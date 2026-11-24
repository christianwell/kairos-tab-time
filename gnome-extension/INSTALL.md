# Install the Kairos GNOME tab

You need **GNOME Shell 45 or 46** and the [Kairos desktop app](https://github.com/hackclub/kairos) running on the same computer.

## Install

Open the [GNOME install guide on the website](https://kairos-tab-time.christianwell.xyz/#install), or install the latest release from a terminal without cloning the repository:

```sh
curl -fsSL https://kairos-tab-time.christianwell.xyz/install.sh | sh
```

Already downloaded this project? From the repository root, run `sh gnome-extension/install.sh`. It packages, installs, and enables the tab without administrator access.

Alternatively, download `kairos-tab-time@local.shell-extension.zip` from [Releases](https://github.com/christianwell/kairos-tab-time/releases), then run `gnome-extensions install --force kairos-tab-time@local.shell-extension.zip` and `gnome-extensions enable kairos-tab-time@local`.

**If it says “extension doesn't exist”:** GNOME needs to discover the new installation. Save your work first. On **X11**, press **Alt+F2**, type `r`, and press **Enter**. On **Wayland**, log out and back in. Then run:

```sh
gnome-extensions enable kairos-tab-time@local
```

Click **Kairos** in the top bar to see your time and pause or resume tracking. **Move tab** lets you choose Left, By the clock, or Right. Keep `kairos-focus@obayy.dev` enabled if you use it for focus tracking.

## Update or remove

To update, run the release install command again, or from the repository root run:

```sh
git pull
sh gnome-extension/install.sh
```

To turn the tab off and restore the previous Kairos panel item:

```sh
gnome-extensions disable kairos-tab-time@local
```

If the tab shows `Kairos —`, start the Kairos desktop app.
