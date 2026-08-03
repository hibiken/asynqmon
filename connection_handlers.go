package asynqmon

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type createConnectionRequest struct {
	Name string `json:"name"`
	Addr string `json:"addr"`
}

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

func newCreateConnectionHandlerFunc(reg *connectionRegistry, configPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req createConnectionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid json body", http.StatusBadRequest)
			return
		}
		req.Name = strings.TrimSpace(req.Name)
		req.Addr = strings.TrimSpace(req.Addr)
		if req.Name == "" || req.Addr == "" {
			http.Error(w, "name and addr are required", http.StatusBadRequest)
			return
		}
		if err := reg.Add(req.Name, req.Addr, nil); err != nil {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		if err := saveConnectionsFile(configPath, reg.List()); err != nil {
			_ = reg.Remove(req.Name)
			http.Error(w, "failed to persist connection: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(RedisConnection{Name: req.Name, Addr: req.Addr})
	}
}

func newDeleteConnectionHandlerFunc(reg *connectionRegistry, configPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := mux.Vars(r)["name"]
		if name == "" {
			http.Error(w, "name is required", http.StatusBadRequest)
			return
		}
		if err := reg.Remove(name); err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if err := saveConnectionsFile(configPath, reg.List()); err != nil {
			http.Error(w, "connection removed but failed to persist: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
