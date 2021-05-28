package main

import (
	"crypto/tls"
	"embed"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
	"github.com/rs/cors"
)

// Command-line flags
var (
	flagPort             int
	flagRedisAddr        string
	flagRedisDB          int
	flagRedisPassword    string
	flagRedisTLS         string
	flagRedisURL         string
	flagRedisInsecureTLS bool
)

func init() {
	flag.IntVar(&flagPort, "port", 8080, "port number to use for web ui server")
	flag.StringVar(&flagRedisAddr, "redis-addr", "127.0.0.1:6379", "address of redis server to connect to")
	flag.IntVar(&flagRedisDB, "redis-db", 0, "redis database number")
	flag.StringVar(&flagRedisPassword, "redis-password", "", "password to use when connecting to redis server")
	flag.StringVar(&flagRedisTLS, "redis-tls", "", "server name for TLS validation used when connecting to redis server")
	flag.StringVar(&flagRedisURL, "redis-url", "", "URL to redis server")
	flag.BoolVar(&flagRedisInsecureTLS, "redis-insecure-tls", false, "Disable TLS certificate host checks")
}

// staticFileServer implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type staticFileServer struct {
	contents      embed.FS
	staticDirPath string
	indexFileName string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler.
// If path '/' is requested, it will serve the index file, otherwise it will
// serve the file specified by the URL path.
func (srv *staticFileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Get the absolute path to prevent directory traversal.
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if path == "/" {
		path = srv.indexFilePath()
	} else {
		path = filepath.Join(srv.staticDirPath, path)
	}

	bytes, err := srv.contents.ReadFile(path)
	// If path is error (e.g. file not exist, path is a directory), serve index file.
	var pathErr *fs.PathError
	if errors.As(err, &pathErr) {
		bytes, err = srv.contents.ReadFile(srv.indexFilePath())
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := w.Write(bytes); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (srv *staticFileServer) indexFilePath() string {
	return filepath.Join(srv.staticDirPath, srv.indexFileName)
}

func getRedisOptionsFromFlags() (*redis.Options, error) {
	var err error
	var opts *redis.Options

	if flagRedisURL != "" {
		opts, err = redis.ParseURL(flagRedisURL)
		if err != nil {
			return nil, err
		}
	} else {
		opts = &redis.Options{
			Addr:     flagRedisAddr,
			DB:       flagRedisDB,
			Password: flagRedisPassword,
		}
	}

	if flagRedisTLS != "" {
		opts.TLSConfig = &tls.Config{ServerName: flagRedisTLS}
	}
	if flagRedisInsecureTLS {
		if opts.TLSConfig == nil {
			opts.TLSConfig = &tls.Config{}
		}
		opts.TLSConfig.InsecureSkipVerify = true
	}
	return opts, nil
}

//go:embed ui/build/*
var staticContents embed.FS

func main() {
	flag.Parse()

	opts, err := getRedisOptionsFromFlags()
	if err != nil {
		log.Fatal(err)
	}

	inspector := asynq.NewInspector(asynq.RedisClientOpt{
		Addr:      opts.Addr,
		DB:        opts.DB,
		Password:  opts.Password,
		TLSConfig: opts.TLSConfig,
	})
	defer inspector.Close()

	rdb := redis.NewClient(opts)
	defer rdb.Close()

	router := mux.NewRouter()
	router.Use(loggingMiddleware)

	api := router.PathPrefix("/api").Subrouter()
	// Queue endpoints.
	api.HandleFunc("/queues", newListQueuesHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}", newGetQueueHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}", newDeleteQueueHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}:pause", newPauseQueueHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}:resume", newResumeQueueHandlerFunc(inspector)).Methods("POST")

	// Queue Historical Stats endpoint.
	api.HandleFunc("/queue_stats", newListQueueStatsHandlerFunc(inspector)).Methods("GET")

	// Task endpoints.
	api.HandleFunc("/queues/{qname}/active_tasks", newListActiveTasksHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}/active_tasks/{task_id}:cancel", newCancelActiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:cancel_all", newCancelAllActiveTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/active_tasks:batch_cancel", newBatchCancelActiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/pending_tasks", newListPendingTasksHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:delete_all", newDeleteAllPendingTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:archive_all", newArchiveAllPendingTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/pending_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/scheduled_tasks", newListScheduledTasksHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:delete_all", newDeleteAllScheduledTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:run_all", newRunAllScheduledTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:archive_all", newArchiveAllScheduledTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/scheduled_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/retry_tasks", newListRetryTasksHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:delete_all", newDeleteAllRetryTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:run_all", newRunAllRetryTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks/{task_id}:archive", newArchiveTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:archive_all", newArchiveAllRetryTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/retry_tasks:batch_archive", newBatchArchiveTasksHandlerFunc(inspector)).Methods("POST")

	api.HandleFunc("/queues/{qname}/archived_tasks", newListArchivedTasksHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}", newDeleteTaskHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:delete_all", newDeleteAllArchivedTasksHandlerFunc(inspector)).Methods("DELETE")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_delete", newBatchDeleteTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks/{task_id}:run", newRunTaskHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:run_all", newRunAllArchivedTasksHandlerFunc(inspector)).Methods("POST")
	api.HandleFunc("/queues/{qname}/archived_tasks:batch_run", newBatchRunTasksHandlerFunc(inspector)).Methods("POST")

	// Servers endpoints.
	api.HandleFunc("/servers", newListServersHandlerFunc(inspector)).Methods("GET")

	// Scheduler Entry endpoints.
	api.HandleFunc("/scheduler_entries", newListSchedulerEntriesHandlerFunc(inspector)).Methods("GET")
	api.HandleFunc("/scheduler_entries/{entry_id}/enqueue_events", newListSchedulerEnqueueEventsHandlerFunc(inspector)).Methods("GET")

	// Redis info endpoint.
	api.HandleFunc("/redis_info", newRedisInfoHandlerFunc(rdb)).Methods("GET")

	fs := &staticFileServer{
		contents:      staticContents,
		staticDirPath: "ui/build",
		indexFileName: "index.html",
	}
	router.PathPrefix("/").Handler(fs)

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE"},
	})
	handler := c.Handler(router)

	srv := &http.Server{
		Handler:      handler,
		Addr:         fmt.Sprintf(":%d", flagPort),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	fmt.Printf("Asynq Monitoring WebUI server is listening on port %d\n", flagPort)
	log.Fatal(srv.ListenAndServe())
}
