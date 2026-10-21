<div dir="rtl">

# HANDOFF — اقرأ هذا أولًا

> وثيقة التسليم لأي مطوّر أو وكيل ذكاء اصطناعي يستلم المشروع في بيئة جديدة.
> تشرح: ما هو المشروع، القواعد التي لا تُكسر، أين كل شيء، كيف تعمل وتنشر
> وتتحقق، ما بُحث فيه، ما فشل ولماذا، وما الذي ينتظر.
> **آخر تحديث: 2026-10-21 · الإنتاج: commit `bdad0b6` على Vercel · فرع التطوير `genspark_ai_developer` فيه v4.5 (الصور) + v4.6 (ختم فكتوري معتم) — لم يُنشر بعد.**

---

## 0. في 30 ثانية

- **الموقع:** https://qahwajeen.com — علامة **«القهوة الملكية» (ROYAL COFFEE)**.
- **النشاط:** حجز ضيافة مناسبات في **جدة فقط**: قهوجيين وصبابين، قهوجيات وصبابات، تقديمات، عدّة.
- **الجمهور:** 99٪ جوال، مستعجل، قادم من بحث Google أو إعلان.
- **الهدف الوحيد لكل صفحة:** أن يتصل الزائر أو يراسل واتساب على **0504968113**.
- **التقنية:** Hono + TypeScript + JSX على الخادم، بلا إطار واجهات. Vite للبناء.
- **الإنتاج:** Vercel، ينشر تلقائيًا من `main` في المستودع الخاص `MoTechSys/qahwajeen`.
- **الحالة:** منشور ويعمل. الفحوص كلها ناجحة (القسم 6). ينتظر المالك: Search Console، Google Business، GA4/Ads.

---

## 1. القواعد التي لا تُكسر (من المالك حرفيًا)

### الهوية والتواصل
- الاسم **«القهوة الملكية»** والدومين **qahwajeen.com** لا يتغيّران.
- **لا تلمس «ضيافة الكيف»** ولا مشاريع المالك الأخرى (القسم 9).
- الهاتف/واتساب: `0504968113` · `wa.me/966504968113`. البريد: `qahwajeen@gmail.com`.
- حسابات التواصل الاجتماعي **مخفية**. **لا خرائط**.
- «من نحن» و«تواصل» موجودتان **فقط** كصفحة `/links`.
- حقوق المطوّر في التذييل تبقى: **Alabbasi Tech — https://alabbasi.uk**.

### المحتوى
- **جدة فقط.** لا صفحات مدن أخرى.
- **رابط واحد لكل نيّة بحث.** لا صفحات مكرّرة أو رقيقة أو doorway. تحويلات 301 بقفزة واحدة.
- **ممنوع:** أسعار، باقات، تقييمات، شعارات شركاء، صور فيها شعارات شركات أخرى.
- **ادعاءات محذوفة ولا تعود:** ٢٤/٧، «١٠ ثوانٍ»، «خلال دقائق»، «بساعتين»، فواتير، ١٠٠٪، «+١٢٠٠ مناسبة»، مدن أخرى.

### التصميم
- **زمرّدي داكن + ذهبي، لا خلفيات بيضاء.** فخم، بسيط، سريع، موثوق.
- **زر رئيسي واحد في كل شاشة.** كل عنصر يقود لاتصال أو واتساب.
- الحركة `transform`/`opacity` فقط وتحترم `prefers-reduced-motion`.
- أهداف اللمس ≥ 44px. لا فائض أفقي على 320 و390.
- **التقديمات صفحة واحدة** على نمط keifaldiafa.com/offerings — لا صفحة لكل قسم.

### الجودة
- Lighthouse جوال: وصول، أفضل ممارسات، SEO = **100**؛ أداء **≥ 90**.
- **بعد كل نشر: افحص الموقع الحي** قبل أن تقول «تم». قل بوضوح ما تحققت منه وما لم تتحقق.
- **لا تدّعِ شيئًا بلا قياس.**

### الأمان والصلاحيات
- **لا تطبع مفاتيح ولا تضعها في المستودع.**
- **لا DNS، لا Nameservers، لا شراء، لا حذف** دون طلب صريح من المالك.
- **النشر مسموح** (أذن به المالك) بالطريقة في القسم 5.
- **مؤلف كل commit يُنشر:** `MoTechSys <256226456+MoTechSys@users.noreply.github.com>` — غيره يُحجب على Vercel (BLOCKED).

