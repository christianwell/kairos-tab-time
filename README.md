<h1 align="center">Kairos Tab Time</h1>

<p align="center">
  <em>Your time vibe-coding, on your screen</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/christianwell/kairos-tab-time/main/gnome-extension/icons/kairos-32.png" width="32" height="32" alt="Kairos pixel-clock icon">
</p>

<p align="center">
  <a href="https://github.com/hackclub/kairos"><img alt="Powered by Kairos" src="https://img.shields.io/badge/powered_by-Kairos-EC3750"></a>
    <a href="https://hackclub.com/"><img alt="Hack Club" src="https://img.shields.io/badge/hack--club-EC3750?style=flat&logo=hackclub&logoColor=white"></a>&nbsp;

</p>

**[Website →](https://kairos-tab-time.christianwell.xyz/)** Install the GNOME tab or VS Code companion from a link or a one-line command, without cloning this repository. The static site lives in `website/`; preview it with `python3 -m http.server 8000 --directory website` and open http://localhost:8000.


## GNOME top bar

<p align="center">
  <img width="800" alt="Kairos focus-time tab in the GNOME top bar, with surrounding desktop details removed" src="https://raw.githubusercontent.com/christianwell/kairos-tab-time/main/gnome-extension/screenshots/top-bar.png">
</p>

**[Install the GNOME extension on the website →](https://kairos-tab-time.christianwell.xyz/#install)** · [GNOME install guide](gnome-extension/INSTALL.md)

## VS Code companion

![Kairos focus time in the VS Code status bar](vscode-extension/screenshots/vscode-status-bar.png)

**[Get the VS Code companion on the website →](https://kairos-tab-time.christianwell.xyz/#vscode)**

Install [Kairos](https://github.com/hackclub/kairos) on the same computer as VS Code, then run:

```sh
curl -fsSL https://kairos-tab-time.christianwell.xyz/install-vscode.sh | sh
```

Reload VS Code after installation. The status bar shows today's Kairos focus time; click it to open the dashboard. [VS Code usage and development →](vscode-extension/README.md)

## Releases

Version tags such as `v0.1.0` build and publish both a VS Code `.vsix` and a GNOME Shell `.zip` on [GitHub Releases](https://github.com/christianwell/kairos-tab-time/releases). The tag version must match `vscode-extension/package.json`. Downloads do not need Node.js or a repository checkout; follow the extension guides to install them.

The bundled icon is copied from [Kairos's browser extension](https://github.com/hackclub/kairos/tree/main/extension/src/icons) (upstream AGPL-3.0).
