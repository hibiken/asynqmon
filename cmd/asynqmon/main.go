package main

import (
	"bytes"
	"crypto/tls"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/hibiken/asynq"
	"github.com/hibiken/asynq/x/metrics"
	"github.com/hibiken/asynqmon"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

// Config holds configurations for the program provided via the command line.
type Config struct {
	// Server port
	Port int

	// Redis connection options
	RedisAddr         string
	RedisDB           int
	RedisPassword     string
	RedisUsername     string
	RedisTLS          string
	RedisURL          string
	RedisInsecureTLS  bool
	RedisClusterNodes string

	// UI related configs
	ReadOnly         bool
	MaxPayloadLength int
	MaxResultLength  int

	// Prometheus related configs
	EnableMetricsExporter bool
	PrometheusServerAddr  string

	// Args are the positional (non-flag) command line arguments
	Args []string
}

// parseFlags parses the command-line arguments provided to the program.
// Typically, os.Args[0] is provided as 'progname' and os.args[1:] as 'args'.
// Returns the Config in case parsing succeeded, or an error. In any case, the
// output of the flag.Parse is returned in output.
//
// Reference: https://eli.thegreenplace.net/2020/testing-flag-parsing-in-go-programs/
func parseFlags(progname string, args []string) (cfg *Config, output string, err error) {
	flags := flag.NewFlagSet(progname, flag.ContinueOnError)
	var buf bytes.Buffer
	flags.SetOutput(&buf)

	var conf Config
	flags.IntVar(&conf.Port, "port", getEnvOrDefaultInt("PORT", 8080), "port number to use for web ui server")
	flags.StringVar(&conf.RedisAddr, "redis-addr", getEnvDefaultString("REDIS_ADDR", "127.0.0.1:6379"), "address of redis server to connect to")
	flags.IntVar(&conf.RedisDB, "redis-db", getEnvOrDefaultInt("REDIS_DB", 0), "redis database number")
	flags.StringVar(&conf.RedisPassword, "redis-password", getEnvDefaultString("REDIS_PASSWORD", ""), "password to use when connecting to redis server")
	flags.StringVar(&conf.RedisUsername, "redis-username", getEnvDefaultString("REDIS_USERNAME", ""), "user name to use when connecting to redis server")
	flags.StringVar(&conf.RedisTLS, "redis-tls", getEnvDefaultString("REDIS_TLS", ""), "server name for TLS validation used when connecting to redis server")
	flags.StringVar(&conf.RedisURL, "redis-url", getEnvDefaultString("REDIS_URL", ""), "URL to redis server")
	flags.BoolVar(&conf.RedisInsecureTLS, "redis-insecure-tls", getEnvOrDefaultBool("REDIS_INSECURE_TLS", false), "disable TLS certificate host checks")
	flags.StringVar(&conf.RedisClusterNodes, "redis-cluster-nodes", getEnvDefaultString("REDIS_CLUSTER_NODES", ""), "comma separated list of host:port addresses of cluster nodes")
	flags.IntVar(&conf.MaxPayloadLength, "max-payload-length", getEnvOrDefaultInt("MAX_PAYLOAD_LENGTH", 200), "maximum number of utf8 characters printed in the payload cell in the Web UI")
	flags.IntVar(&conf.MaxResultLength, "max-result-length", getEnvOrDefaultInt("MAX_RESULT_LENGTH", 200), "maximum number of utf8 characters printed in the result cell in the Web UI")
	flags.BoolVar(&conf.EnableMetricsExporter, "enable-metrics-exporter", getEnvOrDefaultBool("ENABLE_METRICS_EXPORTER", false), "enable prometheus metrics exporter to expose queue metrics")
	flags.StringVar(&conf.PrometheusServerAddr, "prometheus-addr", getEnvDefaultString("PROMETHEUS_ADDR", ""), "address of prometheus server to query time series")
	flags.BoolVar(&conf.ReadOnly, "read-only", getEnvOrDefaultBool("READ_ONLY", false), "restrict to read-only mode")

	err = flags.Parse(args)
	if err != nil {
		return nil, buf.String(), err
	}
	conf.Args = flags.Args()
	return &conf, buf.String(), nil
}

func makeTLSConfig(cfg *Config) *tls.Config {
	if cfg.RedisTLS == "" && !cfg.RedisInsecureTLS {
		return nil
	}
	return &tls.Config{
		ServerName:         cfg.RedisTLS,
		InsecureSkipVerify: cfg.RedisInsecureTLS,
	}
}

func makeRedisConnOpt(cfg *Config) (asynq.RedisConnOpt, error) {
	// Connecting to redis-cluster
	if len(cfg.RedisClusterNodes) > 0 {
		return asynq.RedisClusterClientOpt{
			Addrs:     strings.Split(cfg.RedisClusterNodes, ","),
			Username:  cfg.RedisUsername,
			Password:  cfg.RedisPassword,
			TLSConfig: makeTLSConfig(cfg),
		}, nil
	}

	// Connecting to redis-sentinels
	if strings.HasPrefix(cfg.RedisURL, "redis-sentinel") {
		res, err := asynq.ParseRedisURI(cfg.RedisURL)
		if err != nil {
			return nil, err
		}
		connOpt := res.(asynq.RedisFailoverClientOpt) // safe to type-assert
		connOpt.TLSConfig = makeTLSConfig(cfg)
		return connOpt, nil
	}

	// Connecting to single redis server
	var connOpt asynq.RedisClientOpt
	if len(cfg.RedisURL) > 0 {
		res, err := asynq.ParseRedisURI(cfg.RedisURL)
		if err != nil {
			return nil, err
		}
		connOpt = res.(asynq.RedisClientOpt) // safe to type-assert
	} else {
		connOpt.Addr = cfg.RedisAddr
		connOpt.DB = cfg.RedisDB
		connOpt.Username = cfg.RedisUsername
		connOpt.Password = cfg.RedisPassword
	}
	if connOpt.TLSConfig == nil {
		connOpt.TLSConfig = makeTLSConfig(cfg)
	}
	return connOpt, nil
}

func main() {
	cfg, output, err := parseFlags(os.Args[0], os.Args[1:])
	if err == flag.ErrHelp {
		fmt.Println(output)
		os.Exit(2)
	} else if err != nil {
		fmt.Printf("error: %v\n", err)
		fmt.Println(output)
		os.Exit(1)
	}

	redisConnOpt, err := makeRedisConnOpt(cfg)
	if err != nil {
		log.Fatal(err)
	}

	h := asynqmon.New(asynqmon.Options{
		RedisConnOpt:      redisConnOpt,
		PayloadFormatter:  asynqmon.PayloadFormatterFunc(payloadFormatterFunc(cfg)),
		ResultFormatter:   asynqmon.ResultFormatterFunc(resultFormatterFunc(cfg)),
		PrometheusAddress: cfg.PrometheusServerAddr,
		ReadOnly:          cfg.ReadOnly,
	})
	defer h.Close()

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE"},
	})
	mux := http.NewServeMux()
	mux.Handle("/", c.Handler(h))
	if cfg.EnableMetricsExporter {
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
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	fmt.Printf("Asynq Monitoring WebUI server is listening on port %d\n", cfg.Port)
	log.Fatal(srv.ListenAndServe())
}

func payloadFormatterFunc(cfg *Config) func(string, []byte) string {
	return func(taskType string, payload []byte) string {
		payloadStr := asynqmon.DefaultPayloadFormatter.FormatPayload(taskType, payload)
		return truncate(payloadStr, cfg.MaxPayloadLength)
	}
}

func resultFormatterFunc(cfg *Config) func(string, []byte) string {
	return func(taskType string, result []byte) string {
		resultStr := asynqmon.DefaultResultFormatter.FormatResult(taskType, result)
		return truncate(resultStr, cfg.MaxResultLength)
	}
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
