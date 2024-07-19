package utils

import (
	"encoding/base64"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
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
