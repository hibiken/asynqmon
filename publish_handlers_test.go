package asynqmon

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

func TestPublishEventHandler(t *testing.T) {
	// Use in-memory connection options for the Asynq client
	redisOpt := asynq.RedisClientOpt{
		Addr: "localhost:6379",
		DB:   1, // Use a separate database for tests
	}

	// Create an Asynq client
	client := asynq.NewClient(redisOpt)

	// Create a handler for testing
	handler := newPublishEventHandlerFunc(client)

	// Create a router to add URL parameters
	r := mux.NewRouter()
	r.HandleFunc("/queues/{qname}/publish", handler).Methods("POST")

	// Prepare the request payload
	payload := map[string]interface{}{
		"user_id": 123,
		"action":  "signup",
	}
	reqBody := PublishRequest{
		Payload: payload,
		Event:   "user:registered",
	}
	body, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf("Failed to serialize request body: %v", err)
	}

	// Create an HTTP request with the body
	req, err := http.NewRequest("POST", "/queues/default/publish", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a recorder to capture the response
	rr := httptest.NewRecorder()

	// Make the request to the handler
	r.ServeHTTP(rr, req)

	// Verify the response status
	if rr.Code != http.StatusCreated {
		t.Errorf("Handler returned unexpected code: expected %v, got %v", http.StatusCreated, rr.Code)
	}

	// Verify the response has a task ID
	var response PublishResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if response.TaskID == "" {
		t.Errorf("TaskID in response is empty")
	}
}
