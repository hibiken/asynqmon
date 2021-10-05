package asynqmon_test

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynqmon"
)

func ExampleNew() {
	h := asynqmon.New(asynqmon.Options{
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
	})
	defer h.Close()

	r := mux.NewRouter()
	r.PathPrefix("/api").Handler(h)
	// Add static content handler or other handlers
	// r.PathPrefix("/").Handler(h)

	srv := &http.Server{
		Handler: r,
		Addr:    ":8080",
	}

	log.Fatal(srv.ListenAndServe())
}
