package asynqmon

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

// PublishRequest representa o body do request para a rota de publicação de eventos
type PublishRequest struct {
	Payload map[string]interface{} `json:"payload"`
	Event   string                 `json:"event"`
}

// PublishResponse representa a resposta da API
type PublishResponse struct {
	TaskID string `json:"task_id"`
}

// newPublishEventHandlerFunc cria um handler para publicação de eventos no Asynq
func newPublishEventHandlerFunc(client *asynq.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extrair o nome da fila dos parâmetros da URL
		vars := mux.Vars(r)
		queueName := vars["qname"]
		if queueName == "" {
			http.Error(w, "Nome da fila não especificado", http.StatusBadRequest)
			return
		}

		// Decodificar o corpo da requisição
		var req PublishRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Erro ao decodificar o corpo da requisição: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Validar o corpo da requisição
		if req.Event == "" {
			http.Error(w, "Nome do evento não especificado", http.StatusBadRequest)
			return
		}
		if req.Payload == nil {
			req.Payload = make(map[string]interface{})
		}

		// Converter o payload para bytes
		payload, err := json.Marshal(req.Payload)
		if err != nil {
			http.Error(w, "Erro ao serializar o payload: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Criar a task
		task := asynq.NewTask(req.Event, payload)
		
		// Enfileirar a task na fila especificada
		info, err := client.Enqueue(task, asynq.Queue(queueName))
		if err != nil {
			http.Error(w, "Erro ao publicar evento: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Retornar resposta de sucesso
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(PublishResponse{
			TaskID: info.ID,
		})
	}
}
