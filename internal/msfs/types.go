package msfs

type Mod struct {
	Name    string `json:"name"`
	Enabled bool   `json:"enabled"`
}

// ModLayout contains contents of the mod.
type ModLayout struct {
	Content []FileInfo `json:"content"`
}

// FileInfo contains the expected details of a file.
type FileInfo struct {
	Path string `json:"path"`
	Size int64  `json:"size"`
	Date int64  `json:"date"` // Windows FILETIME format
}

// VerificationResult contains the status of a single file.
type VerificationResult struct {
	Path   string `json:"path"`
	Size   int64  `json:"size"`
	Found  bool   `json:"found"`
	SizeOk bool   `json:"size_ok"`
	Error  string `json:"error"`
}

type ContentType int

const (
	SCENERY ContentType = iota
	AIRCRAFT
	MISC
)
