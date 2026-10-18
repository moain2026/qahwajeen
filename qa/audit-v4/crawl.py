#!/usr/bin/env python3
"""
audit/v4 — full technical crawl (read-only).
For every URL in sitemap.xml + /booking + /links + a 404 probe, record:
status, bytes, title/desc/H1/canonical/robots/hreflang, JSON-LD types,
FAQPage-vs-visible-text match, internal links, unverifiable claims,
city names in body, CTA counts, and nearest-neighbour text similarity.
Output: qa/audit-v4/data/crawl.json  (+ a compact TSV)
"""
import json, re, sys, html, difflib, urllib.request, urllib.error
from collections import defaultdict

B = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
OUT = "qa/audit-v4/data"

def get(u):
    req = urllib.request.Request(B + u, headers={"Accept-Encoding": "identity"})
    class NoRedir(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k): return None
    op = urllib.request.build_opener(NoRedir)
    try:
        r = op.open(req, timeout=30); return r.status, r.read().decode("utf-8", "replace"), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), dict(e.headers)

sm = get("/sitemap.xml")[1]
urls = sorted(set(re.findall(r"<loc>https://qahwajeen\.com([^<]*)</loc>", sm)) - {""})
urls = sorted(set(u for u in urls if not u.startswith("/static")))
extra = ["/booking", "/links", "/this-page-does-not-exist"]
urls_all = urls + [u for u in extra if u not in urls]

CLAIMS = {
    "+١٬٢٠٠ مناسبة": r"١[,٬]?٢٠٠|1,?200",
    "١٠٠٪": r"١٠٠\s*[٪%]|100\s*%",
    "١٠ ثوانٍ": r"١٠ ثوان|10 ثوان|١٠ ثوانٍ",
    "خلال دقائق": r"خلال دقائق",
    "منذ ٢٠١٤": r"٢٠١٤|2014",
    "شركاء/جهات وثقت بنا": r"شركاء النجاح|وثقت بنا",
    "٢٤/٧ أو ٢٤ ساعة": r"٢٤\s*/\s*٧|24\s*/\s*7|٢٤ ساعة|24 ساعة|على مدار الساعة",
    "١٠ مدن / فرق مقيمة": r"١٠ مدن|فرق[ٍ]? ?مقيمة|فرقنا المقيمة|فرقٍ محلية",
    "+٧٠ صنفاً": r"٧٠ صنف|70 صنف",
    "قبل الموعد بساعتين": r"قبل الموعد بساعتين|بساعتين",
    "فاتورة ضريبية/عقود": r"فاتورة ضريبية|فواتير ضريبية|عقود رسمية",
    "ضمان/بلا بنود مخفية": r"بنود مخفية|نضمن|ضمان",
}
CITIES = ["الرياض", "مكة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "أبها", "ينبع", "تبوك"]
PARTNERS = ["أرامكو", "سابك", "نيوم", "الراجحي", "المراعي", "موبايلي", "زين", "جرير", "جاهز", "أكوا", "STC", "اس تي سي"]

def strip(h):
    h = re.sub(r"<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>", " ", h, flags=re.S)
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h))).strip()

def main_text(h):
    m = re.search(r"<main.*?</main>", h, re.S)
    return strip(m.group(0) if m else h)

