package main

import (
	"encoding/json"
	"net/http"

	"github.com/hibiken/asynq/inspeq"
)

// ****************************************************************************
// This file defines:
//   - http.Handler(s) for server related endpoints
// ****************************************************************************

type ListServersResponse struct {
	Servers []*ServerInfo `json:"servers"`
}

func newListServersHandlerFunc(inspector *inspeq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		srvs, err := inspector.Servers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := ListServersResponse{
			Servers: toServerInfoList(srvs),
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
