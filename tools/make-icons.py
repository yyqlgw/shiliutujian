# -*- coding: utf-8 -*-
"""生成红石榴图鉴 PWA 图标与 iOS 启动图（无第三方图片素材，纯代码绘制）"""
import math, os
from PIL import Image, ImageDraw

OUT = r"D:\workplace\ShiliuTujian\web\assets"
os.makedirs(OUT, exist_ok=True)

RED_HI = (255, 107, 82)
RED    = (232, 64, 47)
RED_LO = (194, 31, 18)
GOLD   = (255, 224, 138)
GOLD2  = (245, 185, 66)
WHITE  = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgrad(size, top, bottom):
    """垂直渐变底图"""
    w, h = size
    img = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=lerp(top, bottom, y / max(1, h - 1)))
    return img


def diag_grad(size, c1, c2):
    """对角渐变"""
    w, h = size
    img = Image.new("RGB", (w, h), c1)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(1, w - 1) + y / max(1, h - 1)) / 2.0
            px[x, y] = lerp(c1, c2, t)
    return img


def draw_seed(d, cx, cy, r, fill=WHITE):
    """画一颗石榴籽（椭圆 + 左上高光，看起来有汁水感）"""
    d.ellipse([cx - r, cy - r * 0.82, cx + r, cy + r * 0.82], fill=fill)
    # 高光
    hr = r * 0.30
    d.ellipse([cx - r * 0.42 - hr, cy - r * 0.40 - hr * 0.8,
               cx - r * 0.42 + hr, cy - r * 0.40 + hr * 0.8],
              fill=(255, 210, 122, 200))


def make_icon(size, maskable=False):
    """红底 + 白色石榴籽簇 + 顶部花萼"""
    img = Image.new("RGB", (size, size), RED)
    d = ImageDraw.Draw(img)
    # 垂直渐变底
    for y in range(size):
        col = lerp(RED_HI, RED_LO, y / max(1, size - 1))
        d.line([(0, y), (size, y)], fill=col)

    # 圆形高光（右上）
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([size * 0.42, -size * 0.18, size * 1.18, size * 0.62],
               fill=(255, 210, 122, 46))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    d = ImageDraw.Draw(img)

    # maskable 需要留安全边距（内容在中间 80% 圆内）
    scale = 0.68 if maskable else 0.84
    cx, cy = size / 2, size / 2 + size * 0.03
    R = size * scale / 2

    # 石榴籽簇：紧密相拥（7 颗，中大边小）
    # 形状接近一个「石榴剖面」：中间一颗大籽，周围六颗环绕
    big = R * 0.34
    small = R * 0.26
    d.ellipse([cx - big, cy - big * 0.82, cx + big, cy + big * 0.82], fill=WHITE)
    hr = big * 0.30
    d.ellipse([cx - big * 0.40 - hr, cy - big * 0.36 - hr * 0.8,
               cx - big * 0.40 + hr, cy - big * 0.36 + hr * 0.8],
              fill=(255, 210, 122, 210))

    import math as _m
    ring_r = R * 0.60
    for i in range(6):
        a = -_m.pi / 2 + i * _m.pi * 2 / 6
        px = cx + _m.cos(a) * ring_r
        py = cy + _m.sin(a) * ring_r * 0.86
        d.ellipse([px - small, py - small * 0.82, px + small, py + small * 0.82], fill=WHITE)
        hr2 = small * 0.30
        d.ellipse([px - small * 0.40 - hr2, py - small * 0.36 - hr2 * 0.8,
                   px - small * 0.40 + hr2, py - small * 0.36 + hr2 * 0.8],
                  fill=(255, 210, 122, 210))

    # 顶部花萼（三瓣金冠）
    cl = size * 0.034
    top = cy - R * 0.86
    for dx, hgt in [(-0.62, 1.6), (0.0, 2.6), (0.62, 1.6)]:
        bx = cx + dx * cl * 2.2
        d.polygon([(bx - cl * 0.75, top - cl * 0.5),
                   (bx, top - cl * hgt),
                   (bx + cl * 0.75, top - cl * 0.5)], fill=GOLD)

    # 圆角（非 maskable 时裁圆角）
    if not maskable:
        r = int(size * 0.22)
        mask = Image.new("L", (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img.convert("RGBA")


def make_splash(w, h, name):
    """iOS 启动图：红底渐变 + 居中图标 + 标题"""
    img = vgrad((w, h), RED_HI, RED_LO).convert("RGBA")
    d = ImageDraw.Draw(img)

    # 光晕
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gr = int(w * 0.62)
    gd.ellipse([w / 2 - gr, h * 0.30 - gr, w / 2 + gr, h * 0.30 + gr],
               fill=(255, 210, 122, 40))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    # 居中图标
    icon_size = int(w * 0.30)
    icon = make_icon(icon_size)
    ix, iy = (w - icon_size) // 2, int(h * 0.30 - icon_size / 2)
    img.alpha_composite(icon, (ix, iy))

    # 装饰：飘散光点
    import random
    random.seed(42)
    for _ in range(26):
        px = random.randint(0, w)
        py = random.randint(0, h)
        r = random.randint(2, 6)
        a = random.randint(30, 110)
        d.ellipse([px - r, py - r, px + r, py + r], fill=(255, 210, 122, a))

    img.convert("RGB").save(os.path.join(OUT, name), "JPEG", quality=82, optimize=True)
    return name


# ---------- 生成图标 ----------
make_icon(192).save(os.path.join(OUT, "icon-192.png"), "PNG", optimize=True)
make_icon(512).save(os.path.join(OUT, "icon-512.png"), "PNG", optimize=True)
make_icon(512, maskable=True).convert("RGB").save(
    os.path.join(OUT, "icon-maskable-512.png"), "PNG", optimize=True)
make_icon(180).convert("RGB").save(
    os.path.join(OUT, "apple-touch-icon.png"), "PNG", optimize=True)

# ---------- 生成 iOS 启动图 ----------
splashes = [
    (1170, 2532, "splash-1170x2532.jpg"),
    (1179, 2556, "splash-1179x2556.jpg"),
    (1284, 2778, "splash-1284x2778.jpg"),
    (1290, 2796, "splash-1290x2796.jpg"),
    (1125, 2436, "splash-1125x2436.jpg"),
    (1242, 2688, "splash-1242x2688.jpg"),
    (828, 1792, "splash-828x1792.jpg"),
    (750, 1334, "splash-750x1334.jpg"),
]
for w, h, n in splashes:
    make_splash(w, h, n)

print("生成完成：")
for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    print("  %-30s %8.1f KB" % (f, os.path.getsize(p) / 1024))
