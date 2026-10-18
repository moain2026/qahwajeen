<div dir="rtl">

# 05 — الأداء

> الموقع يُستخدم 99٪ من الجوال. الهدف: Lighthouse جوال — الأداء ≥ 90،
> الوصول/أفضل الممارسات/السيو = 100. كل الأرقام هنا مقيسة.

---

## 1. آخر قياس على الموقع الحي (Lighthouse 12، جوال، محاكاة 4G بطيء)

| الصفحة | أداء | وصول | ممارسات | سيو | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 89 | 100 | 100 | 100 | 1.4s | 2.3s | 360ms | 0 |
| `/menu` | 97 | 100 | 100 | 100 | 1.3s | 2.1s | 130ms | 0 |
| `/gallery` | 91 | 100 | 100 | 100 | 1.3s | 2.3s | 320ms | 0 |

الرئيسية تتذبذب بين 86 و94 بين التشغيلات (TBT من محاكاة المعالج البطيء).

## 2. الحِمل

| العنصر | الحجم (خام / مضغوط gzip) |
|---|---|
| HTML الرئيسية | 91 KB / 14 KB |
| `style.css` | 72 KB / 14.5 KB |
| `app.js` | 14 KB / 4.4 KB |
| خطوط تُحمَّل مسبقًا | `tajawal-400-arabic` 9 KB + `amiri-700-arabic` 46 KB (subset) |
| الحزمة على الخادم | `_worker.js` ≈ 150 KB (≈ 46 KB مضغوط) |

## 3. ما يجعل الصفحة سريعة

1. **HTML كامل من الخادم** — لا انتظار JavaScript لرسم المحتوى.
2. **صورة البطل:** `<picture>` بصورتين (طولية للجوال، عرضية للحاسب) +
   `preload` مقسوم بنفس `media` + `fetchpriority="high"`.
3. **شرائح البطل 2 و3** تحمل `data-src` ولا تُنزَّل إلا بعد `html.go`
   (4 ثوانٍ بعد التحميل عبر `requestIdleCallback`). القاعدة
   `html:not(.go) … {animation:none!important}` تمنع أي حركة قبل ذلك.
4. **كل الصور تحت الطيّة** `loading="lazy"` + `decoding="async"` +
   `width/height` حقيقية من `imgmap.ts` → CLS = 0.
5. **الحركة** `transform`/`opacity` فقط، وتتوقف مع `prefers-reduced-motion`.
6. **CSS:** حُذفت القواعد غير المطابقة لأي عنصر بقياس المتصفح (لا purgecss
   أعمى)، ثم مقارنة لقطات بالبكسل قبل/بعد.

## 4. الصور

```
public/static/img/{name}-sm.webp   480w
public/static/img/{name}-md.webp   900w (أو العرض الأصلي إن كان أصغر)
public/static/img/{name}-lg.webp   1600w — للصور العرضية الكبيرة فقط
src/imgmap.ts:  "name": [["sm","md"], <عرض أكبر مقاس>, <ارتفاعه>]
```

- WebP فقط، ≤ 300 KB لكل ملف (يفحصه `index_audit.py`).
- الأبعاد في `imgmap.ts` يجب أن تطابق الملف الحقيقي (يفحصه `index_audit.py`).
- لا تُبقِ ملفات غير مستخدمة: كل ملف في المجلد مستخدم في الكود
  (آخر تنظيف حذف 28 ملفًا / 3.1 MB: نسخ مكرّرة، صور مولّدة قديمة، شعارات بأحجام لا تُستخدم، صور بشعارات شركات أخرى).

## 5. الكاش

| المسار | الترويسة |
|---|---|
| `/static/*` | `public, max-age=31536000, immutable` |
| HTML | `public, max-age=0, must-revalidate` |
| `sitemap.xml` | `public, max-age=3600` |
| `robots.txt` · مفتاح IndexNow | `public, max-age=86400` |

**لأن `/static/` immutable:** عند تعديل CSS/JS ارفع `V` في `layout.tsx`
(`?v=`). عند استبدال صورة بمحتوى مختلف **غيّر اسم الملف** (مثال: `qr.png` → `qr-links.png`).

## 6. أوامر القياس

```bash
python3 qa/scripts/btn.py        # كل زر ≥ 44px وبلا قصّ على 320/390/1440
python3 qa/scripts/index_audit.py
# Lighthouse (يتطلب Chromium):
npx lighthouse https://qahwajeen.com/ --form-factor=mobile --output=json --output-path=lh.json
```

</div>