rows = {}
texts = {}
for u in urls_all:
    st, h, hd = get(u)
    r = {"url": u, "status": st, "bytes": len(h.encode()), "location": hd.get("Location") or hd.get("location")}
    if st == 200 or st == 404:
        g = lambda p: (re.search(p, h, re.S) or [None, None])[1]
        r["title"] = html.unescape(g(r"<title>(.*?)</title>") or "")
        r["title_len"] = len(r["title"])
        r["desc"] = html.unescape(g(r'<meta name="description" content="(.*?)"') or "")
        r["desc_len"] = len(r["desc"])
        h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", h, re.S)
        r["h1"] = [strip(x) for x in h1s]
        r["canonical"] = g(r'<link rel="canonical" href="(.*?)"')
        r["canon_self"] = r["canonical"] == "https://qahwajeen.com" + u
        r["robots"] = g(r'<meta name="robots" content="(.*?)"')
        r["hreflang"] = re.findall(r'hreflang="([^"]+)"', h)
        r["h2"] = len(re.findall(r"<h2[\s>]", h))
        lds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
        types, faq_q, ld_ok = [], [], True
        for l in lds:
            try:
                j = json.loads(l)
                nodes = j.get("@graph", [j])
                for n in nodes:
                    t = n.get("@type"); types += (t if isinstance(t, list) else [t])
                    if n.get("@type") == "FAQPage":
                        faq_q += [(q["name"], q["acceptedAnswer"]["text"]) for q in n["mainEntity"]]
            except Exception:
                ld_ok = False
        r["ld_types"] = types; r["ld_valid_json"] = ld_ok
        body = strip(h)
        # FAQ schema must match visible text verbatim
        r["faq_ld"] = len(faq_q)
        r["faq_ld_not_visible"] = [q for q, a in faq_q if q not in body or a not in body]
        mt = main_text(h)
        texts[u] = mt.split()
        r["words_main"] = len(mt.split())
        r["claims"] = {k: len(re.findall(p, body)) for k, p in CLAIMS.items() if re.search(p, body)}
        r["other_cities_in_main"] = sorted({c for c in CITIES if c in mt})
        r["partners_named"] = sorted(set(re.findall(r'<b class="ptn-logo-name">([^<]+)</b>', h)))  # logo cards only (word-match gave false positives, e.g. «جاهزة»)
        r["imgs"] = len(re.findall(r"<img\b", h))
        r["tel_links"] = len(re.findall(r'href="tel:', h))
        r["wa_links"] = len(re.findall(r'href="https://wa\.me', h))
        r["internal_links"] = sorted(set(re.findall(r'href="(/[^"#?]*)', h)))
        r["n_internal"] = len(r["internal_links"])
        r["has_ga"] = bool(re.search(r"googletagmanager|gtag\(|G-[A-Z0-9]{6,}|AW-\d+", h))
        r["old_brand"] = bool(re.search(r"alqahwaalmalakiya|0536895975|536895975", h))
    rows[u] = r

# nearest-neighbour similarity on <main> text (word sequence)
keys = [u for u in texts if rows[u]["status"] == 200]
sims = {}
for i, a in enumerate(keys):
    best, bu = 0, None
    sa = difflib.SequenceMatcher(None, texts[a], autojunk=False)
    for b in keys:
        if a == b: continue
        sa.set_seq2(texts[b])
        q = sa.quick_ratio()
        if q <= best: continue
        rr = sa.ratio()
        if rr > best: best, bu = rr, b
    rows[a]["nearest"] = bu; rows[a]["nearest_sim"] = round(best * 100)

json.dump(rows, open(f"{OUT}/crawl.json", "w"), ensure_ascii=False, indent=1)

# internal-link targets status
targets = sorted({t for r in rows.values() for t in r.get("internal_links", [])})
tstat = {t: get(t)[0] for t in targets}
json.dump(tstat, open(f"{OUT}/link_targets.json", "w"), ensure_ascii=False, indent=1)

cols = ["url", "status", "bytes", "title_len", "desc_len", "h2", "words_main", "imgs", "tel_links", "wa_links", "n_internal", "nearest_sim", "nearest"]
with open(f"{OUT}/crawl.tsv", "w") as f:
    f.write("\t".join(cols + ["h1", "claims", "other_cities", "ld_types", "faq_ld/notvisible", "canon_self", "robots"]) + "\n")
    for u in urls_all:
        r = rows[u]
        f.write("\t".join(str(r.get(c, "")) for c in cols) + "\t" + " / ".join(r.get("h1", [])) + "\t" +
                json.dumps(r.get("claims", {}), ensure_ascii=False) + "\t" + ",".join(r.get("other_cities_in_main", [])) + "\t" +
                ",".join(sorted(set(map(str, r.get("ld_types", []))))) + "\t" + f'{r.get("faq_ld",0)}/{len(r.get("faq_ld_not_visible",[]))}' +
                "\t" + str(r.get("canon_self")) + "\t" + str(r.get("robots")) + "\n")
print("urls:", len(urls_all), "| sitemap:", len(urls), "| link targets:", len(targets), "| non-200 targets:", {k: v for k, v in tstat.items() if v != 200})
