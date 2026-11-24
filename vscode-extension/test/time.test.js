const test = require('node:test');
const assert = require('node:assert/strict');
const {formatTime, statusTime} = require('../time');

test('formats short focus totals as minutes', () => {
    assert.equal(formatTime(0), '0m');
    assert.equal(formatTime(3599), '59m');
});

test('formats longer totals as hours and remaining minutes', () => {
    assert.equal(formatTime(3600), '1h 0m');
    assert.equal(formatTime(5399), '1h 29m');
});

test('rejects missing, invalid, or negative Kairos totals', () => {
    for (const value of [undefined, {}, {today_secs: NaN}, {today_secs: -1}])
        assert.throws(() => statusTime(value));
});

test('reads Kairos today_secs without rounding away fractional values', () => {
    assert.equal(statusTime({today_secs: 125.5}), 125.5);
});
