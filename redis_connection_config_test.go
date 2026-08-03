package asynqmon

import (
	"encoding/json"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

func TestRedisConnectionConfigUnmarshalJSON(t *testing.T) {
	tests := []struct {
		name    string
		raw     string
		want    RedisConnectionConfig
		wantErr bool
	}{
		{
			name: "string addr",
			raw:  `"localhost:6379"`,
			want: RedisConnectionConfig{Addr: "localhost:6379"},
		},
		{
			name: "string redis url",
			raw:  `"redis://:secret@localhost:6379/1"`,
			want: RedisConnectionConfig{Addr: "redis://:secret@localhost:6379/1"},
		},
		{
			name: "object with password and db",
			raw:  `{"addr":"localhost:6379","password":"secret","db":3}`,
			want: RedisConnectionConfig{Addr: "localhost:6379", Password: "secret", DB: 3},
		},
		{
			name: "object trims addr",
			raw:  `{"addr":"  localhost:6379  ","password":"x"}`,
			want: RedisConnectionConfig{Addr: "localhost:6379", Password: "x"},
		},
		{
			name:    "null",
			raw:     `null`,
			wantErr: true,
		},
		{
			name:    "empty string",
			raw:     `""`,
			want:    RedisConnectionConfig{Addr: ""},
		},
		{
			name:    "invalid json",
			raw:     `{`,
			wantErr: true,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			var got RedisConnectionConfig
			err := json.Unmarshal([]byte(tc.raw), &got)
			if tc.wantErr {
				if err == nil {
					t.Fatalf("expected error, got %#v", got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if diff := cmp.Diff(tc.want, got); diff != "" {
				t.Errorf("(-want,+got)\n%s", diff)
			}
		})
	}
}

func TestParseRedisConnectionsConfig(t *testing.T) {
	tests := []struct {
		name    string
		raw     string
		want    RedisConnectionsConfig
		wantErr bool
	}{
		{name: "empty", raw: "", want: nil},
		{
			name: "json string values sorted by name later",
			raw:  `{"redis-b":"redis-b:6379","redis-a":"redis-a:6379"}`,
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379"},
				"redis-b": {Addr: "redis-b:6379"},
			},
		},
		{
			name: "json object with password and db",
			raw:  `{"redis-a":{"addr":"redis-a:6379","password":"secret","db":2},"redis-b":"redis-b:6379"}`,
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379", Password: "secret", DB: 2},
				"redis-b": {Addr: "redis-b:6379"},
			},
		},
		{
			name: "json redis url value",
			raw:  `{"prod":"redis://:secret@prod:6379/1"}`,
			want: RedisConnectionsConfig{
				"prod": {Addr: "redis://:secret@prod:6379/1"},
			},
		},
		{
			name: "pairs with url password",
			raw:  "redis-a=redis-a:6379,redis-b=redis://:secret@redis-b:6379/0",
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379"},
				"redis-b": {Addr: "redis://:secret@redis-b:6379/0"},
			},
		},
		{
			name: "pairs ignore empty segments",
			raw:  "redis-a=host:6379,,redis-b=host:6380",
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "host:6379"},
				"redis-b": {Addr: "host:6380"},
			},
		},
		{name: "invalid pairs", raw: "not-a-pair", wantErr: true},
		{name: "empty json addr", raw: `{"redis-a":""}`, wantErr: true},
		{name: "object missing addr", raw: `{"redis-a":{"password":"x"}}`, wantErr: true},
		{name: "invalid json", raw: `{not-json`, wantErr: true},
		{name: "empty name in pairs", raw: "=host:6379", wantErr: true},
		{name: "empty addr in pairs", raw: "redis-a=", wantErr: true},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := ParseRedisConnectionsConfig(tc.raw)
			if tc.wantErr {
				if err == nil {
					t.Fatalf("expected error, got %#v", got)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if diff := cmp.Diff(tc.want, got); diff != "" {
				t.Errorf("(-want,+got)\n%s", diff)
			}
		})
	}
}

func TestRedisConnectionsConfigConnections(t *testing.T) {
	cfg := RedisConnectionsConfig{
		"redis-b": {Addr: "b:6379", Password: "x"},
		"redis-a": {Addr: "a:6379", DB: 1},
	}
	want := []RedisConnection{
		{Name: "redis-a", Addr: "a:6379", DB: 1},
		{Name: "redis-b", Addr: "b:6379", Password: "x"},
	}
	if diff := cmp.Diff(want, cfg.Connections()); diff != "" {
		t.Errorf("(-want,+got)\n%s", diff)
	}

	if got := (RedisConnectionsConfig(nil)).Connections(); got != nil {
		t.Errorf("nil map Connections() = %#v, want nil", got)
	}
}

