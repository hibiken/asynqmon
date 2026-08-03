package asynqmon

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"

	"github.com/gorilla/mux"
	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

const connectionHeader = "X-Asynqmon-Connection"

type contextKey int

const connContextKey contextKey = 1

// RedisConnection describes a named Redis endpoint used by asynqmon.
type RedisConnection struct {
	Name string `json:"name"`
	Addr string `json:"addr"`
	// Password is used when ConnOpt is nil. Never serialized to the API.
	Password string `json:"-"`
	// DB is used when ConnOpt is nil.
	DB int `json:"-"`
	// ConnOpt is optional. When nil, Addr/Password/DB build asynq.RedisClientOpt
	// (or Addr is parsed as a redis URI when it looks like one).
	ConnOpt asynq.RedisConnOpt `json:"-"`
}

type connBundle struct {
	name      string
	addr      string
	inspector *asynq.Inspector
	client    *asynq.Client
	redis     redis.UniversalClient
}

func (c *connBundle) close() error {
	var first error
	for _, fn := range []func() error{c.redis.Close, c.inspector.Close, c.client.Close} {
		if err := fn(); err != nil && first == nil {
			first = err
		}
	}
	return first
}

type connectionRegistry struct {
	mu          sync.RWMutex
	conns       map[string]*connBundle
	order       []string
	defaultName string
}

func newConnectionRegistry() *connectionRegistry {
	return &connectionRegistry{
		conns: make(map[string]*connBundle),
	}
}

func (r *connectionRegistry) Len() int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.conns)
}

func (r *connectionRegistry) DefaultName() string {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.defaultName
}

func (r *connectionRegistry) Get(name string) (*connBundle, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	c, ok := r.conns[name]
	return c, ok
}

func (r *connectionRegistry) List() []RedisConnection {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]RedisConnection, 0, len(r.order))
	for _, name := range r.order {
		c := r.conns[name]
		out = append(out, RedisConnection{Name: c.name, Addr: c.addr})
	}
	return out
}

func (r *connectionRegistry) Add(c RedisConnection) error {
	if c.Name == "" {
		return fmt.Errorf("connection name is required")
	}

	opt := c.ConnOpt
	addr := c.Addr
	if opt == nil {
		if addr == "" {
			return fmt.Errorf("connection addr is required")
		}
		if isRedisURL(addr) {
			parsed, err := asynq.ParseRedisURI(addr)
			if err != nil {
				return fmt.Errorf("parse redis uri: %w", err)
			}
			opt = parsed
			addr = addrFromConnOpt(opt)
		} else {
			opt = asynq.RedisClientOpt{
				Addr:     addr,
				Password: c.Password,
				DB:       c.DB,
			}
		}
	} else if addr == "" {
		addr = addrFromConnOpt(opt)
	}

	rc, ok := opt.MakeRedisClient().(redis.UniversalClient)
	if !ok {
		return fmt.Errorf("unsupported RedisConnOpt type %T", opt)
	}
	bundle := &connBundle{
		name:      c.Name,
		addr:      addr,
		inspector: asynq.NewInspector(opt),
		client:    asynq.NewClient(opt),
		redis:     rc,
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	if _, exists := r.conns[c.Name]; exists {
		bundle.close()
		return fmt.Errorf("connection %q already exists", c.Name)
	}
	r.conns[c.Name] = bundle
	r.order = append(r.order, c.Name)
	if r.defaultName == "" {
		r.defaultName = c.Name
	}
	return nil
}

func isRedisURL(s string) bool {
	return strings.HasPrefix(s, "redis://") ||
		strings.HasPrefix(s, "rediss://") ||
		strings.HasPrefix(s, "redis-sentinel://")
}

func (r *connectionRegistry) Remove(name string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	c, ok := r.conns[name]
	if !ok {
		return fmt.Errorf("connection %q not found", name)
	}
	delete(r.conns, name)
	for i, n := range r.order {
		if n == name {
			r.order = append(r.order[:i], r.order[i+1:]...)
			break
		}
	}
	if r.defaultName == name {
		r.defaultName = ""
		if len(r.order) > 0 {
			r.defaultName = r.order[0]
		}
	}
	return c.close()
}

func (r *connectionRegistry) Close() error {
	r.mu.Lock()
	defer r.mu.Unlock()
	var first error
	for _, name := range r.order {
		if err := r.conns[name].close(); err != nil && first == nil {
			first = err
		}
	}
	r.conns = make(map[string]*connBundle)
	r.order = nil
	r.defaultName = ""
	return first
}

func addrFromConnOpt(opt asynq.RedisConnOpt) string {
	switch c := opt.(type) {
	case asynq.RedisClientOpt:
		return c.Addr
	case *asynq.RedisClientOpt:
		return c.Addr
	case asynq.RedisFailoverClientOpt:
		if len(c.SentinelAddrs) > 0 {
			return c.SentinelAddrs[0]
		}
	case *asynq.RedisFailoverClientOpt:
		if len(c.SentinelAddrs) > 0 {
			return c.SentinelAddrs[0]
		}
	case asynq.RedisClusterClientOpt:
		if len(c.Addrs) > 0 {
			return c.Addrs[0]
		}
	case *asynq.RedisClusterClientOpt:
		if len(c.Addrs) > 0 {
			return c.Addrs[0]
		}
	}
	return "unknown"
}

func getConn(r *http.Request) *connBundle {
	c, _ := r.Context().Value(connContextKey).(*connBundle)
	return c
}

func getInspector(r *http.Request) *asynq.Inspector {
	return getConn(r).inspector
}

func withConn(ctx context.Context, c *connBundle) context.Context {
	return context.WithValue(ctx, connContextKey, c)
}

func connectionMiddleware(reg *connectionRegistry) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := r.URL.Path
			if isConnectionsPath(path) {
				next.ServeHTTP(w, r)
				return
			}
			if reg.Len() == 0 {
				http.Error(w, "no redis connections configured; set ASYNQMON_REDIS_CONNECTIONS", http.StatusServiceUnavailable)
				return
			}
			name := r.Header.Get(connectionHeader)
			if name == "" {
				name = reg.DefaultName()
			}
			c, ok := reg.Get(name)
			if !ok {
				http.Error(w, fmt.Sprintf("unknown redis connection %q", name), http.StatusBadRequest)
				return
			}
			next.ServeHTTP(w, r.WithContext(withConn(r.Context(), c)))
		})
	}
}

func isConnectionsPath(path string) bool {
	const marker = "/api/connections"
	idx := -1
	for i := 0; i+len(marker) <= len(path); i++ {
		if path[i:i+len(marker)] == marker {
			idx = i
			break
		}
	}
	if idx < 0 {
		return false
	}
	rest := path[idx+len(marker):]
	return rest == "" || rest[0] == '/'
}

func adaptInspector(makeHandler func(*asynq.Inspector) http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		makeHandler(getInspector(r))(w, r)
	}
}

func adaptInspectorPayload(makeHandler func(*asynq.Inspector, PayloadFormatter) http.HandlerFunc, pf PayloadFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		makeHandler(getInspector(r), pf)(w, r)
	}
}

func adaptInspectorPayloadResult(makeHandler func(*asynq.Inspector, PayloadFormatter, ResultFormatter) http.HandlerFunc, pf PayloadFormatter, rf ResultFormatter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		makeHandler(getInspector(r), pf, rf)(w, r)
	}
}

func adaptInspectorClient(makeHandler func(*asynq.Inspector, *asynq.Client) http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c := getConn(r)
		makeHandler(c.inspector, c.client)(w, r)
	}
}
