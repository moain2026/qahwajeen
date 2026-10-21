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
OPACITY = 0.92  # flat mark, clearly visible like keifaldiafa.com
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


EMERALD = (8, 46, 34)      # brand dark green
GOLD = (201, 162, 88)      # brand gold (flat, no 3D shading)
CREAM = (250, 242, 222)


def _sil(size):
    """flat vector-like silhouette of the logo (alpha only, crisp edges)"""
    a = LOGO.resize((size, size), Image.LANCZOS).split()[3]
    return a.point(lambda p: 255 if p > 110 else 0).filter(ImageFilter.GaussianBlur(0.6))


def mark(size, light_bg=True):
    """Flat vector seal (v2): emerald disc + gold ring + gold logo silhouette,
    and a solid emerald ribbon with cream name + gold domain under it.
    Opaque brand colours => equally legible on white walls, gold dallahs,
    busy food and night shots (no reliance on the photo behind it)."""
    ring = max(3, size // 26)
    pad = max(4, size // 14)
    D = size + pad * 2
    S = 4  # supersample for clean vector edges
    big = Image.new("RGBA", (D * S, D * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    d.ellipse((0, 0, D * S - 1, D * S - 1), fill=GOLD + (255,))
    d.ellipse((ring * S, ring * S, (D - ring) * S - 1, (D - ring) * S - 1), fill=EMERALD + (255,))
    i2 = ring * 2 + max(1, size // 70)
    d.ellipse((i2 * S, i2 * S, (D - i2) * S - 1, (D - i2) * S - 1), outline=GOLD + (255,), width=max(1, size // 90) * S)
    badge = big.resize((D, D), Image.LANCZOS)
    inner = int(size * 0.9)
    sil = _sil(inner)
    g = Image.new("RGBA", (inner, inner), GOLD + (255,)); g.putalpha(sil)
    badge.alpha_composite(g, ((D - inner) // 2, (D - inner) // 2))
    fa = ImageFont.truetype(FONT_AR, max(14, int(size * 0.30)))
    fl = ImageFont.truetype(FONT_LA, max(9, int(size * 0.115)))
    d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    ba = d0.textbbox((0, 0), BRAND, font=fa, direction="rtl", language="ar")
    bl = d0.textbbox((0, 0), "qahwajeen.com", font=fl)
    px, py = int(size * 0.12), int(size * 0.05)
    rw = max(ba[2] - ba[0], bl[2] - bl[0]) + px * 2
    rh = (ba[3] - ba[1]) + (bl[3] - bl[1]) + py * 3
    tw = max(D, rw) + 2
    ov = int(D * 0.10)  # ribbon tucks slightly under the seal
    th = D - ov + rh
    m = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    rib = Image.new("RGBA", (rw * S, rh * S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(rib)
    rad = min(rh, rw) // 3 * S
    dr.rounded_rectangle((0, 0, rw * S - 1, rh * S - 1), radius=rad, fill=GOLD + (255,))
    b2 = max(2, size // 60) * S
    dr.rounded_rectangle((b2, b2, rw * S - 1 - b2, rh * S - 1 - b2), radius=max(1, rad - b2), fill=EMERALD + (255,))
    rib = rib.resize((rw, rh), Image.LANCZOS)
    rx, ry = (tw - rw) // 2, D - ov
    m.alpha_composite(rib, (rx, ry))
    m.alpha_composite(badge, ((tw - D) // 2, 0))
    d = ImageDraw.Draw(m)
    y = ry + py + max(0, ov // 3)
    d.text((rx + (rw - (ba[2] - ba[0])) // 2 - ba[0], y - ba[1]), BRAND, font=fa, fill=CREAM + (255,),
           direction="rtl", language="ar")
    y += ba[3] - ba[1] + py // 2
    d.text((rx + (rw - (bl[2] - bl[0])) // 2 - bl[0], y - bl[1]), "qahwajeen.com", font=fl, fill=GOLD + (255,))
    return m


def lum(img, box):
    """mean relative luminance (0..1) of a region"""
    g = img.crop(box).convert("L").resize((24, 24))
    return sum(g.get_flattened_data()) / (576 * 255)


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
        size = int(min(W, H) * (0.17 if H > W * 1.25 else 0.155))
        size = max(44, size)
        m = mark(size, True)
        best = place(W, H, m.width, m.height, fs)
        tries = 0
        while best is None or (best[3] > 0 and tries < 4):  # shrink until it fits with no face overlap
            size = int(size * 0.85)
            m = mark(size, True)
            best = place(W, H, m.width, m.height, fs)
            tries += 1
        _, x0, y0, ov = best
        bg_l = lum(src, (x0, y0, x0 + m.width, y0 + m.height))
        light = bg_l > 0.5
        m = mark(size, light)
        m.putalpha(m.split()[3].point(lambda p: int(p * OPACITY)))
        out = src.convert("RGBA")
        out.alpha_composite(m, (x0, y0))
        out = out.convert("RGB")
        # legibility proof: luminance contrast text-colour vs real background under the mark
        txt = EMERALD if light else CREAM
        tl = (0.2126 * txt[0] + 0.7152 * txt[1] + 0.0722 * txt[2]) / 255
        report.append({"name": n, "orig": o, "size": [W, H], "faces": len(fs),
                       "bg_lum": round(bg_l, 3), "theme": "light-bg" if light else "dark-bg",
                       "text_bg_contrast": round(abs(tl - bg_l), 3),
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
