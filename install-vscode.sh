#!/bin/sh
set -eu

if ! command -v code >/dev/null 2>&1; then
    echo 'VS Code command-line tool (code) is required.' >&2
    exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
    echo 'Node.js and npm are required to package the extension.' >&2
    exit 1
fi

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$project_dir"
npm ci
npm run package
code --install-extension "$project_dir/kairos-tab-time.vsix" --force
echo 'Kairos Tab Time installed. Reload your VS Code window to see it in the status bar.'
