.PHONY: assets go_binary build docker

NODE_PATH = $(PWD)/ui/node_modules

assets:
	@cd ./ui && yarn install --modules-folder $(NODE_PATH) && yarn build --modules-folder $(NODE_PATH)
	@rsync -avu --delete "./ui/build/" "./internal/assets"

# Build go binary.
go_binary: assets
	go build -o asynqmon ./cmd/asynqmon

# Target to build a release binary.
build: go_binary

# Build image and run Asynqmon server (with default settings).
docker:
	docker build -t asynqmon .
	docker run --rm \
		--name asynqmon \
		-p 8080:8080 \
		asynqmon --redis-addr=host.docker.internal:6379