---

## 2. المستودعات والفروع

**مستودعان متطابقان تمامًا** (نفس الفروع ونفس الكوميتات ونفس الوسوم):

| المستودع | الوصول | الدور |
|---|---|---|
| `github.com/MoTechSys/qahwajeen` | **خاص** | **النشر.** Vercel يراقب `main` فيه — أي دفع إلى `main` يُنشر على qahwajeen.com خلال ~30 ثانية |
| `github.com/moain2026/royal-coffee-docs` | **عام** | **التطوير.** نسخة مطابقة للعمل والمراجعة. لا يرتبط بأي نشر. **لا ترفع إليه مفاتيح أبدًا** |

| الفرع | المحتوى |
|---|---|
| `main` | **الإنتاج.** كوميت واحد مضغوط لكل نشر، مؤلفه MoTechSys |
| `audit/v4` | خط التطوير التفصيلي (كل كوميتات v4 → اليوم). اعمل هنا أو في فرع منه |
| `genspark_ai_developer` | فرع عمل وكيل Genspark — مساوٍ لـ `main` عند كل مزامنة |
| `design/v3-editorial` | أرشيف: أول نسخة نُشرت (`8130348`) |
| `design/v2-glass-card` | أرشيف: تصميم البطاقة الزجاجية السابق |
| `feature/royal-merge` | أرشيف: آخر نسخة قبل التدقيق (`fc77e55`) |
| وسم `archive/pre-v4-main` | `main` القديم في مستودع التطوير قبل التوحيد (`fc77e55`) |

**الريموتات المحلية:** `prod` = MoTechSys/qahwajeen · `origin` = moain2026/royal-coffee-docs.

### المزامنة — بعد كل نشر، ادفع نفس المراجع للمستودعين

```bash
H="store --file=$HOME/.qahwa-secrets/git-cred"          # رمز MoTechSys
P="git -c credential.helper= -c credential.helper=$H"   # للمستودع الخاص
REFS="release/prod:main audit/v4:audit/v4 release/prod:genspark_ai_developer"
$P push prod $REFS                                       # 1) النشر أولًا
git push origin $REFS --force-with-lease                 # 2) ثم التطوير (رمز moain2026 من بيئة العمل)
git push origin --tags && $P push prod --tags
# تحقق التطابق:
diff <($P ls-remote prod | sort -k2) <(git ls-remote origin | grep -v refs/pull | sort -k2) && echo IDENTICAL
```
لا تدفع إلى `main` في مستودع التطوير شيئًا لم يُدفع إلى الإنتاج — يبقيان متطابقين.

> **ملاحظة Vercel:** كل فرع يُدفع إلى المستودع الخاص يصنع «معاينة» (Preview) على
> `*.vercel.app` — لا تمسّ الإنتاج، وعليها `noindex`. معاينة `design/v2-glass-card`
> تظهر **BLOCKED** لأن كوميتها القديم ليس باسم MoTechSys — متوقّع ولا يؤثر على شيء.

### تاريخ الإنتاج (`MoTechSys/qahwajeen main`)
| الكوميت | النسخة | المحتوى |
|---|---|---|
| `8130348` | v3 | أول نشر على qahwajeen.com |
| `b5e376c` | v4 | التدقيق الشامل: رابط لكل نيّة، جدة فقط، حذف الادعاءات، ترويسة جديدة، أداء |
| `b910f9f` | v4.1 | نافذة الصور + التقديمات صفحة واحدة |
| `bdad0b6` | v4.2 | الفهرسة الكاملة (صور الخريطة، يتيمة، JSON-LD) + تنظيف الصور + التوثيق |
| `82c3e40` | v4.3 | التوثيق والتسليم (`HANDOFF.md`، `qa/tools/`) — لا تغيير في الموقع |
| (التالي) | v4.4 | توحيد المستودعين + توثيق المزامنة — لا تغيير في الموقع |
| (معلّق) | v4.5 | **الصور**: تدقيق 116 صورة بالعين، أسماء SEO، وصف حقيقي، علامة مائية بلا وجوه، حقوق EXIF/XMP/JSON-LD، تمويه شعارات الآخرين، تصحيح «سقيا زمزم» و«السوّاس»، 301 للصور القديمة، `tel:+966` — `docs/09-images-watermark.md` |
| (معلّق) | v4.6 | **ختم مائي فكتوري معتم** (قرص زمردي + شعار ذهبي + شريط اسم) بدل الذهبي الشفاف — تباين 13.2:1، 0 وجوه، `/favicon.ico` → 301، `V=31` — `docs/09` §3 و`qa/images-v46/` |

