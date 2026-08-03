package asynqmon

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type connectionsFile struct {
	Connections []persistedConnection `yaml:"connections"`
}

type persistedConnection struct {
	Name string `yaml:"name"`
	Addr string `yaml:"addr"`
}

func loadConnectionsFile(path string) ([]persistedConnection, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}
	if len(data) == 0 {
		return nil, nil
	}
	var f connectionsFile
	if err := yaml.Unmarshal(data, &f); err != nil {
		return nil, fmt.Errorf("parse config %s: %w", path, err)
	}
	return f.Connections, nil
}

func saveConnectionsFile(path string, conns []RedisConnection) error {
	if path == "" {
		return nil
	}
	f := connectionsFile{Connections: make([]persistedConnection, 0, len(conns))}
	for _, c := range conns {
		f.Connections = append(f.Connections, persistedConnection{Name: c.Name, Addr: c.Addr})
	}
	data, err := yaml.Marshal(&f)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, data, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}
