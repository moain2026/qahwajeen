#!/usr/bin/env python3
"""
audit/v4 — visual & UX measurement (read-only).
For every crawled URL at 390x844, 360x800, 320x640 (mobile) and 1440x900:
 - first-screen screenshot (qa/audit-v4/shots/<vp>/<slug>.png)
 - fixed/sticky chrome height (header + bottom bar) and % of viewport
 - contact CTAs visible in the first screen (tel / wa.me / booking)
 - max contact CTAs visible in any one screen while scrolling
 - horizontal overflow, clipped buttons, targets < 44px, active nav visible
Full-page screenshots for the key pages at 390.
"""
import json, re, sys
from playwright.sync_api import sync_playwright

B = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
R = json.load(open("qa/audit-v4/data/crawl.json"))
URLS = list(R.keys())
KEY = ["/", "/services", "/booking", "/contact", "/qahwajiin-jeddah", "/locations/jeddah", "/menu", "/gallery", "/about", "/links", "/faq", "/occasions", "/qahwajiin-riyadh", "/this-page-does-not-exist"]
ALLV = {"m390": (390, 844, True), "m360": (360, 800, True), "m320": (320, 640, True), "d1440": (1440, 900, False)}
VPS = {k: ALLV[k] for k in (sys.argv[2].split(",") if len(sys.argv) > 2 else ALLV)}

slug = lambda u: "home" if u == "/" else u.strip("/").replace("/", "_")

PROBE = r"""
() => {
  const vh = innerHeight, vw = innerWidth;
  const vis = el => { const cs = getComputedStyle(el); if (cs.display==='none'||cs.visibility==='hidden') return false;
    let n=el, op=1; while(n && n!==document.documentElement){ op*=parseFloat(getComputedStyle(n).opacity); n=n.parentElement } return op>0.1 };
  // fixed chrome
  let chrome = 0; const parts = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if ((cs.position==='fixed'||cs.position==='sticky') && vis(el)) {
      const r = el.getBoundingClientRect();
      if (r.width > vw*0.6 && r.height > 20 && r.bottom > 0 && r.top < vh && !el.closest('[aria-hidden=true]') && el.id!=='toast') {
        // skip nested fixed inside counted
        if (parts.some(p => p.el.contains(el))) continue;
        parts.push({el, h: Math.round(Math.min(r.bottom, vh) - Math.max(r.top, 0)), cls: (el.className||'').toString().slice(0,30)});
      }
    }
  }
  chrome = parts.reduce((s,p)=>s+p.h,0);
  const ctaSel = 'a[href^="tel:"], a[href*="wa.me"], a[href="/booking"]';
  const inView = el => { const r = el.getBoundingClientRect(); if (r.width<2||r.height<2) return false;
     if (r.bottom<=0||r.top>=vh||r.right<=0||r.left>=vw) return false;
     const x=Math.min(Math.max(r.left+r.width/2,1),vw-1), y=Math.min(Math.max(r.top+r.height/2,1),vh-1);
     const t=document.elementFromPoint(x,y); return t && (t===el||el.contains(t)) && vis(el) };
  const ctas = [...document.querySelectorAll(ctaSel)].filter(inView).map(a => {
     const h=a.getAttribute('href'); return h.startsWith('tel:')?'tel':h.includes('wa.me')?'wa':'booking' });
  const count = k => ctas.filter(c=>c===k).length;
  // overflow / clipped / small
  const ox = document.documentElement.scrollWidth - vw;
  let clipped = [], small = [];
  for (const el of document.querySelectorAll('a.btn, button, .bnav a, .top-link, .klink-card, .conc-pill, .w-pill, .tab, summary')) {
    if (!vis(el)) continue; const r = el.getBoundingClientRect(); if (!r.width) continue;
    if (el.scrollWidth - el.clientWidth > 1 && getComputedStyle(el).overflowX!=='auto') clipped.push((el.innerText||'').trim().slice(0,24));
    if ((r.width < 44 || r.height < 44) && r.width>0) small.push((el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,18)+' '+Math.round(r.width)+'x'+Math.round(r.height));
  }
  const act = document.querySelector('.top-link[aria-current=page]');
  let actVis = null; if (act) { const r = act.getBoundingClientRect(); actVis = r.left >= 0 && r.right <= vw; }
  return { chrome, chromePct: Math.round(chrome*100/vh), parts: parts.map(p=>p.cls+':'+p.h),
           tel: count('tel'), wa: count('wa'), booking: count('booking'), ctaTotal: ctas.length,
           ox, clipped: [...new Set(clipped)].slice(0,6), small: [...new Set(small)], actVis, H: document.documentElement.scrollHeight };
}
"""

out = {}
with sync_playwright() as p:
    br = p.chromium.launch()
    for vk, (w, h, mob) in VPS.items():
        ctx = br.new_context(viewport={"width": w, "height": h}, is_mobile=mob, has_touch=mob, device_scale_factor=1, locale="ar-SA")
        for u in URLS if vk != "m320" else URLS:
            pg = ctx.new_page()
            pg.goto(B + u, wait_until="networkidle"); pg.wait_for_timeout(500)
            first = pg.evaluate(PROBE)
            if vk in ("m390", "m360", "d1440") or u in KEY:
                import os; os.makedirs(f"qa/audit-v4/shots/{vk}", exist_ok=True)
                pg.screenshot(path=f"qa/audit-v4/shots/{vk}/{slug(u)}.png")
            # scroll screens
            maxc, maxat, H = first["ctaTotal"], 0, first["H"]
            y = h; screens = 1
            while y < H and screens < 40:
                pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(60)
                s = pg.evaluate(PROBE)
                if s["ctaTotal"] > maxc: maxc, maxat = s["ctaTotal"], y
                y += h - 60; screens += 1
            if vk == "m390" and u in KEY:
                pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(200)
                pg.screenshot(path=f"qa/audit-v4/shots/m390/full_{slug(u)}.png", full_page=True)
            first.update({"maxCtaOneScreen": maxc, "maxCtaAtY": maxat, "screens": screens})
            out.setdefault(u, {})[vk] = first
            pg.close()
        ctx.close()
        print("done", vk, flush=True)
    br.close()
json.dump(out, open(f"qa/audit-v4/data/visual_{'_'.join(VPS)}.json", "w"), ensure_ascii=False, indent=1)
print("ok", len(out))
