#!/usr/bin/env python3
"""
qa/scripts/e2e.py — اختبار تفاعلي شامل «اضغط كل شيء» (Playwright, Chromium).

Usage: python3 qa/scripts/e2e.py [base]      (default http://localhost:3000)

لكل صفحة في sitemap.xml وعلى 320 / 390 / 1280:
  • لا أخطاء Console ولا أخطاء JS ولا طلبات فاشلة (4xx/5xx) لموارد الموقع
  • كل صورة تُحمَّل فعلًا (naturalWidth > 0) بعد التمرير لآخر الصفحة
  • لا تمرير أفقي (scrollWidth ≤ clientWidth)
  • كل روابط الاتصال: tel:+966504968113 · wa.me/966504968113 · mailto:qahwajeen@gmail.com
  • H1 واحد + زر اتصال + زر واتساب ظاهران
ثم مرة واحدة (390):
  • كل رابط داخلي فريد يُرجع 200 مباشرة (بلا تحويل)
  • القائمة: فتح بالزر / إغلاق بالزر / Escape / ضغط خارجها
  • المعرض: كل صورة تفتح النافذة، الصورة محمّلة، الوصف غير فارغ، التالي/السابق يغيّر العدّاد، Escape و× يغلقان
  • فلاتر المعرض: كل زر يُظهر بطاقات من فئته فقط (> 0)
  • «المعرض الكامل»: يفتح ويغلق
  • أسهم الشريط تحرّك الشريط
  • الحجز السريع: كل اختيار يغيّر رسالة واتساب
  • الأسئلة: سؤال واحد مفتوح فقط
  • نسخ الرقم / مشاركة → رسالة toast
  • بدون JavaScript: H1 وزر الاتصال والصور موجودة
Exit 1 on any failure. Output: summary + qa/evidence/e2e-latest.json
"""
import json, os, re, sys, urllib.request
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000").rstrip("/")
SITE = "https://qahwajeen.com"
PHONE, MAIL = "966504968113", "qahwajeen@gmail.com"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHROME = os.environ.get("CHROME_PATH")
fails, stats = [], {"pages": 0, "views": 0, "images_loaded": 0, "links_checked": 0,
                    "lightbox_opened": 0, "filters": 0, "tel": 0, "wa": 0, "mail": 0}


def fail(where, what):
    fails.append(f"{where}: {what}")
    print("  ✗", where, "—", what)


def urls():
    xml = urllib.request.urlopen(BASE + "/sitemap.xml").read().decode()
    return [u.replace(SITE, "") or "/" for u in re.findall(r"<loc>(https://qahwajeen\.com[^<]*)</loc>", xml)]


def scroll_all(pg):
    pg.evaluate("""async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
      document.querySelectorAll('img[data-src]').forEach(i => { i.srcset = i.dataset.srcset || ''; i.src = i.dataset.src; });
      window.scrollTo(0, 0);
    }""")
    pg.wait_for_load_state("networkidle")
    # lazy images inside horizontal rails / hidden «show all» load only on demand —
    # forced to eager above; give them up to 15 s, then judge (complete && naturalWidth==0 = broken)
    try:
        pg.wait_for_function("() => [...document.images].every(i => !i.getAttribute('src') || i.complete)", timeout=15000)
    except Exception:
        pass


