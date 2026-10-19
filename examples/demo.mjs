// node examples/demo.mjs  ->  what a newcomer voice assistant would say in Salt Lake City right now
import { prayerTimes, nextPrayer, qibla, hijriDate, findPhrase, bilingualSSML, toArabicDigits } from '../src/index.js';
const here = { lat: 40.7608, lon: -111.891, timeZone: 'America/Denver' };
const t = prayerTimes(here), n = nextPrayer(here), q = qibla(here.lat, here.lon), h = hijriDate(new Date(), { timeZone: here.timeZone });
console.log('Today:', h.en, '|', h.ar);
console.log('Prayer times:', t);
console.log(`Next: ${n.prayer} at ${n.time} (in ${n.inMinutes} min) | ${n.ar} الساعة ${toArabicDigits(n.time)}`);
console.log(`Qibla: ${q.bearing}° ${q.compass} | القبلة: ${toArabicDigits(q.bearing)}° ${q.compassAr}`);
const p = findPhrase('ابني مريض');
console.log('Phrase:', p.ar, '→', p.en);
console.log('SSML:', bilingualSSML(`Say this at the clinic: ${p.en} بالعربية: ${p.ar}`));
