package asynqmon

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
)

type listGroupsResponse struct {
	Groups []*groupInfo `json:"groups"`
}

func newListGroupsHandlerFunc(inspector *asynq.Inspector) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		qname := mux.Vars(r)["qname"]

		groups, err := inspector.Groups(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resp := listGroupsResponse{
			Groups: toGroupInfos(groups),
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
