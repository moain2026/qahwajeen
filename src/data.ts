import { IMG_META } from './imgmeta'
const capOf = (n: string) => IMG_META[n]?.cap ?? n
/**
 * Content layer — single source of truth for brand, services & menu.
 * Contact details below are the owner's official, live channels.
 */

/* ── Brand & contact ──────────────────────────────────────── */
export const BRAND = {
  name: 'القهوة الملكية',
  latin: 'ROYAL COFFEE',
  tagline: 'ضيافة عربية بمعايير ملكية',
  // ── Live contact (STC) — one number for call + WhatsApp ──
  phoneRaw: '966504968113',
  phoneDisplay: '050 496 8113',
  phoneLocal: '0504968113',
  whatsapp: 'https://wa.me/966504968113',
  // ── Official email (the only other public channel) ──
  email: 'qahwajeen@gmail.com',
} as const

/** Real social accounts only — empty until the owner supplies verified URLs.
 *  Anything added here appears in the footer, /links and JSON-LD sameAs. */
export const SOCIAL_LINKS: { label: string; href: string }[] = []

/** Date the indexable content was last edited — used as <lastmod> in the
 *  sitemap. Update it when page copy changes (never "today" on every request). */
export const CONTENT_DATE = '2026-10-18'

/**
 * Conversion tracking. Leave IDs empty and NOTHING third-party is loaded —
 * clicks are still pushed to window.dataLayer. Fill them in to switch on
 * GA4 / Google Ads (with Consent Mode v2 defaults set before gtag loads).
 */
export const TRACKING = {
  ga4: '', //            e.g. 'G-XXXXXXXXXX'
  ads: '', //            e.g. 'AW-123456789'
  adsCallLabel: '', //   conversion label for click_call
  adsWhatsappLabel: '', // conversion label for click_whatsapp
  adsBookingLabel: '', // conversion label for booking_submit
} as const

/**
 * Search-engine ownership + instant indexing.
 * - googleVerify / bingVerify: paste only the content="" value of the
 *   <meta> tag that Search Console / Bing Webmaster gives you
 *   (HTML-tag method: no DNS change needed). Empty = tag not emitted.
 * - indexNowKey: public by design (served at /{key}.txt). Bing, Yandex,
 *   Seznam and Naver read it to accept URL pings — see qa/scripts/indexnow.py.
 */
export const SEARCH = {
  googleVerify: '',
  bingVerify: '',
  indexNowKey: '18a197b2799047c6ef3caf1c86c0a2cc',
} as const

/**
 * Visibility switches. Everything stays in the code; flip a flag to
 * bring it back. While a flag is false the item is removed from the
 * HTML, the sitemap and the structured data (no dead/fake signals).
 */
export const SHOW = {
  /** email address in footer, /links page and JSON-LD */
  email: true,
  /** partner logos — hidden: no written client consent on file */
  partners: false,
  /** sample testimonials — keep hidden until real client reviews arrive
   *  (Google treats invented reviews as spam; never emit them as schema) */
  reviews: false,
} as const



/** Header desktop nav (kept short, high-intent). */

/* ── Services ─────────────────────────────────────────────── */
export type Service = {
  slug: string
  title: string
  h1: string
  short: string
  desc: string
  img: string
  gal: string[]
  icon: string
  badge: string
  points: string[]
  includes: { t: string; d: string }[]
}

