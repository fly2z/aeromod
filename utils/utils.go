package utils

import (
	"archive/zip"
	"encoding/base64"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

// CreateJunction creates a directory junction on Windows
func CreateJunction(target, linkName string) error {
	cmd := exec.Command("cmd", "/C", "mklink", "/J", linkName, target)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to create directory junction '%s': %w", linkName, err)
	}

	return nil
}

// RemoveJunction removes a directory junction on Windows using fsutil
func RemoveJunction(linkName string) error {
	if _, err := os.Lstat(linkName); os.IsNotExist(err) {
		return nil
	} else if err != nil {
		return fmt.Errorf("failed to stat directory junction '%s': %w", linkName, err)
	}

	// Use fsutil to remove the reparse point
	cmd := exec.Command("cmd", "/C", "fsutil", "reparsepoint", "delete", linkName)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to remove directory junction '%s': %w", linkName, err)
	}

	// Delete the empty folder
	if err := Rmdir(linkName); err != nil {
		return err
	}

	return nil
}

// IsJunction checks if a directory junction exists at the specified path
func IsJunction(linkName string) (bool, error) {
	if _, err := os.Lstat(linkName); os.IsNotExist(err) {
		return false, nil
	} else if err != nil {
		return false, fmt.Errorf("failed to stat directory junction '%s': %w", linkName, err)
	}

	// Use fsutil to check if it is a reparse point (directory junction)
	cmd := exec.Command("cmd", "/C", "fsutil", "reparsepoint", "query", linkName)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Run(); err == nil {
		return true, nil
	}

	return false, nil
}

// Readdir reads a directory at the specified path
func Readdir(path string) ([]fs.DirEntry, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		return []fs.DirEntry{}, err
	}

	return entries, nil
}

// Rmdir deletes the specified directory and its contents
func Rmdir(folderPath string) error {
	if _, err := os.Lstat(folderPath); os.IsNotExist(err) {
		return nil
	} else if err != nil {
		return fmt.Errorf("failed to stat directory '%s': %w", folderPath, err)
	}

	if err := os.RemoveAll(folderPath); err != nil {
		return fmt.Errorf("failed to remove directory '%s': %w", folderPath, err)
	}

	return nil
}

func Base64EncodeFile(filePath string) (string, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	data, err := io.ReadAll(f)
	if err != nil {
		return "", err
	}

	base64str := base64.StdEncoding.EncodeToString(data)
	return base64str, nil
}

func Unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer func() {
		if err := r.Close(); err != nil {
			panic(err)
		}
	}()

	os.MkdirAll(dest, 0755)

	extractAndWriteFile := func(f *zip.File) error {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer func() {
			if err := rc.Close(); err != nil {
				panic(err)
			}
		}()

		path := filepath.Join(dest, f.Name)

		// check for ZipSlip (directory traversal)
		if !strings.HasPrefix(path, filepath.Clean(dest)+string(os.PathSeparator)) {
			return fmt.Errorf("illegal file path: %s", path)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(path, f.Mode())
		} else {
			os.MkdirAll(filepath.Dir(path), f.Mode())
			f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer func() {
				if err := f.Close(); err != nil {
					panic(err)
				}
			}()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
		return nil
	}

	for _, f := range r.File {
		err := extractAndWriteFile(f)
		if err != nil {
			return err
		}
	}

	return nil
}

// CopyFile copies a single file from src to dst
func CopyFile(src, dst string) error {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return err
	}

	defer func() {
		if err := source.Close(); err != nil {
			panic(err)
		}
	}()

	destination, err := os.Create(dst)
	if err != nil {
		return err
	}

	defer func() {
		if err := destination.Close(); err != nil {
			panic(err)
		}
	}()

	_, err = io.Copy(destination, source)
	return err
}

// CopyDir recursively copies a directory tree
func CopyDir(src string, dst string) error {
	src = filepath.Clean(src)
	dst = filepath.Clean(dst)

	srcInfo, err := os.Stat(src)
	if err != nil {
		return err
	}
	if !srcInfo.IsDir() {
		return fmt.Errorf("%s is not a directory", src)
	}

	err = os.MkdirAll(dst, srcInfo.Mode())
	if err != nil {
		return err
	}

	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		if entry.IsDir() {
			err = CopyDir(srcPath, dstPath)
			if err != nil {
				return err
			}
		} else {
			err = CopyFile(srcPath, dstPath)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

var sizes = []string{"B", "kB", "MB", "GB", "TB", "PB", "EB"}

func FormatFileSize(s float64, base float64) string {
	unitsLimit := len(sizes)
	i := 0
	for s >= base && i < unitsLimit {
		s = s / base
		i++
	}

	f := "%.0f %s"
	if i > 1 {
		f = "%.2f %s"
	}

	return fmt.Sprintf(f, s, sizes[i])
}
