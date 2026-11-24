# Kairos Tab Time for VS Code

Shows today's [Kairos](https://github.com/hackclub/kairos) focus time in the bottom-right status bar. Kairos must be running on the same computer as VS Code.

![Kairos focus time in the VS Code status bar](screenshots/vscode-status-bar.png)

## Install

From the [repository root](https://github.com/christianwell/kairos-tab-time), run `sh vscode-extension/install.sh` (requires Node.js and npm). Or download the `.vsix` from [Releases](https://github.com/christianwell/kairos-tab-time/releases) and run `code --install-extension kairos-tab-time.vsix`.

Reload VS Code after installation. Click **Kairos** in the status bar to open the dashboard. If Kairos is unavailable, it shows `Kairos —` and retries every 15 seconds. Run **Kairos: Refresh Tab Time** from the Command Palette to check immediately. To update, rerun the installer or install a newer VSIX; to remove it, uninstall **Kairos Tab Time** from VS Code's Extensions view.

## Develop

Open `vscode-extension/` in VS Code and press **F5** for an Extension Development Host. Run `npm ci && npm test` to check it and `npm run package` to build a VSIX.
