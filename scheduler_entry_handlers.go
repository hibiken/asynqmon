package asynqmon

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for scheduler entry related endpoints
// ****************************************************************************

func newListSchedulerEntriesHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		entries, err := inspector.SchedulerEntries()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(entries) == 0 {
			// avoid nil for the entries field in json output.
			payload["entries"] = make([]*schedulerEntry, 0)
		} else {
			payload["entries"] = toSchedulerEntries(entries, pf)
		}
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

type listSchedulerEnqueueEventsResponse struct {
	Events []*schedulerEnqueueEvent `json:"events"`
}

func newListSchedulerEnqueueEventsHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		entryID := mux.Vars(r)["entry_id"]
		pageSize, pageNum := getPageOptions(r)
		events, err := inspector.ListSchedulerEnqueueEvents(
			entryID, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := listSchedulerEnqueueEventsResponse{
			Events: toSchedulerEnqueueEvents(events),
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newRunSchedulerEntryHandlerFunc(inspector *asynq.Inspector, client *asynq.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		entryID := mux.Vars(r)["entry_id"]
		if entryID == "" {
			http.Error(w, "entry_id is required", http.StatusBadRequest)
			return
		}
		entries, err := inspector.SchedulerEntries()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var target *asynq.SchedulerEntry
		for _, e := range entries {
			if e.ID == entryID {
				target = e
				break
			}
		}
		if target == nil {
			http.Error(w, "scheduler entry not found", http.StatusNotFound)
			return
		}
		task := asynq.NewTask(target.Task.Type(), target.Task.Payload())
		if _, err := client.Enqueue(task, target.Opts...); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
