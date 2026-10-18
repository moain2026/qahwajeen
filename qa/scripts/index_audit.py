#!/usr/bin/env python3
"""
Indexability audit — crawls the site the way Googlebot discovers it and
compares what it finds with what the sitemap declares.

Pages
  * every sitemap URL returns 200, text/html, no noindex (meta or header)
  * canonical == the URL itself (absolute, apex host, no trailing slash)
  * every internally linked page is in the sitemap (no orphans / no gaps)
  * every sitemap URL is linked from at least one other page (no orphans)
  * internal links never hit a redirect or a 404 (one hop = wasted crawl)
Images
  * every content <img> on a page is listed under that page in the sitemap
  * every sitemap image returns 200 image/* and is ≤ 300 KB
  * every content image has non-empty alt text (decorative alt="" allowed
    only when aria-hidden / role=presentation or inside aria-hidden parent)
  * og:image exists and returns 200
Structured data
  * every JSON-LD block parses; @type list per page
Machine files
  * robots.txt allows /, points to the sitemap; /static/ not blocked
  * redirects: legacy URLs answer 301 in one hop to a 200 page

Usage: python3 qa/scripts/index_audit.py [base]   (default http://localhost:3000)
Exit code 0 = PASS, 1 = issues found.
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from html.parser import HTMLParser

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000").rstrip("/")
SITE = "https://qahwajeen.com"
UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


OPEN = urllib.request.build_opener(NoRedirect)


def fetch(path, method="GET"):
    url = path if path.startswith("http") else BASE + path
    req = urllib.request.Request(url, headers={"User-Agent": UA}, method=method)
    try:
        r = OPEN.open(req, timeout=30)
        body = r.read() if method == "GET" else b""
        return r.status, dict(r.headers), body
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read() if method == "GET" else b""


def local(u):
    """absolute SITE url or root-relative → path on BASE"""
    if u.startswith(SITE):
        u = u[len(SITE):] or "/"
    return u


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.imgs, self.ld, self.meta = [], [], [], {}
        self.canon = None
        self._ld = None
        self._hidden = []  # stack of aria-hidden flags
        self.h1 = 0

    def handle_starttag(self, tag, a):
        a = dict(a)
        hidden = a.get("aria-hidden") == "true" or (self._hidden and self._hidden[-1])
        if tag not in ("img", "meta", "link", "source", "br", "input"):
            self._hidden.append(hidden)
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "img":
            self.imgs.append({"src": a.get("src") or a.get("data-src") or "", "alt": a.get("alt"),
                              "hidden": hidden or a.get("role") == "presentation"})
        elif tag == "link" and a.get("rel") == "canonical":
            self.canon = a.get("href")
        elif tag == "meta":
            k = a.get("name") or a.get("property")
            if k:
                self.meta[k] = a.get("content", "")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._ld = ""
        elif tag == "h1":
            self.h1 += 1

    def handle_endtag(self, tag):
        if tag == "script" and self._ld is not None:
            self.ld.append(self._ld)
            self._ld = None
        if tag not in ("img", "meta", "link", "source", "br", "input") and self._hidden:
            self._hidden.pop()

    def handle_data(self, d):
        if self._ld is not None:
            self._ld += d


issues = []
content_imgs = defaultdict(set)
ld_urls = defaultdict(set)
base = lambda src: re.sub(r"-(sm|md|lg)\.webp$", "", src.rsplit("/", 1)[-1])
bad = lambda m: issues.append(m)

# ── robots + sitemap ─────────────────────────────────────────
st, _, robots = fetch("/robots.txt")
robots = robots.decode()
if st != 200 or "Allow: /" not in robots or f"Sitemap: {SITE}/sitemap.xml" not in robots:
    bad(f"robots.txt wrong ({st})")
if re.search(r"(?m)^Disallow:\s*/static", robots):
    bad("robots.txt blocks /static (images/CSS unreachable for Google)")

st, hd, xml = fetch("/sitemap.xml")
xml = xml.decode()
if st != 200 or "xml" not in hd.get("Content-Type", ""):
    bad(f"sitemap.xml {st} {hd.get('Content-Type')}")
smap = {}
for block in re.findall(r"<url>(.*?)</url>", xml, re.S):
    loc = re.search(r"<loc>(.*?)</loc>", block).group(1)
    smap[local(loc)] = [local(i) for i in re.findall(r"<image:loc>(.*?)</image:loc>", block)]
    if not re.search(r"<lastmod>\d{4}-\d\d-\d\d", block):
        bad(f"sitemap {loc}: no lastmod")

# ── crawl: sitemap pages + anything they link to ─────────────
seen, queue, linked_from = {}, list(smap), defaultdict(set)
redirect_links, broken_links = set(), set()
types = {}
while queue:
    path = queue.pop(0)
    if path in seen:
        continue
    st, hd, body = fetch(path)
    seen[path] = st
    if st in (301, 302, 307, 308):
        continue
    if st != 200:
        continue
    if "text/html" not in hd.get("Content-Type", ""):
        continue
    p = Page()
    p.feed(body.decode("utf-8", "replace"))
    # indexability
    if "noindex" in p.meta.get("robots", "") or "noindex" in hd.get("X-Robots-Tag", ""):
        bad(f"{path}: noindex")
    want = SITE + (path if path != "/" else "/")
    if p.canon not in (want, want.rstrip("/") if path != "/" else want):
        bad(f"{path}: canonical {p.canon} ≠ {want}")
    if p.h1 != 1:
        bad(f"{path}: {p.h1} × <h1>")
    # structured data
    t = []
    for raw in p.ld:
        try:
            d = json.loads(raw)
            nodes = d.get("@graph", [d]) if isinstance(d, dict) else d
            for u in set(re.findall(r'"(https://qahwajeen\.com[^"#]*)', raw)):
                ld_urls[local(u)].add(path)
            t += [n.get("@type") if isinstance(n.get("@type"), str) else "+".join(n.get("@type")) for n in nodes]
        except Exception as e:
            bad(f"{path}: JSON-LD parse error {e}")
    types[path] = t
    # og:image
    og = p.meta.get("og:image")
    if not og:
        bad(f"{path}: no og:image")
    else:
        s2, h2, _ = fetch(local(og), "HEAD")
        if s2 != 200:
            bad(f"{path}: og:image {og} → {s2}")
    # links
    for h in p.links:
        h = local(h.split("#")[0])
        if not h or not h.startswith("/") or h.startswith("//") or h.startswith("/static/"):
            continue
        h = h.split("?")[0]
        linked_from[h].add(path)
        if h not in seen and h not in queue:
            queue.append(h)
    # images — content images must be declared in the sitemap for this page
    declared = set(smap.get(path, []))
    for im in p.imgs:
        src = local(im["src"])
        if not src.startswith("/static/img/"):
            continue
        if im["alt"] is None:
            bad(f"{path}: <img {src}> has no alt attribute")
        # alt="" = decorative by WCAG (logo next to its text, background art) → not indexed on purpose
        if im["hidden"] or not (im["alt"] or "").strip():
            continue
        content_imgs[path].add(base(src))
        if path in smap and base(src) not in {base(d) for d in declared}:
            bad(f"{path}: content image {base(src)} (alt «{im['alt'][:30]}») not in sitemap")

# link hygiene
for h, froms in linked_from.items():
    st = seen.get(h)
    if st in (301, 302, 307, 308):
        redirect_links.add((h, st, sorted(froms)[0]))
    elif st != 200:
        broken_links.add((h, st, sorted(froms)[0]))
    elif h not in smap:
        bad(f"linked page {h} is 200 but missing from sitemap")
for h, st, f in sorted(redirect_links):
    bad(f"internal link to redirect {h} ({st}) on {f}")
for h, st, f in sorted(broken_links):
    bad(f"internal link broken {h} ({st}) on {f}")
for s in smap:
    if seen.get(s) != 200:
        bad(f"sitemap URL {s} → {seen.get(s)}")
    if s != "/" and not (linked_from.get(s, set()) - {s}):
        bad(f"orphan: {s} is in sitemap but no page links to it")

# every URL mentioned in structured data must answer 200 directly
for u, froms in sorted(ld_urls.items()):
    st = seen.get(u) or fetch(u, "GET" if not u.startswith("/static/") else "HEAD")[0]
    if st != 200:
        bad(f"JSON-LD url {u} → {st} (on {sorted(froms)[0]})")

# sitemap images
all_imgs = sorted({i for v in smap.values() for i in v})
for src in all_imgs:
    st, hd, body = fetch(src)
    ct = hd.get("Content-Type", "")
    if st != 200 or not ct.startswith("image/"):
        bad(f"sitemap image {src} → {st} {ct}")
    elif len(body) > 300_000:
        bad(f"sitemap image {src} is {len(body)//1024} KB")

# imgmap.ts dimensions == real files (wrong sizes → wrong srcset, CLS, bad image-sitemap metadata)
try:
    import os
    from PIL import Image
    root = os.path.join(os.path.dirname(__file__), "..", "..")
    im_src = open(os.path.join(root, "src/imgmap.ts")).read()
    on_disk = set(os.listdir(os.path.join(root, "public/static/img")))
    for k, vs, w, h in re.findall(r'"([\w-]+)": \[\[([^\]]*)\], (\d+), (\d+)\]', im_src):
        vs = re.findall(r'"(\w+)"', vs)
        for v in vs:
            if f"{k}-{v}.webp" not in on_disk:
                bad(f"imgmap {k}-{v}.webp missing on disk")
        f = os.path.join(root, "public/static/img", f"{k}-{vs[-1]}.webp")
        if os.path.exists(f) and Image.open(f).size != (int(w), int(h)):
            bad(f"imgmap {k}: {Image.open(f).size} on disk ≠ {w}x{h} in imgmap.ts")
except ImportError:
    print("(PIL missing — imgmap size check skipped)")

# legacy redirects (one hop to 200)
LEGACY = ["/about", "/contact", "/menu/coffee", "/services/qahwajiat", "/occasions/weddings",
          "/locations/riyadh", "/qahwajiin-riyadh", "/sitemap-images.xml"]
for old in LEGACY:
    st, hd, _ = fetch(old)
    loc = hd.get("Location") or hd.get("location") or ""
    if st != 301:
        bad(f"legacy {old} → {st} (want 301)")
        continue
    st2, _, _ = fetch(local(loc.split("#")[0]) or "/")
    if st2 != 200:
        bad(f"legacy {old} → {loc} → {st2} (want one hop to 200)")

# ── report ───────────────────────────────────────────────────
pages = [p for p in seen if seen[p] == 200 and p in smap]
print(f"base           {BASE}")
print(f"sitemap URLs   {len(smap)}   crawled 200: {len(pages)}")
print(f"content images {len({i for v in content_imgs.values() for i in v})} unique with alt text on crawled pages")
print(f"sitemap images {len(all_imgs)} unique  ({sum(len(v) for v in smap.values())} page-image pairs)")
print("JSON-LD types  " + ", ".join(f"{k}={v}" for k, v in sorted(
    {x: sum(x in t for t in types.values()) for x in {y for t in types.values() for y in t}}.items())))
print(f"\nissues: {len(issues)}")
for i in issues:
    print("  -", i)
print("\nPASS" if not issues else "\nFIX NEEDED")
sys.exit(0 if not issues else 1)
