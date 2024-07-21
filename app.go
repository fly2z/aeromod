package main

import (
	"context"
	"fmt"
	"log"
	"path/filepath"
	"strings"

	"github.com/fly2z/aeromod/internal/config"
	"github.com/fly2z/aeromod/internal/msfs"
	"github.com/fly2z/aeromod/utils"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	CONFIG_MOD_FOLDER        = "mod_folder"
	CONFIG_ENABLE_ON_INSTALL = "enable_on_install"
)

type App struct {
	ctx           context.Context
	config        *config.AppConfig
	setupComplete bool
	msfsClient    *msfs.Client
}

func NewApp(config *config.AppConfig) *App {
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

func (a *App) reloadConfig() error {
	err := config.Load(a.config)
	if err != nil {
		return err
	}

	return nil
}

func (a *App) createMSFSClient() error {
	modFolder := a.config.ModFolder
	if modFolder == "" {
		return fmt.Errorf("mod folder path cannot be empty")
	}

	a.msfsClient = msfs.NewClient(modFolder)
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

	if err := config.Set(CONFIG_MOD_FOLDER, modDirPath); err != nil {
		return err
	}

	if err := a.reloadConfig(); err != nil {
		return fmt.Errorf("failed to reload config")
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

func (a *App) InstallMod() (bool, error) {
	archive, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Choose Mod",
	})

	if err != nil {
		return false, fmt.Errorf("failed to open directory dialog: %w", err)
	}

	if archive == "" {
		return false, nil
	}

	ext := filepath.Ext(archive)
	if ext != ".zip" {
		return false, fmt.Errorf("unsupported archive format")
	}

	archiveDest := strings.TrimSuffix(archive, ext)

	err = utils.Unzip(archive, archiveDest)
	if err != nil {
		return false, err
	}

	defer func() {
		err := utils.Rmdir(archiveDest)
		if err != nil {
			log.Printf("failed to cleanup extracted archive: %s\n", filepath.Base(archiveDest))
		}
	}()

	mods, err := msfs.FindMods(archiveDest)
	if err != nil {
		return false, fmt.Errorf("failed to find mods: %w", err)
	}

	fmt.Printf("\n\n\n\nFOUND %d MODS\n\n\n\n", len(mods))

	if len(mods) < 1 {
		return false, nil
	}

	for _, m := range mods {
		name := filepath.Base(m)
		err := utils.CopyDir(m, filepath.Join(a.config.ModFolder, name))
		if err != nil {
			log.Printf("failed to move mod: %v\n", err)
			continue
		}

		if a.config.EnableOnInstall {
			err = a.EnableMod(name)
			if err != nil {
				log.Printf("failed to enable mod: %v\n", err)
			}
		}
	}

	return true, nil
}
