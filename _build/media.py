#!/usr/bin/env python3
"""Foam Gaming sitesi — görsel/video hazırlama.

Kaynak: ../ (projeler klasörü) altındaki mağaza görselleri ve reklam videoları.
Çıktı:  assets/ + _build/media.json (boyutlar, build.mjs okur).
Çalıştır:  cd foamgaming-site && python3 _build/media.py [--force]
Yeni oyun: aşağıdaki GAMES sözlüğüne kaynak yollarını ekle.
"""
import glob, json, os, subprocess, sys, zipfile
from PIL import Image, ImageDraw, ImageFilter

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(SITE)  # projeler/
FORCE = "--force" in sys.argv
A = os.path.join(SITE, "assets")

def P(*p): return os.path.join(ROOT, *p)
def S(*p): return os.path.join(SITE, *p)

GAMES = {
    "find-or-fill": {
        "icon": S("find-or-fill-icon.png"),
        "feature": {"tr": P("find ek dosyalar", "mağaza", "feature-graphic-1024x500.png"),
                    "en": P("find ek dosyalar", "mağaza", "feature-graphic-1024x500.png")},
        "shots": {"tr": P("find ek dosyalar", "mağaza", "tr", "*.png"),
                  "en": P("find ek dosyalar", "mağaza", "en", "*.png")},
        "video": {"tr": P("find ek dosyalar", "find-or-fill-reklam-TR.mp4"),
                  "en": P("find ek dosyalar", "find-or-fill-ad-EN.mp4")},
    },
    "bird-jam": {
        "icon": S("bird-jam-icon.png"),
        "feature": {l: P("bird ek dosyalar", "BirdJam_magaza", l, "google_play", "feature_graphic_1024x500.png") for l in ("tr", "en")},
        "shots": {l: P("bird ek dosyalar", "BirdJam_magaza", l, "google_play", "[0-9]_*.png") for l in ("tr", "en")},
        "video": {l: P("bird ek dosyalar", "BirdJam_magaza", l, "video", "*.mp4") for l in ("tr", "en")},
    },
    "cannon-clash": {
        "icon": S("cannon-clash-icon.png"),
        "feature": {l: P("cannon-clash", "store", "feature-graphic-1024x500.png") for l in ("tr", "en")},
        "shots": {l: P("cannon-clash", "store", f"screenshots-{l}", "*.png") for l in ("tr", "en")},
        "video": {},
    },
    "bogaz-vts": {
        "icon": S("bogaz-vts-icon.png"),
        "feature": {l: P("bogaz-vts", "store", f"feature-{l}.png") for l in ("tr", "en")},
        "shots": {l: P("bogaz-vts", "store", "screenshots", f"{l}-*.png") for l in ("tr", "en")},
        "video": {},
    },
}
EXTRA_VIDEOS = {"test-join-tr": P("find ek dosyalar", "find-or-fill-test-nasil-katilinir.mp4")}

def need(out): return FORCE or not os.path.exists(out)
def mk(p): os.makedirs(os.path.dirname(p), exist_ok=True); return p

def save_webp(src, out, width=None, height=None, q=80):
    im = Image.open(src)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if width and im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    if height and im.height > height: im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    if need(out): im.save(mk(out), "WEBP", quality=q, method=6)
    return im.size

def save_jpg(src, out, width=None, q=84):
    im = Image.open(src).convert("RGB")
    if width and im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    if need(out): im.save(mk(out), "JPEG", quality=q, optimize=True, progressive=True)
    return im.size

def video(src, out):
    poster = out[:-4] + ".jpg"
    if need(out):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", "scale=540:-2",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", mk(out)], check=True)
    if need(poster):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1", "-i", out, "-frames:v", "1",
                        "-q:v", "4", poster], check=True)
    w, h = Image.open(poster).size
    return {"src": rel(out), "poster": rel(poster), "w": w, "h": h}

def rel(p): return os.path.relpath(p, SITE).replace(os.sep, "/")

def first(pattern):
    m = sorted(glob.glob(pattern)); return m[0] if m else None

manifest = {"games": {}}

# Logo + fontlar
manifest["logo"] = {"src": "assets/img/logo.webp", "size": save_webp(S("foam-gaming.png"), os.path.join(A, "img", "logo.webp"), height=88, q=90)}

