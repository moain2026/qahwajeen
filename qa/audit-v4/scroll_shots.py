#!/usr/bin/env python3
"""Screen-by-screen capture as a real visitor scrolls (390x844 mobile).
Saves each viewport + a contact sheet per page: qa/audit-v4/shots/scroll/<slug>_sheet.jpg"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

B = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
PAGES = sys.argv[2].split(",") if len(sys.argv) > 2 else ["/", "/services", "/booking", "/contact", "/links", "/qahwajiin-jeddah", "/about", "/menu", "/gallery"]
W, H = 390, 844
OUT = "qa/audit-v4/shots/scroll"; os.makedirs(OUT, exist_ok=True)
slug = lambda u: "home" if u == "/" else u.strip("/").replace("/", "_")

with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": W, "height": H}, is_mobile=True, has_touch=True, device_scale_factor=1, locale="ar-SA")
    for u in PAGES:
        pg = ctx.new_page(); pg.goto(B + u, wait_until="networkidle"); pg.wait_for_timeout(600)
        total = pg.evaluate("document.documentElement.scrollHeight"); y, i, files = 0, 0, []
        while y < total and i < 30:
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(900)
            f = f"{OUT}/{slug(u)}_{i:02d}.png"; pg.screenshot(path=f); files.append((f, y))
            y += H - 104; i += 1
            total = pg.evaluate("document.documentElement.scrollHeight")
        # contact sheet 6 per row
        sc = 0.5; tw, th = int(W * sc), int(H * sc); per = 8
        rows = (len(files) + per - 1) // per
        sh = Image.new("RGB", (per * (tw + 6), rows * (th + 18)), (60, 60, 60)); d = ImageDraw.Draw(sh)
        for k, (f, yy) in enumerate(files):
            im = Image.open(f).convert("RGB").resize((tw, th)); x, yv = (k % per) * (tw + 6), (k // per) * (th + 18)
            sh.paste(im, (x, yv + 16)); d.text((x + 2, yv + 2), f"#{k} y={yy}", fill=(255, 230, 0))
        sh.save(f"{OUT}/{slug(u)}_sheet.jpg", quality=80)
        print(u, len(files), "screens", total, "px", flush=True); pg.close()
    br.close()