def page_checks(pg, path, w):
    where = f"{path} @{w}"
    errs, bad = [], []
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("response", lambda r: r.status >= 400 and r.url.startswith(BASE) and bad.append(f"{r.status} {r.url}"))
    r = pg.goto(BASE + path, wait_until="networkidle")
    if not r or r.status != 200:
        fail(where, f"status {r and r.status}")
        return
    scroll_all(pg)
    d = pg.evaluate("""() => {
      const imgs = [...document.images].filter(i => !i.closest('dialog'));
      const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden'; };
      return {
        broken: imgs.filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src),
        notDone: imgs.filter(i => i.getAttribute('src') && !i.complete).length,
        loaded: imgs.filter(i => i.naturalWidth > 0).length,
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        h1: document.querySelectorAll('h1').length,
        tel: [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href')),
        wa: [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.getAttribute('href')),
        mail: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.getAttribute('href')),
        callVis: [...document.querySelectorAll('a[href^="tel:"]')].some(vis),
        waVis: [...document.querySelectorAll('a[href*="wa.me"]')].some(vis),
        noAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
      };
    }""")
    for e in errs: fail(where, f"console: {e[:160]}")
    for b in sorted(set(bad)): fail(where, f"request {b}")
    for b in d["broken"]: fail(where, f"broken image {b}")
    if d["notDone"]: fail(where, f"{d['notDone']} images never finished loading")
    if d["sw"] > d["cw"] + 1: fail(where, f"horizontal overflow {d['sw']} > {d['cw']}")
    if d["h1"] != 1: fail(where, f"{d['h1']} H1")
    if d["noAlt"]: fail(where, f"{d['noAlt']} images without alt")
    for t in d["tel"]:
        if t != f"tel:+{PHONE}": fail(where, f"bad tel {t}")
    for t in d["wa"]:
        if not t.startswith(f"https://wa.me/{PHONE}"): fail(where, f"bad whatsapp {t}")
    for t in d["mail"]:
        if not t.startswith(f"mailto:{MAIL}"): fail(where, f"bad mail {t}")
    if not d["tel"] or not d["callVis"]: fail(where, "no visible call button")
    if not d["wa"] or not d["waVis"]: fail(where, "no visible WhatsApp button")
    stats["views"] += 1
    stats["images_loaded"] += d["loaded"]
    stats["tel"] += len(d["tel"]); stats["wa"] += len(d["wa"]); stats["mail"] += len(d["mail"])


def internal_links(ctx, paths):
    pg = ctx.new_page()
    seen = set()
    for p in paths:
        pg.goto(BASE + p, wait_until="domcontentloaded")
        for h in pg.evaluate("() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))"):
            if h.startswith(SITE): h = h[len(SITE):] or "/"
            if h.startswith("/") and not h.startswith("//"):
                seen.add(h.split("#")[0] or "/")
    pg.close()
    for h in sorted(seen):
        req = urllib.request.Request(BASE + h, method="GET")
        class NoRedir(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *a, **k): return None
        try:
            code = urllib.request.build_opener(NoRedir).open(req).status
        except urllib.error.HTTPError as e:
            code = e.code
        if code != 200: fail("link", f"{h} → {code}")
        stats["links_checked"] += 1