export const SERVICES: Service[] = [
  {
    slug: 'qahwajiin',
    title: 'ضيافة الرجال',
    h1: 'قهوجيين ومباشرين لضيافة الرجال',
    short: 'قهوجيين ومباشرين بزيٍّ موحّد وحضور منظّم',
    desc:
      'فريق من القهوجيين والمباشرين المدرَّبين على أصول الضيافة السعودية، بزيٍّ موحّد أنيق وحضورٍ منظّم لا يُخطئ الموعد. نتولّى استقبال الضيوف عند الباب، صبّ القهوة العربية والشاي بالدلال النحاسية، وتقديم التمور والحلى على الصواني — بانسيابيةٍ تامة ودون أي تدخّلٍ منك. المباشر يدير مسار الخدمة ويوزّع الفريق حتى لا ينتظر ضيفٌ فنجاله.',
    img: 'qahwajiin-team-uniform-reception-hall',
    gal: ['qahwajiin-team-uniform-reception-hall', 'two-qahwajiin-coffee-booth-dallah-dates', 'qahwaji-serving-coffee-exhibition-hall', 'qahwaji-embroidered-daglah-pouring-coffee-vip-lounge', 'qahwaji-holding-dallah-corporate-event', 'outdoor-tea-coffee-table-dallah-glass-cups'],
    icon: 'servers',
    badge: 'الأكثر طلباً',
    points: ['زي موحّد مكويّ وفاخر', 'مباشر لتنظيم الصفوف', 'صبّ مستمر دون انتظار', 'إشراف ميداني كامل'],
    includes: [
      { t: 'قهوجي لكل ٣٠ ضيفاً', d: 'نحسب عدد الفريق على أساس عدد ضيوفك، لا على أساس ما يوفّره جدولنا.' },
      { t: 'مباشر مسؤول', d: 'فردٌ واحد يدير المسار من الاستقبال حتى آخر فنجال، ويكون نقطة تواصلك الوحيدة.' },
      { t: 'دلال نحاسية مصقولة', d: 'عدّة كاملة تُصقل وتُعقَّم قبل كل مناسبة — دلال، صواني، فناجيل، ترامس.' },
      { t: 'قهوة تُحضَّر في الموقع', d: 'قهوة عربية بالهيل والزعفران على النار، ساخنة طوال المناسبة لا من ترمسٍ بارد.' },
    ],
  },
  {
    slug: 'qahwajiat',
    title: 'ضيافة النساء',
    h1: 'قهوجيات وصبابات للمناسبات النسائية',
    short: 'طاقم نسائي كامل بخصوصية تامة',
    desc:
      'طاقم نسائي مستقل بالكامل من القهوجيات والصبابات المدرَّبات، يخدم الأعراس والملكات وحفلات التخرّج والمناسبات النسائية. حضورٌ هادئ وراقٍ، تنسيق أنيق لطاولة الاستقبال بسقيا زمزم الذهبية والزهور، وتقديم القهوة والشاي والعصائر الطازجة — مع التزامٍ صريح بالخصوصية ودون أي حضورٍ ذكوري داخل مكان المناسبة.',
    img: 'four-female-hostesses-black-uniform',
    gal: ['four-female-hostesses-black-uniform', 'two-female-hostesses-black-suits', 'three-female-hostesses-white-floral-dresses', 'women-reception-zamzam-jugs-flowers', 'henna-artist-hand-design-saudi-emblem', 'guest-giveaways-wrapped-sweets-table'],
    icon: 'sparkle',
    badge: 'خصوصية تامة',
    points: ['طاقم نسائي بالكامل', 'تنسيق طاولة الاستقبال', 'عصائر ومشروبات باردة', 'خصوصية تامة'],
    includes: [
      { t: 'صبابات وقهوجيات', d: 'فريق نسائي مدرَّب على التقديم الراقي وترتيب الصفوف دون ضجيج.' },
      { t: 'طاولة استقبال بسقيا زمزم', d: 'طاولة استقبال بجرار سقيا زمزم الذهبية والفناجيل والزهور الطبيعية بألوان مناسبتك.' },
      { t: 'خصوصية بلا استثناء', d: 'دخول وخروج الفريق مُرتَّب مسبقاً، ولا تصوير ولا حضور ذكوري داخل القاعة.' },
      { t: 'مشروبات باردة طازجة', d: 'عصائر طبيعية، موهيتو، كركديه وسوبيا تُجهَّز في الموقع وتُقدَّم مثلّجة.' },
    ],
  },
  {
    slug: 'zamzam',
    title: 'سقيا زمزم',
    h1: 'سقيا ماء زمزم وسقّاء زمزم للمناسبات',
    short: 'جرار سقيا ذهبية وسقّاء يقدّم زمزم المبرّد لضيوفك',
    desc:
      'سقيا ماء زمزم المبرّد للأعراس ومجالس العزاء والاستقبالات والمؤتمرات: جرار سقيا ذهبية على حوامل مع طاسات الشرب، تُنسَّق عند المدخل أو على طاولة الاستقبال، وسقّاء بزيٍّ رسمي يمرّ على الضيوف بهدوءٍ واحترام ويعيد التعبئة قبل أن تفرغ الجرّة. الأدوات تُعقَّم قبل كل مناسبة، وتتوفّر أكواب مغلّفة فردياً عند الطلب.',
    img: 'golden-zamzam-jugs-stands-flowers',
    gal: ['golden-zamzam-jugs-stands-flowers', 'golden-zamzam-jugs-cups-set', 'golden-zamzam-jug-stand-marble', 'women-reception-zamzam-jugs-flowers', 'brass-zamzam-jugs-collection', 'qahwajiin-team-uniform-reception-hall'],
    icon: 'water',
    badge: 'معقّم بالكامل',
    points: ['جرار سقيا ذهبية بطاساتها', 'سقّاء متجوّل بزي رسمي', 'زمزم مبرّد طوال المناسبة', 'أدوات معقّمة قبل كل حجز'],
    includes: [
      { t: 'ماء زمزم مبرّد', d: 'يُقدَّم مبرَّداً على الدرجة المناسبة طوال المناسبة.' },
      { t: 'طاسات وأكواب نظيفة', d: 'طاسات الشرب تُعقَّم قبل المناسبة، وتتوفّر أكواب مغلّفة فردياً لمن يطلبها.' },
      { t: 'سقّاء متجوّل', d: 'يمرّ على الصفوف بهدوء ويعيد التزويد قبل نهاية الكوب، دون قطع مجلس أحد.' },
      { t: 'جرار سقيا ذهبية', d: 'جرار ذهبية ونحاسية على حوامل ثلاثية مع طاسات الشرب — تُنسَّق مع الزهور عند المدخل.' },
    ],
  },
  {
    slug: 'offerings',
    title: 'التمور والحلى',
    h1: 'تمور محشية وحلى قهوة وشرقيات',
    short: 'تمور محشية، حلى قهوة، وشرقيات بالقطر',
    desc:
      'تشكيلة مختارة من التمور المحشية بالمكسّرات — خلاص، سكري، عجوة — مع حلى القهوة، المعمول، البقلاوة والكنافة، ومحطة حلى متكاملة إن رغبت. كل صينية مرتّبة بتقسيمٍ متناسق يليق بضيوفك، وتُعاد تعبئتها كلما نقصت دون أن تُضطر للتنبيه.',
    img: 'dessert-buffet-creme-caramel-petit-fours',
    gal: ['dessert-buffet-creme-caramel-petit-fours', 'stuffed-dates-three-trays', 'pistachio-baklava-golden-platter', 'kunafa-pistachio-cheese', 'decorated-dates-golden-tray', 'fruit-platters-baklava-gold-stands'],
    icon: 'dates',
    badge: 'تشكيلة واسعة',
    points: ['تمور محشية فاخرة', 'حلى قهوة منوّع', 'شرقيات بالقطر', 'محطة حلى كاملة'],
    includes: [
      { t: 'تمور بثلاث درجات', d: 'خلاص، سكري ومجدول — محشية باللوز أو الفستق أو مجروشة بالقرفة والسمسم.' },
      { t: 'حلى قهوة مصغّر', d: 'أحجام صغيرة تُؤكل بيدٍ واحدة مع الفنجال، لا حلى ثقيل يقطع مسار الضيافة.' },
      { t: 'محطة حلى مُنسَّقة', d: 'طاولة حلى بارتفاعاتٍ متدرّجة وإضاءة دافئة، تصلح خلفيةً للصور.' },
      { t: 'إعادة تعبئة تلقائية', d: 'الفريق يراقب الصواني ويعيد تعبئتها قبل أن تفرغ — دون طلبٍ منك.' },
    ],
  },
  {
    slug: 'buffet',
    title: 'البوفيه والمداخل',
    h1: 'بوفيه مقبلات ومداخل وأكلات شعبية',
    short: 'مقبلات، ساندويتشات، معجنات وبوفيه متكامل',
    desc:
      'بوفيه بارد وساخن يُنسَّق على الموقع: مقبلات مصغّرة، ساندويتشات مُقطَّعة، معجنات وفطائر، فواكه منسّقة، وأكلات شعبية سعودية على الطريقة الأصيلة. طاقم تقديمٍ وتنسيقِ طاولات يرتّب الارتفاعات والألوان بحيث تبدو الطاولة صورةً قبل أن تكون طعاماً.',
    img: 'saudi-popular-food-khamir-bread-honey',
    gal: ['saudi-popular-food-khamir-bread-honey', 'saudi-popular-food-pots-sadu-table', 'saudi-popular-food-nuts-traditional-bread', 'heritage-sadu-buffet-booth-night', 'pastry-buffet-tiered-wooden-stands', 'assorted-canapes-slate-board'],
    icon: 'tray',
    badge: 'بوفيه متكامل',
    points: ['مقبلات وكانابيه', 'ساندويتشات ومعجنات', 'فواكه منسّقة', 'طاقم تقديم وتنسيق'],
    includes: [
      { t: 'تنسيق بارتفاعات', d: 'الطاولة تُبنى على ثلاث طبقات ارتفاع مع فواصل زهور — لا صفوفٌ مسطّحة.' },
      { t: 'بارد وساخن معاً', d: 'شافنج ديش للساخن وقواعد مبرّدة للبارد، فلا يفقد صنفٌ حرارته المطلوبة.' },
      { t: 'أصناف بيدٍ واحدة', d: 'معظم الأصناف مصغّرة تُؤكل واقفاً — مناسبة للاستقبال والمؤتمرات.' },
      { t: 'رفع وتنظيف بعد المناسبة', d: 'الفريق يرفع كل ما يتعلق بالبوفيه ويترك المكان نظيفاً كما وجده.' },
    ],
  },
  {
    slug: 'equipment',
    title: 'العدة واللوازم',
    h1: 'تأجير عدة الضيافة والدلال النحاسية',
    short: 'دلال ومباخر وصواني وحاملات مذهّبة',
    desc:
      'تأجير عدة الضيافة الكاملة: دلال نحاسية منقوشة، حاملات فناجيل مذهّبة، صواني، فناجيل بورسلين وزجاج، أطقم شاي، مباخر عود، ترامس ومناضد. كل قطعة تُصقل وتُعقَّم وتُصوَّر قبل التسليم، وتُسلَّم في صناديق مبطّنة — سواء طلبتها مع الفريق أو منفصلة.',
    img: 'golden-dallah-arabic-coffee-pot',
    gal: ['golden-dallah-arabic-coffee-pot', 'gold-glass-cup-stand-multi-tier', 'white-coffee-finjans-emblem-gold-tray', 'golden-mabkhara-heritage-sweets-table', 'glass-cups-palm-motif-gold-tray', 'two-gold-cup-stands-table'],
    icon: 'mabkhara',
    badge: 'مصقول ومعقّم',
    points: ['دلال نحاسية منقوشة', 'حاملات وفناجيل مذهّبة', 'أطقم شاي ومباخر', 'تعقيم قبل كل حجز'],
    includes: [
      { t: 'دلال بأحجام متعدّدة', d: 'من الدلّة الصغيرة للمجلس إلى الدلّة الاحتفالية الكبيرة للاستقبال.' },
      { t: 'حاملات فناجيل مذهّبة', d: 'حاملات متعدّدة الطوابق تحفظ ترتيب الفناجيل وتمنع الفوضى على الطاولة.' },
      { t: 'تعقيم قبل كل حجز', d: 'كل قطعة تُغسل وتُعقَّم وتُغلَّف — ونرسل لك صور العدّة قبل الخروج إن طلبت.' },
      { t: 'تأجير منفصل متاح', d: 'يمكنك استئجار العدّة وحدها إن كان لديك طاقمك الخاص.' },
    ],
  },
  {
    slug: 'royal',
    title: 'الضيافة الملكية',
    h1: 'السوّاس والدقلة المطرّزة للضيافة الملكية',
    short: 'إبريق السوّاس الذهبي وطاقم بالدقلة المطرّزة لكبار الضيوف',
    desc:
      'أرقى ما نقدّمه للاستقبالات الكبرى: إبريق السوّاس الذهبي المنقوش بتاجه المتدلّي من الخرز الأزرق، يقدّم منه السوّاس المشروب بأسلوبٍ استعراضي يلفت أنظار الضيوف، مع قهوجيين بدقلاتٍ سوداء مطرّزة بالفضي، وتبخير الضيوف بالمبخرة الذهبية عند المدخل، وسقيا زمزم بالجرار الذهبية. تفاصيل تصنع الانطباع الأول وتظهر في كل صورة.',
    img: 'sawas-ornate-golden-vessel-blue-beads',
    gal: ['sawas-ornate-golden-vessel-blue-beads', 'two-qahwajiin-embroidered-daglah-dates-tray', 'qahwaji-embroidered-daglah-pouring-coffee-vip-lounge', 'sawas-golden-vessel-engraved', 'host-golden-mabkhara-incense-entrance', 'sawas-golden-vessel-closeup'],
    icon: 'crown',
    badge: 'الأفخم عندنا',
    points: ['إبريق السوّاس الذهبي', 'دقلات مطرّزة لكبار الضيوف', 'تبخير الضيوف عند المدخل', 'سقيا زمزم بالجرار الذهبية'],
    includes: [
      { t: 'السوّاس وإبريقه الذهبي', d: 'إبريق ذهبي منقوش بتاج من الخرز الأزرق، يُصبّ منه المشروب بأسلوب استعراضي أمام الضيوف.' },
      { t: 'دقلة مطرّزة وتبخير', d: 'قهوجيون بدقلات سوداء مطرّزة بالفضي، ومستقبِل يبخّر الضيوف بالمبخرة الذهبية عند الباب.' },
      { t: 'سقيا زمزم الذهبية', d: 'جرار سقيا ذهبية على حوامل بطاساتها، تُنسَّق مع الزهور على طاولة الاستقبال.' },
      { t: 'تركيب وتفكيك', d: 'فريقٌ مختصّ ينقل ويركّب ويفكّك القطع بأمان — لا مسؤولية عليك.' },
    ],
  },
  {
    slug: 'extras',
    title: 'إضافات المناسبة',
    h1: 'خيام ومجالس وكوش تصوير وحنّاية وتوزيعات',
    short: 'خيام شعبية، كوش تصوير فوري، حنّاية وتوزيعات',
    desc:
      'كل ما يحوّل المناسبة من ضيافةٍ إلى تجربة: خيام ومجالس شعبية بالسدو والمخدّات، كوش تصوير فوري (Photo Booth) مع طباعة لحظية وسجادة حمراء، حنّاية محترفة للمناسبات النسائية، وتوزيعات مُغلَّفة بأسماء الضيوف. تُطلَب مع الضيافة أو منفصلة.',
    img: 'bedouin-tent-majlis-sadu-cushions',
    gal: ['heritage-sadu-buffet-booth-night', 'bedouin-tent-majlis-sadu-cushions', 'mirror-photo-booth-red-carpet-printer', 'henna-artist-station-heritage-tent', 'henna-artist-hand-design-saudi-emblem', 'guest-giveaways-wrapped-sweets-table'],
    icon: 'tent',
    badge: 'تجربة كاملة',
    points: ['خيام ومجالس شعبية', 'كوش تصوير فوري', 'حنّاية محترفة', 'توزيعات مُغلَّفة'],
    includes: [
      { t: 'مجلس شعبي بالسدو', d: 'خيمة أو قعدة أرضية بالسدو والمخدّات والفوانيس — داخلية أو خارجية.' },
      { t: 'كوش تصوير فوري', d: 'مرآة تصوير تفاعلية مع طباعة لحظية، إضاءة حلقية وسجادة حمراء وحبل ذهبي.' },
      { t: 'حنّاية محترفة', d: 'نقش حنّاء بتصاميم خليجية وهندية، بأدواتٍ فردية معقّمة، للمناسبات النسائية.' },
      { t: 'توزيعات بأسماء الضيوف', d: 'تمور أو حلى في علبٍ مُغلَّفة بشريط وبطاقة تحمل اسم الضيف.' },
    ],
  },
]

