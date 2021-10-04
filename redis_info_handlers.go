package asynqmon

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-redis/redis/v8"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for redis info related endpoints
// ****************************************************************************

type redisInfoResponse struct {
	Addr    string            `json:"address"`
	Info    map[string]string `json:"info"`
	RawInfo string            `json:"raw_info"`
	Cluster bool              `json:"cluster"`

	// Following fields are only set when connected to redis cluster.
	RawClusterNodes string               `json:"raw_cluster_nodes"`
	QueueLocations  []*queueLocationInfo `json:"queue_locations"`
}

type queueLocationInfo struct {
	Queue   string   `json:"queue"`   // queue name
	KeySlot int64    `json:"keyslot"` // cluster key slot for the queue
	Nodes   []string `json:"nodes"`   // list of cluster node addresses
}

func newRedisInfoHandlerFunc(client *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, err := client.Info(context.Background()).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		info := parseRedisInfo(res)
		resp := redisInfoResponse{
			Addr:    client.Options().Addr,
			Info:    info,
			RawInfo: res,
			Cluster: false,
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newRedisClusterInfoHandlerFunc(client *redis.ClusterClient, inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		rawClusterInfo, err := client.ClusterInfo(ctx).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		info := parseRedisInfo(rawClusterInfo)
		rawClusterNodes, err := client.ClusterNodes(ctx).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		queues, err := inspector.Queues()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var queueLocations []*queueLocationInfo
		for _, qname := range queues {
			q := queueLocationInfo{Queue: qname}
			q.KeySlot, err = inspector.ClusterKeySlot(qname)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			nodes, err := inspector.ClusterNodes(qname)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			for _, n := range nodes {
				q.Nodes = append(q.Nodes, n.Addr)
			}
			queueLocations = append(queueLocations, &q)
		}

		resp := redisInfoResponse{
			Addr:            strings.Join(client.Options().Addrs, ","),
			Info:            info,
			RawInfo:         rawClusterInfo,
			Cluster:         true,
			RawClusterNodes: rawClusterNodes,
			QueueLocations:  queueLocations,
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
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
