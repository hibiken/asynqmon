# Asynqmon

Asynqmon is a web based tool for monitoring and administrating Asynq queues and tasks.

## Compatibility

Current version of Asynqmon is compatible with [Asynq v0.15 or above](https://github.com/hibiken/asynq/releases).

## Install

### Release binaries

You can download the release binary for your system from the
[releases page](https://github.com/hibiken/asynqmon/releases).

### Docker image

To pull the docker image:

```bash
# Pull the latest image
docker pull hibiken/asynqmon

# Or specify the image by tag
docker pull hibiken/asynqmon[:tag]
```

### Building from source

To build Asynqmon from source code, first ensure that have a working
Go environment with [version 1.16 or greater installed](https://golang.org/doc/install).
You also need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)
installed in order to build the frontend assets.

Download the source code and then run:

```bash
make build
```

The `asynqmon` binary should be created in the current directory.

### Building docker image

To build docker image locally, run:

```bash
make docker
```

## Run

To use the defaults, simply run and open http://localhost:8080.

```bash
# with a local binary
./asynqmon

# with docker
docker run --rm \
    --name asynqmon \
    -p 8080:8080 \
    hibiken/asynqmon
```

By default, Asynqmon web server listens on port `8080` and connects to a Redis server listening on `127.0.0.1:6379`.

Pass flags to specify port, redis server address, etc.

```bash
# with a local binary
./asynqmon --port=3000 --redis_addr=localhost:6380

# with docker (connect to redis-server running on the host machine)
docker run --rm \
    --name asynqmon \
    -p 3000:3000 \
    hibiken/asynqmon --port=3000 --redis_addr=host.docker.internal:6380

# with docker (connect to redis-server running in a docker container)
docker run --rm \
    --name asynqmon \
    --network dev-network \
    -p 8080:8080 \
    asynqmon --redis_addr=dev-redis:6379
```

To see all available flags, run

```bash
# with a local binary
./asynqmon --help

# with docker
docker run hibiken/asynqmon --help
```

Next, go to [localhost:8080](http://localhost:8080) and see Asynqmon dashboard:

![Screenshot](https://user-images.githubusercontent.com/11155743/113557216-57af2b80-9606-11eb-8ab6-df023b14e5c1.png)

## License

Asynqmon is released under the MIT license. See [LICENSE](https://github.com/hibiken/asynqmon/blob/master/LICENSE).
