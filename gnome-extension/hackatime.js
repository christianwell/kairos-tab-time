import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup?version=3.0';

const CLIENT_ID = '1u1PHeuN3KnYK0s_qDqasGTwjWL5qCv42uLEAeDaLBA';
const REDIRECT = 'http://127.0.0.1:24817/callback';
const API = 'https://hackatime.hackclub.com';

function encode(value) {
    return encodeURIComponent(value);
}

function random() {
    return GLib.uuid_string_random().replaceAll('-', '') + GLib.uuid_string_random().replaceAll('-', '');
}

function challenge(verifier) {
    const digest = GLib.compute_checksum_for_string(GLib.ChecksumType.SHA256, verifier, -1);
    const bytes = Uint8Array.from(digest.match(/../g), byte => parseInt(byte, 16));
    return GLib.base64_encode(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export class Hackatime {
    constructor(onChange) {
        this.onChange = onChange;
        this.session = new Soup.Session({timeout: 10});
        this.cancel = new Gio.Cancellable();
        this.file = Gio.File.new_for_path(`${GLib.get_user_data_dir()}/kairos-tab-time/hackatime-token`);
        this.token = null;
        try {
            this.token = new TextDecoder().decode(this.file.load_contents(null)[1]).trim();
        } catch (_) {
            // No account connected yet.
        }
    }

    async request(method, url, body = null) {
        const message = Soup.Message.new(method, url);
        if (this.token)
            message.request_headers.append('Authorization', `Bearer ${this.token}`);
        if (body)
            message.set_request_body_from_bytes('application/x-www-form-urlencoded',
                new GLib.Bytes(new TextEncoder().encode(body)));
        const bytes = await new Promise((resolve, reject) => {
            this.session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, this.cancel,
                (session, result) => {
                    try {
                        resolve(session.send_and_read_finish(result));
                    } catch (error) {
                        reject(error);
                    }
                });
        });
        if (message.status_code < 200 || message.status_code >= 300)
            throw new Error(`Hackatime answered ${message.status_code}`);
        return JSON.parse(new TextDecoder().decode(bytes.get_data()));
    }

    connect() {
        if (this.server)
            return;
        const verifier = random();
        const state = random();
        this.server = new Soup.Server();
        this.server.add_handler('/callback', (_server, message, _path, query) => {
            if (query?.state !== state || (!query.code && !query.error)) {
                message.set_status(Soup.Status.BAD_REQUEST, null);
                return;
            }
            const server = this.server;
            this.server = null;
            GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
                server.disconnect();
                return GLib.SOURCE_REMOVE;
            });
            const denied = Boolean(query.error);
            message.set_status(Soup.Status.OK, null);
            message.set_response('text/html', Soup.MemoryUse.COPY,
                new TextEncoder().encode(`<p>${denied ? 'Hackatime connection cancelled.' : 'Finishing Hackatime connection. You can close this tab.'}</p><script>window.close()</script>`));
            if (denied) {
                this.onChange('Connection cancelled');
                return;
            }
            this.request('POST', `${API}/oauth/token`,
                `client_id=${encode(CLIENT_ID)}&code=${encode(query.code)}&redirect_uri=${encode(REDIRECT)}&grant_type=authorization_code&code_verifier=${encode(verifier)}`)
                .then(data => {
                    if (!data.access_token)
                        throw new Error('No access token returned');
                    this.token = data.access_token;
                    try {
                        this.file.get_parent().make_directory_with_parents(null);
                    } catch (error) {
                        if (!error.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.EXISTS))
                            throw error;
                    }
                    this.file.replace_contents(this.token, null, false, Gio.FileCreateFlags.PRIVATE, null);
                    this.file.set_attribute_uint32('unix::mode', 0o600, Gio.FileQueryInfoFlags.NONE, null);
                    this.refresh();
                }).catch(error => this.onChange(`Connection failed: ${error.message}`));
        });
        try {
            this.server.listen_local(24817, 0);
        } catch (error) {
            this.server = null;
            this.onChange('Could not open login callback port');
            return;
        }
        const url = `${API}/oauth/authorize?client_id=${encode(CLIENT_ID)}&redirect_uri=${encode(REDIRECT)}&response_type=code&scope=profile+read&state=${encode(state)}&code_challenge=${encode(challenge(verifier))}&code_challenge_method=S256`;
        Gio.AppInfo.launch_default_for_uri(url, null);
        this.onChange('Waiting for browser approval…');
    }

    async refresh() {
        if (!this.token)
            return;
        try {
            const date = GLib.DateTime.new_now_local().format('%Y-%m-%d');
            const data = await this.request('GET', `${API}/api/v1/authenticated/hours?start_date=${date}&end_date=${date}`);
            if (!Number.isFinite(data.total_seconds) || data.total_seconds < 0)
                throw new Error('Invalid coding time');
            this.onChange(`${Math.floor(data.total_seconds / 3600)}h ${Math.floor(data.total_seconds % 3600 / 60)}m coding today`);
        } catch (error) {
            this.onChange(`Hackatime unavailable: ${error.message}`);
        }
    }

    disconnect() {
        this.server?.disconnect();
        this.server = null;
        this.token = null;
        try {
            this.file.delete(null);
        } catch (_) {
            // Nothing stored.
        }
        this.onChange('Not connected');
    }

    destroy() {
        this.cancel.cancel();
        this.server?.disconnect();
        this.server = null;
        this.onChange = () => {};
    }
}
