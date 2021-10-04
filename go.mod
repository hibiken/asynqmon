module github.com/hibiken/asynqmon

go 1.16

require (
	github.com/go-redis/redis/v8 v8.11.3
	github.com/gorilla/mux v1.8.0
	github.com/hibiken/asynq v0.18.6
	github.com/rs/cors v1.7.0
)

replace (
	github.com/hibiken/asynq => ../../../database/Redis/go/asynq
)
