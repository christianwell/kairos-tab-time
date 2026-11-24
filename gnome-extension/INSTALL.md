# Install the Kairos GNOME tab

This adds a focus-time pill to your **GNOME top bar**. You need GNOME Shell **45 or 46** and the [Kairos desktop app](https://github.com/hackclub/kairos) running on the same computer. The tab cannot track time on its own.

## 1. Download this project

Open a terminal and run:

```sh
git clone https://github.com/christianwell/kairos-tab-time.git
cd kairos-tab-time
```

Already downloaded the repository? Open a terminal **inside the `kairos-tab-time` folder** and skip this step. If you downloaded a ZIP, extract it first and open a terminal inside the extracted folder.

## 2. Install the tab

Copy and run this whole block in that terminal:

```sh
gnome-extensions pack gnome-extension \
  --schema schemas/org.gnome.shell.extensions.kairos-tab-time.gschema.xml \
  --extra-source icons --force
gnome-extensions install --force kairos-tab-time@local.shell-extension.zip
gnome-extensions enable kairos-tab-time@local
```

**Don't see the tab yet?** If the last command says the extension doesn't exist, save your work and restart GNOME Shell so it finds the new installation:

- **X11:** Press **Alt+F2**, type `r`, then press **Enter**. This restarts the top bar without logging you out.
- **Wayland:** Log out and log back in.

Then run `gnome-extensions enable kairos-tab-time@local` again. You only need this restart when GNOME hasn't discovered a new installation.

## 3. Use it

Click **Kairos** in the top bar to see today's focus time, pause or resume tracking, or open the dashboard. Choose **Move tab → Left / By the clock / Right** to move it; your choice is saved. It does not support free dragging yet.

Keep `kairos-focus@obayy.dev` enabled if you use that extension for focus tracking. The new tab hides the older Kairos panel item while it runs, but does not turn off tracking.

## Update or remove

To update, get the latest version with `git pull` from inside the project folder, then run the three install commands from step 2 again. Disable and re-enable the tab to load the new code:

```sh
gnome-extensions disable kairos-tab-time@local
gnome-extensions enable kairos-tab-time@local
```

To **turn the tab off**, run only the `disable` command above. Your previous Kairos panel item will reappear.

If the tab says `Kairos —`, start the Kairos desktop app; the tab reads its local status at `http://127.0.0.1:24816/v1/status`.
