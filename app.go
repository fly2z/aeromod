package main

import (
	"context"
	"fmt"
	"log"

	"github.com/fly2z/aeromod/internal/config"
	"github.com/fly2z/aeromod/internal/msfs"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	MOD_FOLDER = "MOD_FOLDER"
)

type App struct {
	ctx           context.Context
	config        *config.Config
	setupComplete bool
	msfsClient    *msfs.Client
}

func NewApp(config *config.Config) *App {
	return &App{config: config}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	err := a.createMSFSClient()
	if err != nil {
		return
	}

	a.setupComplete = true
}

func (a *App) createMSFSClient() error {
	modFolder, exists := a.config.GetKey(MOD_FOLDER)
	if !exists {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	a.msfsClient = msfs.NewClient(modFolder.(string))
	return nil
}

func (a *App) IsSetupComplete() bool {
	return a.setupComplete
}

func (a *App) CompleteSetup(modDirPath string) error {
	if modDirPath == "" {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	if _, found := msfs.FindSimCommunityFolder(); !found {
		return fmt.Errorf("failed to find community directory")
	}

	if err := a.config.SetKey(MOD_FOLDER, modDirPath); err != nil {
		return fmt.Errorf("error setting key: %v", err)
	}

	if err := a.createMSFSClient(); err != nil {
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
			log.Printf("failed to check mod status: %v\n", err)
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
		log.Printf("failed to parse package manifest: %v\n", err)
		return msfs.PackageManifest{}
	}

	return *manifest
}

func (a *App) EnableMod(modName string) error {
	if a.msfsClient == nil {
		return fmt.Errorf("msfs client not initialized")
	}

	if err := a.msfsClient.EnableMod(modName); err != nil {
		return fmt.Errorf("error enabling mod: %w", err)
	}

	return nil
}

func (a *App) DisableMod(modName string) error {
	if a.msfsClient == nil {
		return fmt.Errorf("msfs client not initialized")
	}

	if err := a.msfsClient.DisableMod(modName); err != nil {
		return fmt.Errorf("error disabling mod: %w", err)
	}

	return nil
}

func (a *App) OpenDirectoryDialog(title string) (string, error) {
	dirPath, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: title,
	})

	if err != nil {
		return "", fmt.Errorf("failed to open directory dialog: %w", err)
	}

	return dirPath, nil
}

func (a *App) GetModThumbnail(modName string) (string, error) {
	if a.msfsClient == nil {
		return "", fmt.Errorf("msfs client not initialized")
	}

	thumbnail, err := a.msfsClient.GetModThumbnailBase64(modName)
	if err != nil {
		return "", fmt.Errorf("failed to get mod thumbnail: %w", err)
	}

	return thumbnail, nil
}
