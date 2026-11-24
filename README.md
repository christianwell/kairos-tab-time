<h1 align="center">Kairos Tab Time</h1>

<p align="center">
  <em>Your time vibe-coding, on your screen</em>
</p>

<p align="center">
  <img src="gnome-extension/icons/kairos-32.png" width="32" height="32" alt="Kairos pixel-clock icon">
</p>

<p align="center">
  <a href="https://github.com/hackclub/kairos"><img alt="Powered by Kairos" src="https://img.shields.io/badge/powered_by-Kairos-EC3750"></a>
    <a href="https://hackclub.com/"><img alt="Hack Club" src="https://img.shields.io/badge/hack--club-EC3750?style=flat&logo=hackclub&logoColor=white"></a>&nbsp;

</p>


## GNOME top bar

<p align="center">
  <img width="800" alt="Kairos focus-time tab in the GNOME top bar, with surrounding desktop details removed" src="gnome-extension/screenshots/top-bar.png">
</p>

**[Install the GNOME extension →](gnome-extension/INSTALL.md)** 

## VS Code companion

Open this folder in VS Code and press **F5** to launch an Extension Development Host. The status bar shows today's Kairos time and opens the dashboard when clicked. If the local app is unavailable, it shows `Kairos —` and retries every 15 seconds.

Run `npm test` for the companion's unit tests. The GNOME extension lives separately in `gnome-extension/`.

The bundled icon is copied from [Kairos's browser extension](https://github.com/hackclub/kairos/tree/main/extension/src/icons) (upstream AGPL-3.0).
