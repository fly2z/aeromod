package msfs

import (
	"os"
	"path/filepath"
)

// IsSimFolder checks if the given folder is a valid MSFS installation folder
func IsSimFolder(folder string) bool {
	fPath := filepath.Join(folder, "FlightSimulator.CFG")
	_, err := os.Stat(fPath)

	return err == nil
}

// IsSimPackagesFolder checks if the given folder is a valid MSFS packages folder
func IsSimPackagesFolder(folder string) bool {
	dirs, err := os.ReadDir(folder)
	if err != nil {
		return false
	}

	var hasOfficialFolder bool
	var hasCommunityFolder bool

	for _, d := range dirs {
		name := d.Name()
		isDir := d.IsDir()

		if !isDir {
			continue
		}

		if name == "Official" {
			hasOfficialFolder = true
			continue
		}

		if name == "Community" {
			hasCommunityFolder = true
		}
	}

	return hasOfficialFolder && hasCommunityFolder
}

// FindSimPackagesFolder tries to find the MSFS packages folder
func FindSimPackagesFolder() (string, bool) {
	steamPath := filepath.Join((os.Getenv("APPDATA")), "Microsoft Flight Simulator")
	if IsSimFolder(steamPath) {
		return filepath.Join(steamPath, "Packages"), true
	}

	msStorePath := filepath.Join(os.Getenv("LOCALAPPDATA"), "Packages", "Microsoft.FlightSimulator_8wekyb3d8bbwe", "LocalCache")
	if IsSimPackagesFolder(msStorePath) {
		return filepath.Join(msStorePath, "Packages"), true
	}

	return "", false
}

// FindSimCommunityFolder tries to find the MSFS packages folder
func FindSimCommunityFolder() (string, bool) {
	pkgDir, found := FindSimPackagesFolder()
	if !found {
		return "", false
	}
	return filepath.Join(pkgDir, "Community"), true
}
