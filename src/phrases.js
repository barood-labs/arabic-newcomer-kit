// Survival phrasebook for Arabic-speaking newcomers (English ⇄ Modern Standard Arabic).
// Short, polite, voice-friendly sentences a newcomer can show on a phone or have read aloud.
// Each entry: { id, category, en, ar, keywords: [...] }. Keywords mix English, Arabic and common dialect words.
import { normalizeArabic } from './arabic.js';

const P = (id, category, en, ar, keywords) => ({ id, category, en, ar, keywords });
export const PHRASES = [
  // health
  P('sick_child', 'health', 'My son is sick. He needs to see a doctor today.', 'ابني مريض. يحتاج أن يرى طبيبًا اليوم.', ['son', 'child', 'kid', 'sick', 'ابني', 'ولدي', 'طفلي', 'مريض']),
  P('sick_daughter', 'health', 'My daughter is sick. She needs to see a doctor today.', 'ابنتي مريضة. تحتاج أن ترى طبيبًا اليوم.', ['daughter', 'girl', 'ابنتي', 'بنتي', 'مريضة']),
  P('doctor', 'health', 'I need to see a doctor. Is there a clinic nearby?', 'أحتاج أن أرى طبيبًا. هل توجد عيادة قريبة؟', ['doctor', 'clinic', 'طبيب', 'دكتور', 'عيادة']),
  P('fever', 'health', 'He has had a high fever since last night.', 'لديه حرارة مرتفعة منذ الليلة الماضية.', ['fever', 'temperature', 'حرارة', 'حمى', 'سخونة']),
  P('pain', 'health', 'I have pain here.', 'أشعر بألم هنا.', ['pain', 'hurt', 'ache', 'ألم', 'يوجعني', 'وجع']),
  P('allergy', 'health', 'I am allergic to this medicine.', 'لدي حساسية من هذا الدواء.', ['allergy', 'allergic', 'حساسية']),
  P('pregnant', 'health', 'I am pregnant.', 'أنا حامل.', ['pregnant', 'pregnancy', 'حامل', 'حمل']),
  P('female_doctor', 'health', 'May I see a female doctor, please?', 'هل يمكنني أن أرى طبيبة من فضلك؟', ['female', 'woman doctor', 'طبيبة', 'دكتورة']),
  P('interpreter', 'health', 'I need an Arabic interpreter, please. I have the right to one for free.', 'أحتاج إلى مترجم عربي من فضلك. من حقي الحصول عليه مجانًا.', ['interpreter', 'translator', 'translate', 'مترجم', 'ترجمة']),
  P('pharmacy', 'health', 'Where is the nearest pharmacy?', 'أين أقرب صيدلية؟', ['pharmacy', 'drugstore', 'صيدلية', 'صيدليه']),
  P('prescription', 'health', 'I need to fill this prescription.', 'أريد صرف هذه الوصفة الطبية.', ['prescription', 'medicine', 'وصفة', 'روشتة', 'دواء']),
  P('insurance', 'health', 'Do you accept Medicaid?', 'هل تقبلون تأمين ميديكيد؟', ['insurance', 'medicaid', 'تأمين', 'ميديكيد']),
  // emergency
  P('emergency', 'emergency', 'Call 911. This is an emergency.', 'اتصل بالرقم 911. هذه حالة طارئة.', ['emergency', '911', 'ambulance', 'طوارئ', 'طارئة', 'إسعاف', 'اسعاف']),
  P('police', 'emergency', 'Please call the police.', 'من فضلك اتصل بالشرطة.', ['police', 'شرطة', 'بوليس']),
  P('lost_child', 'emergency', 'I cannot find my child. Please help me.', 'لا أجد طفلي. أرجوك ساعدني.', ['lost', 'missing', 'ضاع', 'مفقود', 'لا أجد']),
  P('address', 'emergency', 'My address is…', 'عنواني هو…', ['address', 'where i live', 'عنوان', 'عنواني']),
  // food
  P('halal', 'food', 'Is this halal? Does it contain pork or alcohol?', 'هل هذا حلال؟ هل يحتوي على لحم خنزير أو كحول؟', ['halal', 'pork', 'alcohol', 'حلال', 'خنزير', 'كحول']),
  P('gelatin', 'food', 'Does this have gelatin? Is it from pork?', 'هل يحتوي هذا على جيلاتين؟ هل هو من الخنزير؟', ['gelatin', 'جيلاتين']),
  P('vegetarian', 'food', 'Do you have a vegetarian option?', 'هل لديكم خيار نباتي؟', ['vegetarian', 'no meat', 'نباتي']),
  P('food_bank', 'food', 'Where is the nearest food bank?', 'أين أقرب بنك طعام؟', ['food bank', 'free food', 'pantry', 'بنك طعام', 'مساعدة غذائية']),
  // transport
  P('bus', 'transport', 'Does this bus go downtown? How much is the fare?', 'هل تذهب هذه الحافلة إلى وسط المدينة؟ كم الأجرة؟', ['bus', 'fare', 'downtown', 'باص', 'حافلة', 'أجرة']),
  P('stop', 'transport', 'Please tell me when we reach this stop.', 'من فضلك أخبرني عندما نصل إلى هذه المحطة.', ['stop', 'station', 'محطة', 'موقف']),
  P('directions', 'transport', 'How do I get to this address?', 'كيف أصل إلى هذا العنوان؟', ['directions', 'how do i get', 'كيف أصل', 'طريق']),
  P('taxi', 'transport', 'Please take me to this address.', 'من فضلك خذني إلى هذا العنوان.', ['taxi', 'uber', 'lyft', 'تاكسي', 'سيارة أجرة']),
  // housing
  P('rent', 'housing', 'Is the apartment still available? Are utilities included?', 'هل الشقة ما زالت متاحة؟ هل الفواتير مشمولة؟', ['apartment', 'rent', 'utilities', 'شقة', 'إيجار', 'ايجار']),
  P('repair', 'housing', 'The heating is not working. Can you send someone to fix it?', 'التدفئة لا تعمل. هل يمكنك إرسال شخص لإصلاحها؟', ['heating', 'heat', 'repair', 'broken', 'تدفئة', 'تصليح', 'خربان']),
  P('lease', 'housing', 'Can I have a copy of the lease, please?', 'هل يمكنني الحصول على نسخة من عقد الإيجار من فضلك؟', ['lease', 'contract', 'عقد']),
  // school
  P('school', 'school', 'I want to register my child for school.', 'أريد تسجيل طفلي في المدرسة.', ['school', 'register', 'enroll', 'مدرسة', 'تسجيل']),
  P('school_bus', 'school', 'Is there a school bus for my child?', 'هل توجد حافلة مدرسية لطفلي؟', ['school bus', 'حافلة مدرسية', 'باص المدرسة']),
  P('esl', 'school', 'Does the school have English-language support for my child?', 'هل توفر المدرسة دعمًا في اللغة الإنجليزية لطفلي؟', ['esl', 'ell', 'english support', 'دعم اللغة']),
  P('english', 'school', 'Where can I take free English classes?', 'أين يمكنني أخذ دروس إنجليزية مجانية؟', ['english class', 'learn english', 'دروس إنجليزية', 'انجليزي', 'إنجليزي']),
  // work
  P('job', 'work', 'Are you hiring? I would like to apply.', 'هل لديكم وظائف شاغرة؟ أود التقديم.', ['job', 'hiring', 'work', 'وظيفة', 'شغل', 'عمل']),
  P('experience', 'work', 'I have experience as a…', 'لدي خبرة في العمل كـ…', ['experience', 'خبرة']),
  P('paycheck', 'work', 'When is payday?', 'متى موعد صرف الراتب؟', ['payday', 'salary', 'pay', 'راتب', 'معاش']),
  // documents and services
  P('ssn', 'documents', 'I need to apply for a Social Security number.', 'أحتاج إلى التقدم بطلب للحصول على رقم ضمان اجتماعي.', ['social security', 'ssn', 'ضمان اجتماعي']),
  P('id_card', 'documents', 'How can I get a state ID card?', 'كيف أحصل على بطاقة هوية من الولاية؟', ['id', 'identity', 'هوية', 'بطاقة']),
  P('case_worker', 'documents', 'I would like to speak with my case worker.', 'أود التحدث مع الأخصائي الاجتماعي المسؤول عن ملفي.', ['case worker', 'caseworker', 'agency', 'أخصائي', 'منظمة']),
  P('form_help', 'documents', 'Can you help me fill out this form?', 'هل يمكنك مساعدتي في تعبئة هذا النموذج؟', ['form', 'fill out', 'application', 'نموذج', 'استمارة']),
  P('repeat', 'everyday', 'Could you say that again more slowly, please?', 'هل يمكنك تكرار ذلك ببطء أكثر من فضلك؟', ['repeat', 'slowly', 'again', 'كرر', 'ببطء']),
  P('write_down', 'everyday', 'Could you write that down for me, please?', 'هل يمكنك كتابة ذلك لي من فضلك؟', ['write', 'write down', 'اكتب']),
  // money
  P('bank_account', 'money', 'I would like to open a bank account.', 'أود فتح حساب مصرفي.', ['bank', 'account', 'بنك', 'حساب']),
  P('cash', 'money', 'Can I pay in cash?', 'هل يمكنني الدفع نقدًا؟', ['cash', 'pay', 'نقدا', 'كاش']),
  // community
  P('mosque', 'community', 'Is there a mosque near here?', 'هل يوجد مسجد قريب من هنا؟', ['mosque', 'masjid', 'jummah', 'مسجد', 'جامع']),
  P('prayer_room', 'community', 'Is there a quiet place where I can pray?', 'هل يوجد مكان هادئ يمكنني الصلاة فيه؟', ['pray', 'prayer room', 'صلاة', 'مصلى']),
  P('thanks', 'everyday', 'Thank you so much for your help.', 'شكرًا جزيلًا على مساعدتك.', ['thank', 'thanks', 'شكرا', 'شكرًا']),
  P('dont_understand', 'everyday', 'Sorry, I do not understand. I speak Arabic.', 'عذرًا، لا أفهم. أنا أتحدث العربية.', ['understand', 'arabic', 'لا أفهم', 'ما فهمت']),
];
export const CATEGORIES = [...new Set(PHRASES.map((p) => p.category))];
const norm = (s) => normalizeArabic(s);
const INDEX = PHRASES.map((p) => ({ p, keys: p.keywords.map(norm) }));

