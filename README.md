<h1 align="center">Kairos Tab Time</h1>

<p align="center">
  <em>Your focus time, right where you work.</em>
</p>

<p align="center">
  <img src="gnome-extension/icons/kairos-32.png" width="32" height="32" alt="Kairos pixel-clock icon">
</p>

<p align="center">
  <img alt="GNOME Shell 45–46" src="https://img.shields.io/badge/GNOME_Shell-45%E2%80%9346-4A86CF?logo=gnome&logoColor=white">
  <img alt="VS Code 1.85+" src="https://img.shields.io/badge/VS_Code-1.85%2B-007ACC?logo=visualstudiocode&logoColor=white">
  <a href="https://github.com/hackclub/kairos"><img alt="Powered by Kairos" src="https://img.shields.io/badge/powered_by-Kairos-EC3750"></a>
</p>

<p align="center">
  A small, rounded tab for the GNOME top bar, with a VS Code status-bar companion.<br>
  Both read today's focus time from the <a href="https://github.com/hackclub/kairos">Kairos</a> desktop app running on your computer.
</p>

## GNOME top bar

Click the tab to see today's focus time, pause or resume tracking, and open your Kairos dashboard. **Move tab** lets you place it on the left, by the clock, or on the right; the choice persists. This is position selection, not free dragging.

The extension hides the older Kairos panel item while it's running, but keeps the `kairos-focus@obayy.dev` tracking extension enabled. Other tray icons stay put.

**[Install the GNOME extension →](gnome-extension/INSTALL.md)** — prerequisites, setup, updates, and removal are together with its source code.

## VS Code companion

Open this folder in VS Code and press **F5** to launch an Extension Development Host. The status bar shows today's Kairos time and opens the dashboard when clicked. If the local app is unavailable, it shows `Kairos —` and retries every 15 seconds.

Run `npm test` for the companion's unit tests. The GNOME extension lives separately in `gnome-extension/`.

The bundled icon is copied from [Kairos's browser extension](https://github.com/hackclub/kairos/tree/main/extension/src/icons) (upstream AGPL-3.0).
