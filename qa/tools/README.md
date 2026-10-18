<div dir="rtl">

# أدوات العمل

أدوات فحص ولقطات استُخدمت فعليًا أثناء v4. الخادم المحلي يجب أن يعمل على
`http://localhost:3000` (`npm run build && npx wrangler pages dev dist --ip 0.0.0.0 --port 3000`).
المتطلبات: `pip install playwright pillow && python3 -m playwright install chromium`.

| الأداة | الاستخدام |
|---|---|
| `lhrun.sh` | `CHROME_PATH=/path/to/chrome bash qa/tools/lhrun.sh / /menu` → نتائج في `/tmp/lh/` |
| `pshot.py` | `python3 qa/tools/pshot.py /menu /tmp/menu.png 3000` (390px، صفحة كاملة) |
| `lbshot.py` | `python3 qa/tools/lbshot.py [https://qahwajeen.com] [tag]` → `/tmp/lb-{tag}-{320,390,1280}.png` + مواضع العناصر |
| `ov.py` · `small.py` | فائض أفقي/ارتفاع الترويسة · روابط أقل من 44px |
| `snap.py` | `python3 qa/tools/snap.py /tmp/before` — 11 صفحة × 390/1280 للمقارنة |
| `live.py` | فحص الموقع الحي: Console، فائض، القائمة، الحجز |

## الحذف الآمن لـ CSS (لا تستخدم purgecss مباشرة)

```bash
# 1) روابط كل الصفحات
curl -s localhost:3000/sitemap.xml | grep -o 'https://qahwajeen.com[^<]*' | sed 's#https://qahwajeen.com#http://localhost:3000#' > /tmp/urls.txt
# 2) المحدّدات المطابقة فعلًا في المتصفح → /tmp/used.json
python3 qa/tools/usedsel.py
# 3) الحذف (يحتاج postcss في /tmp/purge)
mkdir -p /tmp/purge && (cd /tmp/purge && npm i postcss)
cp public/static/style.css /tmp/style.full.css && node qa/tools/mypurge.js   # → /tmp/style.safe.css
# 4) لقطات قبل/بعد ومقارنة بالبكسل (PIL ImageChops.difference) قبل اعتماد الملف
python3 qa/tools/snap.py /tmp/before   # ثم بعد الاستبدال: /tmp/after
```

</div>
