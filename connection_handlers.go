package asynqmon

import (
	"encoding/json"
	"net/http"
)

func newListConnectionsHandlerFunc(reg *connectionRegistry) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		list := reg.List()
		payload := map[string]interface{}{
			"connections": list,
			"default":     reg.DefaultName(),
		}
		if err := json.NewEncoder(w).Encode(payload); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
