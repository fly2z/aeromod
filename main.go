package main

import (
	"embed"
	"fmt"

	"github.com/fly2z/aeromod/config"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	config, err := config.NewConfig()
	if err != nil {
		fmt.Printf("error initializing config: %v\n", err)
		return
	}

	// Create an instance of the app structure
	app := NewApp(config)

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
			DisablePinchZoom:    true,
			EnableSwipeGestures: false,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
