package asynqmon

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

// PublishRequest represents the request body for the event publishing endpoint
type PublishRequest struct {
	Payload map[string]interface{} `json:"payload"`
	Event   string                 `json:"event"`
}

// PublishResponse represents the API response
type PublishResponse struct {
	TaskID string `json:"task_id"`
}

// newPublishEventHandlerFunc creates a handler for event publishing to Asynq
func newPublishEventHandlerFunc(client *asynq.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract queue name from URL parameters
		vars := mux.Vars(r)
		queueName := vars["qname"]
		if queueName == "" {
			http.Error(w, "Queue name not specified", http.StatusBadRequest)
			return
		}

		// Decode request body
		var req PublishRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Validate request body
		if req.Event == "" {
			http.Error(w, "Event name not specified", http.StatusBadRequest)
			return
		}
		if req.Payload == nil {
			req.Payload = make(map[string]interface{})
		}

		// Convert payload to bytes
		payload, err := json.Marshal(req.Payload)
		if err != nil {
			http.Error(w, "Error serializing payload: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Create the task
		task := asynq.NewTask(req.Event, payload)

		// Enqueue the task in the specified queue
		info, err := client.Enqueue(task, asynq.Queue(queueName))
		if err != nil {
			http.Error(w, "Error publishing event: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Return success response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(PublishResponse{
			TaskID: info.ID,
		})
	}
}
