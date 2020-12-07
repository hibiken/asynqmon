package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

func loggingMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(os.Stdout, "%v \"%s %s\"\n",
			time.Now().Format(time.RFC3339), r.Method, r.URL)
		h.ServeHTTP(w, r)
	})
}
