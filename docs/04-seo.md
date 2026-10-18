<div dir="rtl">

# 04 — السيو والفهرسة

> المرجع الوحيد لكل ما يخصّ ظهور qahwajeen.com في محركات البحث.
> كل رقم هنا ناتج عن تشغيل `qa/scripts/index_audit.py` و`qa/scripts/seo.py`
> على الموقع المنشور — لا تقديرات.

**آخر قياس (2026-10-18، الموقع الحي):**

```
index_audit.py → 23 رابطًا · 23 تُرجع 200 · 64 صورة فريدة في خريطة الموقع
                 (كل صورة ظاهرة لها نص بديل = مُدرَجة) · 0 رابط داخلي مُحوَّل أو مكسور
                 · 0 صفحة يتيمة · 0 رابط داخل JSON-LD لا يُرجع 200 · issues: 0
seo.py         → 23 رابطًا · 0 عنوان مكرّر · 0 وصف مكرّر · أطول عنوان 60 · issues: 0
```

---

## 1. المبدأ: رابط واحد لكل نيّة بحث، جدة فقط

لا صفحات مدن متشابهة، ولا نسخ من نفس الصفحة بكلمة مختلفة (doorway pages).
كل صفحة تجيب عن **نيّة بحث واحدة** بنص مكتوب لها.

| الرابط | نيّة البحث | ملف المحتوى |
|---|---|---|
| `/` | قهوجي وصبابين جدة | `data.ts` |
| `/services` | خدمات الضيافة في جدة | `data.ts → SERVICES` |
| `/services/{qahwajiin,zamzam,offerings,buffet,equipment,royal,extras}` | كل خدمة منفردة | `data.ts → SERVICES` |
| `/occasions` | ضيافة مناسبات جدة | `data.ts → OCCASIONS` |
| `/occasions/{graduation,newborn,camps}` | كل مناسبة منفردة | `data.ts → OCCASIONS` |
| `/qahwajiat-jeddah` | قهوجيات وصبابات جدة | `jeddah.ts` |
| `/mubashirin-jeddah` | مباشرين قهوة جدة | `jeddah.ts` |
| `/diyafat-zawajat-jeddah` | ضيافة زواجات جدة | `jeddah.ts` |
| `/coffee-break-jeddah` | كوفي بريك شركات جدة | `jeddah.ts` |
| `/diyafat-aza-jeddah` | ضيافة عزاء جدة | `jeddah.ts` |
| `/menu` | منيو / تقديمات ضيافة جدة (صفحة واحدة بكل الأقسام) | `data.ts → MENU` |
| `/gallery` | صور أعمال ضيافة جدة | `data.ts → GALLERY` |
| `/faq` | أسئلة حجز قهوجي | `data.ts → FAQ` |
| `/booking` | حجز سريع | `onepage.tsx` |
| `/links` | التواصل + من نحن | `views.tsx` |

**المجموع: 23 صفحة مفهرسة.** أي صفحة جديدة يجب أن تجيب عن نيّة بحث غير
مغطّاة — وإلا فهي تنافس صفحة موجودة وتضعفها.

### 1.1 صفحة خدمة/مناسبة لها صفحة كلمة مفتاحية

عندما تملك نيّة البحث صفحة في `jeddah.ts`، تُحوَّل صفحة الخدمة/المناسبة
القديمة إليها، ولا تُدرَج في خريطة الموقع. يُدار ذلك من مكان واحد:

```ts
// src/data.ts
SVC_URL = { qahwajiat: '/qahwajiat-jeddah' }
OCC_URL = { weddings: '/diyafat-zawajat-jeddah', condolences: '/diyafat-aza-jeddah', corporate: '/coffee-break-jeddah' }
svcUrl(slug) / occUrl(slug)   // كل رابط داخلي و JSON-LD يمرّ عبرهما
```

---

## 2. التحويلات 301 (قفزة واحدة دائمًا إلى صفحة 200)