/* ── Occasions (each becomes an indexable page) ───────────── */
export type Occasion = {
  slug: string
  title: string
  h1: string
  d: string
  icon: string
  img: string
  desc: string
  needs: string[]
  services: string[]
}

export const OCCASIONS: Occasion[] = [
  {
    slug: 'weddings',
    title: 'أعراس وملكات',
    h1: 'ضيافة الأعراس والملكات',
    d: 'ضيافة كاملة لليلة العمر',
    icon: 'crown',
    img: 'two-qahwajiin-embroidered-daglah-dates-tray',
    desc:
      'ليلة العمر لا تُدار بالحسّ، تُدار بجدول. نصل قبل الموعد، نجهّز سقيا زمزم الذهبية والتبخير في المدخل، نوزّع القهوجيين على المسارات، ونضبط توقيت الحلى مع دخول العروسين. طاقم رجالي ونسائي مستقل، ومباشرٌ واحد يمسك الخطّ من الاستقبال حتى الوداع.',
    needs: ['سقيا زمزم وتبخير في المدخل', 'طاقم نسائي مستقل', 'محطة حلى وتمور', 'توزيعات بأسماء الضيوف'],
    services: ['royal', 'qahwajiat', 'qahwajiin', 'offerings'],
  },
  {
    slug: 'condolences',
    title: 'مجالس العزاء',
    h1: 'ضيافة مجالس العزاء والفواتح',
    d: 'حضور هادئ ومنظّم ومحترم',
    icon: 'crescent',
    img: 'golden-dallah-dates-white-finjan',
    desc:
      'في العزاء لا مكان للضجيج ولا للتأخير. نأتي بلا لمعان زائد: قهوة سادة وشاي وماء زمزم مبرّد، فريق بزيٍّ داكن يمرّ بهدوءٍ على الصفوف، وتزويدٌ مستمر لثلاثة أيام إن لزم. لا موسيقى، لا تصوير، لا نقاش في السعر أمام الضيوف.',
    needs: ['قهوة سادة وشاي', 'ماء زمزم مبرّد', 'فريق بزي داكن هادئ', 'تغطية عدة أيام'],
    services: ['qahwajiin', 'zamzam', 'equipment'],
  },
  {
    slug: 'corporate',
    title: 'مؤتمرات ومعارض',
    h1: 'الضيافة المؤسسية للمؤتمرات والمعارض',
    d: 'ضيافة مؤسسية بزي موحّد وعرض سعر مكتوب',
    icon: 'users',
    img: 'qahwaji-serving-coffee-exhibition-hall',
    desc:
      'الضيافة المؤسسية تُقاس بالانضباط: عرض سعر مكتوب، فريق بزيٍّ موحّد، ومسار خدمة مرسوم على مخطّط القاعة قبل يوم الحدث. نغطّي فترات الاستراحة (Coffee Break) بتوقيتٍ مضبوط على الأجندة، لا على التقدير.',
    needs: ['عرض سعر مكتوب', 'زي رسمي موحّد', 'كوفي بريك مضبوط بالتوقيت', 'بوفيه مقبلات مصغّرة'],
    services: ['buffet', 'qahwajiin', 'zamzam', 'equipment'],
  },
  {
    slug: 'graduation',
    title: 'تخرّج وترقيات',
    h1: 'ضيافة حفلات التخرّج والترقيات',
    d: 'احتفال يستحق التفاصيل',
    icon: 'award',
    img: 'long-dessert-fruit-buffet-chalkboard',
    desc:
      'حفل التخرّج مناسبة تُصوَّر أكثر مما تُؤكل. نبني محطة حلى وقهوة بارتفاعاتٍ متدرّجة تصلح خلفيةً للصور، ونضيف كوش التصوير الفوري بطباعة لحظية، وتوزيعات بأسماء الحاضرين — مع مشروبات باردة تناسب الجو والحرارة.',
    needs: ['محطة حلى للصور', 'كوش تصوير فوري', 'مشروبات باردة', 'توزيعات بالأسماء'],
    services: ['offerings', 'extras', 'qahwajiat', 'buffet'],
  },
  {
    slug: 'newborn',
    title: 'استقبال مواليد',
    h1: 'ضيافة استقبال المواليد والمناسبات العائلية',
    d: 'تنسيق أنيق للمناسبات العائلية',
    icon: 'sparkle',
    img: 'dessert-buffet-parfait-cake-slices',
    desc:
      'مناسبة عائلية صغيرة تحتاج ذوقاً لا حجماً. نُنسّق طاولة استقبال بألوان الموضوع (ثيم) الذي تختاره، مع حلى مصغّر وفواكه منسّقة وعصائر طازجة، وطاقم نسائي هادئ يخدم دون أن يزحم المكان.',
    needs: ['تنسيق بألوان الثيم', 'حلى مصغّر وفواكه', 'عصائر طازجة', 'طاقم نسائي هادئ'],
    services: ['qahwajiat', 'offerings', 'buffet'],
  },
  {
    slug: 'camps',
    title: 'مخيمات واستراحات',
    h1: 'ضيافة المخيمات والاستراحات البرّية',
    d: 'ضيافة برّية بروح أصيلة',
    icon: 'tent',
    img: 'heritage-sadu-buffet-booth-night',
    desc:
      'في البرّ تكون الضيافة أصدق. نصل بمعدّاتنا كاملة إلى المخيم أو الاستراحة: قعدة شعبية بالسدو، دلال على النار، قهوة تُحمَّص في الموقع، تمور ومكسّرات، وبراد ماء بارد — بلا اعتمادٍ على كهرباء الموقع.',
    needs: ['قعدة شعبية بالسدو', 'دلال على النار', 'تحميص في الموقع', 'اكتفاء ذاتي بلا كهرباء'],
    services: ['extras', 'qahwajiin', 'offerings', 'zamzam'],
  },
]

