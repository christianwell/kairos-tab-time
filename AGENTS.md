# Repository guidance

## What this project is

- `gnome-extension/` is the GNOME Shell top-bar tab; root `extension.js`, `time.js`, `package.json`, and `test/` are the separate VS Code status-bar companion. Keep the two surfaces independent.
- Read Kairos's local status at `http://127.0.0.1:24816/v1/status`; `today_secs` is the focus total in seconds. Use Kairos's existing CLI for pause/resume, not a second timer or invented progress goal. The bundled `gnome-extension/icons/kairos-32.png` comes from upstream Kairos.
- The installed `kairos-focus@obayy.dev` extension provides focus tracking. Keep it enabled; this project may hide its panel actor while its own tab is visible, but must restore it on disable. Do not change Ubuntu AppIndicators' global tray position to move Kairos: that moves everyone else's icons.

## GNOME workflow

- GNOME Shell 46 runs on X11 on this development machine. The tab's supported positions are Left, By the clock, and Right, saved by the GSettings schema in `gnome-extension/schemas/`. A browser prototype cannot position a GNOME panel actor; implement and test movement in the Shell extension.
- Check JavaScript with `node --input-type=module --check < gnome-extension/extension.js` and schema with `glib-compile-schemas --strict --dry-run gnome-extension/schemas`.
- `gnome-extension/INSTALL.md` is the user-facing install guide. Keep it short: from the repository root, users run `sh gnome-extension/install.sh`. The script packages, installs, and enables the tab; update it and the guide together when installation changes. When changing packaging, preserve `--extra-source icons` so the bundled icon stays under `icons/` at runtime. Test the script on an existing installation as well as checking the package contents.
- After installing, check `gnome-extensions info kairos-tab-time@local`: `ACTIVE` is necessary but does not prove the tab or menu looks right. Inspect the real top bar and open menu, including a moved position and offline state when feasible. A browser mockup is only a design reference.
- A newly installed extension may not be discovered until GNOME Shell restarts. Ask before restarting the user's active desktop. Shell commands launched from VS Code's Snap inherit `GSETTINGS_SCHEMA_DIR` and `XDG_DATA_DIRS` overrides; do not launch `gnome-shell --replace` with those overrides. Prefer the desktop's X11 Alt+F2 → `r` after approval, and recheck that user extensions remain enabled afterward.

## VS Code workflow

- Run `npm test` for the companion. `sh install-vscode.sh` builds a VSIX and installs `christianwell.kairos-tab-time` in local VS Code; keep the README installation steps in sync with it.
- Check the VSIX contents when changing packaging so the GNOME extension and development files stay out. After installing, reload the VS Code window and inspect the bottom-right status bar with Kairos running; an installed-extension listing alone does not confirm the item appears.
