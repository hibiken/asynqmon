package asynqmon

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type getMetricsResponse struct {
	// TODO
}

func unixTimeString(t time.Time) string {
	return strconv.Itoa(int(t.Unix()))
}

func newGetMetricsHandlerFunc(client *http.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const (
			baseAddr = "http://localhost:9090"
			apiPath  = "/api/v1/query_range"
			promQL   = "asynq_queue_size"
		)
		var b strings.Builder
		v := url.Values{}
		b.WriteString(baseAddr)
		b.WriteString(apiPath)
		v.Add("query", promQL)
		now := time.Now()
		v.Add("start", unixTimeString(now.Add(-30*time.Minute)))
		v.Add("end", unixTimeString(now))
		v.Add("step", (1 * time.Minute).String())
		b.WriteString("?")
		b.WriteString(v.Encode())
		url := b.String()
		fmt.Printf("DEBUG: url: %s\n", url)
		resp, err := client.Get(url)
		if err != nil {
			http.Error(w, fmt.Sprintf("request failed: GET %q: %v", url, err), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		if _, err := io.Copy(w, resp.Body); err != nil {
			http.Error(w, fmt.Sprintf("failed to copy: %v", err), http.StatusInternalServerError)
			return
		}
	}
}
