package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"flag"
	"fmt"
	"io"
	"math/big"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

func TestParseFlags(t *testing.T) {
	tests := []struct {
		args []string
		want *Config
	}{
		{
			args: []string{"--redis-addr", "localhost:6380", "--redis-db", "3"},
			want: &Config{
				RedisAddr: "localhost:6380",
				RedisDB:   3,

				// Default values
				Port:                  8080,
				RedisPassword:         "",
				RedisTLS:              "",
				RedisURL:              "",
				RedisInsecureTLS:      false,
				RedisClusterNodes:     "",
				MaxPayloadLength:      200,
				MaxResultLength:       200,
				EnableMetricsExporter: false,
				PrometheusServerAddr:  "",
				ReadOnly:              false,

				Args: []string{},
			},
		},
	}

	for _, tc := range tests {
		t.Run(strings.Join(tc.args, " "), func(t *testing.T) {
			cfg, output, err := parseFlags("asynqmon", tc.args)
			if err != nil {
				t.Errorf("parseFlags returned error: %v", err)
			}
			if output != "" {
				t.Errorf("parseFlag returned output=%q, want empty", output)
			}
			if diff := cmp.Diff(tc.want, cfg); diff != "" {
				t.Errorf("parseFlag returned Config %v, want %v; (-want,+got)\n%s", cfg, tc.want, diff)
			}
		})
	}

}

func TestMakeRedisConnOpt(t *testing.T) {
	var tests = []struct {
		desc string
		cfg  *Config
		want asynq.RedisConnOpt
	}{
		{
			desc: "With address, db number and password",
			cfg: &Config{
				RedisAddr:     "localhost:6380",
				RedisDB:       1,
				RedisPassword: "foo",
			},
			want: asynq.RedisClientOpt{
				Addr:     "localhost:6380",
				DB:       1,
				Password: "foo",
			},
		},
		{
			desc: "With TLS server name",
			cfg: &Config{
				RedisAddr: "localhost:6379",
				RedisTLS:  "foobar",
			},
			want: asynq.RedisClientOpt{
				Addr:      "localhost:6379",
				TLSConfig: &tls.Config{ServerName: "foobar"},
			},
		},
		{
			desc: "With redis URL",
			cfg: &Config{
				RedisURL: "redis://:bar@localhost:6381/2",
			},
			want: asynq.RedisClientOpt{
				Addr:     "localhost:6381",
				DB:       2,
				Password: "bar",
			},
		},
		{
			desc: "With redis-sentinel URL",
			cfg: &Config{
				RedisURL: "redis-sentinel://:secretpassword@localhost:5000,localhost:5001,localhost:5002?master=mymaster",
			},
			want: asynq.RedisFailoverClientOpt{
				MasterName: "mymaster",
				SentinelAddrs: []string{
					"localhost:5000", "localhost:5001", "localhost:5002"},
				Password: "secretpassword", // FIXME: Shouldn't this be SentinelPassword instead?
			},
		},
		{
			desc: "With cluster nodes",
			cfg: &Config{
				RedisClusterNodes: "localhost:5000,localhost:5001,localhost:5002,localhost:5003,localhost:5004,localhost:5005",
			},
			want: asynq.RedisClusterClientOpt{
				Addrs: []string{
					"localhost:5000", "localhost:5001", "localhost:5002", "localhost:5003", "localhost:5004", "localhost:5005"},
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.desc, func(t *testing.T) {
			got, err := makeRedisConnOpt(tc.cfg)
			if err != nil {
				t.Fatalf("makeRedisConnOpt returned error: %v", err)
			}

			if diff := cmp.Diff(tc.want, got, cmpopts.IgnoreUnexported(tls.Config{})); diff != "" {
				t.Errorf("diff found: want=%v, got=%v; (-want,+got)\n%s",
					tc.want, got, diff)
			}
		})
	}
}

type redisServer struct {
	addr   string
	port   int
	pid    int
	args   []string
	output io.ReadWriter
	cmd    *exec.Cmd
}

func findFreePort(t *testing.T) int {
	t.Helper()
	l, err := net.Listen("tcp", "localhost:0")
	if err != nil {
		t.Fatalf("net.Listen failed: %v", err)
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port
}

func newRedisServer(t *testing.T, args ...string) *redisServer {
	t.Helper()

	port := findFreePort(t)
	addr := fmt.Sprintf("127.0.0.1:%d", port)

	cmdArgs := []string{}
	defaultArgs := map[string]string{
		"--port":       strconv.Itoa(port),
		"--save":       "",
		"--appendonly": "no",
	}
	for _, arg := range args {
		cmdArgs = append(cmdArgs, arg)
		if _, ok := defaultArgs[arg]; ok {
			// Remove the default argument from the map.
			delete(defaultArgs, arg)
		}
	}

	for k, v := range defaultArgs {
		cmdArgs = append(cmdArgs, k, v)
	}

	buf := new(bytes.Buffer)

	cmd := exec.Command("redis-server", cmdArgs...)
	cmd.Stderr = buf
	cmd.Stdout = buf

	if err := cmd.Start(); err != nil {
		t.Fatalf("redis-server failed to start: %v", err)
	}

	return &redisServer{
		addr:   addr,
		port:   port,
		pid:    cmd.Process.Pid,
		args:   cmdArgs,
		output: buf,
		cmd:    cmd,
	}

}

var regenerateTLSFiles = flag.Bool("regenerate-tls-files", false, "regenerate TLS files")

// newRedisServerWithTLS creates a new redis-server instance with TLS enabled.
// If the regenerate-tls-files flag is set, it will generate new TLS files.
func newRedisServerWithTLS(t *testing.T, args ...string) *redisServer {
	t.Helper()

	caFile := "testdata/ca.crt"
	caPrivKeyFile := "testdata/ca.key"
	serverCertFile := "testdata/server.crt"
	serverPrivKeyFile := "testdata/server.key"

	if *regenerateTLSFiles {
		caPrivKey, err := rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			t.Fatalf("rsa.GenerateKey failed: %v", err)
		}

		ca := &x509.Certificate{
			SerialNumber: big.NewInt(2019),
			Subject: pkix.Name{
				CommonName:   "asynqmon test CA",
				Organization: []string{"asynqmon"},
			},
			NotBefore:             time.Now(),
			NotAfter:              time.Now().AddDate(1, 0, 0),
			KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageDigitalSignature,
			BasicConstraintsValid: true,
			IsCA:                  true,
		}

		caBytes, err := x509.CreateCertificate(rand.Reader, ca, ca, &caPrivKey.PublicKey, caPrivKey)
		if err != nil {
			t.Fatalf("x509.CreateCertificate failed: %v", err)
		}

		writePemToFile(caPrivKeyFile, "RSA PRIVATE KEY", x509.MarshalPKCS1PrivateKey(caPrivKey))

		writePemToFile(caFile, "CERTIFICATE", caBytes)

		// Generate server private key
		serverPrivKey, err := rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			panic(err)
		}

		// Define server certificate template
		cert := &x509.Certificate{
			SerialNumber: big.NewInt(2024),
			Subject: pkix.Name{
				CommonName: "localhost",
			},
			IPAddresses: []net.IP{net.ParseIP("127.0.0.1")},
			NotBefore:   time.Now(),
			NotAfter:    time.Now().AddDate(1, 0, 0), // 1 year
			KeyUsage:    x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
			ExtKeyUsage: []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		}

		// Create server Certificate
		serverCert, err := x509.CreateCertificate(rand.Reader, cert, ca, &serverPrivKey.PublicKey, caPrivKey)
		if err != nil {
			panic(err)
		}

		writePemToFile(serverPrivKeyFile, "RSA PRIVATE KEY", x509.MarshalPKCS1PrivateKey(serverPrivKey))

		writePemToFile(serverCertFile, "CERTIFICATE", serverCert)
	}

	tlsPort := findFreePort(t)
	args = append(args, "--tls-port", strconv.Itoa(tlsPort))
	args = append(args, "--tls-cert-file", serverCertFile)
	args = append(args, "--tls-key-file", serverPrivKeyFile)
	args = append(args, "--tls-ca-cert-file", caFile)
	args = append(args, "--tls-auth-clients", "no")

	red := newRedisServer(t, args...)
	red.port = tlsPort
	red.addr = fmt.Sprintf("127.0.0.1:%d", tlsPort)

	return red

}

