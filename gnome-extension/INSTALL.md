# Install the Kairos GNOME tab

You need **GNOME Shell 45 or 46** and the [Kairos desktop app](https://github.com/hackclub/kairos) running on the same computer.

## Install

Open a terminal and copy these commands:

```sh
git clone https://github.com/christianwell/kairos-tab-time.git
cd kairos-tab-time
sh gnome-extension/install.sh
```

Already downloaded this project? Open a terminal in its folder and run just `sh gnome-extension/install.sh`. The installer packages the extension, installs it, and enables it for you; it does not need administrator access.

**If it says “extension doesn't exist”:** GNOME needs to discover the new installation. Save your work first. On **X11**, press **Alt+F2**, type `r`, and press **Enter**. On **Wayland**, log out and back in. Then run:

```sh
gnome-extensions enable kairos-tab-time@local
```

Click **Kairos** in the top bar to see your time and pause or resume tracking. **Move tab** lets you choose Left, By the clock, or Right. Keep `kairos-focus@obayy.dev` enabled if you use it for focus tracking.

## Update or remove

To update, open a terminal in the project folder and run:

```sh
git pull
sh gnome-extension/install.sh
```

To turn the tab off and restore the previous Kairos panel item:

```sh
gnome-extensions disable kairos-tab-time@local
```

If the tab shows `Kairos —`, start the Kairos desktop app.
