// Hijri (Umm al-Qura) dates through the ICU calendar built into Node and every modern browser. No tables to ship.
const MONTHS_EN = ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];
const MONTHS_AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
/** @returns {{year, month, day, monthEn, monthAr, en, ar}} for `date` as seen in `timeZone` (default UTC). */
export function hijriDate(date = new Date(), { timeZone = 'UTC' } = {}) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(date).map((x) => [x.type, x.value]));
  const year = parseInt(p.year, 10), month = parseInt(p.month, 10), day = parseInt(p.day, 10);
  const toAr = (n) => String(n).replace(/\d/g, (c) => '٠١٢٣٤٥٦٧٨٩'[c]);
  return { year, month, day, monthEn: MONTHS_EN[month - 1], monthAr: MONTHS_AR[month - 1],
    en: `${day} ${MONTHS_EN[month - 1]} ${year} AH`, ar: `${toAr(day)} ${MONTHS_AR[month - 1]} ${toAr(year)} هـ` };
}
/** True during Ramadan (month 9). */
export const isRamadan = (date, opts) => hijriDate(date, opts).month === 9;
