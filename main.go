package main

import (
	"embed"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	store, err := NewConfigStore()
	if err != nil {
		fmt.Printf("could not initialize the config store: %v\n", err)
		return
	}

	cfg, err := store.Config()
	if err != nil {
		fmt.Printf("could not retrieve the configuration: %v\n", err)
		return
	}

	// Create an instance of the app structure
	app := NewApp(&cfg)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "AeroMod",
		Width:  1280,
		Height: 720,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			DisablePinchZoom: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
