#!/bin/sh
set -eu

source_dir="$HOME/sites/kairos-tab-time-source"
site_dir="$HOME/sites/kairos-tab-time"

if [ ! -d "$source_dir/.git" ]; then
    git clone --filter=blob:none https://github.com/christianwell/kairos-tab-time.git "$source_dir"
fi

git -C "$source_dir" fetch --quiet origin main
git -C "$source_dir" reset --quiet --hard origin/main

# The site may contain files managed separately on the Pi; only replace tracked site assets.
rsync -a "$source_dir/website/" "$site_dir/" \
    --exclude deploy-from-github.sh \
    --exclude kairos-tab-time-update.service \
    --exclude kairos-tab-time-update.timer
