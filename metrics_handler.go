package asynqmon

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type getMetricsResponse struct {
	QueueSize            *json.RawMessage `json:"queue_size"`
	QueueLatency         *json.RawMessage `json:"queue_latency_seconds"`
	QueueMemUsgApprox    *json.RawMessage `json:"queue_memory_usage_approx_bytes"`
	PendingTasksByQueue  *json.RawMessage `json:"pending_tasks_by_queue"`
	RetryTasksByQueue    *json.RawMessage `json:"retry_tasks_by_queue"`
	ArchivedTasksByQueue *json.RawMessage `json:"archived_tasks_by_queue"`
}

type metricsFetchOptions struct {
	// Specifies the number of seconds to scan for metrics.
	duration time.Duration

	// Specifies the end time when fetching metrics.
	endTime time.Time
}

func newGetMetricsHandlerFunc(client *http.Client, prometheusAddr string) http.HandlerFunc {
	// res is the result of calling a JSON API endpoint.
	type res struct {
		query string
		msg   *json.RawMessage
		err   error
	}

	// Optional query params:
	// `duration_sec`: specifies the number of seconds to scan
	// `end_time`:     specifies the end_time in Unix time seconds
	return func(w http.ResponseWriter, r *http.Request) {
		opts, err := extractMetricsFetchOptions(r)
		if err != nil {
			http.Error(w, fmt.Sprintf("invalid query parameter: %v", err), http.StatusBadRequest)
			return
		}
		// List of queries (i.e. promQL) to send to prometheus server.
		queries := []string{
			"asynq_queue_size",
			"asynq_queue_latency_seconds",
			"asynq_queue_memory_usage_approx_bytes",
			"asynq_tasks_enqueued_total{state=\"pending\"}",
			"asynq_tasks_enqueued_total{state=\"retry\"}",
			"asynq_tasks_enqueued_total{state=\"archived\"}",
		}
		resp := getMetricsResponse{}
		// Make multiple API calls concurrently
		n := len(queries)
		ch := make(chan res, len(queries))
		for _, q := range queries {
			go func(q string) {
				url := buildPrometheusURL(prometheusAddr, q, opts)
				msg, err := fetchPrometheusMetrics(client, url)
				ch <- res{q, msg, err}
			}(q)
		}
		for r := range ch {
			n--
			if r.err != nil {
				http.Error(w, fmt.Sprintf("failed to fetch %q: %v", r.query, err), http.StatusInternalServerError)
				return
			}
			switch r.query {
			case "asynq_queue_size":
				resp.QueueSize = r.msg
			case "asynq_queue_latency_seconds":
				resp.QueueLatency = r.msg
			case "asynq_queue_memory_usage_approx_bytes":
				resp.QueueMemUsgApprox = r.msg
			case "asynq_tasks_enqueued_total{state=\"pending\"}":
				resp.PendingTasksByQueue = r.msg
			case "asynq_tasks_enqueued_total{state=\"retry\"}":
				resp.RetryTasksByQueue = r.msg
			case "asynq_tasks_enqueued_total{state=\"archived\"}":
				resp.ArchivedTasksByQueue = r.msg
			}
			if n == 0 {
				break // fetched all metrics
			}
		}
		bytes, err := json.Marshal(resp)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to marshal response into JSON: %v", err), http.StatusInternalServerError)
			return
		}
		if _, err := w.Write(bytes); err != nil {
			http.Error(w, fmt.Sprintf("failed to write to response: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

const prometheusAPIPath = "/api/v1/query_range"

func extractMetricsFetchOptions(r *http.Request) (*metricsFetchOptions, error) {
	opts := &metricsFetchOptions{
		duration: 60 * time.Minute,
		endTime:  time.Now(),
	}
	q := r.URL.Query()
	if d := q.Get("duration"); d != "" {
		val, err := strconv.Atoi(d)
		if err != nil {
			return nil, fmt.Errorf("invalid value provided for duration: %q", d)
		}
		opts.duration = time.Duration(val) * time.Second
	}
	if t := q.Get("end_time"); t != "" {
		val, err := strconv.Atoi(t)
		if err != nil {
			return nil, fmt.Errorf("invalid value provided for end_time: %q", t)
		}
		opts.endTime = time.Unix(int64(val), 0)
	}
	return opts, nil
}

func buildPrometheusURL(baseAddr, promQL string, opts *metricsFetchOptions) string {
	var b strings.Builder
	b.WriteString(strings.TrimSuffix(baseAddr, "/"))
	b.WriteString(prometheusAPIPath)
	v := url.Values{}
	v.Add("query", promQL)
	v.Add("start", unixTimeString(opts.endTime.Add(-opts.duration)))
	v.Add("end", unixTimeString(opts.endTime))
	v.Add("step", strconv.Itoa(int(step(opts).Seconds())))
	b.WriteString("?")
	b.WriteString(v.Encode())
	return b.String()
}

func fetchPrometheusMetrics(client *http.Client, url string) (*json.RawMessage, error) {
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	msg := json.RawMessage(bytes)
	return &msg, err
}

// Returns step to use given the fetch options.
// In general, the longer the duration, longer the each step.
func step(opts *metricsFetchOptions) time.Duration {
	if opts.duration <= 6*time.Hour {
		// maximum number of data points to return: 6h / 10s = 2160
		return 10 * time.Second
	}
	if opts.duration <= 24*time.Hour {
		// maximum number of data points to return: 24h / 1m = 1440
		return 1 * time.Minute
	}
	if opts.duration <= 8*24*time.Hour {
		// maximum number of data points to return: (8*24)h / 3m = 3840
		return 3 * time.Minute
	}
	if opts.duration <= 30*24*time.Hour {
		// maximum number of data points to return: (30*24)h / 10m = 4320
		return 10 * time.Minute
	}
	return opts.duration / 3000
}

func unixTimeString(t time.Time) string {
	return strconv.Itoa(int(t.Unix()))
}