/**
 * Best phrase for a free-text request in English or Arabic ("my son is sick", "ابني مريض", "وين الصيدلية").
 * Scores keyword hits (longer keywords weigh more); a child + sick request maps to sick_child / sick_daughter.
 * @returns {object|null} phrase entry plus `score`
 */
export function findPhrase(query = '') {
  const q = ` ${norm(query)} `;
  if (/(daughter|girl|ابنتي|بنتي)/.test(q) && /(sick|ill|fever|مريض|حراره)/.test(q)) return { ...PHRASES.find((p) => p.id === 'sick_daughter'), score: 99 };
  if (/(son|child|kid|baby|ابني|ولدي|طفلي)/.test(q) && /(sick|ill|fever|مريض|حراره)/.test(q)) return { ...PHRASES.find((p) => p.id === 'sick_child'), score: 99 };
  let best = null;
  for (const { p, keys } of INDEX) {
    const score = keys.reduce((s, k) => (q.includes(/^[a-z0-9 ]+$/.test(k) ? ` ${k}` : k) ? s + k.length : s), 0);
    if (score && (!best || score > best.score)) best = { ...p, score };
  }
  return best;
}
/** All phrases in a category ("health", "food", ...). */
export const byCategory = (c) => PHRASES.filter((p) => p.category === c);
