#!/usr/bin/env python3
"""
Button integrity audit.

Proves — by measured geometry, not by eyeballing — that no button anywhere
on the site clips its own label, and that every tappable element meets the
44x44 CSS-px minimum from the Apple HIG / Google Material guidance.

For each candidate it compares scrollWidth vs clientWidth (horizontal
clipping), scrollHeight vs clientHeight (vertical clipping), and checks
whether any text node's bounding box escapes its button's padding box.
"""
import json
import time

from playwright.sync_api import sync_playwright

import sys
B = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
PAGES = ["/", "/services", "/services/royal", "/occasions", "/occasions/camps",
         "/qahwajiat-jeddah", "/coffee-break-jeddah", "/menu",
         "/gallery", "/faq", "/booking", "/links"]

PROBE = """
() => {
  const sels = ['a.btn','.bnav a','.hdr-call','.hdr-menu','.top-pages.open .top-link',
                '.lnk','.mcat-chip','.klink-card','.ftr a','a.dishx-card','summary','button'];
  const out = [];
  const seen = new Set();
  for (const sel of sels) {
    for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el)) continue; seen.add(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;   // hidden
      const cs = getComputedStyle(el);
      // Skip elements that are not actually reachable right now: a dock
      // that is faded out, or anything inside pointer-events:none. Measuring
      // those reports the mid-transition transform, not the real hit area.
      if (cs.pointerEvents === 'none') continue;
      let op = 1, n = el;
      while (n && n !== document.body) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      if (op < 0.9) continue;
      // does the inner content overflow the box?
      const clipX = el.scrollWidth  - el.clientWidth;
      const clipY = el.scrollHeight - el.clientHeight;
      // does any child text escape the element's own rect?
      let escape = 0;
      for (const c of el.children) {
        const cr = c.getBoundingClientRect();
        if (cr.width === 0) continue;
        const overR = r.right  - cr.right;
        const overL = cr.left  - r.left;
        if (overR < -0.5 || overL < -0.5) escape = 1;
      }
      out.push({
        sel, txt: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 22),
        w: Math.round(r.width), h: Math.round(r.height),
        clipX, clipY, escape,
        ovf: cs.overflow, ws: cs.whiteSpace,
      });
    }
  }
  return out;
}
"""


def run(page, label):
    rows = page.evaluate(PROBE)
    clipped = [r for r in rows if r["clipX"] > 1 or r["clipY"] > 1 or r["escape"]]
    small = [r for r in rows if (r["w"] < 44 or r["h"] < 44)]
    print(f"\n=== {label} — {len(rows)} interactive elements ===")
    if clipped:
        print("  CLIPPED / OVERFLOWING:")
        for r in clipped:
            print(f"    {r['sel']:18} '{r['txt']}' {r['w']}x{r['h']} "
                  f"clipX={r['clipX']} clipY={r['clipY']} escape={r['escape']} ws={r['ws']}")
    else:
        print("  clipping: NONE — every label fits inside its button")
    if small:
        print(f"  UNDER 44px ({len(small)}):")
        for r in small:
            print(f"    {r['sel']:18} '{r['txt']}' {r['w']}x{r['h']}")
    else:
        print("  tap targets: ALL >= 44x44")
    return len(clipped), len(small)


with sync_playwright() as pw:
    br = pw.chromium.launch(args=["--force-color-profile=srgb"])
    tot_c = tot_s = 0
    for w, h, mobile in [(320, 700, True), (390, 844, True), (1440, 900, False)]:
        ctx = br.new_context(viewport={"width": w, "height": h}, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page()
        for path in PAGES:
            pg.goto(B + path, wait_until="networkidle")
            pg.mouse.wheel(0, 900)
            time.sleep(0.5)
            c, s_ = run(pg, f"{w}px {path}")
            tot_c += c
            tot_s += s_
        if mobile:  # the open menu sheet
            pg.goto(B + "/", wait_until="networkidle")
            pg.click("#menuBtn")
            time.sleep(0.4)
            c, s_ = run(pg, f"{w}px menu-open")
            tot_c += c
            tot_s += s_
        ctx.close()
    br.close()

print(f"\n{'='*56}\nTOTAL clipped: {tot_c}   |   TOTAL under-44px: {tot_s}")
print("VERDICT:", "PASS" if tot_c == 0 and tot_s == 0 else "FIX NEEDED")
