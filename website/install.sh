#!/bin/sh
set -eu

if ! command -v gnome-extensions >/dev/null 2>&1; then
    echo 'GNOME Extensions is required. Install it for your Linux distribution first.' >&2
    exit 1
fi
if ! command -v curl >/dev/null 2>&1; then
    echo 'curl is required to download the extension.' >&2
    exit 1
fi

uuid=kairos-tab-time@local
bundle_dir=$(mktemp -d)
trap 'rm -rf "$bundle_dir"' EXIT HUP INT TERM
curl -fL --retry 2 --output "$bundle_dir/$uuid.shell-extension.zip" \
    "https://github.com/christianwell/kairos-tab-time/releases/latest/download/$uuid.shell-extension.zip"

if gnome-extensions info "$uuid" 2>/dev/null | grep -q 'Enabled: Yes'; then
    gnome-extensions disable "$uuid"
fi

gnome-extensions install --force "$bundle_dir/$uuid.shell-extension.zip"
if gnome-extensions enable "$uuid"; then
    echo 'Kairos tab installed. Look for it in the GNOME top bar.'
else
    echo 'Installed, but GNOME has not discovered it yet.' >&2
    echo 'Save your work and restart GNOME Shell (X11: Alt+F2, type r, Enter; Wayland: log out and back in).' >&2
    echo "Then run: gnome-extensions enable $uuid" >&2
    exit 1
fi
