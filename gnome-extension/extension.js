import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup?version=3.0';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const STATUS_URL = 'http://127.0.0.1:24816/v1/status';
const POSITIONS = ['left', 'center', 'right'];

function time(seconds) {
    const minutes = Math.floor(seconds / 60);
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}

export default class KairosTabTime extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._session = new Soup.Session({timeout: 3});
        this._cancellable = new Gio.Cancellable();
        this._hiddenIndicators = new Set();

        const indicator = new PanelMenu.Button(0, 'Kairos focus time');
        indicator.add_style_class_name('kairos-tab');
        const contents = new St.BoxLayout();
        const icon = new St.Icon({
            gicon: new Gio.FileIcon({file: Gio.File.new_for_path(`${this.path}/icons/kairos-32.png`)}),
            icon_size: 16,
            style_class: 'kairos-tab-icon',
        });
        this._label = new St.Label({text: 'Kairos …', style_class: 'kairos-tab-label', y_align: Clutter.ActorAlign.CENTER});
        contents.add_child(icon);
        contents.add_child(this._label);
        indicator.add_child(contents);

        indicator.menu.actor.add_style_class_name('kairos-menu');
        const overview = new PopupMenu.PopupBaseMenuItem({reactive: false, can_focus: false});
        overview.add_style_class_name('kairos-overview');
        const summary = new St.BoxLayout({vertical: true, style_class: 'kairos-summary'});
        summary.add_child(new St.Label({text: 'Kairos', style_class: 'kairos-heading'}));
        summary.add_child(new St.Label({text: 'Focus time today', style_class: 'kairos-caption'}));
        this._detail = new St.Label({text: '—', style_class: 'kairos-total'});
        summary.add_child(this._detail);
        this._state = new St.Label({text: 'Connecting…', style_class: 'kairos-state'});
        summary.add_child(this._state);
        overview.add_child(summary);
        indicator.menu.addMenuItem(overview);
        indicator.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._pause = indicator.menu.addAction('Pause for 30 minutes', () =>
            this._paused ? this._runKairos('resume') : this._runKairos('pause', '30m'));
        indicator.menu.addAction('Open dashboard', () =>
            Gio.AppInfo.launch_default_for_uri('https://kairos.hackclub.com/me', null));

        const move = new PopupMenu.PopupSubMenuMenuItem('Move tab');
        this._choices = POSITIONS.map(position => {
            const item = move.menu.addAction(position === 'center' ? 'By the clock' :
                position[0].toUpperCase() + position.slice(1), () => this._place(position));
            return [position, item];
        });
        indicator.menu.addMenuItem(move);

        this._indicator = indicator;
        Main.panel.addToStatusArea(this.uuid, indicator, 0, 'right');
        this._place(this._settings.get_string('position'));
        this._syncOriginal();
        this._refresh();
        this._ticks = 0;
        this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
            this._syncOriginal();
            if (++this._ticks % 8 === 0)
                this._refresh();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._timer) {
            GLib.Source.remove(this._timer);
            this._timer = null;
        }
        this._cancellable?.cancel();
        this._indicator?.destroy();
        for (const actor of this._hiddenIndicators) {
            if (actor.get_parent())
                actor.show();
        }
        this._hiddenIndicators.clear();
        this._indicator = null;
        this._session = null;
        this._settings = null;
    }

    _place(value) {
        const position = POSITIONS.includes(value) ? value : 'right';
        const boxes = {
            left: Main.panel._leftBox,
            center: Main.panel._centerBox,
            right: Main.panel._rightBox,
        };
        const actor = this._indicator.container;
        actor.get_parent()?.remove_child(actor);
        // After Activities, after the clock, or before the system indicators.
        boxes[position].insert_child_at_index(actor, position === 'left' ? 1 :
            position === 'center' ? boxes.center.get_n_children() : 0);
        this._settings.set_string('position', position);
        for (const [name, item] of this._choices)
            item.setOrnament(name === position ? PopupMenu.Ornament.DOT : PopupMenu.Ornament.NONE);
    }

    _syncOriginal() {
        // Keep the focus-tracking extension enabled; replace only its panel item.
        // Kairos may also publish a StatusNotifier item through AppIndicators.
        for (const [role, indicator] of Object.entries(Main.panel.statusArea)) {
            if (role === 'kairos-focus@obayy.dev' ||
                (role.startsWith('appindicator-') && indicator?._indicator?.id === 'kairos')) {
                const actor = indicator.container;
                if (actor?.visible && !this._hiddenIndicators.has(actor)) {
                    this._hiddenIndicators.add(actor);
                    actor.hide();
                }
            }
        }
    }

    _refresh() {
        if (!this._indicator)
            return;
        const request = Soup.Message.new('GET', STATUS_URL);
        this._session.send_and_read_async(request, GLib.PRIORITY_DEFAULT, this._cancellable,
            (session, result) => {
                if (!this._indicator)
                    return;
                try {
                    const bytes = session.send_and_read_finish(result);
                    if (request.get_status() !== Soup.Status.OK)
                        throw new Error(`Kairos answered ${request.get_status()}`);
                    const status = JSON.parse(new TextDecoder().decode(bytes.get_data()));
                    if (!Number.isFinite(status.today_secs) || status.today_secs < 0)
                        throw new Error('Invalid focus time');
                    const today = time(status.today_secs);
                    const paused = status.paused_until > Date.now() / 1000;
                    this._label.text = `Kairos ${today}`;
                    this._indicator.accessible_name = `Kairos: ${today} of focus today`;
                    this._detail.text = today;
                    this._state.text = paused ? '●  Tracking paused' :
                        status.upload_error ? '●  Sync issue — check Kairos' : '●  Tracking is on';
                    this._pause.label.text = paused ? 'Resume tracking' : 'Pause for 30 minutes';
                    this._paused = paused;
                } catch (error) {
                    this._label.text = 'Kairos —';
                    this._indicator.accessible_name = 'Kairos time unavailable';
                    this._detail.text = '—';
                    this._state.text = 'Start Kairos to reconnect';
                    this._pause.setSensitive(false);
                    return;
                }
                this._pause.setSensitive(true);
            });
    }

    _runKairos(action, duration) {
        const binary = GLib.find_program_in_path('kairos') ??
            `${GLib.get_home_dir()}/.local/bin/kairos`;
        try {
            const process = Gio.Subprocess.new([binary, action, ...(duration ? [duration] : [])],
                Gio.SubprocessFlags.NONE);
            process.wait_async(null, (subprocess, result) => {
                try {
                    subprocess.wait_finish(result);
                    if (!this._indicator)
                        return;
                    if (!subprocess.get_successful())
                        this._state.text = `Could not ${action} Kairos`;
                    else
                        this._refresh();
                } catch (error) {
                    console.error(error);
                }
            });
        } catch (error) {
            this._state.text = `Could not ${action} Kairos`;
            console.error(error);
        }
    }
}