---

## 3. خريطة المشروع

```
HANDOFF.md            ← هذا الملف
README.md             نظرة عامة + أوامر التشغيل
docs/01..08           التوثيق التفصيلي (البنية، التصميم، المحتوى، السيو، الأداء، النشر، القرارات، المتبقّي)
src/                  الكود (انظر docs/01-architecture.md)
  data.ts             ← كل المحتوى والإعدادات (BRAND, TRACKING, SEARCH, MENU, GALLERY…)
  jeddah.ts           ← صفحات الكلمات المفتاحية الخمس
public/static/        style.css · app.js · fonts/ · img/ (كل الصور WebP)
qa/scripts/           فحوص رسمية: index_audit.py · seo.py · btn.py · indexnow.py (+ أدوات لقطات)
qa/tools/             أدوات العمل اليومية (Lighthouse، لقطات، فائض، حذف CSS الآمن…) — القسم 6
qa/audit-v4/          تقرير التدقيق الشامل v4 وأدلّته (أرشيف)
research/             تحليل المنافسين (keifaldiafa.com، asoulaldiafa.com) وأصولهم — للدراسة فقط
vercel.json           إعداد الإنتاج
wrangler.jsonc        Cloudflare (للمعاينة المحلية)
Dockerfile            بديل حاويات (غير مستخدم)
```

### الصفحات (23 مفهرسة)
`/` · `/services` + 7 خدمات · `/occasions` + 3 (تخرّج، مواليد، مخيمات) ·
`/qahwajiat-jeddah` · `/mubashirin-jeddah` · `/diyafat-zawajat-jeddah` · `/coffee-break-jeddah` · `/diyafat-aza-jeddah` ·
`/menu` · `/gallery` · `/faq` · `/booking` · `/links`.
التحويلات كاملة في `docs/04-seo.md` §2.

---

## 4. تجهيز بيئة جديدة

```bash
# 1) الكود
git clone https://github.com/MoTechSys/qahwajeen.git webapp && cd webapp   # يحتاج رمز MoTechSys
npm ci

# 2) أدوات الفحص
pip install playwright pillow && python3 -m playwright install chromium
# TypeScript (غير مثبّت كاعتمادية؛ ثبّته خارج المشروع):
mkdir -p /tmp/tscheck && (cd /tmp/tscheck && npm i typescript@5) 
# Lighthouse: npx lighthouse (يحتاج CHROME_PATH لـ Chromium)

# 3) تشغيل محلي
npm run build && npx wrangler pages dev dist --ip 0.0.0.0 --port 3000
```

### الأسرار (خارج المستودع دائمًا)
المالك يملك ملفًا اسمه **`QAHWAJEEN_ALL_CONNECTIONS.txt`** فيه: مفاتيح Spaceship
API، رمز Vercel، رمز GitHub لـ MoTechSys، معرّفات الفريق والمشروع، وسجل
الأحداث. **اطلبه من المالك.** طريقة التجهيز (مكتوبة داخله، الخطوة A):

```bash
mkdir -p ~/.qahwa-secrets && chmod 700 ~/.qahwa-secrets
# env.sh: يصدّر SPACESHIP_API_KEY/SECRET, VERCEL_TOKEN, VERCEL_TEAM, VERCEL_PROJECT, GH2_TOKEN
#         ويعرّف الدوال ss_api / vc / gh2 (curl بالترويسات المناسبة)
# git-cred: سطر واحد https://x-access-token:<TOKEN>@github.com/MoTechSys/qahwajeen.git
source ~/.qahwa-secrets/env.sh
```
**غير سري (يجوز في المستودع):** `VERCEL_TEAM=team_3AEMXZJset4pSyLO7T7LZXMa`،
`VERCEL_PROJECT=prj_EyhgUqgrq6HljO7brWKuPOxnJfxP`، repoId `1423877867`، مفتاح IndexNow في `data.ts`.

بعد أي عمل: **حدّث «سجل الأحداث» في آخر ملف الاتصالات** وأعطِ المالك نسخة.

---

## 5. طريقة العمل (Workflow) — كما طُبّقت فعلًا

