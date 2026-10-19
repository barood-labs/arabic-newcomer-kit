// Small, dependency-free Arabic text helpers for search, voice and mixed-direction UI.
const TASHKEEL = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, TATWEEL = /\u0640/g;
/** Is there any Arabic-script letter in the string? */
export const hasArabic = (s = '') => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(s);
/** Remove harakat (short-vowel marks), Quranic marks and tatweel. */
export const stripTashkeel = (s = '') => s.replace(TASHKEEL, '').replace(TATWEEL, '');
/**
 * Normalize for matching (not for display): strip marks, unify alef forms (أ إ آ ٱ → ا), alef maqsura (ى → ي),
 * taa marbuta (ة → ه), hamza seats (ؤ → و, ئ → ي), Arabic-Indic and Persian digits → 0-9, lower-case Latin.
 * So "مستشفى" matches "مستشفي", "الصيدلية" matches "الصيدليه", "إسعاف" matches "اسعاف".
 */
export function normalizeArabic(s = '') {
  return stripTashkeel(s).replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x6F0))
    .toLowerCase().replace(/\s+/g, ' ').trim();
}
/** 0-9 → ٠-٩ */
export const toArabicDigits = (s) => String(s).replace(/[0-9]/g, (c) => '٠١٢٣٤٥٦٧٨٩'[c]);
/** ٠-٩ / ۰-۹ → 0-9 */
export const toLatinDigits = (s) => String(s).replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x6F0));
/** Wrap text in Unicode First-Strong-Isolate marks so an English word, number or address can't scramble an Arabic sentence (and vice versa). */
export const isolate = (s) => `\u2068${s}\u2069`;
/** Strip bidi control characters (before TTS or before comparing strings). */
export const stripBidi = (s = '') => s.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
/**
 * Build SSML that switches voice language per run of script, so a TTS voice reads "Maghrib is at 18:52"
 * and "المغرب الساعة ١٨:٥٢" correctly in one response. Uses <lang xml:lang>, supported by most SSML engines.
 */
export function bilingualSSML(text, { ar = 'ar-SA', en = 'en-US' } = {}) {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const runs = stripBidi(text).match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:[\s\d٠-٩:.,،؟!-]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*|[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g) || [];
  return `<speak>${runs.map((r) => (hasArabic(r) ? `<lang xml:lang="${ar}">${esc(r)}</lang>` : esc(r))).join('')}</speak>`;
}
