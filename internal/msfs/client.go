package msfs

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/fly2z/aeromod/utils"
)

type Client struct {
	config *ClientConfig
}

type ClientConfig struct {
	communityFolder string
	modFolder       string
}

func NewClient(modFolder string) *Client {
	communityFolder, found := FindSimCommunityFolder()
	if !found {
		return nil
	}

	return &Client{
		config: &ClientConfig{
			communityFolder: communityFolder,
			modFolder:       modFolder,
		},
	}
}

func (c *Client) GetModNames() []string {
	folders, err := utils.Readdir(c.config.modFolder)
	if err != nil {
		return nil
	}

	var mods []string
	for _, e := range folders {
		mods = append(mods, e.Name())
	}

	return mods
}

func (c *Client) EnableMod(modName string) error {
	modSource := filepath.Join(c.config.modFolder, modName)
	modLink := filepath.Join(c.config.communityFolder, modName)
	enabled, err := utils.IsJunction(modLink)
	if err != nil {
		return err
	}

	// mod is already enabled
	if enabled {
		return nil
	}

	return utils.CreateJunction(modSource, modLink)
}

func (c *Client) DisableMod(modName string) error {
	modLink := filepath.Join(c.config.communityFolder, modName)
	enabled, err := utils.IsJunction(modLink)
	if err != nil {
		return err
	}

	// mod is already disabled
	if !enabled {
		return nil
	}

	return utils.RemoveJunction(modLink)
}

func (c *Client) IsModEnabled(modName string) (bool, error) {
	modLink := filepath.Join(c.config.communityFolder, modName)
	return utils.IsJunction(modLink)
}

func (c *Client) GetModThumbnailBase64(modName string) (string, error) {
	modPath := filepath.Join(c.config.communityFolder, modName)
	thumbnailPath := filepath.Join(modPath, "ContentInfo", modName, "Thumbnail.jpg")
	if _, err := os.Stat(thumbnailPath); errors.Is(err, os.ErrNotExist) {
		return "", fmt.Errorf("mod: %s, doesnt have a thumbnail", modName)
	}

	return utils.Base64EncodeFile(thumbnailPath)
}