/* ── One URL per search intent ─────────────────────────────
 * These services/occasions are served by their dedicated Jeddah
 * keyword page; the old /services|/occasions URL 301s there.      */
export const SVC_URL: Record<string, string> = { qahwajiat: '/qahwajiat-jeddah' }
export const OCC_URL: Record<string, string> = {
  weddings: '/diyafat-zawajat-jeddah',
  condolences: '/diyafat-aza-jeddah',
  corporate: '/coffee-break-jeddah',
}
export const svcUrl = (slug: string) => SVC_URL[slug] ?? `/services/${slug}`
export const occUrl = (slug: string) => OCC_URL[slug] ?? `/occasions/${slug}`

/* ── Menu (photos illustrate the dish types we serve) ───────── */
export type MenuItem = { n: string; d: string; img?: string }
export type MenuCat = { slug: string; cat: string; line: string; icon: string; hero: string; blurb: string; items: MenuItem[] }

export const MENU: MenuCat[] = [
  {
    slug: 'coffee',
    cat: 'المشروبات الحارة',
    line: 'قهوة سعودية وشاي ومشروبات دافئة تُحضَّر في موقع المناسبة.',
    icon: 'dallah',
    hero: 'golden-dallah-arabic-coffee-pot',
    blurb: 'تُحضَّر في موقع المناسبة وتُصبّ ساخنة من الدلّة النحاسية — لا من ترمسٍ عُبِّئ في الصباح.',
    items: [
      { n: 'قهوة عربية بالهيل', d: 'محمّصة على النار مع الزعفران والهيل', img: 'golden-dallah-arabic-coffee-pot' },
      { n: 'قهوة سعودية فاتحة', d: 'التحميص الأشقر الأصيل بالزعفران', img: 'golden-dallah-dates-white-finjan' },
      { n: 'قهوة سادة للعزاء', d: 'بلا سكر ولا إضافات — للمجالس الرسمية', img: 'golden-dallah-dates-white-finjan' },
      { n: 'شاي أحمر بالنعناع', d: 'مغليٌّ على الطريقة الحجازية', img: 'red-tea-glass-teapot' },
      { n: 'شاي أخضر بالخلطة المدينية', d: 'خفيف ومنعش بعد الأكل', img: 'green-tea-glass-teapot' },
      { n: 'كركديه دافئ', d: 'مشروب أحمر حامض يُقدَّم ساخناً', img: 'hibiscus-karkade-glass-teapot' },
      { n: 'زنجبيل وقرفة', d: 'مشروبات دافئة للمجالس الطويلة والشتاء' },
      { n: 'شاي كرك', d: 'حليب وهيل وزنجبيل مركّز' },
      { n: 'قهوة تركية', d: 'مطحونة ناعمة تُغلى على الرمل' },
      { n: 'قهوة مختصة (V60)', d: 'حبوب مختصة تُحضَّر بالتقطير أمام الضيف' },
    ],
  },
  {
    slug: 'cold',
    cat: 'المشروبات الباردة',
    line: 'عصائر ومشروبات مثلّجة تُجهَّز في الموقع وتُقدَّم باردة.',
    icon: 'water',
    hero: 'fruit-cocktail-cream-honey-glasses',
    blurb: 'تُجهَّز في الموقع وتُقدَّم مثلّجة في أكوابٍ زجاجية — مناسبة لحرارة الصيف والمناسبات النهارية.',
    items: [
      { n: 'عصائر طبيعية طازجة', d: 'برتقال · مانجو · ليمون نعناع', img: 'server-tray-tea-juice-glasses' },
      { n: 'موهيتو منعش', d: 'ليمون ونعناع وصودا مثلّجة', img: 'lemon-mint-mojito-bottle' },
      { n: 'كركديه مثلّج', d: 'حامض حلو ولون أحمر لافت', img: 'iced-karkade-mint-glass' },
      { n: 'كوكتيل فواكه بالقشطة', d: 'فراولة وأناناس وقشطة ورشّة عسل', img: 'fruit-cocktail-cream-honey-glasses' },
      { n: 'سوبيا حجازية', d: 'مشروب رمضاني أصيل بالشعير' },
      { n: 'تمر هندي', d: 'مركّز ومبرّد على الطريقة القديمة', img: 'tamarind-drink-glasses-mint-lemon' },
      { n: 'سوس بارد', d: 'عرق سوس مرغي على الطريقة الشعبية', img: 'erq-sous-licorice-drink-glasses' },
      { n: 'آيس لاتيه', d: 'إسبريسو وحليب بارد وثلج', img: 'iced-latte-glass' },
      { n: 'عصير رمان وأناناس', d: 'يُعصَر طازجاً في الموقع' },
      { n: 'ماء زمزم مبرّد', d: 'بجرار السقيا الذهبية وطاساتها', img: 'golden-zamzam-jugs-cups-set' },
    ],
  },
  {
    slug: 'dates',
    cat: 'التمور الفاخرة',
    line: 'تمور سعودية سادة ومحشية مرتّبة على الصواني.',
    icon: 'dates',
    hero: 'stuffed-dates-three-trays',
    blurb: 'ثلاث درجات من التمور السعودية، محشية أو مجروشة أو سادة — مرتّبة بتقسيمٍ متناسق على الصواني.',
    items: [
      { n: 'صواني تمر محشي مشكّل', d: 'بالفستق والسمسم والشوكولاتة', img: 'stuffed-dates-three-trays' },
      { n: 'علبة تمر بالفستق وجوز الهند', d: 'طبقات مرصوصة بألوان متدرّجة', img: 'dates-pistachio-coconut-square-box' },
      { n: 'تمر بالشوكولاتة والبيكان', d: 'مزيّن بالفستق المجروش والورد', img: 'chocolate-dates-roses-pecan-platter' },
      { n: 'صينية تمر بيضاوية', d: 'محشي بالفستق وجوز الهند', img: 'oval-tray-dates-pistachio-coconut' },
      { n: 'صينية تمر مزيّن ذهبية', d: 'بالمكسّرات والشوكولاتة', img: 'decorated-dates-golden-tray' },
      { n: 'كرات تمر بالسمسم', d: 'محشوة بالكراميل', img: 'sesame-date-balls-caramel-filling' },
      { n: 'خلاص القصيم', d: 'كراميلي القوام، الأشهر للضيافة', img: 'dates-silver-bowl' },
      { n: 'هرم تمور على شكل نخلة', d: 'تنسيق لافت لطاولة الاستقبال', img: 'dates-pyramid-palm-centerpiece' },
      { n: 'نخلة بقاعدة تمور محشية', d: 'قطعة وسط للطاولة', img: 'palm-centerpiece-stuffed-dates-base' },
      { n: 'صينية تمور محشية دائرية', d: 'فستق وسمسم وشوكولاتة', img: 'round-platter-stuffed-dates-pistachio-sesame' },
      { n: 'سكري القصيم', d: 'حلو هشّ ذهبي اللون', img: 'glossy-dates-silver-dish' },
      { n: 'نخلة تمور للتوزيعات', d: 'هدية يأخذها الضيف معه', img: 'date-palm-tree-arrangement-gift' },
    ],
  },
  {
    slug: 'sweets',
    cat: 'الحلويات والشرقيات',
    line: 'حلى قهوة مصغّر وشرقيات ومحطات حلى للمناسبات.',
    icon: 'sparkle',
    hero: 'dessert-buffet-creme-caramel-petit-fours',
    blurb: 'حلى قهوة مصغّر يُؤكل بيدٍ واحدة، وشرقيات بالقطر تُقطَّع في الموقع، ومحطة حلى تصلح خلفيةً للصور.',
    items: [
      { n: 'بقلاوة بالفستق', d: 'رقائق مقرمشة بالقطر الخفيف', img: 'pistachio-baklava-golden-platter' },
      { n: 'كنافة بالجبن', d: 'جبن مطاطي وفستق وقطر ساخن', img: 'kunafa-pistachio-cheese' },
      { n: 'كرواسون بالشوكولاتة', d: 'زبدة حقيقية وحشوة شوكولاتة', img: 'chocolate-croissants' },
      { n: 'صينية شوكولاتة مغلّفة', d: 'قطع بالذهبي والأبيض مع القهوة', img: 'wrapped-chocolates-platter' },
      { n: 'فواكه وبقلاوة على حوامل', d: 'صوانٍ على حوامل ذهبية', img: 'fruit-platters-baklava-gold-stands' },
      { n: 'صينية شرقيات', d: 'معمول ومدلوقة وعيش السرايا' },
      { n: 'محطة حلى ذهبية', d: 'ارتفاعات متدرّجة وإضاءة دافئة', img: 'dessert-buffet-creme-caramel-petit-fours' },
      { n: 'محطة حلى للأعراس', d: 'تنسيق بألوان الثيم والزهور', img: 'long-dessert-fruit-buffet-chalkboard' },
      { n: 'محطة حلى عائلية', d: 'حجم مناسب للمناسبات الصغيرة', img: 'dessert-buffet-parfait-cake-slices' },
      { n: 'ركن الكيك والتورتة', d: 'كيك مقطّع بأحجام الضيافة' },
      { n: 'ركن الحلى البارد', d: 'موس وتشيز كيك على قواعد مبرّدة', img: 'dessert-buffet-top-view' },
      { n: 'ركن كاسات الحلى', d: 'كاسات موس ومعجنات حلوة', img: 'dessert-buffet-cups-pastries' },
    ],
  },
  {
    slug: 'pastry',
    cat: 'المعجنات',
    line: 'معجنات وفطائر مصغّرة تصل الطاولة ساخنة.',
    icon: 'tent',
    hero: 'arabic-fatayer-sesame-pastries',
    blurb: 'تُخبَز على دفعاتٍ لتصل الطاولة ساخنة — سمبوسة، فطائر مصغّرة، وعجينة عربية أصيلة.',
    items: [
      { n: 'فطائر عربية', d: 'زعتر وجبن ومعجنات بالسمسم', img: 'arabic-fatayer-sesame-pastries' },
      { n: 'معجنات محلّاة', d: 'بالتفاح والكريمة والزبيب', img: 'assorted-danish-pastries-trays' },
      { n: 'سمبوسة مصغّرة', d: 'جبن أو لحم مقرمشة', img: 'fried-samosa-basket' },
      { n: 'ميلفيه بالكريمة والتوت', d: 'عجينة هشّة بالفراولة والتوت', img: 'puff-pastry-cream-berries' },
      { n: 'مناقيش زعتر وجبن', d: 'قطع صغيرة تُؤكل بيد واحدة', img: 'manakish-zaatar-cheese-board' },
    ],
  },
  {
    slug: 'snacks',
    cat: 'المقبلات والسناكات',
    line: 'أصناف بحجم اللقمة تُؤكل واقفاً بيدٍ واحدة.',
    icon: 'tray',
    hero: 'assorted-canapes-slate-board',
    blurb: 'أصناف مصغّرة تُؤكل واقفاً بيدٍ واحدة — الأنسب للاستقبال والمؤتمرات وفترات الاستراحة.',
    items: [
      { n: 'كانابيه مشكّل', d: 'قواعد مقرمشة بحشوات ملوّنة', img: 'assorted-canapes-slate-board' },
      { n: 'بروشيتا إيطالية', d: 'خبز محمّص وطماطم وحبق', img: 'bruschetta-slate-platter' },
      { n: 'بيتزا مصغّرة', d: 'قطع بحجم اللقمة', img: 'mini-margherita-pizzas' },
      { n: 'سبرينج رول', d: 'مقرمش بحشوة خضار أو دجاج', img: 'spring-rolls-sweet-chili' },
      { n: 'أصابع موزاريلا', d: 'جبن مطاطي بقشرة ذهبية', img: 'mozzarella-sticks-marinara' },
      { n: 'دجاج مقرمش', d: 'قطع صغيرة مع صوص جانبي', img: 'crispy-chicken-bites-mustard-sauce' },
      { n: 'بطاطس ودجز', d: 'مقاطع سميكة بالبهارات', img: 'potato-wedges-dip' },
      { n: 'كروكيت بطاطس', d: 'كرات مقرمشة بحشوة كريمية', img: 'potato-croquettes-tomato-sauce' },
      { n: 'ناتشوز بالجبن', d: 'رقائق ذرة وصوص ساخن', img: 'cheese-nachos-guacamole' },
      { n: 'سلايدر برجر مصغّر', d: 'خبز بريوش ولحم مشوي', img: 'mini-beef-sliders' },
    ],
  },
  {
    slug: 'sandwiches',
    cat: 'الساندويتشات',
    line: 'ساندويتشات بأحجام الضيافة مرصوفة بتناسق.',
    icon: 'finjan',
    hero: 'turkey-cheese-mini-sub',
    blurb: 'مُقطَّعة بأحجام الضيافة ومرصوفة بتناسق — تُجهَّز قريباً من موعد التقديم لا قبله بساعات.',
    items: [
      { n: 'ساندويتش تونة', d: 'سلطة تونة وخس في خبز بالسمسم', img: 'tuna-salad-burger-bun' },
      { n: 'رول تونة', d: 'خبز طويل بالحبة السوداء', img: 'tuna-salad-sesame-roll' },
      { n: 'ساندويتش دجاج', d: 'دجاج وخس في خبز بالسمسم', img: 'chicken-sandwich-sesame-bun' },
      { n: 'دجاج وجبن', d: 'تشاباتا بالدجاج والشيدر', img: 'chicken-cheese-ciabatta-sandwich' },
      { n: 'ديك رومي وجبن', d: 'تركي مدخّن وجبن شيدر', img: 'turkey-cheese-mini-sub' },
      { n: 'ساب ديك رومي', d: 'خبز طويل بالجبن والخس', img: 'turkey-cheese-sub-sandwich' },
      { n: 'فوكاتشيا ديك رومي', d: 'جبن وطماطم وخس', img: 'turkey-cheese-tomato-focaccia' },
    ],
  },
  {
    slug: 'fruits',
    cat: 'الفواكه',
    line: 'فواكه تُقطَّع في الموقع وتُرتَّب بتدرّج لوني.',
    icon: 'leaf',
    hero: 'cubed-mango',
    blurb: 'فواكه تُقطَّع في الموقع قبل التقديم بوقتٍ قصير، وتُرتَّب بتدريجٍ لوني على الصواني.',
    items: [
      { n: 'مانجو مقطّع', d: 'شرائح ذهبية بلا ألياف', img: 'cubed-mango' },
      { n: 'أناناس مقطّع', d: 'قطع طازجة جاهزة للتقديم', img: 'pineapple-chunks-bowl' },
      { n: 'فراولة طازجة', d: 'كاملة ولامعة مع سكر ناعم', img: 'fresh-strawberries' },
      { n: 'توت وبيري مشكّل', d: 'بلوبيري وراسبيري وبلاك بيري', img: 'mixed-berries-red-bowl' },
      { n: 'رمان مفصّص', d: 'حبّات ياقوتية بلا قشر', img: 'half-pomegranate-seeds' },
      { n: 'كيوي مقطّع', d: 'شرائح خضراء لتدريج الألوان', img: 'sliced-kiwi' },
      { n: 'تين طازج', d: 'مشقوق ومرصوف بعناية', img: 'fresh-figs' },
      { n: 'عنب مشكّل', d: 'أخضر وأحمر بلا بذور', img: 'green-red-grapes' },
    ],
  },
  {
    slug: 'popular',
    cat: 'الأكلات الشعبية والمكسّرات',
    line: 'سفرة شعبية سعودية ومكسّرات محمّصة بجانب القهوة.',
    icon: 'tray',
    hero: 'saudi-popular-food-khamir-bread-honey',
    blurb: 'سفرة شعبية سعودية تُطبخ على الأصول وتُقدَّم في قدورٍ حافظة للحرارة — للعزائم والولائم والعقائق ومناسبات الأهل في جدة.',
    items: [
      { n: 'قدور أكلات شعبية', d: 'جريش ومرقوق وأطباق ساخنة', img: 'saudi-popular-food-pots-sadu-table' },
      { n: 'بنت الصحن', d: 'رقائق هشّة بالسمن والعسل والحبّة السوداء' },
      { n: 'عريكة', d: 'بالتمر والسمن والعسل — طبق جنوبي أصيل' },
      { n: 'خبز الخمير والعسل', d: 'يُقطَّع ويُقدَّم مع العسل والقهوة', img: 'saudi-popular-food-khamir-bread-honey' },
      { n: 'عصيد ومرقوق', d: 'أطباق دافئة للشتاء والعزائم' },
      { n: 'مطازيز ومراصيع', d: 'من سفرة الأهل على الطريقة النجدية' },
      { n: 'فتّة تمر ومرسة', d: 'تمر مهروس بالسمن والخبز' },
      { n: 'حنيني ومعمول', d: 'حلى شعبي يُقدَّم مع القهوة' },
      { n: 'مكسّرات محمّصة', d: 'تُقدَّم في سلال بجانب القهوة', img: 'saudi-popular-food-nuts-traditional-bread' },
    ],
  },
]