1. **اعمل على `audit/v4`** (أو فرع جديد منه). كوميتات صغيرة واضحة.
2. **عند كل تعديل CSS/JS ارفع `V`** في `src/layout.tsx` (حاليًا `'29'`) — الملفات الثابتة immutable سنة.
   عند استبدال صورة بمحتوى مختلف **غيّر اسم الملف**.
3. **الفحص المحلي (كلها يجب أن تنجح):**
   ```bash
   timeout 90 /tmp/tscheck/node_modules/.bin/tsc --noEmit -p .
   npm run build && npm run build:vercel
   python3 qa/scripts/index_audit.py        # issues: 0
   python3 qa/scripts/seo.py                # issues: 0
   python3 qa/scripts/btn.py                # clipped: 0 · under-44px: 0
   CHROME_PATH=… bash qa/tools/lhrun.sh / /menu /gallery
   ```
   + لقطات شاشة للتغيير البصري على 320 و390 و1280 (`qa/tools/pshot.py`) **وانظر إليها**.
4. **النشر — كوميت واحد مضغوط باسم MoTechSys فوق `prod/main`:**
   ```bash
   git -c credential.helper= -c credential.helper="store --file=$HOME/.qahwa-secrets/git-cred" fetch prod
   export GIT_AUTHOR_NAME=MoTechSys GIT_AUTHOR_EMAIL=256226456+MoTechSys@users.noreply.github.com
   export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL
   NEW=$(git commit-tree "$(git rev-parse HEAD^{tree})" -p prod/main -m "type(scope): وصف")
   git branch -f release/prod $NEW
   git -c credential.helper= -c credential.helper="store --file=$HOME/.qahwa-secrets/git-cred" push prod release/prod:main
   ```
   `-c credential.helper=` يلغي مساعد الاعتماد العام في البيئة (كان يُفشل الدفع).
5. **انتظر READY:**
   `vc "/v6/deployments?projectId=$VERCEL_PROJECT&teamId=$VERCEL_TEAM&limit=1"` → `state`.
6. **افحص الحي:** `index_audit.py https://qahwajeen.com` · `seo.py https://qahwajeen.com` ·
   Lighthouse على الحي · `qa/tools/live.py` (أخطاء Console + فائض) · `python3 qa/scripts/indexnow.py`.
7. **بلّغ المالك بالعربية:** ما تغيّر، ما تحقّقت منه بالأرقام، ما لم تتحقق منه.

**التراجع:** Vercel → Deployments → السابق → Promote، أو `git revert` + دفع.

---

## 6. أدوات الفحص

| الأداة | الغرض |
|---|---|
| `qa/scripts/index_audit.py [base]` | **الأهم.** زحف كامل: 200/noindex/canonical/H1، روابط داخلية لتحويل أو 404، صفحات يتيمة، كل صورة محتوى في الخريطة، صور الخريطة 200 و≤300KB، أبعاد `imgmap.ts` = الملفات، روابط JSON-LD = 200، og:image، التحويلات القديمة |
| `qa/scripts/seo.py [base]` | العناوين ≤60 والأوصاف وتكرارها، OG، lang/dir، نص بديل |
| `qa/scripts/btn.py` | 13 صفحة × 320/390/1440 + القائمة مفتوحة: قصّ النص، أهداف < 44px |
| `qa/scripts/indexnow.py` | إبلاغ Bing/Yandex بعد النشر |
| `qa/tools/lhrun.sh <paths>` | Lighthouse جوال محلي → `/tmp/lh/*.json` (يحتاج `CHROME_PATH`) |
| `qa/tools/pshot.py <path> <out.png> <h>` | لقطة صفحة كاملة 390px مع إجبار الصور الكسولة |
| `qa/tools/lbshot.py [base] [tag]` | يفتح نافذة الصور في المعرض ويقيس مواضع الأزرار والصورة على 320/390/1280 |
| `qa/tools/ov.py` · `small.py` | فائض أفقي وارتفاع الترويسة · روابط أقل من 44px |
| `qa/tools/snap.py <dir>` | لقطات 11 صفحة × 390/1280 — للمقارنة بالبكسل قبل/بعد |
| `qa/tools/usedsel.py` + `mypurge.js` | **الحذف الآمن لـ CSS:** يجمع المحدّدات المطابقة فعلًا في المتصفح على كل الصفحات، ثم يحذف ما لم يطابق شيئًا (مع إبقاء أصناف الحالة). ثم `snap.py` قبل/بعد ومقارنة بـ PIL. يحتاج `postcss` |
| `qa/tools/live.py` | فحص الحي: أخطاء Console، فائض، القائمة، الحجز |
| `qa/tools/build_images.py` | **يبني كل الصور** من `assets/img-src` + `assets/catalog.json`: علامة مائية تتجنّب الوجوه، تمويه شعارات، EXIF/XMP، `imgmap.ts` و`imgmeta.ts` |
| `qa/tools/compare_competitors.py` | مطابقة إدراكية لصورنا مع خرائط صور المنافسين |

