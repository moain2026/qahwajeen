<div dir="rtl">

# ضمان الجودة

كل رقم في التوثيق مصدره أحد هذه السكربتات. شغّلها محليًا قبل الدفع وعلى
`https://qahwajeen.com` بعد النشر.

| السكربت | ما يقيسه | المطلوب |
|---|---|---|
| `scripts/e2e.py [base]` | **اضغط كل شيء**: 23 صفحة × 320/390/1280 — Console/JS/طلبات فاشلة، كل صورة محمّلة، لا تمرير أفقي، H1 واحد، روابط الاتصال/واتساب/البريد صحيحة وظاهرة؛ كل رابط داخلي 200 مباشرة؛ القائمة (زر/Escape/خارجها)؛ كل صورة في المعرض تفتح وتُغلق، التالي/السابق/الأسهم؛ الفلاتر؛ «المعرض الكامل»؛ أسهم الشريط؛ الحجز السريع يبني رسالة واتساب؛ سؤال واحد مفتوح؛ نسخ/مشاركة؛ الصفحات بدون JavaScript | `failures: 0` → `evidence/e2e-latest.json` |
| `scripts/index_audit.py [base]` | زحف كامل كما يفعل Googlebot: كل رابط في خريطة الموقع 200 وقابل للفهرسة، canonical ذاتي، H1 واحد، لا روابط داخلية لتحويل أو 404، لا صفحات يتيمة، كل صورة محتوى مُدرجة في الخريطة، كل صورة في الخريطة 200 و≤300KB، أبعاد `imgmap.ts` = الملفات، كل رابط في JSON-LD يُرجع 200، og:image يعمل، التحويلات القديمة قفزة واحدة | `issues: 0` |
| `scripts/seo.py [base]` | العناوين والأوصاف (تكرار/طول)، canonical، JSON-LD، OG، lang/dir، نص بديل وأبعاد الصور | `issues: 0` |
| `scripts/btn.py` | كل زر على 13 صفحة × 320/390/1440 + القائمة مفتوحة: مقطوع؟ أصغر من 44px؟ | `clipped: 0 · under-44px: 0` |
| `scripts/indexnow.py [--dry]` | يرسل روابط الخريطة الحية إلى IndexNow (Bing/Yandex) | `200/202` |
| `scripts/sheet.py` · `cine.py` · `hero.py` · `home.py` · `ui.py` · `shot.py` | أدوات لقطات وقياسات بصرية مساعدة | — |
| `evidence/` | أدلّة كل إصدار: `v4.5-images/` · `v4.6-watermark/` · `e2e-latest.json` · `lighthouse-latest.txt` | — |
| `archive/` | قديم للقراءة فقط: `audit-v4/` · `screenshots-v3/` · `report-v3.json` | — |
| `watermark-report.json` | يولّده `tools/build_images.py`: موضع الختم وعدد الوجوه والتداخل لكل صورة | `face_overlap_px = 0` |

## آخر نتائج (2026-10-21 · v4.7 · محلي)

```
e2e.py         → 23 صفحة × 3 مقاسات = 69 عرضًا · 1089 صورة محمّلة · 41 صورة فُتحت في النافذة
                 · 6 فلاتر · 23 رابطًا داخليًا · tel 336 / wa 345 / mail 72 صحيحة · failures: 0
index_audit.py → 23 رابطًا · 56 صورة فريدة (194 ربط) · issues: 0
seo.py         → issues: 0
btn.py         → clipped: 0 · under-44px: 0
Lighthouse جوال → / 91 · /services/zamzam 93 · /gallery 94 · /menu 94 — والباقي 100·100·100
build_images   → 109 صورة · 57 وجهًا · تداخل الختم مع وجه: 0 بكسل
```

## المتطلبات

`python3` + `playwright` (لـ btn.py و e2e.py) + `Pillow` (فحص أبعاد الصور في index_audit.py).

</div>
