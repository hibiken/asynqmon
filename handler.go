package asynqmon

import (
	"embed"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

// Options are used to configure HTTPHandler.
type Options struct {
	// URL path the handler is responsible for.
	// The path is used for the homepage of asynqmon, and every other page is rooted in this subtree.
	//
	// This field is optional. Default is "/".
	RootPath string

	// RedisConnOpt specifies the connection to a redis-server or redis-cluster.
	//
	// Required when RedisConnections is empty and ConfigPath does not already list connections.
	RedisConnOpt asynq.RedisConnOpt

	// RedisConnections is an optional list of named Redis endpoints.
	// When set, these are loaded into the connection registry at startup.
	RedisConnections []RedisConnection

	// ConfigPath is the YAML file used to persist connections created via the UI.
	// When the file already contains connections, they are loaded on startup.
	ConfigPath string

	// PayloadFormatter is used to convert payload bytes to string shown in the UI.
	//
	// This field is optional.
	PayloadFormatter PayloadFormatter

	// ResultFormatter is used to convert result bytes to string shown in the UI.
	//
	// This field is optional.
	ResultFormatter ResultFormatter

	// PrometheusAddress specifies the address of the Prometheus to connect to.
	//
	// This field is optional. If this field is set, asynqmon will query the Prometheus server
	// to get the time series data about queue metrics and show them in the web UI.
	PrometheusAddress string

	// Set ReadOnly to true to restrict user to view-only mode.
	ReadOnly bool
}

// HTTPHandler is a http.Handler for asynqmon application.
type HTTPHandler struct {
	router   *mux.Router
	registry *connectionRegistry
	rootPath string // the value should not have the trailing slash
}

func (h *HTTPHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.router.ServeHTTP(w, r)
}

// New creates a HTTPHandler with the given options.
func New(opts Options) *HTTPHandler {
	// Make sure that RootPath starts with a slash if provided.
	if opts.RootPath != "" && !strings.HasPrefix(opts.RootPath, "/") {
		panic("asynqmon.New: RootPath must start with a slash")
	}
	// Remove trailing slash from RootPath.
	opts.RootPath = strings.TrimSuffix(opts.RootPath, "/")

	reg := newConnectionRegistry()

	if opts.ConfigPath != "" {
		persisted, err := loadConnectionsFile(opts.ConfigPath)
		if err != nil {
			panic(fmt.Sprintf("asynqmon.New: load config: %v", err))
		}
		for _, c := range persisted {
			if err := reg.Add(c.Name, c.Addr, nil); err != nil {
				panic(fmt.Sprintf("asynqmon.New: add connection %q: %v", c.Name, err))
			}
		}
	}

	for _, c := range opts.RedisConnections {
		opt := c.ConnOpt
		if err := reg.Add(c.Name, c.Addr, opt); err != nil {
			panic(fmt.Sprintf("asynqmon.New: add connection %q: %v", c.Name, err))
		}
	}

	if reg.Len() == 0 && opts.RedisConnOpt != nil && opts.ConfigPath == "" {
		if err := reg.Add("default", addrFromConnOpt(opts.RedisConnOpt), opts.RedisConnOpt); err != nil {
			panic(fmt.Sprintf("asynqmon.New: add default connection: %v", err))
		}
	}

	if reg.Len() == 0 && opts.ConfigPath == "" {
		panic("asynqmon.New: RedisConnOpt, RedisConnections, or ConfigPath is required")
	}

	return &HTTPHandler{
		router:   muxRouter(opts, reg),
		registry: reg,
		rootPath: opts.RootPath,
	}
}

// Close closes connections to redis.
func (h *HTTPHandler) Close() error {
	return h.registry.Close()
}

// RootPath returns the root URL path used for asynqmon application.
// Returned path string does not have the trailing slash.
func (h *HTTPHandler) RootPath() string {
	return h.rootPath
}

//go:embed ui/build/*
var staticContents embed.FS

func muxRouter(opts Options, reg *connectionRegistry) *mux.Router {
	router := mux.NewRouter().PathPrefix(opts.RootPath).Subrouter()

	var payloadFmt PayloadFormatter = DefaultPayloadFormatter
	if opts.PayloadFormatter != nil {
		payloadFmt = opts.PayloadFormatter
	}

	var resultFmt ResultFormatter = DefaultResultFormatter
	if opts.ResultFormatter != nil {
		resultFmt = opts.ResultFormatter
	}

	api := router.PathPrefix("/api").Subrouter()
	api.Use(connectionMiddleware(reg))

	// Connection management (no selected-connection header required).
	api.HandleFunc("/connections", newListConnectionsHandlerFunc(reg)).Methods("GET")
	api.HandleFunc("/connections", newCreateConnectionHandlerFunc(reg, opts.ConfigPath)).Methods("POST")
	api.HandleFunc("/connections/{name}", newDeleteConnectionHandlerFunc(reg, opts.ConfigPath)).Methods("DELETE")

	// Queue endpoints.
	api.HandleFunc("/queues", adaptInspector(newListQueuesHandlerFunc)).Methods("GET")
	api.HandleFunc("/queues/{qname}", adaptInspector(newGetQueueHandlerFunc)).Methods("GET")
	api.HandleFunc("/queues/{qname}", adaptInspector(newDeleteQueueHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}:pause", adaptInspector(newPauseQueueHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}:resume", adaptInspector(newResumeQueueHandlerFunc)).Methods("POST")

	// Queue Historical Stats endpoint.
	api.HandleFunc("/queue_stats", adaptInspector(newListQueueStatsHandlerFunc)).Methods("GET")

	// Task endpoints.
	api.HandleFunc("/queues/{qname}/active_tasks", adaptInspectorPayload(newListActiveTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/active_tasks/{task_id}:cancel", adaptInspector(newCancelActiveTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:cancel_all", adaptInspector(newCancelAllActiveTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:batch_cancel", adaptInspector(newBatchCancelActiveTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/pending_tasks", adaptInspectorPayload(newListPendingTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:delete_all", adaptInspector(newDeleteAllPendingTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}:archive", adaptInspector(newArchiveTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:archive_all", adaptInspector(newArchiveAllPendingTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_archive", adaptInspector(newBatchArchiveTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/scheduled_tasks", adaptInspectorPayload(newListScheduledTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:delete_all", adaptInspector(newDeleteAllScheduledTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:run", adaptInspector(newRunTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:run_all", adaptInspector(newRunAllScheduledTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_run", adaptInspector(newBatchRunTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:archive", adaptInspector(newArchiveTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:archive_all", adaptInspector(newArchiveAllScheduledTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_archive", adaptInspector(newBatchArchiveTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/retry_tasks", adaptInspectorPayload(newListRetryTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:delete_all", adaptInspector(newDeleteAllRetryTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:run", adaptInspector(newRunTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:run_all", adaptInspector(newRunAllRetryTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_run", adaptInspector(newBatchRunTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:archive", adaptInspector(newArchiveTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:archive_all", adaptInspector(newArchiveAllRetryTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_archive", adaptInspector(newBatchArchiveTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/archived_tasks", adaptInspectorPayload(newListArchivedTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:delete_all", adaptInspector(newDeleteAllArchivedTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}:run", adaptInspector(newRunTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:run_all", adaptInspector(newRunAllArchivedTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_run", adaptInspector(newBatchRunTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/completed_tasks", adaptInspectorPayloadResult(newListCompletedTasksHandlerFunc, payloadFmt, resultFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/completed_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/completed_tasks:delete_all", adaptInspector(newDeleteAllCompletedTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/completed_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/tasks:export", adaptInspectorPayloadResult(newExportTasksHandlerFunc, payloadFmt, resultFmt)).Methods("GET")

	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks", adaptInspectorPayload(newListAggregatingTasksHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks/{task_id}", adaptInspector(newDeleteTaskHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:delete_all", adaptInspector(newDeleteAllAggregatingTasksHandlerFunc)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:batch_delete", adaptInspector(newBatchDeleteTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks/{task_id}:run", adaptInspector(newRunTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:run_all", adaptInspector(newRunAllAggregatingTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:batch_run", adaptInspector(newBatchRunTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks/{task_id}:archive", adaptInspector(newArchiveTaskHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:archive_all", adaptInspector(newArchiveAllAggregatingTasksHandlerFunc)).Methods("POST")
	api.HandleFunc("/queues/{qname}/groups/{gname}/aggregating_tasks:batch_archive", adaptInspector(newBatchArchiveTasksHandlerFunc)).Methods("POST")

	api.HandleFunc("/queues/{qname}/tasks/{task_id}", adaptInspectorPayloadResult(newGetTaskHandlerFunc, payloadFmt, resultFmt)).Methods("GET")

	// Groups endpoints
	api.HandleFunc("/queues/{qname}/groups", adaptInspector(newListGroupsHandlerFunc)).Methods("GET")

	// Servers endpoints.
	api.HandleFunc("/servers", adaptInspectorPayload(newListServersHandlerFunc, payloadFmt)).Methods("GET")

	// Scheduler Entry endpoints.
	api.HandleFunc("/scheduler_entries", adaptInspectorPayload(newListSchedulerEntriesHandlerFunc, payloadFmt)).Methods("GET")
	api.HandleFunc("/scheduler_entries/{entry_id}/enqueue_events", adaptInspector(newListSchedulerEnqueueEventsHandlerFunc)).Methods("GET")
	api.HandleFunc("/scheduler_entries/{entry_id}:run", adaptInspectorClient(newRunSchedulerEntryHandlerFunc)).Methods("POST")

	// Redis info endpoint.
	api.HandleFunc("/redis_info", newRedisInfoFromConnHandlerFunc()).Methods("GET")

	// Time series metrics endpoints.
	api.HandleFunc("/metrics", newGetMetricsHandlerFunc(http.DefaultClient, opts.PrometheusAddress)).Methods("GET")

	// Restrict APIs when running in read-only mode.
	if opts.ReadOnly {
		api.Use(restrictToReadOnly)
	}

	// Everything else, route to uiAssetsHandler.
	router.NotFoundHandler = &uiAssetsHandler{
		rootPath:       opts.RootPath,
		contents:       staticContents,
		staticDirPath:  "ui/build",
		indexFileName:  "index.html",
		prometheusAddr: opts.PrometheusAddress,
		readOnly:       opts.ReadOnly,
	}

	return router
}

// restrictToReadOnly is a middleware function to restrict users to perform only GET requests.
func restrictToReadOnly(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" && r.Method != "" {
			http.Error(w, fmt.Sprintf("API Server is running in read-only mode: %s request is not allowed", r.Method), http.StatusMethodNotAllowed)
			return
		}
		h.ServeHTTP(w, r)
	})
}
