package asynqmon_test

import (
	"log"
	"net/http"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynqmon"
)

func ExampleHTTPHandler() {
	h := asynqmon.New(asynqmon.Options{
		RootPath:     "/monitoring",
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
	})

	http.Handle(h.RootPath(), h)
	log.Fatal(http.ListenAndServe(":8000", nil)) // visit localhost:8000/monitoring to see asynqmon homepage
}

func ExampleHTTPHandlerWithBasicAuthMidlleware() {

	h := asynqmon.New(asynqmon.Options{
		RootPath:     "/monitoring",
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
	})

	http.Handle(h.RootPath(), basicAuthHandler("username", "password", h))
	log.Fatal(http.ListenAndServe(":8000", nil)) // visit localhost:8000/monitoring to see asynqmon homepage
}

func basicAuthHandler(u, p string, next http.Handler) http.Handler {
	var unauthorized = func(w http.ResponseWriter) {
		w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		username, password, ok := r.BasicAuth()
		if !ok {
			unauthorized(w)
			return
		}

		if !(u == username && p == password) {
			unauthorized(w)
			return
		}

		next.ServeHTTP(w, r)
	})
}
