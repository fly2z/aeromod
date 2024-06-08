package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

type Config struct {
	CommunityPath  string `json:"community_path"`
	ModStoragePath string `json:"mod_storage_path"`
}

func DefaultConfig() Config {
	return Config{
		CommunityPath:  "",
		ModStoragePath: "",
	}
}

type ConfigStore struct {
	configPath string
}

func NewConfigStore() (*ConfigStore, error) {
	configFilePath, err := xdg.ConfigFile("AeroMod/config.json")
	if err != nil {
		return nil, fmt.Errorf("could not resolve path for config file: %w", err)
	}

	return &ConfigStore{
		configPath: configFilePath,
	}, nil
}

func (s *ConfigStore) Config() (Config, error) {
	_, err := os.Stat(s.configPath)
	if os.IsNotExist(err) {
		cfg, err := s.CreateConfigFile()
		if err != nil {
			return Config{}, err
		}

		return cfg, nil
	}

	dir, fileName := filepath.Split(s.configPath)
	if len(dir) == 0 {
		dir = "."
	}

	buf, err := fs.ReadFile(os.DirFS(dir), fileName)
	if err != nil {
		return Config{}, fmt.Errorf("could not read the configuration file: %w", err)
	}

	if len(buf) == 0 {
		return DefaultConfig(), nil
	}

	cfg := Config{}
	if err := json.Unmarshal(buf, &cfg); err != nil {
		return Config{}, fmt.Errorf("configuration file does not have a valid format: %w", err)
	}

	return cfg, nil
}

func (s *ConfigStore) CreateConfigFile() (Config, error) {
	_, err := os.Stat(s.configPath)
	if os.IsExist(err) {
		return Config{}, fmt.Errorf("configuration file already exist")
	}

	cfg := DefaultConfig()

	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return Config{}, fmt.Errorf("configuration does not have a valid format: %w", err)
	}

	f, err := os.OpenFile(s.configPath, os.O_TRUNC|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return Config{}, fmt.Errorf("could not open the configuration file: %w", err)
	}

	defer f.Close()

	_, err = f.Write(data)
	if err != nil {
		return Config{}, fmt.Errorf("could not write to the configuration file: %w", err)
	}

	return cfg, nil
}

func WriteConfigFile(config Config) error {
	configPath, err := xdg.ConfigFile("AeroMod/config.json")
	if err != nil {
		return fmt.Errorf("could not resolve path for config file: %w", err)
	}

	_, err = os.Stat(configPath)
	if os.IsNotExist(err) {
		return fmt.Errorf("configuration does not exist")
	}

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("configuration does not have a valid format: %w", err)
	}

	f, err := os.OpenFile(configPath, os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("could not open the configuration file: %w", err)
	}

	defer f.Close()

	_, err = f.Write(data)
	if err != nil {
		return fmt.Errorf("could not write to the configuration file: %w", err)
	}

	return nil
}
