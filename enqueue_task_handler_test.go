package asynqmon

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

type recordingTaskEnqueuer struct {
	task *asynq.Task
	opts []asynq.Option
	info *asynq.TaskInfo
	err  error
}

func (e *recordingTaskEnqueuer) Enqueue(task *asynq.Task, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	e.task = task
	e.opts = opts
	return e.info, e.err
}

func TestEnqueueTaskHandler(t *testing.T) {
	enqueuer := &recordingTaskEnqueuer{
		info: &asynq.TaskInfo{
			ID:    "task-123",
			Queue: "critical",
			Type:  "email:deliver",
		},
	}
	handler := newEnqueueTaskHandlerFunc(enqueuer)
	req := httptest.NewRequest(http.MethodPost, "/api/queues/critical/tasks", strings.NewReader(
		`{"type":"email:deliver","payload":"{\"user_id\":123}"}`,
	))
	req = mux.SetURLVars(req, map[string]string{"qname": "critical"})
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("status code = %d, want %d; body=%q", rec.Code, http.StatusCreated, rec.Body.String())
	}
	if got := rec.Header().Get("Content-Type"); got != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", got)
	}
	if got, want := enqueuer.task.Type(), "email:deliver"; got != want {
		t.Errorf("task type = %q, want %q", got, want)
	}
	if got, want := string(enqueuer.task.Payload()), `{"user_id":123}`; got != want {
		t.Errorf("task payload = %q, want %q", got, want)
	}
	if len(enqueuer.opts) != 1 {
		t.Fatalf("enqueue options = %d, want 1", len(enqueuer.opts))
	}
	if got, want := enqueuer.opts[0].Type(), asynq.QueueOpt; got != want {
		t.Errorf("option type = %v, want %v", got, want)
	}
	if got, want := enqueuer.opts[0].Value(), "critical"; got != want {
		t.Errorf("queue option = %v, want %q", got, want)
	}
	if got, want := strings.TrimSpace(rec.Body.String()), `{"id":"task-123","queue":"critical","type":"email:deliver"}`; got != want {
		t.Errorf("response body = %q, want %q", got, want)
	}
}

func TestEnqueueTaskHandlerValidation(t *testing.T) {
	tests := []struct {
		name   string
		queue  string
		body   string
		status int
	}{
		{name: "missing queue", body: `{"type":"task"}`, status: http.StatusBadRequest},
		{name: "malformed JSON", queue: "default", body: `{`, status: http.StatusBadRequest},
		{name: "unknown field", queue: "default", body: `{"type":"task","unknown":true}`, status: http.StatusBadRequest},
		{name: "multiple JSON values", queue: "default", body: `{"type":"task"} {}`, status: http.StatusBadRequest},
		{name: "missing task type", queue: "default", body: `{"payload":"value"}`, status: http.StatusBadRequest},
		{name: "blank task type", queue: "default", body: `{"type":"  "}`, status: http.StatusBadRequest},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			enqueuer := &recordingTaskEnqueuer{}
			req := httptest.NewRequest(http.MethodPost, "/api/queues/default/tasks", strings.NewReader(tc.body))
			req = mux.SetURLVars(req, map[string]string{"qname": tc.queue})
			rec := httptest.NewRecorder()

			newEnqueueTaskHandlerFunc(enqueuer).ServeHTTP(rec, req)

			if rec.Code != tc.status {
				t.Fatalf("status code = %d, want %d; body=%q", rec.Code, tc.status, rec.Body.String())
			}
			if enqueuer.task != nil {
				t.Fatal("Enqueue was called for an invalid request")
			}
		})
	}
}

func TestEnqueueTaskHandlerRejectsOversizedBody(t *testing.T) {
	body := `{"type":"task","payload":"` + strings.Repeat("x", maxEnqueueTaskRequestBytes) + `"}`
	req := httptest.NewRequest(http.MethodPost, "/api/queues/default/tasks", strings.NewReader(body))
	req = mux.SetURLVars(req, map[string]string{"qname": "default"})
	rec := httptest.NewRecorder()

	newEnqueueTaskHandlerFunc(&recordingTaskEnqueuer{}).ServeHTTP(rec, req)

	if rec.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("status code = %d, want %d; body=%q", rec.Code, http.StatusRequestEntityTooLarge, rec.Body.String())
	}
}

func TestEnqueueTaskHandlerReturnsClientError(t *testing.T) {
	enqueuer := &recordingTaskEnqueuer{err: errors.New("redis unavailable")}
	req := httptest.NewRequest(http.MethodPost, "/api/queues/default/tasks", strings.NewReader(`{"type":"task"}`))
	req = mux.SetURLVars(req, map[string]string{"qname": "default"})
	rec := httptest.NewRecorder()

	newEnqueueTaskHandlerFunc(enqueuer).ServeHTTP(rec, req)

	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status code = %d, want %d", rec.Code, http.StatusInternalServerError)
	}
}
