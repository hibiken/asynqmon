.PHONY: assets sync go_binary build docker

NODE_PATH ?= $(PWD)/ui/node_modules

assets:
	@if [ ! -d "$(NODE_PATH)" ]; then cd ./ui && yarn install --modules-folder $(NODE_PATH); fi
	cd ./ui && yarn build --modules-folder $(NODE_PATH)

sync:
	rsync -avu --delete "./ui/build/" "./cmd/asynqmon/ui-assets"

# Build go binary.
go_binary: assets sync
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