/* ── /menu extras (one page, Keif-style): equipment, giveaways, menu FAQ ── */
export const MENU_EQUIP = {
  img: 'golden-dallah-dates-white-finjan',
  line: 'نحضر بعدّتنا كاملة مصقولة ومعقّمة — ويمكن تأجيرها منفصلة.',
  items: ['دلال نحاسية', 'حاملات فناجيل مذهّبة', 'فناجيل بورسلين وزجاج', 'أطقم شاي', 'صواني تقديم', 'مباخر عود', 'ترامس', 'مناضد ومحطات'],
} as const
export const MENU_GIFTS = {
  img: 'stuffed-dates-three-trays',
  line: 'تمور أو حلى في علبٍ مُغلَّفة بشريط وبطاقة — هدية يأخذها ضيفك معه.',
  items: ['علب تمور مُغلَّفة', 'علب حلى وشوكولاتة', 'بطاقة بالاسم أو العبارة التي تختارها', 'تغليف بألوان مناسبتك'],
} as const
export const MENU_FAQ = [
  {
    q: 'هل أدوات التقديم ضمن الطلب؟',
    a: 'نعم. تصل التقديمات بعدّتها: دلال وصواني وحاملات وفناجيل وأطقم شاي — مصقولة ومعقّمة — ونرفعها بعد المناسبة.',
  },
  {
    q: 'هل يمكن تخصيص القائمة؟',
    a: 'نعم. تختار من أي قسم ما يناسبك، وتستبعد ما لا تريده، وتطلب بدائل خالية من المكسّرات أو السكر عند الحاجة.',
  },
  {
    q: 'هل يمكن وضع اسم أو عبارة على التوزيعات؟',
    a: 'نعم. تُغلَّف التوزيعات ببطاقة تحمل الاسم أو العبارة التي تختارها. أرسل النص مع تفاصيل الحجز.',
  },
  {
    q: 'هل أطلب التقديمات وحدها أم مع الطاقم؟',
    a: 'الأفضل أن تصل مع طاقمها من القهوجيين أو القهوجيات ليتولّوا التقديم والترتيب. أخبرنا بما تحتاجه ونقترح لك الأنسب.',
  },
] as const



