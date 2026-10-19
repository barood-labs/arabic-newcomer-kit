# arabic-newcomer-kit · عُدّة الوافد العربي

Zero-dependency JavaScript toolkit for apps, MCP servers and voice assistants that serve **Arabic-speaking newcomers**
(refugees, immigrants, students) in English-speaking countries.

Everything runs **offline**: no API keys, no network calls, no data leaves the device. MIT licensed.

| Module | What it gives you |
|---|---|
| `prayerTimes`, `nextPrayer` | The five daily prayers plus sunrise for any lat/lon. Takes an IANA time zone, so DST is handled. Methods: ISNA, MWL, Egypt, Makkah (Umm al-Qura), Karachi. Asr can be Shafi'i or Hanafi. Matches aladhan.com to within 1–2 minutes. |
| `qibla`, `distanceToKaabaKm` | Great-circle bearing to the Kaaba, with an English and an Arabic compass word. |
| `hijriDate`, `isRamadan` | Umm al-Qura Hijri date in English and Arabic (Arabic-Indic digits), using the ICU calendar already in Node and browsers. |
| `normalizeArabic`, `stripTashkeel`, `hasArabic` | Matching-grade normalization: alef forms, ى/ي, ة/ه, hamza seats, harakat, tatweel, and Arabic-Indic or Persian digits. So "إسعاف" matches "اسعاف" and "الصيدليه" matches "الصيدلية". |
| `bilingualSSML`, `isolate`, `stripBidi` | Mixed Arabic/English output that neither breaks the screen nor gets mispronounced. `bilingualSSML` wraps each Arabic run in `<lang xml:lang="ar-SA">` for TTS. `isolate` adds Unicode FSI/PDI so numbers and English words can't scramble an RTL sentence. |
| `PHRASES`, `findPhrase`, `byCategory` | 46 short, polite survival sentences (EN ⇄ MSA), covering health, emergency, food, transport, housing, school, work, documents, money and community. `findPhrase` understands English, MSA and common dialect wording ("وين الصيدليه", "بنتي عندها حرارة"). |

## Why

A family in their first week in Salt Lake City or Dearborn asks the same few questions: *when is Maghrib, which way is
the qibla, is this halal, how do I tell the pharmacist my son is sick?* Most prayer-time and phrasebook code is locked
inside apps or behind paid APIs. Generic i18n libraries don't cover Arabic search normalization or bilingual
speech either. This kit puts those small, well-tested pieces in one place so any app can use them.

It was extracted from and is used by **[Jisr · جسر](https://github.com/baroodstore1-ai/jisr-alexa)**, a bilingual
Alexa+ MCP server for newcomer families.

## Install

```bash
npm install github:baroodstore1-ai/arabic-newcomer-kit
```
Node ≥ 20 (needs `Intl` with full ICU, which is the default build). Also runs in modern browsers as an ES module.

## Use

```js
import { prayerTimes, nextPrayer, qibla, hijriDate, findPhrase, bilingualSSML } from 'arabic-newcomer-kit';

const slc = { lat: 40.7608, lon: -111.891, timeZone: 'America/Denver' };
prayerTimes(slc);            // { fajr: '06:28', sunrise: '07:43', dhuhr: '13:13', asr: '16:14', maghrib: '18:41', isha: '19:56' }
prayerTimes({ ...slc, method: 'MWL', asr: 'hanafi' });
nextPrayer(slc);             // { prayer: 'asr', ar: 'العصر', time: '16:14', inMinutes: 134 }
qibla(slc.lat, slc.lon);     // { bearing: 28.5, compass: 'NE', compassAr: 'شمال شرق' }
hijriDate(new Date(), { timeZone: slc.timeZone }).ar;   // '٨ جمادى الأولى ١٤٤٨ هـ'

findPhrase('ابني مريض');      // { id: 'sick_child', en: 'My son is sick. He needs to see a doctor today.', ar: 'ابني مريض. يحتاج أن يرى طبيبًا اليوم.', ... }
bilingualSSML('Maghrib is at 18:41. المغرب الساعة ١٨:٤١');
// <speak>Maghrib is at 18:41. <lang xml:lang="ar-SA">المغرب الساعة ١٨:٤١</lang></speak>
```

Run `npm run demo` to see what a voice assistant would say right now in Salt Lake City.

## Accuracy and limits

- Prayer times use the standard astronomical formulas (as on praytimes.org). The tests check them against aladhan.com
  for Salt Lake City (ISNA, Shafi'i) and Dearborn (ISNA, Hanafi). Local mosques often publish their own timetable,
  so treat these values as a guide and defer to the local masjid.
- Latitudes beyond ±65° throw a `RangeError`, because they need a high-latitude rule that isn't implemented yet.
- Hijri dates follow the Umm al-Qura calendar. Communities that rely on local moon sighting can be a day off.
- Phrases are in Modern Standard Arabic so speakers of every dialect can read them. They're no substitute for a professional
  interpreter in medical or legal settings, which is why the kit includes the `interpreter` phrase. In the US,
  hospitals that take federal funds must provide one free of charge.

## Test

```bash
npm test   # node:test, 12 suites: reference times, DST, Hanafi, ordering, qibla, Hijri, normalization, SSML, phrasebook
```

## Contributing

Corrections from native speakers, more phrases, and more calculation methods (Tehran, Jafari, high-latitude rules)
are all welcome. Please add a test with each change.

## Support

If this helped you, you can support Satr Tools on Solana: `EkyuoGVxpdf2rjywLh7TUyvkkerj15f4MXnsj2mpKpvA`

## License

MIT © 2026 Satr Tools