def interactions(ctx):
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE + "/", wait_until="networkidle")

    # ── menu
    btn, nav = pg.locator("#menuBtn"), pg.locator("#topNav")
    if btn.count() and btn.is_visible():
        btn.click(); pg.wait_for_timeout(250)
        if "open" not in (nav.get_attribute("class") or ""): fail("menu", "does not open")
        if btn.get_attribute("aria-expanded") != "true": fail("menu", "aria-expanded not true")
        btn.click(); pg.wait_for_timeout(250)
        if "open" in (nav.get_attribute("class") or ""): fail("menu", "button does not close it")
        btn.click(); pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
        if "open" in (nav.get_attribute("class") or ""): fail("menu", "Escape does not close it")
        btn.click(); pg.wait_for_timeout(200); pg.mouse.click(5, 700); pg.wait_for_timeout(250)
        if "open" in (nav.get_attribute("class") or ""): fail("menu", "outside click does not close it")
        # every menu link works
        btn.click(); pg.wait_for_timeout(200)
        links = nav.locator("a").evaluate_all("as => as.map(a => a.getAttribute('href'))")
        if len(links) < 4: fail("menu", f"only {len(links)} links")
        pg.keyboard.press("Escape")
    else:
        fail("menu", "#menuBtn not visible on mobile")

    # ── gallery page: lightbox on every image
    pg.goto(BASE + "/gallery", wait_until="networkidle")
    scroll_all(pg)
    items = pg.locator(".galx-it")
    n = items.count()
    if n < 20: fail("gallery", f"only {n} items")
    lb = pg.locator("#lbx")
    for i in range(n):
        it = items.nth(i)
        if not it.is_visible(): continue
        it.scroll_into_view_if_needed(); it.click()
        pg.wait_for_function("() => document.querySelector('#lbx').open && document.querySelector('#lbx img').complete")
        st = pg.evaluate("""() => { const l = document.querySelector('#lbx'), i = l.querySelector('img');
            return {open: l.open, w: i.naturalWidth, cap: (l.querySelector('#lbxCap')||{}).textContent || '',
                    cnt: (l.querySelector('#lbxCount')||{}).textContent || '', alt: i.alt} }""")
        if not st["open"] or st["w"] == 0: fail("lightbox", f"item {i} image not shown")
        if not st["cap"].strip(): fail("lightbox", f"item {i} empty caption")
        if not st["alt"].strip(): fail("lightbox", f"item {i} empty alt")
        if i == 0:
            c0 = st["cnt"]
            pg.locator(".lbx-next").click(); pg.wait_for_timeout(150)
            c1 = pg.locator("#lbxCount").text_content()
            pg.locator(".lbx-prev").click(); pg.wait_for_timeout(150)
            c2 = pg.locator("#lbxCount").text_content()
            if c1 == c0 or c2 != c0: fail("lightbox", f"next/prev counter {c0}→{c1}→{c2}")
            pg.keyboard.press("ArrowLeft"); pg.wait_for_timeout(150)
            if pg.locator("#lbxCount").text_content() == c0: fail("lightbox", "arrow key does not move")
            pg.locator(".lbx-x").click(); pg.wait_for_timeout(150)
            if lb.evaluate("l => l.open"): fail("lightbox", "× does not close")
            continue
        pg.keyboard.press("Escape"); pg.wait_for_timeout(120)
        if lb.evaluate("l => l.open"): fail("lightbox", f"Escape does not close (item {i})")
        if pg.evaluate("document.documentElement.classList.contains('lbx-on')"): fail("lightbox", "scroll lock left on")
        stats["lightbox_opened"] += 1
    stats["lightbox_opened"] += 1

    # ── filters
    pills = pg.locator("#worksFilters .w-pill")
    for i in range(pills.count()):
        p = pills.nth(i); cat = p.get_attribute("data-wcat")
        p.click(); pg.wait_for_timeout(120)
        r = pg.evaluate("""cat => { const c = [...document.querySelectorAll('#works .k-work-card')].filter(x => !x.hidden);
            return {n: c.length, wrong: c.filter(x => cat !== 'all' && x.dataset.wcat !== cat).length} }""", cat)
        if r["n"] == 0: fail("filter", f"{cat}: 0 cards")
        if r["wrong"]: fail("filter", f"{cat}: {r['wrong']} cards from another category")
        if p.get_attribute("aria-pressed") != "true": fail("filter", f"{cat}: aria-pressed")
        stats["filters"] += 1
    pills.nth(0).click()

    # ── home: show-all toggle, rail arrows
    pg.goto(BASE + "/", wait_until="networkidle")
    more = pg.locator("#galMore")
    if more.count():
        more.scroll_into_view_if_needed(); more.click(); pg.wait_for_timeout(200)
        if pg.locator("#galx").is_hidden(): fail("galMore", "does not open")
        more.click(); pg.wait_for_timeout(400)
        if not pg.locator("#galx").is_hidden(): fail("galMore", "does not close")
    rb = pg.locator('.rail-btn[data-rail-target="worksRail"][data-dir="next"]')
    if rb.count() and rb.first.is_visible():
        rail = pg.locator("#worksRail"); rail.scroll_into_view_if_needed()
        x0 = rail.evaluate("r => r.scrollLeft"); rb.first.click(); pg.wait_for_timeout(700)
        if rail.evaluate("r => r.scrollLeft") == x0: fail("rail", "next arrow does not scroll")

    # ── quick booking (any page that has it)
    for p in ["/", "/booking", "/contact"]:
        pg.goto(BASE + p, wait_until="networkidle")
        if pg.locator("#concBox").count(): break
    if pg.locator("#concBox").count():
        wa = pg.locator("#concWaBtn")
        groups = pg.locator("#concBox .conc-pills")
        for g in range(groups.count()):
            ps = groups.nth(g).locator(".conc-pill")
            for k in range(ps.count()):
                before = wa.get_attribute("href")
                ps.nth(k).scroll_into_view_if_needed(); ps.nth(k).click(); pg.wait_for_timeout(60)
                after = wa.get_attribute("href")
                val = ps.nth(k).get_attribute("data-val") or ""
                if val and urllib.parse.quote(val) not in after and val not in urllib.parse.unquote(after):
                    fail("booking", f"choice «{val}» not in WhatsApp message")
        if not wa.get_attribute("href").startswith(f"https://wa.me/{PHONE}"): fail("booking", "button not WhatsApp")
    else:
        fail("booking", "#concBox not found")

    # ── FAQ: one open at a time
    pg.goto(BASE + "/faq", wait_until="networkidle")
    ds = pg.locator(".faq details summary")
    if ds.count() >= 2:
        ds.nth(0).click(); ds.nth(1).click(); pg.wait_for_timeout(150)
        if pg.locator(".faq details[open]").count() != 1: fail("faq", "more than one open")
    else:
        fail("faq", "no questions")

    # ── copy / share → toast
    for sel in ["[data-copy]", "[data-share]"]:
        for p in ["/", "/contact", "/links"]:
            pg.goto(BASE + p, wait_until="networkidle")
            b = pg.locator(sel)
            if b.count() and b.first.is_visible():
                pg.evaluate("() => { try { delete navigator.share } catch(e){}; Object.defineProperty(navigator, 'share', {value: undefined, configurable: true}) }")
                b.first.click(); pg.wait_for_timeout(300)
                if "show" not in (pg.locator("#toast").get_attribute("class") or ""): fail(sel, f"no toast on {p}")
                break
    for e in errs: fail("interactions", f"JS error {e[:160]}")
    pg.close()


