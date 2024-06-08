package msfs

import (
	"path/filepath"

	"github.com/fly2z/aeromod/utils"
)

func (m *Client) EnableMod(modName string) error {
	modSource := filepath.Join(m.ModStorageFolder, modName)
	modLink := filepath.Join(m.CommunityPath, modName)
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

func (m *Client) DisableMod(modName string) error {
	modLink := filepath.Join(m.CommunityPath, modName)
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

func (m *Client) IsModEnabled(modName string) (bool, error) {
	modLink := filepath.Join(m.CommunityPath, modName)
	return utils.IsJunction(modLink)
}
