<div dir="rtl">

# ضمان الجودة

كل رقم في التوثيق مصدره أحد هذه السكربتات. شغّلها محليًا قبل الدفع وعلى
`https://qahwajeen.com` بعد النشر.

| السكربت | ما يقيسه | المطلوب |
|---|---|---|
| `scripts/index_audit.py [base]` | زحف كامل كما يفعل Googlebot: كل رابط في خريطة الموقع 200 وقابل للفهرسة، canonical ذاتي، H1 واحد، لا روابط داخلية لتحويل أو 404، لا صفحات يتيمة، كل صورة محتوى مُدرجة في الخريطة، كل صورة في الخريطة 200 و≤300KB، أبعاد `imgmap.ts` = الملفات، كل رابط في JSON-LD يُرجع 200، og:image يعمل، التحويلات القديمة قفزة واحدة | `issues: 0` |
| `scripts/seo.py [base]` | العناوين والأوصاف (تكرار/طول)، canonical، JSON-LD، OG، lang/dir، نص بديل وأبعاد الصور | `issues: 0` |
| `scripts/btn.py` | كل زر على 13 صفحة × 320/390/1440 + القائمة مفتوحة: مقطوع؟ أصغر من 44px؟ | `clipped: 0 · under-44px: 0` |
| `scripts/indexnow.py [--dry]` | يرسل روابط الخريطة الحية إلى IndexNow (Bing/Yandex) | `200/202` |
| `scripts/sheet.py` · `cine.py` · `hero.py` · `home.py` · `ui.py` · `shot.py` | أدوات لقطات وقياسات بصرية مساعدة | — |
| `audit-v4/` | تقرير تدقيق v4 وأدلته (لقطات، Lighthouse) — أرشيف | — |

## آخر نتائج (2026-10-18)

```
index_audit.py → 23 رابطًا · 64 صورة · issues: 0
seo.py         → 23 رابطًا · 0 مكرّر · أطول عنوان 60 · issues: 0
btn.py         → clipped: 0 · under-44px: 0
Lighthouse جوال (حي) → / 89·100·100·100 · /menu 97·100·100·100 · /gallery 91·100·100·100
```

## المتطلبات

`python3` + `playwright` (لـ btn.py) + `Pillow` (فحص أبعاد الصور في index_audit.py).

</div>
