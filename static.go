package asynqmon

import (
	"embed"
	"errors"
	"io/fs"
	"net/http"
	"path/filepath"
)

func NewStaticContentHandler(contents embed.FS, staticDirPath, indexFileName string) http.Handler {
	return &staticContentHandler{
		contents:      contents,
		staticDirPath: staticDirPath,
		indexFileName: indexFileName,
	}
}

// staticFileServer implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type staticContentHandler struct {
	contents      embed.FS
	staticDirPath string
	indexFileName string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler.
// If path '/' is requested, it will serve the index file, otherwise it will
// serve the file specified by the URL path.
func (h *staticContentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Get the absolute path to prevent directory traversal.
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if path == "/" {
		path = h.indexFilePath()
	} else {
		path = filepath.Join(h.staticDirPath, path)
	}

	bytes, err := h.contents.ReadFile(path)
	// If path is error (e.g. file not exist, path is a directory), serve index file.
	var pathErr *fs.PathError
	if errors.As(err, &pathErr) {
		bytes, err = h.contents.ReadFile(h.indexFilePath())
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := w.Write(bytes); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *staticContentHandler) indexFilePath() string {
	return filepath.Join(h.staticDirPath, h.indexFileName)
}
