package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/rs/cors"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynqmon"
)

// Command-line flags
var (
	flagPort              int
	flagRedisAddr         string
	flagRedisDB           int
	flagRedisPassword     string
	flagRedisTLS          string
	flagRedisURL          string
	flagRedisInsecureTLS  bool
	flagRedisClusterNodes string
)

func init() {
	flag.IntVar(&flagPort, "port", 8080, "port number to use for web ui server")
	flag.StringVar(&flagRedisAddr, "redis-addr", "127.0.0.1:6379", "address of redis server to connect to")
	flag.IntVar(&flagRedisDB, "redis-db", 0, "redis database number")
	flag.StringVar(&flagRedisPassword, "redis-password", "", "password to use when connecting to redis server")
	flag.StringVar(&flagRedisTLS, "redis-tls", "", "server name for TLS validation used when connecting to redis server")
	flag.StringVar(&flagRedisURL, "redis-url", "", "URL to redis server")
	flag.BoolVar(&flagRedisInsecureTLS, "redis-insecure-tls", false, "disable TLS certificate host checks")
	flag.StringVar(&flagRedisClusterNodes, "redis-cluster-nodes", "", "comma separated list of host:port addresses of cluster nodes")
}

// TODO: Write test and refactor this code.
// IDEA: https://eli.thegreenplace.net/2020/testing-flag-parsing-in-go-programs/
func getRedisOptionsFromFlags() (asynq.RedisConnOpt, error) {
	var opts redis.UniversalOptions

	if flagRedisClusterNodes != "" {
		opts.Addrs = strings.Split(flagRedisClusterNodes, ",")
		opts.Password = flagRedisPassword
	} else {
		if flagRedisURL != "" {
			res, err := redis.ParseURL(flagRedisURL)
			if err != nil {
				return nil, err
			}
			opts.Addrs = append(opts.Addrs, res.Addr)
			opts.DB = res.DB
			opts.Password = res.Password

		} else {
			opts.Addrs = []string{flagRedisAddr}
			opts.DB = flagRedisDB
			opts.Password = flagRedisPassword
		}
	}

	if flagRedisTLS != "" {
		opts.TLSConfig = &tls.Config{ServerName: flagRedisTLS}
	}
	if flagRedisInsecureTLS {
		if opts.TLSConfig == nil {
			opts.TLSConfig = &tls.Config{}
		}
		opts.TLSConfig.InsecureSkipVerify = true
	}

	if flagRedisClusterNodes != "" {
		return asynq.RedisClusterClientOpt{
			Addrs:     opts.Addrs,
			Password:  opts.Password,
			TLSConfig: opts.TLSConfig,
		}, nil
	}
	return asynq.RedisClientOpt{
		Addr:      opts.Addrs[0],
		DB:        opts.DB,
		Password:  opts.Password,
		TLSConfig: opts.TLSConfig,
	}, nil
}

func main() {
	flag.Parse()

	redisConnOpt, err := getRedisOptionsFromFlags()
	if err != nil {
		log.Fatal(err)
	}

	h := asynqmon.New(asynqmon.Options{
		RedisConnOpt: redisConnOpt,
	})
	defer h.Close()

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE"},
	})

	srv := &http.Server{
		Handler:      c.Handler(h),
		Addr:         fmt.Sprintf(":%d", flagPort),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	fmt.Printf("Asynq Monitoring WebUI server is listening on port %d\n", flagPort)
	log.Fatal(srv.ListenAndServe())
}
