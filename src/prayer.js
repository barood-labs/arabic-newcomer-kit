// Prayer times computed locally: no API, no key, no network. Standard astronomical method
// (the same math as praytimes.org). Works with a numeric UTC offset or an IANA time zone (DST-aware).
export const METHODS = {
  ISNA: { fajr: 15, isha: 15, name: 'Islamic Society of North America' },
  MWL: { fajr: 18, isha: 17, name: 'Muslim World League' },
  Egypt: { fajr: 19.5, isha: 17.5, name: 'Egyptian General Authority of Survey' },
  Makkah: { fajr: 18.5, ishaMinutes: 90, name: 'Umm al-Qura, Makkah' },
  Karachi: { fajr: 18, isha: 18, name: 'University of Islamic Sciences, Karachi' },
};
export const PRAYERS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
export const PRAYER_NAMES_AR = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };

const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
function sun(jd) {
  const D = jd - 2451545.0, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360), e = 23.439 - 0.00000036 * D;
  const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - RA };
}
function julian(y, m, d) { if (m <= 2) { y -= 1; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }

/** UTC offset in hours of an IANA zone (e.g. "America/Denver") at a given instant. DST-aware. */
export function zoneOffsetHours(timeZone, date = new Date()) {
  const s = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' }).formatToParts(date).find((p) => p.type === 'timeZoneName').value;
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(s); if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) + Number(m[3] || 0) / 60);
}
/** The calendar date (y, m, d) of `date` as seen in `timeZone` (so "today" means today where the user is). */
function localYMD(date, timeZone) {
  if (!timeZone) return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).map((x) => [x.type, x.value]));
  return [Number(p.year), Number(p.month), Number(p.day)];
}
const hhmm = (h) => { const m = Math.round(fix(h, 24) * 60) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

/**
 * Prayer times for one day.
 * @param {object} o  { lat, lon, timeZone? (IANA) | tz? (hours), date?, method? ('ISNA'), asr? ('shafii' | 'hanafi') }
 * @returns {{fajr,sunrise,dhuhr,asr,maghrib,isha}} local clock times "HH:MM"
 */
export function prayerTimes({ lat, lon, tz, timeZone, date = new Date(), method = 'ISNA', asr = 'shafii' }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new TypeError('lat and lon must be numbers');
  if (Math.abs(lat) > 65) throw new RangeError('latitudes beyond ±65° need a high-latitude rule (not supported)');
  const M = METHODS[method] || METHODS.ISNA, shadow = asr === 'hanafi' ? 2 : 1;
  const offset = timeZone ? zoneOffsetHours(timeZone, date) : (tz ?? 0);
  const [y, mo, d] = localYMD(date, timeZone);
  const jd = julian(y, mo, d) - lon / (15 * 24);
  const mid = (t) => fix(12 - sun(jd + t / 24).eqt, 24);
  const angle = (a, t, ccw) => { const s = sun(jd + t / 24), z = mid(t); const v = (1 / 15) * deg(Math.acos((-Math.sin(rad(a)) - Math.sin(rad(s.decl)) * Math.sin(rad(lat))) / (Math.cos(rad(s.decl)) * Math.cos(rad(lat))))); return z + (ccw ? -v : v); };
  const asrT = (t) => { const s = sun(jd + t / 24); return angle(-deg(Math.atan(1 / (shadow + Math.tan(rad(Math.abs(lat - s.decl)))))), t, false); };
  const maghrib = angle(0.833, 18, false);
  const raw = { fajr: angle(M.fajr, 5, true), sunrise: angle(0.833, 6, true), dhuhr: mid(12) + 1 / 60, asr: asrT(13), maghrib, isha: M.ishaMinutes ? maghrib + M.ishaMinutes / 60 : angle(M.isha, 18, false) };
  const out = {};
  for (const k of PRAYERS) out[k] = hhmm(raw[k] + offset - lon / 15);
  return out;
}

/** The next prayer after `now` (sunrise is skipped), with minutes to go. Rolls over to tomorrow's Fajr after Isha. */
export function nextPrayer({ now = new Date(), ...o }) {
  const offset = o.timeZone ? zoneOffsetHours(o.timeZone, now) : (o.tz ?? 0);
  const local = new Date(now.getTime() + offset * 3600e3), nowMin = local.getUTCHours() * 60 + local.getUTCMinutes();
  const t = prayerTimes({ ...o, date: now });
  for (const k of PRAYERS) {
    if (k === 'sunrise') continue;
    const [h, m] = t[k].split(':').map(Number);
    if (h * 60 + m > nowMin) return { prayer: k, ar: PRAYER_NAMES_AR[k], time: t[k], inMinutes: h * 60 + m - nowMin };
  }
  const tm = prayerTimes({ ...o, date: new Date(now.getTime() + 86400e3) }); const [h, m] = tm.fajr.split(':').map(Number);
  return { prayer: 'fajr', ar: PRAYER_NAMES_AR.fajr, time: tm.fajr, inMinutes: 1440 - nowMin + h * 60 + m, tomorrow: true };
}
