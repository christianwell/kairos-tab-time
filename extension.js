const vscode = require('vscode');
const {formatTime, statusTime} = require('./time');

const STATUS_URL = 'http://127.0.0.1:24816/v1/status';
const DASHBOARD_URL = 'https://kairos.hackclub.com/';

function activate(context) {
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10);
    item.command = 'kairosTabTime.openDashboard';
    item.text = '$(clock) Kairos …';
    item.tooltip = 'Loading today’s Kairos focus time';
    item.show();

    const refresh = async () => {
        try {
            const response = await fetch(STATUS_URL, {signal: AbortSignal.timeout(3000)});
            if (!response.ok)
                throw new Error(`Kairos answered ${response.status}`);
            const seconds = statusTime(await response.json());
            const time = formatTime(seconds);
            item.text = `$(clock) Kairos ${time}`;
            item.tooltip = `Today’s Kairos focus time: ${time}\nClick to open your Kairos dashboard`;
        } catch {
            item.text = '$(clock) Kairos —';
            item.tooltip = 'Kairos is not responding locally. Click to open the dashboard.';
        }
    };

    const timer = setInterval(refresh, 15000);
    context.subscriptions.push(
        item,
        {dispose: () => clearInterval(timer)},
        vscode.commands.registerCommand('kairosTabTime.refresh', refresh),
        vscode.commands.registerCommand('kairosTabTime.openDashboard', () =>
            vscode.env.openExternal(vscode.Uri.parse(DASHBOARD_URL))),
    );
    void refresh();
}

function deactivate() {}

module.exports = {activate, deactivate};
