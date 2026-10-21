#!/usr/bin/env python3
"""
Build every content photo of the site from the untouched originals.

    assets/img-src/{old}-{sm|md|lg}.webp   (originals — never served)
  + assets/catalog.json                    (what each photo really shows)
  → public/static/img/{new-seo-name}-{sm|md|lg}.webp
  → src/imgmap.ts   (sizes)   · src/imgmeta.ts (alt/caption per image + old→new map)
  → qa/watermark-report.json (where the logo went and why)

Per photo:
  1. optional blur of third-party logos (catalog "blur" boxes, source pixels)
  2. face detection (OpenCV YuNet) on the largest variant
  3. the brand mark (logo + «القهوة الملكية» + qahwajeen.com) is placed on the
     candidate spot with ZERO overlap with any face (+ head/neck margin),
     preferring the lower-centre like keifaldiafa.com; never on a face.
  4. EXIF Artist/Copyright + XMP (dc:rights, dc:creator, xmpRights:WebStatement,
     plus:Licensor URL, Iptc4xmpCore:CreatorContactInfo) — Google reads these
     for the «Licensable» badge in Images.

Run:  python3 qa/tools/build_images.py            (needs opencv-python, pillow)
"""
import json, os, re, sys, math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "assets/img-src")
OUT = os.path.join(ROOT, "public/static/img")
CAT = json.load(open(os.path.join(ROOT, "assets/catalog.json")))["items"]
LOGO = Image.open(os.path.join(ROOT, "public/static/img/logo-512.webp")).convert("RGBA")
FONT_AR = "/usr/share/fonts/opentype/fonts-hosny-amiri/Amiri-Bold.ttf"
FONT_LA = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MODEL = os.environ.get("YUNET", os.path.join(ROOT, "..", "models", "yunet.onnx"))
WIDTH = {"sm": 480, "md": 900, "lg": 1600}
SITE = "https://qahwajeen.com"
BRAND = "القهوة الملكية"
YEAR = "2026"

det = cv2.FaceDetectorYN.create(MODEL, "", (320, 320), 0.6, 0.3, 5000)


def variants(key):
    return [v for v in ("sm", "md", "lg") if os.path.exists(f"{SRC}/{key}-{v}.webp")]


def faces(img):
    a = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    h, w = a.shape[:2]
    det.setInputSize((w, h))
    _, f = det.detect(a)
    out = []
    for r in (f if f is not None else []):
        x, y, fw, fh = [float(v) for v in r[:4]]
        out.append((x, y, fw, fh, float(r[-1])))
    return out


