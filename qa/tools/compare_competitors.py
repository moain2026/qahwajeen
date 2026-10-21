#!/usr/bin/env python3
"""Perceptual match of every source photo (assets/img-src) against the images
listed in competitors' image sitemaps. Prints matches with aHash distance <= 40
(of 256). Usage: python3 qa/tools/compare_competitors.py  (needs network + pillow)"""
import glob, hashlib, io, os, re, urllib.request
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAPS = ["https://keifaldiafa.com/image-sitemap.xml", "https://asoulaldiafa.com/image-sitemap.xml"]
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=25).read()
def ah(im, n=16):
    im = im.convert("L").resize((n, n)); px = list(im.get_flattened_data()); m = sum(px) / len(px)
    return [p > m for p in px]
urls = set()
for m in MAPS:
    try: urls |= set(re.findall(r"<image:loc>([^<]+)", get(m).decode()))
    except Exception as e: print("skip", m, e)
H = {}
for u in sorted(urls):
    try: H[u] = ah(Image.open(io.BytesIO(get(u))))
    except Exception: pass
print("competitor images", len(H))
hits = 0
for f in sorted(glob.glob(f"{ROOT}/assets/img-src/*-sm.webp")):
    h = ah(Image.open(f)); d, u = min((sum(a != b for a, b in zip(h, v)), u) for u, v in H.items())
    if d <= 40: hits += 1; print(f"{os.path.basename(f)[:-8]:22} {d:3}  {u}")
print("matches", hits)