---

## 7. ما بحثنا فيه (Research)

| الموضوع | النتيجة | المكان |
|---|---|---|
| **keifaldiafa.com و asoulaldiafa.com** (منافسان، Next.js + Tailwind) | نفس بالتة الذهب حرفيًا (`#c5a059/#e2c68e/#a67c37/#85642e`). أصول أرقى (أسود أعمق، لؤلؤ دافئ، Amiri). استعرنا: الإيقاع البصري، صفحة `/links`، **هيكل `/offerings`** (أقسام بعدد وسطر وزر «اطلب» وواتساب معبّأ) | `research/competitor-analysis/ANALYSIS.md` + 32 لقطة + HTML خام |
| **هيكل keifaldiafa.com/offerings** | فتات → «التقديمات والمعدات» → H2 «ما الذي يصل إلى ضيوفك؟» → أقسام (حارة، باردة، تمور، حلويات، معجنات، سناكات، سندوتشات، فواكه، مكسرات) → معدات (47 قطعة) → توزيعات → «تصل مع طاقمها» → 4 أسئلة → تواصل. **لم ننسخ** «عروض أسعار وعقود وفواتير» ولا منتجات شركائهم | طُبّق في `MenuSec` |
| **خرائط مواقع وأصول المنافسين** | جرد صورهم ومقاساتهم وخرائطهم | `research/asset-harvest/` |
| **تدقيق v4 الشامل** (قبل أي تعديل) | 79 صفحة، 40 صفحة مدن بتشابه 90–97٪، QR معطّل، شعارات 11 جهة كبرى، صورة بعلامة حراج، صور بشعارات شركات، لا تتبّع، أداء 69–90، ادعاءات بلا مصدر في كل الصفحات | `qa/audit-v4/AUDIT.md` + `PER-PAGE.md` |
| **أسماء دومين بديلة** (قراءة فقط) | qahwamalakiya.com، alqahwa-almalakiya.com، royal-qahwa.com، qahwaji-jeddah.com متاحة؛ alqahwaalmalakiya.com مأخوذ. **لم يُشترَ شيء** | ملف الاتصالات |
| **Spaceship Hyperlift** | الـ API لا يستطيع إنشاء تطبيق (اللوحة فقط) → اخترنا Vercel | ملف الاتصالات |

---

## 8. ما فشل أو أخطأنا فيه — ولا تكرّره

| الخطأ | ماذا حدث | الدرس |
|---|---|---|
| **purgecss أعمى** | حذف قواعد مستخدمة (حالات JS، القائمة، نافذة الصور) فانكسر الشكل | لا تحذف CSS إلا بالمحدّدات المطابقة في المتصفح + مقارنة لقطات بالبكسل (`qa/tools/usedsel.py` + `mypurge.js` + `snap.py`) |
| **نافذة الصور** | الصورة منزاحة والأسهم فوق حوافها وشريط فاتح على اليمين. **المالك اكتشفه لا نحن** — فحوصنا لم تفتح النافذة | كل مكوّن تفاعلي يُفتح ويُصوَّر في الفحص. الآن `qa/tools/lbshot.py` |
| **صفحة لكل قسم منيو** (`/menu/coffee`…) | تشتيت، صفحات رقيقة. المالك رفضها | صفحة واحدة؛ القديمة 301 إلى `/menu#slug` |
| **40 صفحة مدن** | تشابه 90–97٪ (doorway) + ادعاء تغطية غير حقيقية | جدة فقط، رابط لكل نيّة |
| **خريطة صور يدوية** | أغفلت ~40 صورة؛ صفحة `/mubashirin-jeddah` كانت يتيمة؛ JSON-LD يشير لرابط محوَّل | الخريطة تُبنى الآن من HTML المرسوم؛ `index_audit.py` يكشف اليتيمة والروابط المحوّلة |
| **QR قديم** | كان يوجّه إلى `royal-coffee.pages.dev` (غير موجود). بعد إصلاحه بقي الكاش يخدم القديم | الملفات الثابتة immutable → **اسم ملف جديد** (`qr-links.png`) |
| **شعارات «شركاء» وصور بشعارات شركات** | بلا موافقة مكتوبة؛ بعضها لشركة ضيافة منافسة | حُذفت كلها؛ افحص كل صورة جديدة بصريًا |
| **زر «واتساب فوري» مقصوص على 320** | | `<span class="w-xs">` يخفي «فوري» تحت 359px؛ `btn.py` على 320 |
| **دفع git فشل** | مساعد اعتماد عام في البيئة | `-c credential.helper=` قبل المساعد الخاص |
| **Vercel BLOCKED** | مؤلف الكوميت غير MoTechSys (خطة Hobby) | `commit-tree` بمتغيرات المؤلف/الناشر |
| **لقطة بطل فارغة على الحي** | توقيت اللقطة أثناء حركة الدخول، لا خلل | انتظر أو استخدم `reduced_motion` في اللقطات |
| **وصف الصور من اسم الملف** | فناجيل قهوة وُصفت «سقاية زمزم»، جرار زمزم وُصفت «سوقية»، مبخرة اسمها `eq-dallah`، 6 صور مكرّرة بأسماء مختلفة | كل صورة تُوصف **بالنظر إليها** في `assets/catalog.json`؛ alt لا يأخذ سياق الصفحة |
| **الادعاء قبل القياس** | «تم» قبل فحص الحي في جولات سابقة | لا «تم» قبل `index_audit` + `seo` + Lighthouse على الحي |

