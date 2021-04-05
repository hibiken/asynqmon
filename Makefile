.PHONY: assets go_binary build docker

NODE_MODULES_PATH = $(PWD)/ui/node_modules

# Checking for a node_modules folder before building.
assets:
	@if [ -d "$(NODE_MODULES_PATH)" ]; then cd ./ui && yarn install; fi
	cd ./ui && yarn build

# Build go binary.
go_binary: assets
	go build -o asynqmon .

# Target to build a release binary.
build: go_binary

# Build image and run Asynqmon server (with default settings).
docker:
	docker build -t asynqmon .
	docker run --rm \
		--name asynqmon \
		-p 8080:8080 \
		asynqmon

