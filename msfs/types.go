package msfs

type Mod struct {
	Name    string `json:"name"`
	Enabled bool   `json:"enabled"`
}

type ContentType int

const (
	SCENERY ContentType = iota
	AIRCRAFT
)
