package asynqmon

import (
	"encoding/json"
	"errors"
	"net/http"
	"sync"

	"github.com/gorilla/mux"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for queue related endpoints
// ****************************************************************************

const queueInfoBatchSize = 10

type queueInfoFetcher interface {
	Queues() ([]string, error)
	GetQueueInfo(string) (*asynq.QueueInfo, error)
}

func fetchQueueStateSnapshotsInBatches(inspector queueInfoFetcher, qnames []string, batchSize int) ([]*queueStateSnapshot, error) {
	if batchSize <= 0 {
		batchSize = 1
	}

	snapshots := make([]*queueStateSnapshot, len(qnames))
	for start := 0; start < len(qnames); start += batchSize {
		end := start + batchSize
		if end > len(qnames) {
			end = len(qnames)
		}

		var (
			wg       sync.WaitGroup
			mu       sync.Mutex
			batchErr error
		)

		for i := start; i < end; i++ {
			wg.Add(1)
			go func(index int, qname string) {
				defer wg.Done()

				qinfo, err := inspector.GetQueueInfo(qname)
				if err != nil {
					mu.Lock()
					if batchErr == nil {
						batchErr = err
					}
					mu.Unlock()
					return
				}
				snapshots[index] = toQueueStateSnapshot(qinfo)
			}(i, qnames[i])
		}

		wg.Wait()
		if batchErr != nil {
			return nil, batchErr
		}
	}

	return snapshots, nil
}

func newListQueuesHandlerFunc(inspector queueInfoFetcher) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qnames, err := inspector.Queues()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		snapshots, err := fetchQueueStateSnapshotsInBatches(inspector, qnames, queueInfoBatchSize)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := map[string]interface{}{"queues": snapshots}
		json.NewEncoder(w).Encode(payload)
	}
}

func newGetQueueHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]

		payload := make(map[string]interface{})
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			// TODO: Check for queue not found error.
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload["current"] = toQueueStateSnapshot(qinfo)

		// TODO: make this n a variable
		data, err := inspector.History(qname, 10)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var dailyStats []*dailyStats
		for _, s := range data {
			dailyStats = append(dailyStats, toDailyStats(s))
		}
		payload["history"] = dailyStats
		json.NewEncoder(w).Encode(payload)
	}
}

func newDeleteQueueHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		if err := inspector.DeleteQueue(qname, false); err != nil {
			if errors.Is(err, asynq.ErrQueueNotFound) {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			if errors.Is(err, asynq.ErrQueueNotEmpty) {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newPauseQueueHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		if err := inspector.PauseQueue(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newResumeQueueHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		if err := inspector.UnpauseQueue(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

type listQueueStatsResponse struct {
	Stats map[string][]*dailyStats `json:"stats"`
}

func newListQueueStatsHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qnames, err := inspector.Queues()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := listQueueStatsResponse{Stats: make(map[string][]*dailyStats)}
		const numdays = 90 // Get stats for the last 90 days.
		for _, qname := range qnames {
			stats, err := inspector.History(qname, numdays)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			resp.Stats[qname] = toDailyStatsList(stats)
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
