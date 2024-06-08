package msfs

import (
	"encoding/json"
	"io"
	"os"
	"path"
)

type ContentType int

const (
	SCENERY ContentType = iota
	AIRCRAFT
)

type PackageManifest struct {
	ContentType        string        `json:"content_type"`
	Title              string        `json:"title"`
	Manufacturer       string        `json:"manufacturer"`
	Creator            string        `json:"creator"`
	PackageVersion     string        `json:"package_version"`
	MinimumGameVersion string        `json:"minimum_game_version"`
	ReleaseNotes       interface{}   `json:"release_notes"`
	Dependencies       []interface{} `json:"dependencies"`
}

func (m *Client) ParsePackageManifest(packageName string) (*PackageManifest, error) {
	manifestFile, err := os.Open(path.Join(m.ModStorageFolder, packageName, "manifest.json"))
	if err != nil {
		return nil, err
	}

	defer manifestFile.Close()

	byteValue, _ := io.ReadAll(manifestFile)

	var manifest PackageManifest
	err = json.Unmarshal(byteValue, &manifest)
	if err != nil {
		return nil, err
	}

	return &manifest, nil
}