/* ── FAQ ──────────────────────────────────────────────────── */
export const FAQ = [
  {
    q: 'كيف تُحدَّد تكلفة الضيافة؟',
    a: 'نحسبها على أربعة عوامل: عدد الضيوف، عدد أفراد الطاقم، مدة المناسبة، ونوع التقديمات. أرسل تفاصيل مناسبتك ويصلك عرض سعر مكتوب ومفصّل قبل أي تأكيد.',
  },
  {
    q: 'هل يتوفر طاقم نسائي للمناسبات النسائية؟',
    a: 'نعم. لدينا طاقم نسائي مستقل بالكامل من القهوجيات والصبابات المدرَّبات، يخدم المناسبات النسائية مع التزامٍ تام بالخصوصية ودون أي حضورٍ ذكوري داخل مكان المناسبة، ودخول وخروج مُرتَّب مسبقاً.',
  },
  {
    q: 'هل تخدمون كل أحياء جدة؟',
    a: 'مقرّنا جدة، ونخدم جميع أحيائها وقاعاتها واستراحاتها. للمناسبات خارج جدة تواصل معنا لتأكيد التوفّر قبل الحجز.',
  },
  {
    q: 'قبل كم من الوقت يجب الحجز؟',
    a: 'نوصي بالحجز قبل ٣ إلى ٧ أيام، خصوصاً في المواسم والأعياد ونهايات الأسبوع. الحجوزات القريبة ممكنة حسب توفّر الطاقم — تواصل معنا مباشرة.',
  },
  {
    q: 'هل توفّرون العدة والأدوات أم نحضّرها؟',
    a: 'نحضر بعدّتنا كاملة: دلال نحاسية، صواني، حاملات مذهّبة، فناجيل بورسلين وزجاج، أطقم شاي، مباخر، ترامس ومناضد — كلها مصقولة ومعقّمة. ويمكن تأجير العدّة منفصلة إن كان لديك طاقمك الخاص.',
  },
  {
    q: 'هل تشمل الخدمة التنظيف بعد المناسبة؟',
    a: 'نعم. الفريق يرفع كل ما يتعلق بالضيافة — عدّة، صواني، أكواب ومخلّفات التقديم — ويترك منطقة التقديم نظيفة كما وجدها، قبل أن ينصرف. وهذا بند ثابت في كل حجز.',
  },
  {
    q: 'هل يمكن تخصيص القائمة أو استبعاد أصناف؟',
    a: 'القائمة قابلة للتخصيص بالكامل. يمكنك استبعاد أي صنف، أو طلب أصناف محدّدة، أو تحديد بدائل خالية من المكسّرات أو السكر. أخبرنا بالقيود الغذائية عند الحجز وسنثبّتها في أمر التشغيل.',
  },
] as const