for gid, g in GAMES.items():
    out = os.path.join(A, "img", gid)
    m = {"icon": {"src": rel(os.path.join(out, "icon.webp")),
                  "size": save_webp(g["icon"], os.path.join(out, "icon.webp"), width=256, q=88)},
         "feature": {}, "shots": {}, "video": {}}
    # basın kiti için orijinal ikon
    ip = os.path.join(out, "icon-512.png")
    if need(ip): Image.open(g["icon"]).convert("RGBA").resize((512, 512), Image.LANCZOS).save(mk(ip), optimize=True)
    for lang, src in g["feature"].items():
        f = os.path.join(out, f"feature-{lang}.jpg")
        m["feature"][lang] = {"src": rel(f), "size": save_jpg(src, f, width=1024)}
    for lang, pat in g["shots"].items():
        lst = []
        for i, src in enumerate(sorted(glob.glob(pat)), 1):
            o = os.path.join(out, f"{lang}-{i}.webp")
            w0, h0 = Image.open(src).size
            lst.append({"src": rel(o), "size": save_webp(src, o, width=540 if h0 >= w0 else 960, q=78)})
            save_jpg(src, os.path.join(out, "press", f"{lang}-{i}.jpg"), width=1080, q=85)
        m["shots"][lang] = lst
    for lang, pat in g["video"].items():
        src = first(pat)
        if src: m["video"][lang] = video(src, os.path.join(A, "video", f"{gid}-{lang}.mp4"))
    # basın kiti zip
    z = os.path.join(A, "press", f"{gid}-press-kit.zip")
    if need(z):
        with zipfile.ZipFile(mk(z), "w", zipfile.ZIP_DEFLATED) as zf:
            zf.write(ip, f"{gid}/icon-512.png")
            for lang in m["feature"]: zf.write(os.path.join(SITE, m["feature"][lang]["src"]), f"{gid}/feature-{lang}.jpg")
            for f in sorted(glob.glob(os.path.join(out, "press", "*.jpg"))): zf.write(f, f"{gid}/screenshots/{os.path.basename(f)}")
    m["pressKit"] = {"src": rel(z), "bytes": os.path.getsize(z)}
    manifest["games"][gid] = m

for name, src in EXTRA_VIDEOS.items():
    manifest[name] = video(src, os.path.join(A, "video", f"{name}.mp4"))

# Stüdyo basın kiti (logo)
lz = os.path.join(A, "press", "foam-gaming-logo.zip")
if need(lz):
    with zipfile.ZipFile(mk(lz), "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(S("foam-gaming.png"), "foam-gaming-logo.png")
        zf.write(S("apple-touch-icon.png"), "foam-gaming-icon.png")
manifest["logoKit"] = {"src": rel(lz), "bytes": os.path.getsize(lz)}

# Ana sayfa paylaşım görseli 1200x630
og = os.path.join(A, "img", "og-home.jpg")
if need(og):
    W, H = 1200, 630
    bg = Image.new("RGB", (W, H), (11, 14, 42))
    glow = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(glow)
    d.ellipse((150, 120, 650, 620), fill=(120, 90, 20)); d.ellipse((560, 60, 1080, 560), fill=(20, 80, 120))
    bg = Image.blend(bg, glow.filter(ImageFilter.GaussianBlur(120)), .55)
    logo = Image.open(S("foam-gaming.png")).convert("RGBA"); logo = logo.resize((560, round(logo.height * 560 / logo.width)), Image.LANCZOS)
    bg.paste(logo, ((W - logo.width) // 2, 90), logo)
    n, sz, gap = len(GAMES), 170, 34
    x = (W - (n * sz + (n - 1) * gap)) // 2
    for gid, g in GAMES.items():
        ic = Image.open(g["icon"]).convert("RGBA").resize((sz, sz), Image.LANCZOS)
        mask = Image.new("L", (sz, sz), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, sz, sz), radius=38, fill=255)
        bg.paste(ic, (x, 360), mask); x += sz + gap
    bg.save(mk(og), "JPEG", quality=86, optimize=True, progressive=True)
manifest["ogHome"] = {"src": rel(og), "size": [1200, 630]}

with open(os.path.join(SITE, "_build", "media.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)
print("media.json yazıldı:", {k: len(v["shots"].get("tr", [])) for k, v in manifest["games"].items()})
