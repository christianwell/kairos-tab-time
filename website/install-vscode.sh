#!/bin/sh
set -eu

if ! command -v code >/dev/null 2>&1; then
    echo 'The VS Code command-line tool (code) is required. Or download the VSIX from the website and install it from the Extensions menu.' >&2
    exit 1
fi
if ! command -v curl >/dev/null 2>&1; then
    echo 'curl is required to download the companion.' >&2
    exit 1
fi

bundle_dir=$(mktemp -d)
trap 'rm -rf "$bundle_dir"' EXIT HUP INT TERM
curl -fL --retry 2 --output "$bundle_dir/kairos-tab-time.vsix" \
    'https://github.com/christianwell/kairos-tab-time/releases/latest/download/kairos-tab-time.vsix'
code --install-extension "$bundle_dir/kairos-tab-time.vsix" --force
echo 'Kairos Tab Time installed. Reload your VS Code window to see it in the status bar.'
