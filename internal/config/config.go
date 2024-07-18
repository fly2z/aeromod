package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/adrg/xdg"
)

type Config struct {
	mu     sync.RWMutex
	config map[string]interface{}
	path   string
}

func NewConfig(dir string) (*Config, error) {
	path, err := xdg.ConfigFile(dir)
	if err != nil {
		return nil, fmt.Errorf("failed to get config file path: %w", err)
	}

	cfg := &Config{
		config: make(map[string]interface{}),
		path:   path,
	}

	// create the config file if it does not exist
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := cfg.save(); err != nil {
			return nil, fmt.Errorf("failed to create config file: %w", err)
		}
	}

	if err := cfg.load(); err != nil {
		return nil, err
	}

	return cfg, nil
}

func (c *Config) load() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if _, err := os.Stat(c.path); os.IsNotExist(err) {
		return nil // config file does not exist
	}

	data, err := os.ReadFile(c.path)
	if err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}

	if err := json.Unmarshal(data, &c.config); err != nil {
		return fmt.Errorf("failed to unmarshal config file: %w", err)
	}

	return nil
}

func (c *Config) save() error {
	data, err := json.MarshalIndent(c.config, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	if err := os.MkdirAll(filepath.Dir(c.path), os.ModePerm); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	if err := os.WriteFile(c.path, data, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}

func (c *Config) SetKey(key string, value interface{}) error {
	c.mu.Lock()
	c.config[key] = value
	c.mu.Unlock()

	return c.save()
}

func (c *Config) GetKey(key string) (interface{}, bool) {
	value, exists := c.config[key]
	return value, exists
}
