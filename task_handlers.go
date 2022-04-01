package asynqmon

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for task related endpoints
// ****************************************************************************

type listActiveTasksResponse struct {
	Tasks []*activeTask       `json:"tasks"`
	Stats *queueStateSnapshot `json:"stats"`
}

func newListActiveTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
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
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		servers, err := inspector.Servers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// m maps taskID to workerInfo.
		m := make(map[string]*asynq.WorkerInfo)
		for _, srv := range servers {
			for _, w := range srv.ActiveWorkers {
				if w.Queue == qname {
					m[w.TaskID] = w
				}
			}
		}
		activeTasks := toActiveTasks(tasks, pf)
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

		resp := listActiveTasksResponse{
			Tasks: activeTasks,
			Stats: toQueueStateSnapshot(qinfo),
		}
		writeResponseJSON(w, resp)
	}
}

func newCancelActiveTaskHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["task_id"]
		if err := inspector.CancelProcessing(id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newCancelAllActiveTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const batchSize = 100
		page := 1
		qname := mux.Vars(r)["qname"]
		for {
			tasks, err := inspector.ListActiveTasks(qname, asynq.Page(page), asynq.PageSize(batchSize))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			for _, t := range tasks {
				if err := inspector.CancelProcessing(t.ID); err != nil {
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

func newBatchCancelActiveTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
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
			if err := inspector.CancelProcessing(id); err != nil {
				log.Printf("error: could not send cancelation signal to task %s", id)
				resp.ErrorIDs = append(resp.ErrorIDs, id)
			} else {
				resp.CanceledIDs = append(resp.CanceledIDs, id)
			}
		}
		writeResponseJSON(w, resp)
	}
}

func newListPendingTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
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
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*pendingTask, 0)
		} else {
			payload["tasks"] = toPendingTasks(tasks, pf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		writeResponseJSON(w, payload)
	}
}

func newListScheduledTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
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
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*scheduledTask, 0)
		} else {
			payload["tasks"] = toScheduledTasks(tasks, pf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		writeResponseJSON(w, payload)
	}
}

func newListRetryTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
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
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*retryTask, 0)
		} else {
			payload["tasks"] = toRetryTasks(tasks, pf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		writeResponseJSON(w, payload)
	}
}

func newListArchivedTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListArchivedTasks(
			qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*archivedTask, 0)
		} else {
			payload["tasks"] = toArchivedTasks(tasks, pf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		writeResponseJSON(w, payload)
	}
}

func newListCompletedTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter, rf ResultFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListCompletedTasks(qname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*completedTask, 0)
		} else {
			payload["tasks"] = toCompletedTasks(tasks, pf, rf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		writeResponseJSON(w, payload)
	}
}

func newListAggregatingTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname := vars["qname"]
		gname := vars["gname"]
		pageSize, pageNum := getPageOptions(r)
		tasks, err := inspector.ListAggregatingTasks(
			qname, gname, asynq.PageSize(pageSize), asynq.Page(pageNum))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		qinfo, err := inspector.GetQueueInfo(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		groups, err := inspector.Groups(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		payload := make(map[string]interface{})
		if len(tasks) == 0 {
			// avoid nil for the tasks field in json output.
			payload["tasks"] = make([]*aggregatingTask, 0)
		} else {
			payload["tasks"] = toAggregatingTasks(tasks, pf)
		}
		payload["stats"] = toQueueStateSnapshot(qinfo)
		payload["groups"] = toGroupInfos(groups)
		writeResponseJSON(w, payload)
	}
}

func newDeleteTaskHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, taskid := vars["qname"], vars["task_id"]
		if qname == "" || taskid == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.DeleteTask(qname, taskid); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newRunTaskHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, taskid := vars["qname"], vars["task_id"]
		if qname == "" || taskid == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.RunTask(qname, taskid); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func newArchiveTaskHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, taskid := vars["qname"], vars["task_id"]
		if qname == "" || taskid == "" {
			http.Error(w, "route parameters should not be empty", http.StatusBadRequest)
			return
		}
		if err := inspector.ArchiveTask(qname, taskid); err != nil {
			// TODO: Handle task not found error and return 404
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

type deleteAllTasksResponse struct {
	// Number of tasks deleted.
	Deleted int `json:"deleted"`
}

func newDeleteAllPendingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllPendingTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

func newDeleteAllAggregatingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, gname := vars["qname"], vars["gname"]
		n, err := inspector.DeleteAllAggregatingTasks(qname, gname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

func newDeleteAllScheduledTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllScheduledTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

func newDeleteAllRetryTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllRetryTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

func newDeleteAllArchivedTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllArchivedTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

func newDeleteAllCompletedTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.DeleteAllCompletedTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, deleteAllTasksResponse{n})
	}
}

type runAllTasksResponse struct {
	// Number of tasks scheduled to run.
	Scheduled int `json:"scheduled"`
}

func newRunAllScheduledTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.RunAllScheduledTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, runAllTasksResponse{n})
	}
}

func newRunAllRetryTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.RunAllRetryTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, runAllTasksResponse{n})
	}
}

func newRunAllArchivedTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.RunAllArchivedTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, runAllTasksResponse{n})
	}
}

func newRunAllAggregatingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, gname := vars["qname"], vars["gname"]
		n, err := inspector.RunAllAggregatingTasks(qname, gname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, runAllTasksResponse{n})
	}
}

type archiveAllTasksResponse struct {
	// Number of tasks archived.
	Archived int `json:"archived"`
}

func writeResponseJSON(w http.ResponseWriter, resp interface{}) {
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func newArchiveAllPendingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.ArchiveAllPendingTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, archiveAllTasksResponse{n})
	}
}

func newArchiveAllAggregatingTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, gname := vars["qname"], vars["gname"]
		n, err := inspector.ArchiveAllAggregatingTasks(qname, gname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, archiveAllTasksResponse{n})
	}
}

func newArchiveAllScheduledTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.ArchiveAllScheduledTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, archiveAllTasksResponse{n})
	}
}

func newArchiveAllRetryTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		n, err := inspector.ArchiveAllRetryTasks(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeResponseJSON(w, archiveAllTasksResponse{n})
	}
}

// request body used for all batch delete tasks endpoints.
type batchDeleteTasksRequest struct {
	TaskIDs []string `json:"task_ids"`
}

// Note: Redis does not have any rollback mechanism, so it's possible
// to have partial success when doing a batch operation.
// For this reason this response contains a list of succeeded ids
// and a list of failed ids.
type batchDeleteTasksResponse struct {
	// task ids that were successfully deleted.
	DeletedIDs []string `json:"deleted_ids"`

	// task ids that were not deleted.
	FailedIDs []string `json:"failed_ids"`
}

// Maximum request body size in bytes.
// Allow up to 1MB in size.
const maxRequestBodySize = 1000000

func newBatchDeleteTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
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
			DeletedIDs: make([]string, 0),
			FailedIDs:  make([]string, 0),
		}
		for _, taskid := range req.TaskIDs {
			if err := inspector.DeleteTask(qname, taskid); err != nil {
				log.Printf("error: could not delete task with id %q: %v", taskid, err)
				resp.FailedIDs = append(resp.FailedIDs, taskid)
			} else {
				resp.DeletedIDs = append(resp.DeletedIDs, taskid)
			}
		}
		writeResponseJSON(w, resp)
	}
}

type batchRunTasksRequest struct {
	TaskIDs []string `json:"task_ids"`
}

type batchRunTasksResponse struct {
	// task ids that were successfully moved to the pending state.
	PendingIDs []string `json:"pending_ids"`
	// task ids that were not able to move to the pending state.
	ErrorIDs []string `json:"error_ids"`
}

func newBatchRunTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
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
			PendingIDs: make([]string, 0),
			ErrorIDs:   make([]string, 0),
		}
		for _, taskid := range req.TaskIDs {
			if err := inspector.RunTask(qname, taskid); err != nil {
				log.Printf("error: could not run task with id %q: %v", taskid, err)
				resp.ErrorIDs = append(resp.ErrorIDs, taskid)
			} else {
				resp.PendingIDs = append(resp.PendingIDs, taskid)
			}
		}
		writeResponseJSON(w, resp)
	}
}

type batchArchiveTasksRequest struct {
	TaskIDs []string `json:"task_ids"`
}

type batchArchiveTasksResponse struct {
	// task ids that were successfully moved to the archived state.
	ArchivedIDs []string `json:"archived_ids"`
	// task ids that were not able to move to the archived state.
	ErrorIDs []string `json:"error_ids"`
}

func newBatchArchiveTasksHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
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
			ArchivedIDs: make([]string, 0),
			ErrorIDs:    make([]string, 0),
		}
		for _, taskid := range req.TaskIDs {
			if err := inspector.ArchiveTask(qname, taskid); err != nil {
				log.Printf("error: could not archive task with id %q: %v", taskid, err)
				resp.ErrorIDs = append(resp.ErrorIDs, taskid)
			} else {
				resp.ArchivedIDs = append(resp.ArchivedIDs, taskid)
			}
		}
		writeResponseJSON(w, resp)
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

func newGetTaskHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter, rf ResultFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		qname, taskid := vars["qname"], vars["task_id"]
		if qname == "" {
			http.Error(w, "queue name cannot be empty", http.StatusBadRequest)
			return
		}
		if taskid == "" {
			http.Error(w, "task_id cannot be empty", http.StatusBadRequest)
			return
		}

		info, err := inspector.GetTaskInfo(qname, taskid)
		switch {
		case errors.Is(err, asynq.ErrQueueNotFound), errors.Is(err, asynq.ErrTaskNotFound):
			http.Error(w, strings.TrimPrefix(err.Error(), "asynq: "), http.StatusNotFound)
			return
		case err != nil:
			http.Error(w, strings.TrimPrefix(err.Error(), "asynq: "), http.StatusInternalServerError)
			return
		}

		writeResponseJSON(w, toTaskInfo(info, pf, rf))
	}
}
