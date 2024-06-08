package main

import (
	"context"
	"fmt"

	"github.com/fly2z/aeromod/msfs"
)

// App struct
type App struct {
	ctx           context.Context
	config        *Config
	setupComplete bool
	msfsClient    *msfs.Client
}

// NewApp creates a new App application struct
func NewApp(config *Config) *App {
	return &App{config: config}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// initialize msfs client and check if setup is complete
	err := a.createMSFSClient()
	if err == nil {
		a.setupComplete = true
	}
}

func (a *App) createMSFSClient() error {
	if a.config.CommunityPath == "" {
		return fmt.Errorf("community folder path cannot be empty")
	}

	if a.config.ModStoragePath == "" {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	clientOptions := msfs.ClientOptions{
		CommunityPath:    a.config.CommunityPath,
		ModStorageFolder: a.config.ModStoragePath,
	}

	a.msfsClient = msfs.NewClient(clientOptions)
	return nil
}

func (a *App) IsSetupComplete() bool {
	return a.setupComplete
}

func (a *App) CompleteSetup(communityFolderPath, modFolderPath string) error {
	if communityFolderPath == "" {
		return fmt.Errorf("community folder path cannot be empty")
	}

	if modFolderPath == "" {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	cfg := Config{CommunityPath: communityFolderPath, ModStoragePath: modFolderPath}
	err := WriteConfigFile(cfg)
	if err != nil {
		return err
	}

	a.config = &cfg

	err = a.createMSFSClient()
	if err != nil {
		return err
	}

	a.setupComplete = true
	return nil
}

func (a *App) GetMods() []msfs.Mod {
	if a.msfsClient == nil {
		return []msfs.Mod{}
	}

	var mods []msfs.Mod

	modNames := a.msfsClient.GetModNames()

	for _, name := range modNames {
		enabled, err := a.msfsClient.IsModEnabled(name)
		if err != nil {
			mods = append(mods, msfs.Mod{Name: name, Enabled: false})
			continue
		}

		mods = append(mods, msfs.Mod{Name: name, Enabled: enabled})
	}

	return mods
}

func (a *App) GetModManifest(packageName string) msfs.PackageManifest {
	if a.msfsClient == nil {
		return msfs.PackageManifest{}
	}

	manifest, err := a.msfsClient.ParsePackageManifest(packageName)
	if err != nil {
		return msfs.PackageManifest{}
	}

	return *manifest
}

func (a *App) EnableMod(modName string) error {
	if a.msfsClient == nil {
		return fmt.Errorf("msfs client not initialized")
	}

	err := a.msfsClient.EnableMod(modName)
	return err
}

func (a *App) DisableMod(modName string) error {
	if a.msfsClient == nil {
		return fmt.Errorf("msfs client not initialized")
	}

	err := a.msfsClient.DisableMod(modName)
	return err
}
