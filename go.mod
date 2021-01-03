module asynqmon

go 1.14

require (
	github.com/go-redis/redis/v8 v8.4.4
	github.com/gorilla/mux v1.8.0
	github.com/hibiken/asynq v0.13.1
	github.com/rs/cors v1.7.0
)

replace github.com/hibiken/asynq => ../../../database/Redis/go/asynq
