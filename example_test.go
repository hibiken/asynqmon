package asynqmon_test

import (
	"log"
	"net/http"

	"github.com/Shopify/asynq"
	"github.com/Shopify/asynqmon"
)

func ExampleHTTPHandler() {
	h := asynqmon.New(asynqmon.Options{
		RootPath:     "/monitoring",
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
	})

	http.Handle(h.RootPath(), h)
	log.Fatal(http.ListenAndServe(":8000", nil)) // visit localhost:8000/monitoring to see asynqmon homepage
}