| من | إلى | السبب |
|---|---|---|
| `/about` `/contact` `/prices` `/social` `/qr` | `/links` | دُمجت في صفحة واحدة |
| `/concierge` | `/booking` | |
| `/locations` `/locations/*` | `/` | الخدمة في جدة فقط |
| `/{qahwajiin,sababin-qahwa,diyafa-munasabat}-{مدينة}` | `/` | صفحات المدن الأخرى أُلغيت |
| `/qahwajiin-jeddah` `/sababin-qahwa-jeddah` | `/` | نفس نيّة الرئيسية |
| `/diyafa-munasabat-jeddah` | `/occasions` | |
| `/services/qahwajiat` | `/qahwajiat-jeddah` | `SVC_URL` |
| `/occasions/{weddings,condolences,corporate}` | صفحة جدة المقابلة | `OCC_URL` |
| `/menu/{slug}` | `/menu#{slug}` | التقديمات صفحة واحدة (مثل keifaldiafa.com/offerings) |
| `/sitemap-images.xml` | `/sitemap.xml` | خريطة واحدة تشمل الصور |
| `www.qahwajeen.com/*` | `qahwajeen.com/*` | نطاق واحد |
| `/أي-مسار/` | بدون الشرطة الأخيرة | رابط واحد لكل صفحة |

`index_audit.py` يتحقق من أن كل تحويل قفزة واحدة إلى 200.

---

## 3. وسوم `<head>` في كل صفحة (`src/layout.tsx`)

| الوسم | القيمة |
|---|---|
| `<html lang="ar" dir="rtl">` | |
| `<title>` | ≤ 60 حرفًا شاملة « \| القهوة الملكية» — `fit()` في `pages.tsx` يقصّ بحدود الكلمات |
| `meta description` | فريد، 60–165 حرفًا |
| `link canonical` | الرابط المطلق نفسه على `https://qahwajeen.com` |
| `hreflang` | `ar-SA` + `x-default` إلى نفس الرابط |
| `meta robots` | `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` |
| Open Graph / Twitter | عنوان، وصف، صورة 200، نص بديل للصورة |
| `google-site-verification` / `msvalidate.01` | تظهر فقط عند تعبئة `SEARCH` في `data.ts` |

صفحة 404: `noindex,follow` وحالة HTTP 404.
روابط المعاينة `*.vercel.app` و`*.pages.dev`: ترويسة `X-Robots-Tag: noindex, nofollow`.

---

## 4. البيانات المنظّمة (JSON-LD) — `src/ld.ts`

| النوع | أين | ملاحظات |
|---|---|---|
| `LocalBusiness` | الرئيسية، `/links` | `@id = https://qahwajeen.com/#business`؛ كل العُقد الأخرى تشير إليه. الهاتف، البريد، جدة، `hasOfferCatalog` بروابط الخدمات القانونية |
| `WebSite` | الرئيسية | |
| `Service` | كل صفحة خدمة وكل صفحة جدة | `provider → #business`، `areaServed = جدة` |
| `FAQPage` | 11 صفحة | الأسئلة نفسها ظاهرة في الصفحة (شرط Google) |
| `BreadcrumbList` | 22 صفحة | كل الصفحات عدا الرئيسية |
| `Menu` + `MenuSection` + `MenuItem` | `/menu` | كل قسم بـ `url: /menu#slug` |
| `ImageGallery` + `ImageObject` | `/gallery` + صفحة | لكل صورة: `contentUrl`، `caption`، `width/height`، `creator → #business`، `creditText`، `copyrightNotice` (مؤهّلة لـ «بيانات الترخيص» في صور Google) |
| `ContactPage` | `/links` | |

**ممنوع:** `AggregateRating` / `Review` / `Offer` بسعر — لا توجد تقييمات ولا أسعار حقيقية.

---

## 5. الصور — كيف تُفهرس كل صورة

1. **الصورة ذات المحتوى = `<img>` بنص بديل غير فارغ.**
   النص البديل الفارغ `alt=""` معناه «زخرفية» (الشعار بجانب اسمه، خلفيات
   البطل، خلفية قسم التواصل) — لا تُفهرس عمدًا.
2. **خريطة الموقع تُبنى من HTML المُولَّد نفسه** (`pageImages()` في
   `src/index.tsx`): الخادم يرسم كل صفحة داخليًا، ويستخرج كل صورة لها نص
   بديل، ويضعها تحت رابط صفحتها بأكبر مقاس متاح. **أي صورة تُضاف لأي صفحة
   تدخل خريطة الموقع تلقائيًا** — لا قائمة يدوية تنسى.