/* ── Gallery — captions come from assets/catalog.json (what each photo really shows) ── */
export type Shot = { img: string; cap: string; tall?: boolean; cat: string }

export const GALLERY: Shot[] = [
  { img: 'qahwajiin-team-uniform-reception-hall', cap: capOf('qahwajiin-team-uniform-reception-hall'), cat: 'فريق' },
  { img: 'two-qahwajiin-embroidered-daglah-dates-tray', cap: capOf('two-qahwajiin-embroidered-daglah-dates-tray'), tall: true, cat: 'فريق' },
  { img: 'two-qahwajiin-coffee-booth-dallah-dates', cap: capOf('two-qahwajiin-coffee-booth-dallah-dates'), tall: true, cat: 'فريق' },
  { img: 'four-female-hostesses-black-uniform', cap: capOf('four-female-hostesses-black-uniform'), tall: true, cat: 'فريق' },
  { img: 'golden-zamzam-jugs-stands-flowers', cap: capOf('golden-zamzam-jugs-stands-flowers'), cat: 'ملكية' },
  { img: 'outdoor-tea-coffee-table-dallah-glass-cups', cap: capOf('outdoor-tea-coffee-table-dallah-glass-cups'), cat: 'عدّة' },
  { img: 'sawas-ornate-golden-vessel-blue-beads', cap: capOf('sawas-ornate-golden-vessel-blue-beads'), tall: true, cat: 'ملكية' },
  { img: 'host-golden-mabkhara-incense-entrance', cap: capOf('host-golden-mabkhara-incense-entrance'), tall: true, cat: 'فريق' },
  { img: 'saudi-popular-food-khamir-bread-honey', cap: capOf('saudi-popular-food-khamir-bread-honey'), tall: true, cat: 'تقديمات' },
  { img: 'qahwaji-embroidered-daglah-pouring-coffee-vip-lounge', cap: capOf('qahwaji-embroidered-daglah-pouring-coffee-vip-lounge'), tall: true, cat: 'فريق' },
  { img: 'dessert-buffet-creme-caramel-petit-fours', cap: capOf('dessert-buffet-creme-caramel-petit-fours'), cat: 'تقديمات' },
  { img: 'golden-dallah-arabic-coffee-pot', cap: capOf('golden-dallah-arabic-coffee-pot'), cat: 'عدّة' },
  { img: 'golden-zamzam-jugs-cups-set', cap: capOf('golden-zamzam-jugs-cups-set'), cat: 'ملكية' },
  { img: 'women-reception-zamzam-jugs-flowers', cap: capOf('women-reception-zamzam-jugs-flowers'), cat: 'ملكية' },
  { img: 'two-female-hostesses-black-suits', cap: capOf('two-female-hostesses-black-suits'), tall: true, cat: 'فريق' },
  { img: 'pastry-buffet-tiered-wooden-stands', cap: capOf('pastry-buffet-tiered-wooden-stands'), cat: 'تقديمات' },
  { img: 'white-coffee-finjans-emblem-gold-tray', cap: capOf('white-coffee-finjans-emblem-gold-tray'), cat: 'عدّة' },
  { img: 'mini-sadu-tent-coffee-station-indoor', cap: capOf('mini-sadu-tent-coffee-station-indoor'), cat: 'إضافات' },
  { img: 'stuffed-dates-three-trays', cap: capOf('stuffed-dates-three-trays'), cat: 'تقديمات' },
  { img: 'sawas-golden-vessel-engraved', cap: capOf('sawas-golden-vessel-engraved'), tall: true, cat: 'ملكية' },
  { img: 'gold-glass-cup-stand-multi-tier', cap: capOf('gold-glass-cup-stand-multi-tier'), cat: 'عدّة' },
  { img: 'serving-tea-glass-cups-golden-tray', cap: capOf('serving-tea-glass-cups-golden-tray'), cat: 'عدّة' },
  { img: 'canapes-buffet-black-platters-top-view', cap: capOf('canapes-buffet-black-platters-top-view'), cat: 'تقديمات' },
  { img: 'bedouin-tent-majlis-sadu-cushions', cap: capOf('bedouin-tent-majlis-sadu-cushions'), cat: 'إضافات' },
  { img: 'golden-zamzam-jug-stand-marble', cap: capOf('golden-zamzam-jug-stand-marble'), tall: true, cat: 'ملكية' },
  { img: 'mirror-photo-booth-red-carpet-printer', cap: capOf('mirror-photo-booth-red-carpet-printer'), cat: 'إضافات' },
  { img: 'guest-giveaways-wrapped-sweets-table', cap: capOf('guest-giveaways-wrapped-sweets-table'), cat: 'تقديمات' },
  { img: 'golden-dallah-dates-white-finjan', cap: capOf('golden-dallah-dates-white-finjan'), cat: 'عدّة' },
  { img: 'heritage-sadu-buffet-booth-night', cap: capOf('heritage-sadu-buffet-booth-night'), cat: 'إضافات' },
  { img: 'brass-zamzam-jugs-collection', cap: capOf('brass-zamzam-jugs-collection'), cat: 'ملكية' },
  { img: 'henna-artist-hand-design-saudi-emblem', cap: capOf('henna-artist-hand-design-saudi-emblem'), cat: 'إضافات' },
  { img: 'qahwaji-serving-coffee-exhibition-hall', cap: capOf('qahwaji-serving-coffee-exhibition-hall'), tall: true, cat: 'فريق' },
  { img: 'fruit-platters-baklava-gold-stands', cap: capOf('fruit-platters-baklava-gold-stands'), cat: 'تقديمات' },
  { img: 'three-female-hostesses-white-floral-dresses', cap: capOf('three-female-hostesses-white-floral-dresses'), tall: true, cat: 'فريق' },
  { img: 'golden-mabkhara-heritage-sweets-table', cap: capOf('golden-mabkhara-heritage-sweets-table'), cat: 'عدّة' },
  { img: 'mirror-photo-booth-purple-carpet', cap: capOf('mirror-photo-booth-purple-carpet'), tall: true, cat: 'إضافات' },
  { img: 'henna-artist-station-heritage-tent', cap: capOf('henna-artist-station-heritage-tent'), cat: 'إضافات' },
  { img: 'pistachio-baklava-golden-platter', cap: capOf('pistachio-baklava-golden-platter'), cat: 'تقديمات' },
  { img: 'server-tray-tea-juice-glasses', cap: capOf('server-tray-tea-juice-glasses'), cat: 'فريق' },
  { img: 'long-dessert-fruit-buffet-chalkboard', cap: capOf('long-dessert-fruit-buffet-chalkboard'), cat: 'تقديمات' },
  { img: 'sawas-golden-vessel-closeup', cap: capOf('sawas-golden-vessel-closeup'), cat: 'ملكية' },
]


