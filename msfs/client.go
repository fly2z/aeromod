package msfs

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/fly2z/aeromod/utils"
)

type Client struct {
	CommunityPath    string
	ModStorageFolder string
}

type ClientOptions struct {
	CommunityPath    string
	ModStorageFolder string
}

func NewClient(options ClientOptions) *Client {
	return &Client{
		CommunityPath:    options.CommunityPath,
		ModStorageFolder: options.ModStorageFolder,
	}
}

func (c *Client) GetModNames() []string {
	folders, err := utils.Readdir(c.ModStorageFolder)
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
	modSource := filepath.Join(c.ModStorageFolder, modName)
	modLink := filepath.Join(c.CommunityPath, modName)
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
	modLink := filepath.Join(c.CommunityPath, modName)
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
	modLink := filepath.Join(c.CommunityPath, modName)
	return utils.IsJunction(modLink)
}

func (c *Client) GetModThumbnailBase64(modName string) (string, error) {
	modPath := filepath.Join(c.CommunityPath, modName)
	thumbnailPath := filepath.Join(modPath, "ContentInfo", modName, "Thumbnail.jpg")
	if _, err := os.Stat(thumbnailPath); errors.Is(err, os.ErrNotExist) {
		return "", fmt.Errorf("mod: %s, doesnt have a thumbnail", modName)
	}

	return utils.Base64EncodeFile(thumbnailPath)
}
