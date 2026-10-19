import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as k from '../src/index.js';

const SLC = { lat: 40.7608, lon: -111.891, timeZone: 'America/Denver' };
const mins = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const near = (a, b, tol = 2) => assert.ok(Math.abs(mins(a) - mins(b)) <= tol, `${a} vs ${b}`);

test('prayer times match a reference (aladhan.com, ISNA) within 2 minutes', () => {
  // Reference: api.aladhan.com/v1/timings/19-10-2026?latitude=40.7608&longitude=-111.891&method=2&timezonestring=America/Denver
  const t = k.prayerTimes({ ...SLC, date: new Date('2026-10-19T18:00:00Z') });
  const ref = { fajr: '06:28', sunrise: '07:43', dhuhr: '13:12', asr: '16:15', maghrib: '18:41', isha: '19:56' };
  for (const p of k.PRAYERS) near(t[p], ref[p]);
});
test('Hanafi Asr (Dearborn, MI) matches reference', () => {
  const t = k.prayerTimes({ lat: 42.3223, lon: -83.1763, timeZone: 'America/Detroit', date: new Date('2026-10-19T18:00:00Z'), asr: 'hanafi' });
  near(t.asr, '17:01'); near(t.fajr, '06:33'); near(t.isha, '20:02');
});
test('IANA time zones follow DST; numeric offsets still work', () => {
  const summer = k.prayerTimes({ ...SLC, date: new Date('2026-07-01T18:00:00Z') });
  const viaTz = k.prayerTimes({ lat: SLC.lat, lon: SLC.lon, tz: -6, date: new Date('2026-07-01T18:00:00Z') });
  assert.deepEqual(summer, viaTz);
  assert.equal(k.zoneOffsetHours('America/Denver', new Date('2026-12-15T12:00:00Z')), -7);
  assert.equal(k.zoneOffsetHours('Asia/Kolkata', new Date('2026-12-15T12:00:00Z')), 5.5);
});
test('times are ordered and Makkah Isha is Maghrib + 90 min', () => {
  const t = k.prayerTimes({ ...SLC, method: 'Makkah', date: new Date('2026-10-19T18:00:00Z') });
  const order = k.PRAYERS.map((p) => mins(t[p]));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.equal(mins(t.isha) - mins(t.maghrib), 90);
});
test('bad input is rejected clearly', () => {
  assert.throws(() => k.prayerTimes({ lat: 'x', lon: 0 }), TypeError);
  assert.throws(() => k.prayerTimes({ lat: 70, lon: 20 }), RangeError);
});
test('nextPrayer skips sunrise and rolls over to tomorrow after Isha', () => {
  const a = k.nextPrayer({ ...SLC, now: new Date('2026-10-19T20:00:00Z') }); // 14:00 MDT
  assert.equal(a.prayer, 'asr'); assert.equal(a.ar, 'العصر');
  const b = k.nextPrayer({ ...SLC, now: new Date('2026-10-20T03:00:00Z') }); // 21:00 MDT
  assert.equal(b.prayer, 'fajr'); assert.equal(b.tomorrow, true); assert.ok(b.inMinutes > 500 && b.inMinutes < 620);
});
test('qibla bearings match published values', () => {
  assert.ok(Math.abs(k.qibla(40.7608, -111.891).bearing - 28.5) < 0.2);  // Salt Lake City
  assert.ok(Math.abs(k.qibla(40.7128, -74.006).bearing - 58.5) < 0.2);   // New York
  assert.equal(k.qibla(40.7128, -74.006).compassAr, 'شمال شرق');
  assert.ok(Math.abs(k.distanceToKaabaKm(40.7128, -74.006) - 10300) < 150);
});
test('Hijri date (Umm al-Qura) in both languages', () => {
  const h = k.hijriDate(new Date('2026-10-19T18:00:00Z'), { timeZone: 'America/Denver' });
  assert.equal(h.year, 1448); assert.equal(h.month, 5); assert.match(h.ar, /جمادى الأولى ١٤٤٨ هـ$/);
  assert.equal(k.isRamadan(new Date('2027-02-20T12:00:00Z')), true);
});
test('Arabic normalization unifies spelling variants and digits', () => {
  assert.equal(k.normalizeArabic('إسْعَاف'), k.normalizeArabic('اسعاف'));
  assert.equal(k.normalizeArabic('مستشفى'), k.normalizeArabic('مستشفي'));
  assert.equal(k.normalizeArabic('الصيدلية'), k.normalizeArabic('الصيدليه'));
  assert.equal(k.toLatinDigits('١٨:٤١'), '18:41'); assert.equal(k.toArabicDigits('911'), '٩١١');
  assert.equal(k.hasArabic('hello'), false); assert.equal(k.hasArabic('hello مرحبا'), true);
  assert.equal(k.stripBidi(k.isolate('911')), '911');
});
test('bilingual SSML tags only the Arabic runs and escapes XML', () => {
  const s = k.bilingualSSML('Maghrib <today> is 18:41. المغرب الساعة ١٨:٤١');
  assert.match(s, /^<speak>Maghrib &lt;today&gt; is 18:41\. <lang xml:lang="ar-SA">المغرب الساعة ١٨:٤١<\/lang><\/speak>$/);
});
test('phrasebook finds the right sentence from English, MSA and dialect requests', () => {
  const cases = { 'my son is sick': 'sick_child', 'ابني مريض': 'sick_child', 'بنتي عندها حرارة': 'sick_daughter', 'وين الصيدليه': 'pharmacy',
    'is this halal': 'halal', 'I need an interpreter': 'interpreter', 'where is a mosque': 'mosque', 'call the police': 'police', 'open a bank account': 'bank_account' };
  for (const [q, id] of Object.entries(cases)) assert.equal(k.findPhrase(q)?.id, id, q);
  assert.equal(k.findPhrase('zzz'), null);
});
test('every phrase is complete and ids are unique', () => {
  const ids = new Set();
  for (const p of k.PHRASES) {
    assert.ok(p.en && p.ar && p.keywords.length && k.CATEGORIES.includes(p.category), p.id);
    assert.ok(k.hasArabic(p.ar) && !k.hasArabic(p.en), p.id);
    assert.ok(!ids.has(p.id), p.id); ids.add(p.id);
  }
  assert.ok(k.PHRASES.length >= 40);
});
