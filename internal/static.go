package internal

import "embed"

//go:embed assets/*
var StaticContents embed.FS
