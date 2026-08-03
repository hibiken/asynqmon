package asynqmon

import (
	"bytes"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

// RedisConnectionConfig holds settings for one named Redis endpoint
// as expressed in ASYNQMON_REDIS_CONNECTIONS / --redis-connections.
//
// JSON accepts either a plain address string:
//
//	"host:6379"
//
// or an object:
//
//	{"addr":"host:6379","password":"secret","db":0}
type RedisConnectionConfig struct {
	Addr     string `json:"addr"`
	Password string `json:"password,omitempty"`
	DB       int    `json:"db,omitempty"`
}

// UnmarshalJSON accepts a string address/URL or a full config object.
func (c *RedisConnectionConfig) UnmarshalJSON(data []byte) error {
	data = bytes.TrimSpace(data)
	if len(data) == 0 || string(data) == "null" {
		return fmt.Errorf("empty connection config")
	}
	if data[0] == '"' {
		var addr string
		if err := json.Unmarshal(data, &addr); err != nil {
			return err
		}
		*c = RedisConnectionConfig{Addr: strings.TrimSpace(addr)}
		return nil
	}
	type alias RedisConnectionConfig
	var raw alias
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}
	raw.Addr = strings.TrimSpace(raw.Addr)
	*c = RedisConnectionConfig(raw)
	return nil
}

// RedisConnectionsConfig is a map of connection name → settings.
type RedisConnectionsConfig map[string]RedisConnectionConfig

// ParseRedisConnectionsConfig parses a map-like string into typed connection config.
// Accepted formats:
//
//	JSON:  {"redis-a":"host:6379","redis-b":{"addr":"host:6380","password":"x","db":1}}
//	pairs: redis-a=host:6379,redis-b=redis://:pass@host:6380/0
func ParseRedisConnectionsConfig(raw string) (RedisConnectionsConfig, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil, nil
	}

	if strings.HasPrefix(raw, "{") {
		var m RedisConnectionsConfig
		if err := json.Unmarshal([]byte(raw), &m); err != nil {
			return nil, fmt.Errorf("parse JSON map: %w", err)
		}
		for name, cfg := range m {
			if strings.TrimSpace(name) == "" {
				return nil, fmt.Errorf("connection entries need non-empty name")
			}
			if cfg.Addr == "" {
				return nil, fmt.Errorf("connection %q needs non-empty addr", name)
			}
		}
		return m, nil
	}

	parts := strings.Split(raw, ",")
	out := make(RedisConnectionsConfig)
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		name, value, ok := strings.Cut(part, "=")
		if !ok {
			return nil, fmt.Errorf("expected name=addr, got %q", part)
		}
		name = strings.TrimSpace(name)
		value = strings.TrimSpace(value)
		if name == "" || value == "" {
			return nil, fmt.Errorf("connection entries need non-empty name and addr (got %q)", part)
		}
		out[name] = RedisConnectionConfig{Addr: value}
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("no connections found")
	}
	return out, nil
}

// Connections converts the map into a stable-ordered list of RedisConnection values.
func (m RedisConnectionsConfig) Connections() []RedisConnection {
	if len(m) == 0 {
		return nil
	}
	names := make([]string, 0, len(m))
	for name := range m {
		names = append(names, name)
	}
	sort.Strings(names)
	out := make([]RedisConnection, 0, len(names))
	for _, name := range names {
		cfg := m[name]
		out = append(out, RedisConnection{
			Name:     name,
			Addr:     cfg.Addr,
			Password: cfg.Password,
			DB:       cfg.DB,
		})
	}
	return out
}