def no_js(browser):
    ctx = browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    for p in ["/", "/services/zamzam", "/menu", "/gallery"]:
        pg.goto(BASE + p)
        d = pg.evaluate("() => ({h1: document.querySelectorAll('h1').length, tel: document.querySelectorAll('a[href^=\"tel:\"]').length, img: [...document.images].filter(i => i.getAttribute('src')).length})")
        if d["h1"] != 1 or not d["tel"] or not d["img"]: fail(f"no-JS {p}", str(d))
    ctx.close()


import urllib.parse  # noqa: E402

with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME) if CHROME else p.chromium.launch()
    paths = urls()
    print(f"base {BASE} · {len(paths)} pages")
    for w, h, mob in [(390, 844, True), (320, 640, True), (1280, 800, False)]:
        ctx = br.new_context(viewport={"width": w, "height": h}, is_mobile=mob, has_touch=mob,
                             permissions=["clipboard-read", "clipboard-write"])
        for path in paths:
            pg = ctx.new_page(); page_checks(pg, path, w); pg.close()
        ctx.close()
        print(f"  ✓ {len(paths)} pages @{w}")
    stats["pages"] = len(paths)
    ctx = br.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True,
                         permissions=["clipboard-read", "clipboard-write"])
    internal_links(ctx, paths); print(f"  ✓ {stats['links_checked']} internal links")
    interactions(ctx); print(f"  ✓ interactions (lightbox {stats['lightbox_opened']}, filters {stats['filters']})")
    ctx.close()
    no_js(br); print("  ✓ no-JS")
    br.close()

out = {"base": BASE, "stats": stats, "failures": fails}
os.makedirs(os.path.join(ROOT, "qa/evidence"), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, "qa/evidence/e2e-latest.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(stats, ensure_ascii=False))
print(f"\nfailures: {len(fails)}")
print("PASS" if not fails else "FAIL")
sys.exit(1 if fails else 0)
