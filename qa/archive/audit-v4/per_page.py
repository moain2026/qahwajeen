#!/usr/bin/env python3
"""Build the per-page issue table (one row per page) from measured data only.
Inputs : qa/audit-v4/data/crawl.json, visual.json, lh/*.json
Output : qa/audit-v4/PER-PAGE.md
Every issue cites the metric that triggered it — nothing is hand-typed."""
import json, os

R = json.load(open("qa/audit-v4/data/crawl.json"))
V = json.load(open("qa/audit-v4/data/visual.json"))
LH = {}
for f in os.listdir("qa/audit-v4/lh"):
    d = json.load(open("qa/audit-v4/lh/" + f)); a = d["audits"]; c = d["categories"]
    u = "/" if f == "home.json" else "/" + f[:-5].replace("_", "/")
    LH[u] = dict(perf=round(c["performance"]["score"] * 100), a11y=round(c["accessibility"]["score"] * 100),
                 lcp=round(a["largest-contentful-paint"]["numericValue"] / 1000, 2), tbt=round(a["total-blocking-time"]["numericValue"]),
                 kb=round(a["total-byte-weight"]["numericValue"] / 1024))

SEV = {"C": "حرجة", "H": "عالية", "M": "متوسطة", "L": "منخفضة"}
def issues(u):
    r, v = R[u], V.get(u, {})
    out = []
    add = lambda s, prob, ev, fix: out.append((s, prob, ev, fix))
    if r["status"] != 200 and u != "/this-page-does-not-exist":
        add("C", "حالة غير 200", f"status={r['status']}", "إصلاح المسار")
    if r.get("partners_named"):
        add("C", "شعارات/أسماء جهات كبرى غير موثّقة", f"{len(r['partners_named'])} جهة: {'، '.join(r['partners_named'][:4])}…", "حذف حتى موافقة مكتوبة")
    cl = r.get("claims", {})
    unv = [k for k in cl if k in ("+١٬٢٠٠ مناسبة", "١٠٠٪", "خلال دقائق", "١٠ ثوانٍ", "١٠ مدن / فرق مقيمة", "منذ ٢٠١٤", "+٧٠ صنفاً", "قبل الموعد بساعتين")]
    if unv:
        add("H", "ادعاءات بلا مصدر", "، ".join(unv), "تأكيد من المالك أو حذف")
    if r.get("nearest_sim", 0) >= 90:
        add("C", "محتوى شبه مكرر (Doorway)", f"{r['nearest_sim']}% مع {r['nearest']}", "دمج/noindex/محتوى فريد (قرار المالك)")
    elif r.get("nearest_sim", 0) >= 80:
        add("H", "تشابه نصي عالٍ", f"{r['nearest_sim']}% مع {r['nearest']}", "تمييز المحتوى أو دمج")
    if r.get("other_cities_in_main") and u in ("/", "/services", "/about", "/booking", "/contact", "/menu", "/gallery", "/faq"):
        add("M", "أسماء مدن أخرى في جسم صفحة عامة", f"{len(r['other_cities_in_main'])} مدينة", "إزالتها من الجسم (طلب المالك)")
    if r.get("title_len", 0) > 60:
        add("M", "عنوان أطول من 60", f"{r['title_len']} حرف", "اختصار")
    if r.get("desc_len", 0) > 155:
        add("L", "وصف أطول من 155", f"{r['desc_len']} حرف", "اختصار")
    m = v.get("m390", {})
    if m:
        if m["maxCtaOneScreen"] >= 6:
            add("H", "تكرار أزرار التواصل في شاشة واحدة", f"حتى {m['maxCtaOneScreen']} زر تواصل مرئي معاً (390px)", "زر أساسي واحد/شاشة")
        if m.get("actVis") is False:
            add("M", "الرابط النشط في القائمة خارج الشاشة", "actVis=false @390", "إزالة القائمة الأفقية أو تمرير تلقائي")
    m320 = v.get("m320", {})
    if m320 and m320.get("clipped"):
        add("M", "نص زر مقصوص على 320px", "، ".join(m320["clipped"]), "تقليص النص/التخطيط")
    if u in LH:
        L = LH[u]
        if L["perf"] < 90 or L["lcp"] > 2.5:
            add("H", "أداء الجوال دون المعيار", f"Perf {L['perf']} · LCP {L['lcp']}s · TBT {L['tbt']}ms · {L['kb']}KB", "انظر قسم الأداء")
        if L["a11y"] < 100:
            add("M", "سهولة الوصول < 100", f"A11y {L['a11y']}", "إصلاح aria/label")
    if r.get("words_main", 0) > 2000:
        add("M", "صفحة طويلة جداً", f"{r['words_main']} كلمة · {m.get('screens','?')} شاشة · {r['imgs']} صورة", "تقصير/تأجيل الأقسام غير المحوِّلة")
    if not r.get("has_ga"):
        pass  # site-wide, reported once
    return out

order = sorted(R, key=lambda u: (0 if u == "/" else 1 if not any(x in u for x in ("-", "/locations/")) else 2, u))
lines = ["<div dir=\"rtl\">\n", "# الملحق أ — جدول التدقيق صفحةً صفحة (مولّد آلياً من القياس)\n",
         "> المصدر: `qa/audit-v4/per_page.py` ← `data/crawl.json` + `data/visual.json` + `lh/*.json`. لا يوجد أي صف مكتوب يدوياً.\n",
         "> مشاكل على مستوى الموقع كله (لا تتكرر هنا): غياب التتبّع، الرأس، الشريط السفلي، رمز QR — انظر التقرير الرئيسي.\n"]
for u in order:
    r = R[u]
    lines.append(f"\n### `{u}` — {r['status']} · {r.get('bytes',0)//1024}KB HTML · H1: «{(r.get('h1') or [''])[0]}»\n")
    iss = issues(u)
    if not iss:
        lines.append("لا مشاكل مقيسة على مستوى الصفحة.\n"); continue
    lines.append("| المشكلة | الخطورة | الدليل | الإصلاح المقترح |\n|---|---|---|---|")
    for s, p, e, f in sorted(iss, key=lambda x: "CHML".index(x[0])):
        lines.append(f"| {p} | {SEV[s]} | {e} | {f} |")
lines.append("\n</div>\n")
open("qa/audit-v4/PER-PAGE.md", "w").write("\n".join(lines))
import collections
cnt = collections.Counter(s for u in R for s, *_ in issues(u))
print("pages:", len(R), "issues by severity:", {SEV[k]: v for k, v in cnt.items()})
