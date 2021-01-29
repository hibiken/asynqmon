package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq/inspeq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for task related endpoints
// ****************************************************************************

type ListActiveTasksResponse struct {
	Tasks []*ActiveTask       `json:"tasks"`
	Stats *QueueStateSnapshot `json:"stats"`
}

func newListActiveTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)

		tasks, err := inspector.ListActiveTasks(
			qname, inspeq.PageSize(pageSize), inspeq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats, err := inspector.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		servers, err := inspector.Servers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// m maps taskID to WorkerInfo.
		m := make(map[string]*inspeq.WorkerInfo)
		for _, srv := range servers {
			for _, w := range srv.ActiveWorkers {
				if w.Task.Queue == qname {
					m[w.Task.ID] = w
				}
			}
		}
		activeTasks := toActiveTasks(tasks)
		for _, t := range activeTasks {
			workerInfo, ok := m[t.ID]
			if ok {
				t.Started = workerInfo.Started.Format(time.RFC3339)
				t.Deadline = workerInfo.Deadline.Format(time.RFC3339)
			} else {
				t.Started = "-"
				t.Deadline = "-"
			}
		}

		resp := ListActiveTasksResponse{
			Tasks: activeTasks,
			Stats: toQueueStateSnapshot(stats),
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newCancelActiveTaskHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["task_id"]
		if err := inspector.CancelActiveTask(id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newCancelAllActiveTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const batchSize = 100
		page := 1
		qname := mux.Vars(r)["qname"]
		for {
			tasks, err := inspector.ListActiveTasks(qname, inspeq.Page(page), inspeq.PageSize(batchSize))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			for _, t := range tasks {
				if err := inspector.CancelActiveTask(t.ID); err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}
			if len(tasks) < batchSize {
				break
			}
			page++
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

type batchCancelTasksRequest struct {
	TaskIDs []string `json:"task_ids"`
}

type batchCancelTasksResponse struct {
	CanceledIDs []string `json:"canceled_ids"`
	ErrorIDs    []string `json:"error_ids"`
}

func newBatchCancelActiveTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodySize)
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()

		var req batchCancelTasksRequest
		if err := dec.Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		resp := batchCancelTasksResponse{
			// avoid null in the json response
			CanceledIDs: make([]string, 0),
			ErrorIDs:    make([]string, 0),
		}
		for _, id := range req.TaskIDs {
			if err := inspector.CancelActiveTask(id); err != nil {
				log.Printf("error: could not send cancelation signal to task %s", id)
				resp.ErrorIDs = append(resp.ErrorIDs, id)
			} else {
				resp.CanceledIDs = append(resp.CanceledIDs, id)
			}
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newListPendingTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListPendingTasks(
			qname, inspeq.PageSize(pageSize), inspeq.Page(pageNum))
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
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newListScheduledTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListScheduledTasks(
			qname, inspeq.PageSize(pageSize), inspeq.Page(pageNum))
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
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newListRetryTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListRetryTasks(
			qname, inspeq.PageSize(pageSize), inspeq.Page(pageNum))
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
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newListArchivedTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListArchivedTasks(
			qname, inspeq.PageSize(pageSize), inspeq.Page(pageNum))
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
			payload["tasks"] = make([]*ArchivedTask, 0)
		} else {
			payload["tasks"] = toArchivedTasks(tasks)
		}
		payload["stats"] = toQueueStateSnapshot(stats)
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newDeleteTaskHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, key := vars["qname"], vars["task_key"]
		if qname == "" || key == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.DeleteTaskByKey(qname, key); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newRunTaskHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, key := vars["qname"], vars["task_key"]
		if qname == "" || key == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.RunTaskByKey(qname, key); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newArchiveTaskHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, key := vars["qname"], vars["task_key"]
		if qname == "" || key == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.ArchiveTaskByKey(qname, key); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

type DeleteAllTasksResponse struct {
	// Number of tasks deleted.
	Deleted int `json:"deleted"`
}

func newDeleteAllPendingTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllPendingTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := DeleteAllTasksResponse{n}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newDeleteAllScheduledTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllScheduledTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := DeleteAllTasksResponse{n}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newDeleteAllRetryTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllRetryTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := DeleteAllTasksResponse{n}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newDeleteAllArchivedTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllArchivedTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := DeleteAllTasksResponse{n}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func newRunAllScheduledTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.RunAllScheduledTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newRunAllRetryTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.RunAllRetryTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newRunAllArchivedTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.RunAllArchivedTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newArchiveAllPendingTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.ArchiveAllPendingTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newArchiveAllScheduledTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.ArchiveAllScheduledTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newArchiveAllRetryTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if _, err := inspector.ArchiveAllRetryTasks(qname); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

// request body used for all batch delete tasks endpoints.
type batchDeleteTasksRequest struct {
	TaskKeys []string `json:"task_keys"`
}

// Note: Redis does not have any rollback mechanism, so it's possible
// to have partial success when doing a batch operation.
// For this reason this response contains a list of succeeded keys
// and a list of failed keys.
type batchDeleteTasksResponse struct {
	// task keys that were successfully deleted.
	DeletedKeys []string `json:"deleted_keys"`

	// task keys that were not deleted.
	FailedKeys []string `json:"failed_keys"`
}

// Maximum request body size in bytes.
// Allow up to 1MB in size.
const maxRequestBodySize = 1000000

func newBatchDeleteTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodySize)
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()

		var req batchDeleteTasksRequest
		if err := dec.Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		qname := mux.Vars(r)["qname"]
		resp := batchDeleteTasksResponse{
			// avoid null in the json response
			DeletedKeys: make([]string, 0),
			FailedKeys:  make([]string, 0),
		}
		for _, key := range req.TaskKeys {
			if err := inspector.DeleteTaskByKey(qname, key); err != nil {
				log.Printf("error: could not delete task with key %q: %v", key, err)
				resp.FailedKeys = append(resp.FailedKeys, key)
			} else {
				resp.DeletedKeys = append(resp.DeletedKeys, key)
			}
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

type batchRunTasksRequest struct {
	TaskKeys []string `json:"task_keys"`
}

type batchRunTasksResponse struct {
	// task keys that were successfully moved to the pending state.
	PendingKeys []string `json:"pending_keys"`
	// task keys that were not able to move to the pending state.
	ErrorKeys []string `json:"error_keys"`
}

func newBatchRunTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodySize)
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()

		var req batchRunTasksRequest
		if err := dec.Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		qname := mux.Vars(r)["qname"]
		resp := batchRunTasksResponse{
			// avoid null in the json response
			PendingKeys: make([]string, 0),
			ErrorKeys:   make([]string, 0),
		}
		for _, key := range req.TaskKeys {
			if err := inspector.RunTaskByKey(qname, key); err != nil {
				log.Printf("error: could not run task with key %q: %v", key, err)
				resp.ErrorKeys = append(resp.ErrorKeys, key)
			} else {
				resp.PendingKeys = append(resp.PendingKeys, key)
			}
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

type batchArchiveTasksRequest struct {
	TaskKeys []string `json:"task_keys"`
}

type batchArchiveTasksResponse struct {
	// task keys that were successfully moved to the archived state.
	ArchivedKeys []string `json:"archived_keys"`
	// task keys that were not able to move to the archived state.
	ErrorKeys []string `json:"error_keys"`
}

func newBatchArchiveTasksHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodySize)
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()

		var req batchArchiveTasksRequest
		if err := dec.Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		qname := mux.Vars(r)["qname"]
		resp := batchArchiveTasksResponse{
			// avoid null in the json response
			ArchivedKeys: make([]string, 0),
			ErrorKeys:    make([]string, 0),
		}
		for _, key := range req.TaskKeys {
			if err := inspector.ArchiveTaskByKey(qname, key); err != nil {
				log.Printf("error: could not archive task with key %q: %v", key, err)
				resp.ErrorKeys = append(resp.ErrorKeys, key)
			} else {
				resp.ArchivedKeys = append(resp.ArchivedKeys, key)
			}
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
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