func TestConnectionRegistryAddWithPasswordAndDB(t *testing.T) {
	reg := newConnectionRegistry()
	defer reg.Close()

	err := reg.Add(RedisConnection{
		Name:     "secure",
		Addr:     "127.0.0.1:6379",
		Password: "s3cret",
		DB:       4,
	})
	if err != nil {
		t.Fatalf("Add: %v", err)
	}

	bundle, ok := reg.Get("secure")
	if !ok {
		t.Fatal("expected connection secure")
	}
	client, ok := bundle.redis.(*redis.Client)
	if !ok {
		t.Fatalf("unexpected redis client type %T", bundle.redis)
	}
	opts := client.Options()
	if opts.Addr != "127.0.0.1:6379" {
		t.Errorf("Addr = %q, want 127.0.0.1:6379", opts.Addr)
	}
	if opts.Password != "s3cret" {
		t.Errorf("Password = %q, want s3cret", opts.Password)
	}
	if opts.DB != 4 {
		t.Errorf("DB = %d, want 4", opts.DB)
	}
}

func TestConnectionRegistryAddRedisURL(t *testing.T) {
	reg := newConnectionRegistry()
	defer reg.Close()

	err := reg.Add(RedisConnection{
		Name: "url",
		Addr: "redis://:uri-pass@127.0.0.1:6380/2",
	})
	if err != nil {
		t.Fatalf("Add: %v", err)
	}

	bundle, ok := reg.Get("url")
	if !ok {
		t.Fatal("expected connection url")
	}
	if bundle.addr != "127.0.0.1:6380" {
		t.Errorf("display addr = %q, want 127.0.0.1:6380", bundle.addr)
	}
	client, ok := bundle.redis.(*redis.Client)
	if !ok {
		t.Fatalf("unexpected redis client type %T", bundle.redis)
	}
	opts := client.Options()
	if opts.Password != "uri-pass" {
		t.Errorf("Password = %q, want uri-pass", opts.Password)
	}
	if opts.DB != 2 {
		t.Errorf("DB = %d, want 2", opts.DB)
	}
}

func TestConnectionRegistryListOmitsPassword(t *testing.T) {
	reg := newConnectionRegistry()
	defer reg.Close()

	if err := reg.Add(RedisConnection{
		Name:     "a",
		Addr:     "127.0.0.1:6379",
		Password: "should-not-leak",
		DB:       1,
	}); err != nil {
		t.Fatalf("Add: %v", err)
	}

	list := reg.List()
	want := []RedisConnection{{Name: "a", Addr: "127.0.0.1:6379"}}
	if diff := cmp.Diff(want, list); diff != "" {
		t.Errorf("List() (-want,+got)\n%s", diff)
	}
}

func TestConnectionRegistryDefaultsAndErrors(t *testing.T) {
	reg := newConnectionRegistry()
	defer reg.Close()

	if err := reg.Add(RedisConnection{Name: "", Addr: "127.0.0.1:6379"}); err == nil {
		t.Fatal("expected error for empty name")
	}
	if err := reg.Add(RedisConnection{Name: "a", Addr: ""}); err == nil {
		t.Fatal("expected error for empty addr")
	}

	if err := reg.Add(RedisConnection{Name: "a", Addr: "127.0.0.1:6379"}); err != nil {
		t.Fatalf("Add a: %v", err)
	}
	if err := reg.Add(RedisConnection{Name: "b", Addr: "127.0.0.1:6380"}); err != nil {
		t.Fatalf("Add b: %v", err)
	}
	if got := reg.DefaultName(); got != "a" {
		t.Errorf("DefaultName = %q, want a", got)
	}
	if err := reg.Add(RedisConnection{Name: "a", Addr: "127.0.0.1:6379"}); err == nil {
		t.Fatal("expected duplicate name error")
	}

	opt := asynq.RedisClientOpt{Addr: "127.0.0.1:6390", Password: "from-opt"}
	if err := reg.Add(RedisConnection{Name: "c", ConnOpt: opt}); err != nil {
		t.Fatalf("Add with ConnOpt: %v", err)
	}
	bundle, _ := reg.Get("c")
	client := bundle.redis.(*redis.Client)
	if client.Options().Password != "from-opt" {
		t.Errorf("ConnOpt password = %q, want from-opt", client.Options().Password)
	}
}

func TestIsRedisURL(t *testing.T) {
	tests := []struct {
		in   string
		want bool
	}{
		{"redis://localhost:6379/0", true},
		{"rediss://localhost:6379/0", true},
		{"redis-sentinel://localhost:26379?master=mymaster", true},
		{"localhost:6379", false},
		{"", false},
	}
	for _, tc := range tests {
		if got := isRedisURL(tc.in); got != tc.want {
			t.Errorf("isRedisURL(%q) = %v, want %v", tc.in, got, tc.want)
		}
	}
}
