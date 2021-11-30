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

type metricsFetchOptions struct {
	// Specifies the number of seconds to scan for metrics.
	duration time.Duration

	// Specifies the end time when fetching metrics.
	endTime time.Time
}

func newGetMetricsHandlerFunc(client *http.Client, prometheusAddr string) http.HandlerFunc {
	// Optional query params:
	// `duration_sec`: specifies the number of seconds to scan
	// `end_time`:     specifies the end_time in Unix time seconds
	return func(w http.ResponseWriter, r *http.Request) {
		opts := extractMetricsFetchOptions(r)
		url := buildPrometheusURL(prometheusAddr, "asynq_queue_size", opts)
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

const prometheusAPIPath = "/api/v1/query_range"

func extractMetricsFetchOptions(r *http.Request) *metricsFetchOptions {
	// TODO: Extract these options from the request if any, and default to these values if none are specified
	return &metricsFetchOptions{
		duration: 60 * time.Minute,
		endTime:  time.Now(),
	}
}

func buildPrometheusURL(baseAddr, promQL string, opts *metricsFetchOptions) string {
	var b strings.Builder
	b.WriteString(strings.TrimSuffix(baseAddr, "/"))
	b.WriteString(prometheusAPIPath)
	v := url.Values{}
	v.Add("query", promQL)
	v.Add("start", unixTimeString(opts.endTime.Add(-opts.duration)))
	v.Add("end", unixTimeString(opts.endTime))
	v.Add("step", (1 * time.Minute).String())
	b.WriteString("?")
	b.WriteString(v.Encode())
	return b.String()
}

func unixTimeString(t time.Time) string {
	return strconv.Itoa(int(t.Unix()))
}