3. النتيجة محسوبة مرّة واحدة لكل نسخة منشورة (ذاكرة في `sitemapCache`).
4. `robots.txt` لا يحجب `/static/` — جوجل يصل للصور والـ CSS.
5. كل صورة WebP، ≤ 300KB، `width`/`height` مطابقة للملف الحقيقي
   (`index_audit.py` يقارن `imgmap.ts` بالملفات على القرص).
6. أسماء الملفات وصفية (`dates-stuffed`، `ev-women-2`…)، والنص البديل
   يتبع الصيغة: **ما في الصورة — القهوة الملكية** (وأحيانًا «في جدة»).

### صور ممنوعة
صور تُظهر شعارات أو أسماء شركات أخرى (أجنحة معارض) لا تُستخدم — تعطي
انطباع «شريك» غير موثّق. حُذفت `ev-booth-1/3/4/5/8` لهذا السبب.

---

## 6. ملفات الآلة

```
/robots.txt              User-agent: * · Allow: / · Sitemap: https://qahwajeen.com/sitemap.xml
/sitemap.xml             23 <url> · <lastmod>=CONTENT_DATE · <image:image> لكل صورة محتوى
/{indexNowKey}.txt       مفتاح IndexNow (علني بطبيعة البروتوكول)
```

`CONTENT_DATE` في `data.ts`: **حدّثه عند كل تغيير محتوى حقيقي** — جوجل
يتجاهل `lastmod` إن كان يتغيّر بلا تغيير فعلي.

---

## 7. ربط محركات البحث (خطوات المالك)

| المحرك | الطريقة | ما يلزم في الكود |
|---|---|---|
| **Google Search Console** | خاصية «بادئة URL» `https://qahwajeen.com/` → طريقة «علامة HTML» | الصق قيمة `content` في `SEARCH.googleVerify` ثم انشر. لا يحتاج DNS. بعد التحقق: «خرائط المواقع» → `sitemap.xml` |
| **Bing Webmaster** | «استيراد من Google Search Console» أو علامة HTML | `SEARCH.bingVerify` (اختياري إن استوردت) |
| **IndexNow** (Bing، Yandex، Seznam، Naver) | جاهز | بعد كل نشر: `python3 qa/scripts/indexnow.py` |
| **Google Business Profile** | يدوي من المالك | أهم مصدر لنتائج «قريب مني» والخرائط — يحتاج قرار المالك (الموقع لا يعرض خرائط حاليًا) |

---

## 8. الروابط الداخلية

- القائمة العلوية: 7 صفحات رئيسية.
- التذييل: نفس الصفحات + **صفحات جدة الخمس** — كل صفحة مفهرسة لها رابط من كل الصفحات.
- كل بطاقة خدمة/مناسبة تربط بصفحتها القانونية عبر `svcUrl/occUrl` (لا رابط داخلي يمرّ بتحويل).
- `/menu` ترتبط بصفحات الطاقم؛ الرئيسية ترتبط بأقسام `/menu#…`.

---

## 9. التحقق بعد أي تعديل

```bash
npm run build && (npx wrangler pages dev dist --ip 0.0.0.0 --port 3000 &)
python3 qa/scripts/index_audit.py            # الفهرسة: صفحات + صور + تحويلات + JSON-LD
python3 qa/scripts/seo.py                    # العناوين والأوصاف والوسوم
# بعد النشر
python3 qa/scripts/index_audit.py https://qahwajeen.com
python3 qa/scripts/seo.py https://qahwajeen.com
python3 qa/scripts/indexnow.py
```

## 10. ما لا يمكن التحقق منه من داخل الكود

- هل جوجل **فهرس** الصفحات فعلًا؟ لا يُعرف إلا من Search Console
  (تقرير «الصفحات» و«فحص عنوان URL»). يحتاج تحقّق المالك أولًا (القسم 7).
- الترتيب في النتائج يعتمد أيضًا على عوامل خارج الموقع (Google Business
  Profile، الروابط الخارجية، عمر النطاق) — لا يضمنه أي كود.

</div>
