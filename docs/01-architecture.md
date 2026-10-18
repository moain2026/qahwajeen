<div dir="rtl">

# 01 — البنية المعمارية

> كيف يتحوّل الطلب إلى HTML، وأين يعيش كل شيء. اقرأه قبل أن تعدّل سطرًا.

---

## 1. الصورة الكبيرة

تطبيق **Hono** واحد يرسم HTML كاملًا على الخادم لكل صفحة (JSX بلا React).
الجافاسكربت في المتصفح ملف واحد للتفاعل فقط — لو تعطّل يبقى الموقع
مقروءًا وكل أزرار الاتصال والواتساب تعمل لأنها روابط عادية.

```
طلب
 │
 ├── /static/*  → ملف ثابت تخدمه المنصّة (immutable سنة)
 │
 └── غيره → src/index.tsx
              ├── وسيط: www→الجذر · حذف الشرطة الأخيرة · ترويسات الأمان · noindex لروابط المعاينة
              ├── مسارات الصفحات → src/pages.tsx (+ views.tsx لـ /links)
              │        └── أقسام من src/onepage.tsx ← محتوى من src/data.ts و src/jeddah.ts
              │        └── غلاف src/layout.tsx (<head>، الترويسة، التذييل، الشريط السفلي)
              │        └── JSON-LD من src/ld.ts
              ├── تحويلات 301 (جدول MOVED + أنماط)
              └── robots.txt · sitemap.xml · مفتاح IndexNow
```

## 2. الملفات ومسؤولياتها

| الملف | المسؤولية | لا يحتوي |
|---|---|---|
| `src/index.tsx` | المسارات، التحويلات، robots، sitemap (مبني من HTML المرسوم) | HTML |
| `src/layout.tsx` | `<head>` كامل، الترويسة، قائمة الجوال، التذييل، الشريط السفلي، gtag (عند وجود معرّف). `V` = رقم كسر الكاش | محتوى صفحة |
| `src/pages.tsx` | الصفحات: Home, Services, ServiceDetail, Occasions, OccasionDetail, Menu, Gallery, FaqPage, FastBooking, JeddahLanding, NotFound | نصوص طويلة |
| `src/views.tsx` | `/links` (التواصل + من نحن + QR) | |
| `src/onepage.tsx` | الأقسام المشتركة: Hero, WhoSec, WorksSec, CrewSec, MenuSec, ServicesSec, RolesSec, ArrangementsSec, OccasionsSec, WhySec, FaqSec, EndCta (+ نافذة الصور) | |
| `src/data.ts` | **كل المحتوى**: BRAND, TRACKING, SEARCH, SHOW, SERVICES, OCCASIONS, MENU, MENU_EQUIP, MENU_GIFTS, MENU_FAQ, FAQ, GALLERY, STAFF, ROLES … | JSX |
| `src/jeddah.ts` | صفحات الكلمات المفتاحية الخمس لجدة (نص فريد لكل صفحة) | |
| `src/ld.ts` | بانيات JSON-LD | |
| `src/ui.tsx` | `Img`, `HeroPic`, `Faq`, `imgSrc`, `imgSet` | |
| `src/imgmap.ts` | المقاسات المتوفرة وأبعاد كل صورة (مطابقة للملفات — يفحصها `index_audit.py`) | |
| `src/icons.tsx` · `src/blocks.tsx` | أيقونات SVG · `Ico` و`wa()` | |
| `src/server.node.ts` | مدخل Node للاستضافة بالحاويات | |
| `public/static/style.css` | التنسيق (مضغوط + قواعد مقروءة مُلحقة في آخره) | |
| `public/static/app.js` | التفاعل (انظر القسم 4) | |

**القاعدة:** النص في `data.ts`/`jeddah.ts`، الشكل في `*.tsx`، التنسيق في `style.css`.

## 3. البناء: كود واحد، ثلاث منصّات

| الأمر | المخرَج | الاستخدام |
|---|---|---|
| `npm run build:vercel` | `.vercel/output/` | **الإنتاج** (Vercel، ينشر تلقائيًا من `main`) |
| `npm run build` | `dist/_worker.js` | Cloudflare Pages + المعاينة المحلية بـ wrangler |
| `npm run build:node` | `dist-node/server.mjs` | Docker / VPS |

لا تستورد وحدات Node (`fs`, `path`) في `src/` عدا `server.node.ts` — يكسر Vercel Edge وCloudflare.

## 4. `app.js` — تحسين تدريجي

| الوحدة | الوظيفة |
|---|---|
| toast | رسالة نسخ قصيرة |
| header | ظل بعد التمرير |
| menu sheet | قائمة الجوال (`#menuBtn` / `#topNav`)، Esc يغلق، التركيز محفوظ |
| reveal | `.rv` → `.in` (المحتوى ظاهر بدون JS) |
| FAQ | سؤال واحد مفتوح |
| share/copy | مشاركة الرابط |
| bnav | الشريط السفلي يختفي ما دام أزرار البطل ظاهرة |
| gallery | «عرض الكل» + فلتر الفئات |
| lightbox | `<dialog>` بثلاث صفوف، أسهم + سحب + لوحة مفاتيح، يقفل تمرير الصفحة |
| rails | أسهم الأشرطة + تقدّم تلقائي عند الظهور فقط |
| booking | يبني رسالة واتساب من اختيارات الحجز السريع |
| tracking | `click_call` · `click_whatsapp` · `booking_submit` · `click_email` من `a[data-track]` |
| go gate | يضيف `html.go` بعد التحميل بـ4 ثوانٍ لتشغيل حركة البطل (لا تؤثر على LCP) |

## 5. من أين أبدأ؟

| أريد | أفتح |
|---|---|
| تغيير نص/رقم/صنف | `src/data.ts` |
| صفحة كلمة مفتاحية جديدة لجدة | `src/jeddah.ts` (تُضاف للمسارات والتذييل وخريطة الموقع تلقائيًا) |
| صورة جديدة | `public/static/img/{name}-{sm,md}.webp` + سطر في `imgmap.ts` (انظر `05-performance.md`) |
| تنسيق | آخر `style.css` + رفع `V` في `layout.tsx` |
| تحويل رابط قديم | `MOVED` في `src/index.tsx` |

</div>
