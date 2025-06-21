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
	// Usa opções de conexão em memória para o cliente Asynq
	redisOpt := asynq.RedisClientOpt{
		Addr: "localhost:6379",
		DB:   1, // Usa um banco de dados separado para testes
	}

	// Cria um cliente Asynq
	client := asynq.NewClient(redisOpt)

	// Cria um handler para teste
	handler := newPublishEventHandlerFunc(client)

	// Cria um router para adicionar os parâmetros de URL
	r := mux.NewRouter()
	r.HandleFunc("/queues/{qname}/publish", handler).Methods("POST")

	// Monta o payload da requisição
	payload := map[string]interface{}{
		"user_id": 123,
		"action": "signup",
	}
	reqBody := PublishRequest{
		Payload: payload,
		Event:   "user:registered",
	}
	body, err := json.Marshal(reqBody)
	if err != nil {
		t.Fatalf("Falha ao serializar corpo da requisição: %v", err)
	}

	// Cria uma requisição HTTP com o corpo
	req, err := http.NewRequest("POST", "/queues/default/publish", bytes.NewReader(body))
	if err != nil {
		t.Fatalf("Falha ao criar requisição: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Cria um recorder para capturar a resposta
	rr := httptest.NewRecorder()

	// Faz a requisição ao handler
	r.ServeHTTP(rr, req)

	// Verifica o status de resposta
	if rr.Code != http.StatusCreated {
		t.Errorf("Handler retornou código inesperado: esperado %v, obtido %v", http.StatusCreated, rr.Code)
	}

	// Verifica se a resposta tem um ID de task
	var response PublishResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("Falha ao decodificar resposta: %v", err)
	}
	if response.TaskID == "" {
		t.Errorf("TaskID na resposta está vazio")
	}
}