/* ── Our team (real photos) — "choose your crew's look" rail ─ */
export const STAFF = [
  { img: 'qahwajiin-team-uniform-reception-hall', t: 'زيّ موحّد كلاسيكي', d: 'قهوجيين وصبابين' },
  { img: 'two-qahwajiin-embroidered-daglah-dates-tray', t: 'زيّ ملكي مطرّز', d: 'الأعراس وكبار الضيوف' },
  { img: 'qahwaji-golden-dallah-exhibition-booth', t: 'زيّ الفعاليات', d: 'المعارض والشركات' },
  { img: 'three-female-hostesses-white-floral-dresses', t: 'قهوجيات بفساتين موحّدة', d: 'المناسبات النسائية' },
  { img: 'two-female-hostesses-black-suits', t: 'مباشرات بزيّ رسمي', d: 'تنظيم وخصوصية تامة' },
] as const

/* ── The three roles — one line each ──────────────────────── */
export const ROLES = [
  { img: 'two-qahwajiin-coffee-booth-dallah-dates', t: 'القهوجي', d: 'يحضّر القهوة على الأصول ويتابع الدلال وحرارتها طوال المناسبة.' },
  { img: 'qahwaji-embroidered-daglah-pouring-coffee-vip-lounge', t: 'الصبّاب', d: 'يصبّ من اليمين بدءاً بكبير الضيوف، ويعيد الصبّ في وقته.' },
  { img: 'server-tray-tea-juice-glasses', t: 'المباشر', d: 'ينظّم حركة التقديم ويوزّع الطاقم من أول ضيف إلى آخره.' },
] as const

/* ── Why us — one line each ───────────────────────────────── */
export const WHY = [
  'جدة مقرّنا — نخدم أحياءها وقاعاتها واستراحاتها',
  'حضور قبل الموعد وتجهيز كامل للموقع',
  'طاقم بزيٍّ رسمي موحّد ومظهر يليق بضيوفك',
  'قهوة عربية أصيلة تُحضَّر في الموقع وتُصبّ ساخنة',
  'عدّة ودلال مذهّبة مصقولة ومعقّمة قبل كل مناسبة',
  'عرض سعر مكتوب قبل أي تأكيد',
] as const

/* ── Who we serve (3 compact cards right after Hero — Keif cadence) ── */
export const AUDIENCE = [
  { t: 'الجهات والمجالس الرسمية', d: 'بروتوكول رسمي لكبار الضيوف', img: 'qahwaji-embroidered-daglah-pouring-coffee-vip-lounge', href: '/services/qahwajiin' },
  { t: 'الشركات والمؤتمرات', d: 'كوفي بريك وأجنحة معارض', img: 'qahwaji-serving-coffee-exhibition-hall', href: '/coffee-break-jeddah' },
  { t: 'المناسبات الخاصة', d: 'أعراس وملكات ومجالس وعزاء', img: 'qahwajiin-team-uniform-reception-hall', href: '/diyafat-zawajat-jeddah' },
] as const

/* ── Team Arrangements (كيف نرتب الطاقم لمناسبتك — no prices) ── */
export const ARRANGEMENTS = [
  {
    title: 'قهوجيين لمجالس الأعيان',
    sub: 'تقديم على الأصول: من اليمين، بالترتيب، وبمقدار لا يملّ.',
    points: [
      'قهوجي يجهّز القهوة السعودية ويتابع حرارة الدلال',
      'صبّاب يقدّم من اليمين على الأصول وبهدوء تام',
      'قهوة طازجة بالهيل والزعفران مع تمر فاخر',
      'دلال نحاسية مذهّبة وفناجيل بورسلين معقّمة',
    ],
    msg: 'السلام عليكم، أرغب في ترتيب (قهوجيين لمجالس الأعيان) مع القهوة الملكية.',
  },
  {
    title: 'قهوجيين ومباشرين لكبار الضيوف VIP',
    sub: 'فريق متكامل للفعاليات الرسمية والأعراس والاستقبالات ببروتوكول ملكي.',
    points: [
      'توزيع الأدوار ورسم مسار الخدمة قبل المناسبة',
      'مباشرون ينظّمون حركة التقديم والتمور والعود',
      'زيّ سعودي رسمي موحّد (دقلة / سديري / بشت)',
      'إشراف ميداني مباشر طوال ساعات الفعالية',
    ],
    msg: 'السلام عليكم، أرغب في ترتيب (قهوجيين ومباشرين لكبار الضيوف VIP) مع القهوة الملكية.',
  },
  {
    title: 'قهوجيات وصبابات ومباشرات',
    sub: 'للمناسبات النسائية — طاقم نسائي مستقل بالكامل بلا استثناء.',
    points: [
      'مباشرات وصبابات مدرّبات على بروتوكول القاعات',
      'زيّ نسائي رسمي موحّد وأنيق مع مشرفة مستقلة',
      'تنسيق طاولة الاستقبال بسقيا زمزم الذهبية والحلى',
      'خصوصية تامة من الدخول حتى المغادرة',
    ],
    msg: 'السلام عليكم، أرغب في ترتيب (قهوجيات وصبابات ومباشرات) مع القهوة الملكية.',
  },
] as const

/* ── Royal Trust Metrics (شريط الثقة الملكي أسفل بطاقة الهيرو) ── */
export const HERO_METRICS = [
  { num: 'رجالي ونسائي', label: 'طاقم مستقل لكل قسم' },
  { num: 'زي موحّد', label: 'مظهر رسمي يليق بضيوفك' },
  { num: 'عرض مكتوب', label: 'السعر واضح قبل التأكيد' },
] as const

/* ── Royal 10-Second Concierge (مُحدّد الضيافة الملكي السريع للزبون المستعجل) ── */
export const CONCIERGE = {
  occasions: [
    { id: 'زواج أو ملكة', label: 'زواج / ملكة', icon: 'crown' },
    { id: 'مؤتمر أو فعالية شركة', label: 'شركات ومؤتمرات', icon: 'award' },
    { id: 'مجلس رسمي أو عزاء', label: 'مجالس وعزاء', icon: 'dallah' },
    { id: 'مناسبة نسائية خاصة', label: 'مناسبة نسائية', icon: 'sparkle' },
  ],
  crews: [
    { id: 'طاقم رجالي (قهوجيين ومباشرين)', label: 'طاقم رجالي' },
    { id: 'طاقم نسائي (قهوجيات ومباشرات)', label: 'طاقم نسائي' },
    { id: 'طاقم مشترك (رجالي + نسائي منفصل)', label: 'رجالي + نسائي' },
  ],
  guests: [
    { id: 'أقل من ٥٠ ضيفاً', label: 'أقل من ٥٠ ضيفاً', rec: '٢ قهوجي وصبّاب + عدّة نحاسية مذهّبة كاملة' },
    { id: '٥٠ إلى ١٢٠ ضيفاً', label: '٥٠ – ١٢٠ ضيفاً', rec: '٣ قهوجيين وصبّابين + مباشر تنظيم + عدّة ملكية' },
    { id: '١٢٠ إلى ٢٥٠ ضيفاً', label: '١٢٠ – ٢٥٠ ضيفاً', rec: '٥ قهوجيين وصبّابين + مشرف ميداني + ركن ضيافة ملكي' },
    { id: 'أكثر من ٢٥٠ ضيفاً (VIP)', label: '+٢٥٠ ضيفاً VIP', rec: 'طاقم ملكي موسّع + مشرف بروتوكول + سقيا زمزم ودلال مذهّبة' },
  ],
} as const

