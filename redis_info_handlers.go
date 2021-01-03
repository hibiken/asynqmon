package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-redis/redis/v8"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for redis info related endpoints
// ****************************************************************************

func newRedisInfoHandlerFunc(rdb *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		res, err := rdb.Info(ctx).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		info := parseRedisInfo(res)
		if err := json.NewEncoder(w).Encode(info); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

// Parses the return value from the INFO command.
// See https://redis.io/commands/info#return-value.
func parseRedisInfo(infoStr string) map[string]string {
	info := make(map[string]string)
	lines := strings.Split(infoStr, "\r\n")
	for _, l := range lines {
		kv := strings.Split(l, ":")
		if len(kv) == 2 {
			info[kv[0]] = kv[1]
		}
	}
	return info

}
