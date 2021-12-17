module github.com/hibiken/asynqmon

go 1.16

require (
	github.com/go-redis/redis/v8 v8.11.4
	github.com/gorilla/mux v1.8.0
	github.com/hibiken/asynq v0.19.1
	github.com/hibiken/asynq/x v0.1.0
	github.com/prometheus/client_golang v1.11.0 // indirect
	github.com/rs/cors v1.7.0
)

replace (
	github.com/hibiken/asynq => ./../../../database/Redis/go/asynq
	github.com/hibiken/asynq/x => ./../../../database/Redis/go/asynq/x
)
