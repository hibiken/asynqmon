package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for task related endpoints
// ****************************************************************************

func newListActiveTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListActiveTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*ActiveTask, 0)
		} else {
			payload["tasks"] = toActiveTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		json.NewEncoder(w).Encode(payload)
	}
}

func newCancelActiveTaskHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["task_id"]
		if err := inspector.CancelActiveTask(id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newListPendingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListPendingTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*PendingTask, 0)
		} else {
			payload["tasks"] = toPendingTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		json.NewEncoder(w).Encode(payload)
	}
}

func newListScheduledTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListScheduledTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*ScheduledTask, 0)
		} else {
			payload["tasks"] = toScheduledTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		json.NewEncoder(w).Encode(payload)
	}
}

func newListRetryTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListRetryTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*RetryTask, 0)
		} else {
			payload["tasks"] = toRetryTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		json.NewEncoder(w).Encode(payload)
	}
}

func newListDeadTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListDeadTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*DeadTask, 0)
		} else {
			payload["tasks"] = toDeadTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		json.NewEncoder(w).Encode(payload)
	}
}

// getPageOptions read page size and number from the request url if set,
// otherwise it returns the default value.
func getPageOptions(r *http.Request) (pageSize, pageNum int) {
	pageSize = 20 // default page size
	pageNum = 1   // default page num
	q := r.URL.Query()
	if s := q.Get("size"); s != "" {
		if n, err := strconv.Atoi(s); err == nil {
			pageSize = n
		}
	}
	if s := q.Get("page"); s != "" {
		if n, err := strconv.Atoi(s); err == nil {
			pageNum = n
		}
	}
	return pageSize, pageNum
}
