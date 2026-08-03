package asynqmon

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestParseRedisConnectionsConfig(t *testing.T) {
	tests := []struct {
		raw     string
		want    RedisConnectionsConfig
		wantErr bool
	}{
		{raw: "", want: nil},
		{
			raw: `{"redis-b":"redis-b:6379","redis-a":"redis-a:6379"}`,
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379"},
				"redis-b": {Addr: "redis-b:6379"},
			},
		},
		{
			raw: `{"redis-a":{"addr":"redis-a:6379","password":"secret","db":2},"redis-b":"redis-b:6379"}`,
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379", Password: "secret", DB: 2},
				"redis-b": {Addr: "redis-b:6379"},
			},
		},
		{
			raw: `{"prod":"redis://:p@ss@prod:6379/1"}`,
			want: RedisConnectionsConfig{
				"prod": {Addr: "redis://:p@ss@prod:6379/1"},
			},
		},
		{
			raw: "redis-a=redis-a:6379,redis-b=redis://:secret@redis-b:6379/0",
			want: RedisConnectionsConfig{
				"redis-a": {Addr: "redis-a:6379"},
				"redis-b": {Addr: "redis://:secret@redis-b:6379/0"},
			},
		},
		{raw: "not-a-pair", wantErr: true},
		{raw: `{"redis-a":""}`, wantErr: true},
		{raw: `{"redis-a":{"password":"x"}}`, wantErr: true},
	}

	for _, tc := range tests {
		t.Run(tc.raw, func(t *testing.T) {
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
}
