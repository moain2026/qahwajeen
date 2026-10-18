<div dir="rtl">

> **مطوّر أو وكيل جديد؟ ابدأ بـ [`HANDOFF.md`](HANDOFF.md)** — القواعد، طريقة العمل والنشر، ما بُحث فيه، وما فشل.

# القهوة الملكية — qahwajeen.com

موقع حجز ضيافة في **جدة**: قهوجيين وصبابين، قهوجيات وصبابات، وضيافة مناسبات.
هدف كل صفحة واحد: أن يتصل الزائر أو يراسل على واتساب **0504968113**.

مبني بـ **Hono + TypeScript (JSX على الخادم)**. الإنتاج على **Vercel** (`build:vercel`)،
ويُبنى أيضاً لـ Cloudflare (`build`) و Node (`build:node`) من نفس الكود.

---

## ١) خريطة الكود

```
src/
├── index.tsx    المسارات، تحويلات 301، robots.txt، sitemap.xml
├── layout.tsx   <head> + الترويسة (صف واحد) + التذييل + شريط واتساب/اتصال + التتبّع
├── pages.tsx    صفحات: الرئيسية، الخدمات، المناسبات، القائمة، الأعمال، الأسئلة، الحجز، صفحات جدة
├── views.tsx    /links — صفحة التواصل و«من نحن» (الوحيدة)
├── onepage.tsx  أقسام الصفحات (Hero، الخدمات، القائمة، المعرض، الحجز السريع…)
├── data.ts      كل المحتوى: الهوية، الخدمات، المناسبات، القائمة، الأسئلة، التتبّع
├── jeddah.ts    صفحات كلمات جدة (قهوجيات، مباشرين، زواجات، كوفي بريك، عزاء)
├── ld.ts        JSON-LD: LocalBusiness · Service · FAQPage · BreadcrumbList · ImageGallery
├── ui.tsx       Img / HeroPic / Faq
└── imgmap.ts    مقاسات الصور (sm/md/lg)
public/static/   style.css · app.js · fonts/ · img/
qa/scripts/      index_audit.py · seo.py · btn.py · indexnow.py
qa/tools/        أدوات العمل: Lighthouse، لقطات، فائض، حذف CSS الآمن
qa/audit-v4/     تقرير التدقيق v4 وأدواته
```

## ٢) خريطة الصفحات — رابط واحد لكل نيّة بحث (٢٣ صفحة مفهرسة)

| الرابط | نيّة البحث |
|---|---|
| `/` | قهوجي وصبابين جدة |
| `/services` + ٧ صفحات خدمة | خدمات الضيافة في جدة |
| `/occasions` + ٣ صفحات | ضيافة مناسبات جدة (تخرّج، مواليد، مخيمات) |
| `/qahwajiat-jeddah` · `/mubashirin-jeddah` · `/diyafat-zawajat-jeddah` · `/coffee-break-jeddah` · `/diyafat-aza-jeddah` | صفحات كلمات جدة |
| `/menu` | كل التقديمات في صفحة واحدة (٩ أقسام + المعدات + التوزيعات) |
| `/gallery` · `/faq` · `/booking` · `/links` | الأعمال · الأسئلة · الحجز · التواصل ومن نحن |

التحويلات 301 كاملة في `docs/04-seo.md` القسم 2 (منها `/menu/{قسم}` → `/menu#{قسم}`).

**الفهرسة:** `sitemap.xml` تُبنى من HTML المرسوم نفسه — كل صورة لها نص بديل
تُدرَج تلقائيًا تحت صفحتها (٦٤ صورة). التفاصيل وخطوات Search Console في `docs/04-seo.md`.

## ٣) التشغيل

```bash
npm install
npm run build && npx wrangler pages dev dist --ip 0.0.0.0 --port 3000   # محلياً
npm run build:vercel                                                    # بناء الإنتاج
python3 qa/scripts/index_audit.py  # الفهرسة: صفحات، صور، تحويلات، روابط داخلية، JSON-LD
python3 qa/scripts/seo.py      # عناوين ≤60، وصف، canonical، H1، JSON-LD، sitemap
python3 qa/scripts/btn.py      # كل زر ≥44px وبلا قصّ — 320/390/1440
```

## ٤) قواعد ثابتة

- الاسم «القهوة الملكية» والدومين qahwajeen.com لا يتغيّران.
- قنوات التواصل الظاهرة: الاتصال، واتساب، البريد qahwajeen@gmail.com فقط.
  حسابات التواصل الاجتماعي مخفية (`SOCIAL_LINKS = []` في `data.ts`).
- لا أسعار، لا باقات، لا تقييمات، ولا ادعاء لا يمكن إثباته (مدة وصول، نسب، فواتير، مدن أخرى).
- زمرّدي داكن + ذهبي، بلا خلفيات بيضاء. الحركة transform/opacity فقط وتحترم reduced-motion.
- عند تعديل CSS/JS ارفع `V` في `layout.tsx`.

## ٥) التتبّع (Google Ads / GA4)

ضع المعرّفات في `TRACKING` داخل `src/data.ts`. لا يُحمَّل أي سكربت قبل ذلك.
الأحداث: `click_call` · `click_whatsapp` · `booking_submit` · `click_email`،
مع Consent Mode v2 (مرفوض افتراضياً) وتحميل gtag بعد `load`.

## ٦) النشر

الإنتاج: مستودع MoTechSys/qahwajeen فرع `main` على Vercel.
مؤلف الكوميت يجب أن يكون `MoTechSys <256226456+MoTechSys@users.noreply.github.com>`.
بعد النشر: `index_audit.py` و`seo.py` على `https://qahwajeen.com` + `indexnow.py` + Lighthouse.
التفاصيل: `docs/06-deployment.md`.

## ٧) التوثيق

| الملف | المحتوى |
|---|---|
| `docs/01-architecture.md` | البنية والملفات ومسؤولياتها |
| `docs/02-design-system.md` | الألوان والطباعة العربية والمكوّنات |
| `docs/03-content-model.md` | أين يعيش كل نص وكيف تضيف محتوى |
| `docs/04-seo.md` | السيو والفهرسة والصور والتحويلات وربط محركات البحث |
| `docs/05-performance.md` | قياسات الأداء والصور والكاش |
| `docs/06-deployment.md` | خطوات النشر والتحقق والتراجع |
| `docs/07-decisions.md` | سجل القرارات |
| `docs/08-roadmap.md` | ما ينتظر المالك وما تبقّى |
| `qa/README.md` | سكربتات الفحص ونتائجها |

</div>
