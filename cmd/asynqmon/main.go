package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/hibiken/asynq"
	"github.com/hibiken/asynq/x/metrics"
	"github.com/hibiken/asynqmon"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

// Command-line flags
var (
	flagPort                  int
	flagRedisAddrs            string
	flagRedisDB               int
	flagRedisPassword         string
	flagRedisTLS              string
	flagRedisURL              string
	flagRedisInsecureTLS      bool
	flagRedisSentinels        string
	flagMaxPayloadLength      int
	flagMaxResultLength       int
	flagEnableMetricsExporter bool
	flagPrometheusServerAddr  string
	flagReadOnly              bool
	flagMasterName            string
)

func init() {
	flag.IntVar(&flagPort, "port", getEnvOrDefaultInt("PORT", 8080), "port number to use for web ui server")
	flag.StringVar(&flagRedisAddrs, "redis-addrs", getEnvDefaultString("REDIS_ADDRS", "127.0.0.1:6379"), "comma separated list of host:port addresses")
	flag.IntVar(&flagRedisDB, "redis-db", getEnvOrDefaultInt("REDIS_DB", 0), "redis database number")
	flag.StringVar(&flagMasterName, "redis-master-name", getEnvDefaultString("REDIS_MASTER_NAME", ""), "redis master name for redis sentinel")
	flag.StringVar(&flagRedisPassword, "redis-password", getEnvDefaultString("REDIS_PASSWORD", ""), "password to use when connecting to redis server")
	flag.StringVar(&flagRedisTLS, "redis-tls", getEnvDefaultString("REDIS_TLS", ""), "server name for TLS validation used when connecting to redis server")
	flag.StringVar(&flagRedisURL, "redis-url", getEnvDefaultString("REDIS_URL", ""), "URL to redis server")
	flag.BoolVar(&flagRedisInsecureTLS, "redis-insecure-tls", getEnvOrDefaultBool("REDIS_INSECURE_TLS", false), "disable TLS certificate host checks")
	flag.StringVar(&flagRedisSentinels, "redis-sentinels", getEnvDefaultString("REDIS_SENTINELS", ""), "comma separated list of host:port addresses of cluster nodes")

	flag.IntVar(&flagMaxPayloadLength, "max-payload-length", getEnvOrDefaultInt("MAX_PAYLOAD_LENGTH", 200), "maximum number of utf8 characters printed in the payload cell in the Web UI")
	flag.IntVar(&flagMaxResultLength, "max-result-length", getEnvOrDefaultInt("MAX_RESULT_LENGTH", 200), "maximum number of utf8 characters printed in the result cell in the Web UI")
	flag.BoolVar(&flagEnableMetricsExporter, "enable-metrics-exporter", getEnvOrDefaultBool("ENABLE_METRICS_EXPORTER", false), "enable prometheus metrics exporter to expose queue metrics")
	flag.StringVar(&flagPrometheusServerAddr, "prometheus-addr", getEnvDefaultString("PROMETHEUS_ADDR", ""), "address of prometheus server to query time series")
	flag.BoolVar(&flagReadOnly, "read-only", getEnvOrDefaultBool("READ_ONLY", false), "restrict to read-only mode")
}

// TODO: Write test and refactor this code.
// IDEA: https://eli.thegreenplace.net/2020/testing-flag-parsing-in-go-programs/
func getRedisOptionsFromFlags() (asynq.RedisConnOpt, error) {
	var opts redis.UniversalOptions
	if flagRedisAddrs != "" {
		opts.Addrs = strings.Split(flagRedisAddrs, ",")
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
	if flagMasterName != "" {
		return asynq.RedisFailoverClientOpt{
			SentinelAddrs: opts.Addrs,
			MasterName:    flagMasterName,
			Password:      opts.Password,
			TLSConfig:     opts.TLSConfig,
		}, nil
	}
	if len(flagRedisAddrs) > 1 {
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
		RedisConnOpt:      redisConnOpt,
		PayloadFormatter:  asynqmon.PayloadFormatterFunc(formatPayload),
		ResultFormatter:   asynqmon.ResultFormatterFunc(formatResult),
		PrometheusAddress: flagPrometheusServerAddr,
		ReadOnly:          flagReadOnly,
	})
	defer h.Close()

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE"},
	})
	mux := http.NewServeMux()
	mux.Handle("/", c.Handler(h))
	if flagEnableMetricsExporter {
		// Using NewPedanticRegistry here to test the implementation of Collectors and Metrics.
		reg := prometheus.NewPedanticRegistry()

		inspector := asynq.NewInspector(redisConnOpt)

		reg.MustRegister(
			metrics.NewQueueMetricsCollector(inspector),
			// Add the standard process and go metrics to the registry
			prometheus.NewProcessCollector(prometheus.ProcessCollectorOpts{}),
			prometheus.NewGoCollector(),
		)
		mux.Handle("/metrics", promhttp.HandlerFor(reg, promhttp.HandlerOpts{}))
	}

	srv := &http.Server{
		Handler:      mux,
		Addr:         fmt.Sprintf(":%d", flagPort),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	fmt.Printf("Asynq Monitoring WebUI server is listening on port %d\n", flagPort)
	log.Fatal(srv.ListenAndServe())
}

func formatPayload(taskType string, payload []byte) string {
	payloadStr := asynqmon.DefaultPayloadFormatter.FormatPayload(taskType, payload)
	return truncate(payloadStr, flagMaxPayloadLength)
}

func formatResult(taskType string, result []byte) string {
	resultStr := asynqmon.DefaultResultFormatter.FormatResult(taskType, result)
	return truncate(resultStr, flagMaxResultLength)
}

// truncates string s to limit length (in utf8).
func truncate(s string, limit int) string {
	i := 0
	for pos := range s {
		if i == limit {
			return s[:pos] + "…"
		}
		i++
	}
	return s
}

func getEnvDefaultString(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}

	return v
}

func getEnvOrDefaultInt(key string, def int) int {
	v, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return def
	}
	return v
}

func getEnvOrDefaultBool(key string, def bool) bool {
	v, err := strconv.ParseBool(os.Getenv(key))
	if err != nil {
		return def
	}
	return v
}
