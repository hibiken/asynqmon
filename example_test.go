package asynqmon_test

import (
	"embed"
	"log"
	"net/http"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynqmon"
)

//go:embed ui-assets/*
var staticContents embed.FS

func ExampleNew() {
	h := asynqmon.New(asynqmon.Options{
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
		StaticContentHandler: asynqmon.NewStaticContentHandler(
			staticContents,
			"ui-assets",
			"index.html",
		),
	})
	defer h.Close()

	srv := &http.Server{
		Handler: h,
		Addr:    ":8080",
	}

	log.Fatal(srv.ListenAndServe())
}
