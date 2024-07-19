package config

import (
	"fmt"
	"os"

	"github.com/adrg/xdg"
	"github.com/knadh/koanf/parsers/toml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var (
	k          = koanf.New(".")
	parser     = toml.Parser()
	configPath string
)

func Load(v interface{}) error {
	var err error
	configPath, err = xdg.ConfigFile("AeroMod/config.toml")
	if err != nil {
		return fmt.Errorf("failed to get config file path: %w", err)
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		_, err := os.Create(configPath)
		if err != nil {
			return err
		}
	}

	if err := k.Load(file.Provider(configPath), parser); err != nil {
		return err
	}

	if err := k.Unmarshal("", &v); err != nil {
		return err
	}

	return nil
}

func Get(key string) interface{} {
	return k.Get(key)
}

func Set(key string, val interface{}) error {
	if err := k.Set(key, val); err != nil {
		return fmt.Errorf("failed to set key %s: %w", key, err)
	}

	if err := save(); err != nil {
		return err
	}

	return nil
}

func save() error {
	tomlData, err := k.Marshal(parser)
	if err != nil {
		return fmt.Errorf("failed to marshal config to TOML: %w", err)
	}

	err = os.WriteFile(configPath, tomlData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}
