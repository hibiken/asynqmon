package asynqmon

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

const maxEnqueueTaskRequestBytes = 1 << 20 // 1 MiB

type taskEnqueuer interface {
	Enqueue(*asynq.Task, ...asynq.Option) (*asynq.TaskInfo, error)
}

type enqueueTaskRequest struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type enqueueTaskResponse struct {
	ID    string `json:"id"`
	Queue string `json:"queue"`
	Type  string `json:"type"`
}

func newEnqueueTaskHandlerFunc(client taskEnqueuer) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]
		if strings.TrimSpace(qname) == "" {
			http.Error(w, "queue name cannot be empty", http.StatusBadRequest)
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, maxEnqueueTaskRequestBytes)
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()

		var req enqueueTaskRequest
		if err := dec.Decode(&req); err != nil {
			var maxBytesErr *http.MaxBytesError
			if errors.As(err, &maxBytesErr) {
				http.Error(w, "request body is too large", http.StatusRequestEntityTooLarge)
				return
			}
			http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if err := ensureJSONEOF(dec); err != nil {
			http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(req.Type) == "" {
			http.Error(w, "task type cannot be empty", http.StatusBadRequest)
			return
		}

		info, err := client.Enqueue(
			asynq.NewTask(req.Type, []byte(req.Payload)),
			asynq.Queue(qname),
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(enqueueTaskResponse{
			ID:    info.ID,
			Queue: info.Queue,
			Type:  info.Type,
		}); err != nil {
			return
		}
	}
}

func ensureJSONEOF(dec *json.Decoder) error {
	var extra interface{}
	if err := dec.Decode(&extra); err != io.EOF {
		if err == nil {
			return errors.New("request body must contain a single JSON object")
		}
		return err
	}
	return nil
}
