package main

import (
	"context"
	"fmt"

	"github.com/fly2z/aeromod/config"
	"github.com/fly2z/aeromod/msfs"
)

const COMMUNITY_FOLDER_KEY = "community_path"
const MOD_FOLDER_KEY = "mod_folder_path"

// App struct
type App struct {
	ctx           context.Context
	config        *config.Config
	setupComplete bool
	msfsClient    *msfs.Client
}

// NewApp creates a new App application struct
func NewApp(config *config.Config) *App {
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
	communityPath, exists := a.config.GetKey(COMMUNITY_FOLDER_KEY)
	if !exists {
		return fmt.Errorf("community folder path cannot be empty")
	}

	modStoragePath, exists := a.config.GetKey(MOD_FOLDER_KEY)
	if !exists {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	clientOptions := msfs.ClientOptions{
		CommunityPath:    communityPath.(string),
		ModStorageFolder: modStoragePath.(string),
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

	if err := a.config.SetKey(COMMUNITY_FOLDER_KEY, communityFolderPath); err != nil {
		return fmt.Errorf("error setting key: %v", err)
	}

	if err := a.config.SetKey(MOD_FOLDER_KEY, modFolderPath); err != nil {
		return fmt.Errorf("error setting key: %v", err)
	}

	err := a.createMSFSClient()
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
