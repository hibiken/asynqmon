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
		opts, err := extractMetricsFetchOptions(r)
		if err != nil {
			http.Error(w, fmt.Sprintf("invalid query parameter: %v", err), http.StatusBadRequest)
			return
		}
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
