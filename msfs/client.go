package msfs

import "github.com/fly2z/aeromod/utils"

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

func (m *Client) GetModNames() []string {
	folders, err := utils.Readdir(m.ModStorageFolder)
	if err != nil {
		return nil
	}

	var mods []string
	for _, e := range folders {
		mods = append(mods, e.Name())
	}

	return mods
}
