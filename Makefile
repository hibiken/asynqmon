.PHONY: api assets build docker

NODE_PATH ?= $(PWD)/ui/node_modules
assets:
	@if [ ! -d "$(NODE_PATH)"  ]; then cd ./ui && yarn install --modules-folder $(NODE_PATH); fi
	cd ./ui && yarn build --modules-folder $(NODE_PATH)

# This target skips the overhead of building UI assets.
# Intended to be used during development.
api:
	go build -o api ./cmd/asynqmon

# Build a release binary.
build: assets
	go build -o asynqmon ./cmd/asynqmon

# Build image and run Asynqmon server (with default settings).
docker:
	docker build -t asynqmon .
	docker run --rm \
		--name asynqmon \
		-p 8080:8080 \
		asynqmon --redis-addrs=host.docker.internal:6379
