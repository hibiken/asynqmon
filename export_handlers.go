package asynqmon

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

const (
	exportBatchSize = 100
	exportMaxRows   = 10000
)

func newExportTasksHandlerFunc(inspector *asynq.Inspector, pf PayloadFormatter, rf ResultFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		state := r.URL.Query().Get("state")
		if state == "" {
			http.Error(w, "missing required query parameter \"state\"", http.StatusBadRequest)
			return
		}

		header, err := csvHeaderForState(state)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var workerByTaskID map[string]*asynq.WorkerInfo
		if state == "active" {
			workerByTaskID, err = activeWorkersByTaskID(inspector, qname)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		filename := fmt.Sprintf("%s-%s.csv", qname, state)
		w.Header().Set("Content-Type", "text/csv")
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filename))

		cw := csv.NewWriter(w)
		defer cw.Flush()

		if err := cw.Write(header); err != nil {
			return
		}

		page := 1
		total := 0
		for total < exportMaxRows {
			tasks, err := listTasksByState(inspector, qname, state, page, exportBatchSize)
			if err != nil {
				// Headers already sent; best-effort stop.
				return
			}
			if len(tasks) == 0 {
				break
			}

			for _, t := range tasks {
				if total >= exportMaxRows {
					break
				}
				row := csvRowForTask(state, t, pf, rf, workerByTaskID)
				if err := cw.Write(row); err != nil {
					return
				}
				total++
			}

			if len(tasks) < exportBatchSize {
				break
			}
			page++
		}
	}
}

func activeWorkersByTaskID(inspector *asynq.Inspector, qname string) (map[string]*asynq.WorkerInfo, error) {
	servers, err := inspector.Servers()
	if err != nil {
		return nil, err
	}
	m := make(map[string]*asynq.WorkerInfo)
	for _, srv := range servers {
		for _, w := range srv.ActiveWorkers {
			if w.Queue == qname {
				m[w.TaskID] = w
			}
		}
	}
	return m, nil
}

func listTasksByState(inspector *asynq.Inspector, qname, state string, page, size int) ([]*asynq.TaskInfo, error) {
	opts := []asynq.ListOption{asynq.Page(page), asynq.PageSize(size)}
	switch state {
	case "active":
		return inspector.ListActiveTasks(qname, opts...)
	case "pending":
		return inspector.ListPendingTasks(qname, opts...)
	case "scheduled":
		return inspector.ListScheduledTasks(qname, opts...)
	case "retry":
		return inspector.ListRetryTasks(qname, opts...)
	case "archived":
		return inspector.ListArchivedTasks(qname, opts...)
	case "completed":
		return inspector.ListCompletedTasks(qname, opts...)
	default:
		return nil, fmt.Errorf("unsupported state %q", state)
	}
}

func csvHeaderForState(state string) ([]string, error) {
	base := []string{"id", "type", "payload", "queue", "max_retry", "retried", "error_message"}
	switch state {
	case "active":
		return append(base, "start_time", "deadline", "is_orphaned"), nil
	case "pending":
		return base, nil
	case "scheduled", "retry":
		return append(base, "next_process_at"), nil
	case "archived":
		return append(base, "last_failed_at"), nil
	case "completed":
		return append(base, "completed_at", "result", "ttl_seconds"), nil
	default:
		return nil, fmt.Errorf("unsupported state %q", state)
	}
}

func csvRowForTask(state string, ti *asynq.TaskInfo, pf PayloadFormatter, rf ResultFormatter, workers map[string]*asynq.WorkerInfo) []string {
	base := []string{
		ti.ID,
		ti.Type,
		pf.FormatPayload(ti.Type, ti.Payload),
		ti.Queue,
		strconv.Itoa(ti.MaxRetry),
		strconv.Itoa(ti.Retried),
		ti.LastErr,
	}
	switch state {
	case "active":
		started, deadline := "-", "-"
		if w, ok := workers[ti.ID]; ok {
			started = w.Started.Format(time.RFC3339)
			deadline = w.Deadline.Format(time.RFC3339)
		}
		return append(base, started, deadline, strconv.FormatBool(ti.IsOrphaned))
	case "pending":
		return base
	case "scheduled", "retry":
		return append(base, formatTimeInRFC3339(ti.NextProcessAt))
	case "archived":
		return append(base, formatTimeInRFC3339(ti.LastFailedAt))
	case "completed":
		return append(base,
			formatTimeInRFC3339(ti.CompletedAt),
			rf.FormatResult(ti.Type, ti.Result),
			strconv.FormatInt(int64(taskTTL(ti)/time.Second), 10),
		)
	default:
		return base
	}
}
