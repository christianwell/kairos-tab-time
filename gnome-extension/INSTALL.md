# Install the GNOME top-bar tab

You need [Kairos](https://github.com/hackclub/kairos) running on your computer and GNOME Shell 45 or 46. The tab reads focus time from Kairos's local service at `127.0.0.1:24816`; it does not start Kairos for you. Keep the existing `kairos-focus@obayy.dev` extension enabled if you use it for focus tracking.

From the **repository root**, package and install the extension:

```sh
gnome-extensions pack gnome-extension \
  --schema schemas/org.gnome.shell.extensions.kairos-tab-time.gschema.xml \
  --extra-source icons --force
gnome-extensions install --force kairos-tab-time@local.shell-extension.zip
gnome-extensions enable kairos-tab-time@local
```

If `enable` says the extension doesn't exist, GNOME Shell has not discovered the new installation yet. Save your work, then restart the shell: on X11 press **Alt+F2**, type `r`, and press Enter; on Wayland log out and back in. Run `gnome-extensions enable kairos-tab-time@local` again afterward.

Click the tab for today's focus time, pause/resume, and the dashboard. Choose **Move tab → Left / By the clock / Right** to save its top-bar position. This is position selection, not free dragging.

To turn it off and restore the old Kairos panel item:

```sh
gnome-extensions disable kairos-tab-time@local
```

For updates, repeat the pack and install steps, then disable and enable the extension to load the new code. If the tab shows `Kairos —`, start Kairos and confirm `http://127.0.0.1:24816/v1/status` responds on this machine.