def mark(size):
    """brand mark: round logo + Arabic name + domain, gold with soft dark halo"""
    lw = size
    logo = LOGO.resize((lw, lw), Image.LANCZOS)
    fa = ImageFont.truetype(FONT_AR, max(12, int(lw * 0.30)))
    fl = ImageFont.truetype(FONT_LA, max(8, int(lw * 0.11)))
    d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    ba = d0.textbbox((0, 0), BRAND, font=fa, direction="rtl", language="ar")
    bl = d0.textbbox((0, 0), "qahwajeen.com", font=fl)
    tw = max(lw, ba[2] - ba[0], bl[2] - bl[0]) + 8
    th = lw + (ba[3] - ba[1]) + (bl[3] - bl[1]) + int(lw * 0.14)
    m = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    m.alpha_composite(logo, ((tw - lw) // 2, 0))
    d = ImageDraw.Draw(m)
    y = lw + int(lw * 0.02)
    d.text(((tw - (ba[2] - ba[0])) // 2 - ba[0], y - ba[1]), BRAND, font=fa, fill=(232, 202, 140, 255),
           direction="rtl", language="ar")
    y += ba[3] - ba[1] + int(lw * 0.08)
    d.text(((tw - (bl[2] - bl[0])) // 2 - bl[0], y - bl[1]), "qahwajeen.com", font=fl, fill=(246, 240, 227, 255))
    # dark halo so the gold reads on bright AND dark photos
    a = m.split()[3]
    halo = Image.new("RGBA", m.size, (10, 20, 15, 0))
    halo.putalpha(a.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(max(2, lw // 40))).point(lambda p: int(p * 0.55)))
    pad = Image.new("RGBA", m.size, (0, 0, 0, 0))
    pad.alpha_composite(halo)
    pad.alpha_composite(m)
    return pad


def inter(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    return max(0, x2 - x1) * max(0, y2 - y1)


def place(w, h, mw, mh, fs):
    """best top-left for the mark: no face overlap, then closest to lower-centre"""
    # protected zone per face: the face itself + margin + the head/neck around it
    prot = []
    for x, y, fw, fh, _ in fs:
        prot.append((x - fw * 0.6, y - fh * 0.8, x + fw * 1.6, y + fh * 1.7))
    margin = int(min(w, h) * 0.03)
    best = None
    for cy in np.linspace(0.18, 0.86, 35):
        for cx in np.linspace(0.16, 0.84, 35):
            x0 = int(cx * w - mw / 2)
            y0 = int(cy * h - mh / 2)
            if x0 < margin or y0 < margin or x0 + mw > w - margin or y0 + mh > h - margin:
                continue
            box = (x0, y0, x0 + mw, y0 + mh)
            ov = sum(inter(box, p) for p in prot)
            score = ov * 1e6 + ((cx - 0.5) ** 2) * 2 + (cy - 0.66) ** 2
            if best is None or score < best[0]:
                best = (score, x0, y0, ov)
    return best


def xmp(alt, url):
    e = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
    return f"""<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
 xmlns:plus="http://ns.useplus.org/ldf/xmp/1.0/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
 xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
<dc:title><rdf:Alt><rdf:li xml:lang="ar">{e(alt)}</rdf:li></rdf:Alt></dc:title>
<dc:description><rdf:Alt><rdf:li xml:lang="ar">{e(alt)} — {BRAND} جدة</rdf:li></rdf:Alt></dc:description>
<dc:creator><rdf:Seq><rdf:li>{BRAND} ROYAL COFFEE</rdf:li></rdf:Seq></dc:creator>
<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© {YEAR} {BRAND} — qahwajeen.com. جميع الحقوق محفوظة.</rdf:li></rdf:Alt></dc:rights>
<photoshop:Credit>{BRAND}</photoshop:Credit><photoshop:City>Jeddah</photoshop:City><photoshop:Country>Saudi Arabia</photoshop:Country>
<xmpRights:Marked>True</xmpRights:Marked>
<xmpRights:WebStatement>{SITE}/links</xmpRights:WebStatement>
<plus:Licensor><rdf:Seq><rdf:li rdf:parseType="Resource"><plus:LicensorURL>{SITE}/links</plus:LicensorURL></rdf:li></rdf:Seq></plus:Licensor>
<Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource"><Iptc4xmpCore:CiUrlWork>{SITE}</Iptc4xmpCore:CiUrlWork><Iptc4xmpCore:CiEmailWork>qahwajeen@gmail.com</Iptc4xmpCore:CiEmailWork><Iptc4xmpCore:CiTelWork>+966504968113</Iptc4xmpCore:CiTelWork><Iptc4xmpCore:CiAdrCity>Jeddah</Iptc4xmpCore:CiAdrCity></Iptc4xmpCore:CreatorContactInfo>
</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>"""


def exif():
    ex = Image.Exif()
    ex[0x013B] = "Royal Coffee - qahwajeen.com"  # Artist
    ex[0x8298] = f"(c) {YEAR} Royal Coffee qahwajeen.com - All rights reserved"  # Copyright
    return ex.tobytes()


def build():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):  # rebuild content photos from scratch (keep brand files)
        if f.endswith(".webp") and not f.startswith("logo-"):
            os.remove(os.path.join(OUT, f))
    keymap, meta, report, sizes = {}, {}, [], {}
    by_o = {c["o"]: c for c in CAT}
    for c in CAT:
        if "dup" in c:
            continue
        o, n = c["o"], c["n"]
        vs = variants(o)
        if not vs:
            sys.exit(f"missing source for {o}")
        src = Image.open(f"{SRC}/{o}-{vs[-1]}.webp").convert("RGB")
        W, H = src.size
        for b in c.get("blur", []):
            x1, y1, x2, y2 = [int(v) for v in b]
            reg = src.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(max(8, (x2 - x1) // 14)))
            src.paste(reg, (x1, y1))
        fs = faces(src)
        size = int(min(W, H) * (0.21 if H > W * 1.25 else 0.19))
        size = max(56, size)
        m = mark(size)
        best = place(W, H, m.width, m.height, fs)
        tries = 0
        while best is None or (best[3] > 0 and tries < 4):  # shrink until it fits with no face overlap
            size = int(size * 0.85)
            m = mark(size)
            best = place(W, H, m.width, m.height, fs)
            tries += 1
        _, x0, y0, ov = best
        m.putalpha(m.split()[3].point(lambda p: int(p * 0.62)))
        out = src.convert("RGBA")
        out.alpha_composite(m, (x0, y0))
        out = out.convert("RGB")
        report.append({"name": n, "orig": o, "size": [W, H], "faces": len(fs),
                       "mark": [x0, y0, m.width, m.height], "face_overlap_px": int(ov),
                       "blurred": c.get("blur", [])})
        alt = c["alt"]
        made = []
        for v in vs:
            tw = min(WIDTH[v], W) if v != vs[-1] else W
            img = out if tw == W else out.resize((tw, round(H * tw / W)), Image.LANCZOS)
            p = f"{OUT}/{n}-{v}.webp"
            img.save(p, "WEBP", quality=82, method=6, exif=exif(), xmp=xmp(alt, f"{SITE}/static/img/{n}-{v}.webp").encode())
            made.append(v)
        sizes[n] = (made, W, H)
        meta[n] = {"alt": alt, "cap": c["cap"]}
        keymap[o] = n
    for c in CAT:
        if "dup" in c:
            keymap[c["o"]] = keymap[c["dup"]]
    # src/imgmap.ts
    lines = ["// AUTO-GENERATED by qa/tools/build_images.py — do not edit by hand.",
             "// [availableSizes, intrinsicW, intrinsicH] of the largest variant.",
             "export const IMG: Record<string, [string[], number, number]> = {"]
    for n, (vs, W, H) in sizes.items():
        lines.append(f'  "{n}": [[{", ".join(chr(34)+v+chr(34) for v in vs)}], {W}, {H}],')
    lines.append("}")
    tail = open(os.path.join(ROOT, "src/imgmap.ts")).read().split("export const IMG_W", 1)[1]
    open(os.path.join(ROOT, "src/imgmap.ts"), "w").write("\n".join(lines) + "\nexport const IMG_W" + tail)
    # src/imgmeta.ts
    with open(os.path.join(ROOT, "src/imgmeta.ts"), "w") as f:
        f.write("// AUTO-GENERATED by qa/tools/build_images.py from assets/catalog.json — do not edit by hand.\n")
        f.write("/** What each photo really shows (checked by eye) — used as alt text, captions and ImageObject names. */\n")
        f.write("export const IMG_META: Record<string, { alt: string; cap: string }> = " + json.dumps(meta, ensure_ascii=False, indent=1) + "\n")
        f.write("/** Retired image keys → current file name (old /static/img URLs 301 here). */\n")
        f.write("export const IMG_OLD: Record<string, string> = " + json.dumps(keymap, ensure_ascii=False, indent=1) + "\n")
    json.dump(report, open(os.path.join(ROOT, "qa/watermark-report.json"), "w"), ensure_ascii=False, indent=1)
    bad = [r for r in report if r["face_overlap_px"] > 0]
    print(f"built {len(sizes)} photos · {sum(len(v[0]) for v in sizes.values())} files · faces total {sum(r['faces'] for r in report)} · mark on a face: {len(bad)}")
    for r in bad:
        print("  OVERLAP", r)


if __name__ == "__main__":
    build()
