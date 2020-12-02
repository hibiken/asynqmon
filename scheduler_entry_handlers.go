package main

import (
	"encoding/json"
	"net/http"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for scheduler entry related endpoints
// ****************************************************************************

func newListSchedulerEntriesHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		entries, err := inspector.SchedulerEntries()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(entries) == 0 {
			// avoid nil for the entries field in json output.
			payload["entries"] = make([]*SchedulerEntry, 0)
		} else {
			payload["entries"] = toSchedulerEntries(entries)
		}
		json.NewEncoder(w).Encode(payload)
	}
}
