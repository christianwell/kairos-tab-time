function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0)
        return '—';

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

function statusTime(status) {
    if (!status || !Number.isFinite(status.today_secs) || status.today_secs < 0)
        throw new Error('Kairos returned an invalid time value');
    return status.today_secs;
}

module.exports = {formatTime, statusTime};
