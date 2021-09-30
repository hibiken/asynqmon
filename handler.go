package asynqmon

import (
	"github.com/go-redis/redis/v7"
	"github.com/gorilla/mux"
	"net/http"

	"github.com/hibiken/asynq"
)

type HandlerOptions struct {
	RedisClient          redis.UniversalClient
	Inspector            *asynq.Inspector
	Middlewares          []mux.MiddlewareFunc
	BytesStringer        BytesStringer
	StaticContentHandler http.Handler
}

func NewHandler(opts HandlerOptions) http.Handler {
	router := mux.NewRouter()
	inspector := opts.Inspector
	t := &transformer{bs: defaultBytesStringer}
	if opts.BytesStringer != nil {
		t = &transformer{bs: opts.BytesStringer}
	}

	for _, mf := range opts.Middlewares {
		router.Use(mf)
	}

	api := router.PathPrefix("/api").Subrouter()
	// Queue endpoints.
	api.HandleFunc("/queues", newListQueuesHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}", newGetQueueHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}", newDeleteQueueHandlerFunc(inspector, t)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}:pause", newPauseQueueHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}:resume", newResumeQueueHandlerFunc(inspector)).Methods("POST")

	// Queue Historical Stats endpoint.
	api.HandleFunc("/queue_stats", newListQueueStatsHandlerFunc(inspector, t)).Methods("GET")

	// Task endpoints.
	api.HandleFunc("/queues/{qname}/active_tasks", newListActiveTasksHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}/active_tasks/{task_id}:cancel", newCancelActiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:cancel_all", newCancelAllActiveTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:batch_cancel", newBatchCancelActiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/pending_tasks", newListPendingTasksHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:delete_all", newDeleteAllPendingTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:archive_all", newArchiveAllPendingTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/scheduled_tasks", newListScheduledTasksHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:delete_all", newDeleteAllScheduledTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:run_all", newRunAllScheduledTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:archive_all", newArchiveAllScheduledTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/retry_tasks", newListRetryTasksHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:delete_all", newDeleteAllRetryTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:run_all", newRunAllRetryTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:archive_all", newArchiveAllRetryTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/archived_tasks", newListArchivedTasksHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:delete_all", newDeleteAllArchivedTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:run_all", newRunAllArchivedTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/tasks/{task_id}", newGetTaskHandlerFunc(inspector, t)).Methods("GET")

	// Servers endpoints.
	api.HandleFunc("/servers", newListServersHandlerFunc(inspector, t)).Methods("GET")

	// Scheduler Entry endpoints.
	api.HandleFunc("/scheduler_entries", newListSchedulerEntriesHandlerFunc(inspector, t)).Methods("GET")
	api.HandleFunc("/scheduler_entries/{entry_id}/enqueue_events", newListSchedulerEnqueueEventsHandlerFunc(inspector, t)).Methods("GET")

	// Redis info endpoint.
	switch c := opts.RedisClient.(type) {
	case *redis.ClusterClient:
		api.HandleFunc("/redis_info", newRedisClusterInfoHandlerFunc(c, inspector)).Methods("GET")
	case *redis.Client:
		api.HandleFunc("/redis_info", newRedisInfoHandlerFunc(c)).Methods("GET")
	}

	api.Handle("/", opts.StaticContentHandler)

	return router
}