// writePemToFile writes PEM-encoded data to a file with the specified filename and PEM block type.
func writePemToFile(filename, pemType string, bytes []byte) {
	file, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	pemBlock := &pem.Block{
		Type:  pemType,
		Bytes: bytes,
	}
	if err := pem.Encode(file, pemBlock); err != nil {
		panic(err)
	}
}

func TestConfigureAndPingRedis(t *testing.T) {
	_, err := exec.LookPath("redis-server")
	if err != nil {
		t.Skip("redis-server not found in PATH")
	}

	tests := []struct {
		desc      string
		cfg       *Config
		getServer func() *redisServer
	}{
		{
			desc: "Basic",
			cfg: &Config{
				RedisAddr: "localhost:6380",
			},
			getServer: func() *redisServer {
				return newRedisServer(t)
			},
		},
		{
			desc: "With TLS certs",
			cfg: &Config{
				RedisCaCert:     "testdata/ca.crt",
				RedisClientCert: "testdata/server.crt",
				RedisClientKey:  "testdata/server.key",
				RedisTLS:        "",
			},

			getServer: func() *redisServer {
				return newRedisServerWithTLS(t)
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.desc, func(t *testing.T) {
			red := tc.getServer()
			defer red.cmd.Process.Kill()
			time.Sleep(5 * time.Second)
			cfg := tc.cfg
			cfg.RedisAddr = red.addr
			cfg.RedisDB = 1

			printServerOutput := func() {
				t.Helper()
				t.Logf("redis-server output:\n%s", red.output)
			}

			got, err := makeRedisConnOpt(cfg)
			if err != nil {
				printServerOutput()
				t.Fatalf("makeRedisConnOpt returned error: %v", err)
			}

			client, ok := got.MakeRedisClient().(redis.UniversalClient)
			if !ok {
				printServerOutput()
				t.Fatalf("got.MakeRedisClient() returned a non-redis.UniversalClient type")
			}

			defer client.Close()
			if _, err := client.Ping(context.Background()).Result(); err != nil {
				printServerOutput()
				t.Errorf("client.Ping() returned error: %v", err)
			}

			client.Set(context.Background(), "foo", "bar", 0)
			key, err := client.Get(context.Background(), "foo").Result()
			if err != nil {
				printServerOutput()
				t.Errorf("client.Get() returned error: %v", err)
			}
			if key != "bar" {
				printServerOutput()
				t.Errorf("client.Get() returned %q, want %q", key, "bar")

			}

		})
	}
}
