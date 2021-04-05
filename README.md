# Asynqmon

Asynqmon is a web based tool for monitoring and administrating Asynq queues and tasks.

## Compatibility

Current version of Asynqmon is compatible with [Asynq v0.15 or above](https://github.com/hibiken/asynq/releases).

## Installation

### Release binaries

You can download the release binary for your system from the
[releases page](https://github.com/hibiken/asynqmon/releases).

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

### Running from Docker

To run Asynqmon in Docker container, you only need to install [Docker](https://www.docker.com/get-started) to your system. No need to install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/), they will be installed automatically in container.

After that, just run this command:

```bash
make docker
```

Next, go to [localhost:8080](http://localhost:8080) and see Asynqmon dashboard:

![Screenshot](https://user-images.githubusercontent.com/11155743/113557216-57af2b80-9606-11eb-8ab6-df023b14e5c1.png)

#### Change a default Asynqmon settings

By default, Asynqmon runs on `http://localhost:8080` and waiting to connect to the Redis server on port `6379`. You can easily change this settings by running Docker container with custom options, like this:

```bash
docker run --rm \
    --name asynqmon \
    -p 3000:3000 \
    asynqmon --port=3000 --redis_addr=localhost:6380
```

#### Works with a Redis server from Docker

If you run Redis server from Docker container too (i.e. is **not** locally installed to your machine), you need to set [Docker network](https://docs.docker.com/network/) to work with it. For example, if Redis container have a name like `dev-redis`, and our Docker network called `dev-network`, you should run Asynqmon container by this command:

```bash
docker run --rm \
    --name asynqmon \
    --network dev-network \
    -p 8080:8080 \
    asynqmon --redis_addr=dev-redis:6379
```

## Usage

Asynqmon server needs to connect to redis server to serve data.
By default, it connects to redis server running on port 6379 locally, and the server listens on port 8080.

To use the defaults, simply run and open http://localhost:8080.

```bash
./asynqmon
```

Pass flags to specify port, redis server address, etc.


```bash
./asynqmon --port=3000 --redis_addr=localhost:6380
```

To see all available flags, run

```bash
./asynqmon --help
```

## License

Asynqmon is released under the MIT license. See [LICENSE](https://github.com/hibiken/asynqmon/blob/master/LICENSE).