---

## 9. ممنوع اللمس

- **basirapp.site** (في نفس حساب Spaceship) — لا قراءة ولا تعديل.
- **مشاريع Vercel الأخرى:** `keif-v2` (keifaldiafa.com)، `osoul-aldiafa-v2` (asoulaldiafa.com)، `keif-v2-1`، `electricity-billing-pwa-v2`.
- **Nameservers** qahwajeen.com (`launch1/launch2.spaceship.net`) — تغييرها يمحو DNS.
- **«ضيافة الكيف»** كعلامة.

---

## 10. ما ينتظر (بالترتيب)

0. **نشر v4.5 + v4.6 على الإنتاج** — رمز moain2026 لا يصل إلى `MoTechSys/qahwajeen` (404). يحتاج رمز MoTechSys (القسم 4) ثم خطوات القسم 5 كما هي.
0. **قرار المالك عن مصدر الصور** — 66 صورة تطابق صور keifaldiafa.com (`docs/09-images-watermark.md` §6). الأفضل: صور فعالياتك الحقيقية تدريجيًا عبر `assets/catalog.json`.

1. **Search Console** — المالك ينشئ خاصية «بادئة URL» بطريقة «علامة HTML» ويعطي قيمة `content` →
   ضعها في `SEARCH.googleVerify` (`src/data.ts`) → انشر → تحقّق → أرسل `sitemap.xml`. لا يحتاج DNS.
2. **Google Business Profile** — أقوى عامل لنتائج الخرائط. خارج الكود.
3. **GA4 / Google Ads** — املأ `TRACKING` في `data.ts`. الأحداث جاهزة:
   `click_call` · `click_whatsapp` · `booking_submit` · `click_email`، مع Consent Mode v2.
4. **أداء الرئيسية** 86–94 (الهدف ≥90). المصدر TBT. الخيارات: تقليل أقسام الرئيسية، تأخير شريط الأعمال.
5. **اختبار السحب في نافذة الصور على آيفون حقيقي** — لم يُختبر.
6. **تدوير المفاتيح** (Spaceship، Vercel، GitHub) — مكتوبة في محادثات سابقة.

تفاصيل أكثر: `docs/08-roadmap.md`.

---

## 11. أسلوب التعامل مع المالك

- يكتب بلهجة سعودية مختصرة. **الرد بالعربية الفصحى المبسّطة**، مختصر، بجداول، بلا مصطلحات غير لازمة.
- يريد **الدقة والقياس**: كل ادعاء برقم، وقل صراحة ما لم تتحقق منه.
- يكره التشتيت والتكرار: صفحة واحدة واضحة أفضل من صفحات كثيرة.
- يقارن دائمًا بـ keifaldiafa.com — ادرس الصفحة المقابلة هناك قبل بناء أي قسم.
- لا يملك الآن معرّفات GA4/Ads — لا تطلبها مرة أخرى إلا عند الحاجة الفعلية.

</div>
