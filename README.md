<img src="https://user-images.githubusercontent.com/11155743/114745460-57760500-9d57-11eb-9a2c-43fa88171807.png" alt="Asynqmon logo" width="360px" />

# A modern web based tool for monitoring & administrating [Asynq](https://github.com/hibiken/asynq) queues, tasks and message broker

## Version Compatibility

| Asynq version  | WebUI (asynqmon) version |
| -------------- | ------------------------ |
| 0.18.x         | 0.2.x                    |
| 0.16.x, 0.17.x | 0.1.x                    |

## Install

### Release binaries

You can download the release binary for your system from the [releases page](https://github.com/hibiken/asynqmon/releases).

### Docker image

To pull the Docker image:

```bash
# Pull the latest image
docker pull hibiken/asynqmon

# Or specify the image by tag
docker pull hibiken/asynqmon[:tag]
```

### Building from source

To build Asynqmon from source code, make sure you have Go installed ([download](https://golang.org/dl/)). Version `1.16` or higher is required. You also need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed in order to build the frontend assets.

Download the source code of this repository and then run:

```bash
make build
```

The `asynqmon` binary should be created in the current directory.

### Building Docker image locally

To build Docker image locally, run:

```bash
make docker
```

### Importing into projects

You can import `asynqmon` into other projects and create a single binary to serve other components of `asynq` and `asynqmon` from a single binary.

<details><summary>Example</summary>
<p>

> `staticContents` can be embedded by using the pre-built UI bundle from the Releases section.

```go
package main

import (
	"embed"
	"log"
	"net/http"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynqmon"
)

//go:embed ui-assets/*
var staticContents embed.FS

func main() {
	api := asynqmon.NewHTTPHandler(asynqmon.Options{
		RedisConnOpt: asynq.RedisClientOpt{Addr: ":6379"},
		StaticContentHandler: asynqmon.NewStaticContentHandler(
			staticContents,
			"ui-assets",
			"index.html",
		),
	})
	defer api.Close()

	srv := &http.Server{
		Handler: api,
		Addr:    ":8080",
	}

	log.Fatal(srv.ListenAndServe())
}
```

</p>
</details>


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

By default, Asynqmon web server listens on port `8080` and connects to a Redis server running on `127.0.0.1:6379`.

To see all available flags, run:

```bash
# with a local binary
./asynqmon --help

# with Docker
docker run hibiken/asynqmon --help
```

Here's the available flags:

_Note_: Use `--redis-url` to specify address, db-number, and password with one flag value; Alternatively, use `--redis-addr`, `--redis-db`, and `--redis-password` to specify each value.

| Flag                            | Description                                                         | Default          |
| ------------------------------- | ------------------------------------------------------------------- | ---------------- |
| `--port`(int)                   | port number to use for web ui server                                | 8080             |
| `---redis-url`(string)          | URL to redis server                                                 | ""               |
| `--redis-addr`(string)          | address of redis server to connect to                               | "127.0.0.1:6379" |
| `--redis-db`(int)               | redis database number                                               | 0                |
| `--redis-password`(string)      | password to use when connecting to redis server                     | ""               |
| `--redis-cluster-nodes`(string) | comma separated list of host:port addresses of cluster nodes        | ""               |
| `--redis-tls`(string)           | server name for TLS validation used when connecting to redis server | ""               |
| `--redis-insecure-tls`(bool)    | disable TLS certificate host checks                                 | false            |

### Examples

```bash
# with a local binary; custom port and connect to redis server at localhost:6380
./asynqmon --port=3000 --redis-addr=localhost:6380

# with Docker (connect to a Redis server running on the host machine)
docker run --rm \
    --name asynqmon \
    -p 3000:3000 \
    hibiken/asynqmon --port=3000 --redis-addr=host.docker.internal:6380

# with Docker (connect to a Redis server running in the Docker container)
docker run --rm \
    --name asynqmon \
    --network dev-network \
    -p 8080:8080 \
    hibiken/asynqmon --redis-addr=dev-redis:6379
```

Next, go to [localhost:8080](http://localhost:8080) and see Asynqmon dashboard:

![Web UI Queues View](https://user-images.githubusercontent.com/11155743/114697016-07327f00-9d26-11eb-808c-0ac841dc888e.png)

**Tasks view**

![Web UI TasksView](https://user-images.githubusercontent.com/11155743/114697070-1f0a0300-9d26-11eb-855c-d3ec263865b7.png)

**Settings and adaptive dark mode**

![Web UI Settings and adaptive dark mode](https://user-images.githubusercontent.com/11155743/114697149-3517c380-9d26-11eb-9f7a-ae2dd00aad5b.png)

## License

Copyright (c) 2019-present [Ken Hibino](https://github.com/hibiken) and [Contributors](https://github.com/hibiken/asynqmon/graphs/contributors). `Asynqmon` is free and open-source software licensed under the [MIT License](https://github.com/hibiken/asynq/blob/master/LICENSE). Official logo was created by [Vic Shóstak](https://github.com/koddr) and distributed under [Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/) license (CC0 1.0 Universal).
