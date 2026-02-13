#!/usr/bin/env python3
"""
Snow Wind Swirl — procedural wind-spiral vanish animation.

Animated spiral strokes wrap around the symbol centre, creating a
fantasy ice-wind whirl with snowflakes, sparkles and ice crystals.

Animation (16 frames, 320×320):
  Frames 0–2:   Wind streaks spiral inward (gathering)
  Frames 3–5:   Dense wrap envelopes centre (symbol vanishes ~frame 3)
  Frames 6–12:  Spirals unwind outward with trailing wisps
  Frames 13–15: Faint wisps dissipate

Spritesheet: 8 columns → 2560×640.
"""

from PIL import Image, ImageDraw
import numpy as np
import json
import os
import random
import math

OUTPUT_DIR = "/workspaces/web-sdk/apps/alchemy/static/assets/spines/tumbleWin"
CELL = 320
NUM_FRAMES = 16
COLS = 8
cx, cy = CELL // 2, CELL // 2

random.seed(42)
np.random.seed(42)


# ══════════════════════════════════════════════════════════════════════════
# Fast ribbon drawing — works directly on a float64 RGBA canvas array
# ══════════════════════════════════════════════════════════════════════════

def composite_dot(canvas_arr, x, y, radius, src_alpha_01, bright=False):
    """
    Composite a soft gaussian dot onto canvas_arr (float64 H×W×4, 0-255).
    src_alpha_01 is 0-1 multiplier for the dot's alpha.
    """
    if radius < 0.5 or src_alpha_01 < 0.004:
        return
    h, w = canvas_arr.shape[:2]
    ri = int(radius * 1.5) + 1
    x0, x1 = max(0, int(x) - ri), min(w, int(x) + ri + 1)
    y0, y1 = max(0, int(y) - ri), min(h, int(y) + ri + 1)
    if x0 >= x1 or y0 >= y1:
        return

    yy, xx = np.mgrid[y0:y1, x0:x1]
    dist = np.sqrt((xx - x) ** 2 + (yy - y) ** 2)
    norm = dist / radius

    gauss = np.exp(-2.5 * norm ** 2)
    gauss[norm > 1.5] = 0.0
    src_a = gauss * src_alpha_01            # 0-1

    # Colour: white centre → light blue edge
    t = np.clip(norm, 0, 1)
    if bright:
        src_r = np.full_like(t, 255.0)
        src_g = np.full_like(t, 253.0)
        src_b = np.full_like(t, 255.0)
    else:
        src_r = 248.0 - t * 38.0
        src_g = 250.0 - t * 28.0
        src_b = 255.0 - t * 14.0

    # Porter-Duff "over" compositing
    dst_a = canvas_arr[y0:y1, x0:x1, 3] / 255.0
    out_a = src_a + dst_a * (1.0 - src_a)

    mask = out_a > 1e-6
    if not mask.any():
        return
    safe = np.where(mask, out_a, 1.0)

    for c, sc in enumerate([src_r, src_g, src_b]):
        dc = canvas_arr[y0:y1, x0:x1, c]
        canvas_arr[y0:y1, x0:x1, c] = np.where(
            mask,
            (sc * src_a + dc * dst_a * (1.0 - src_a)) / safe,
            dc,
        )
    canvas_arr[y0:y1, x0:x1, 3] = np.clip(out_a * 255.0, 0, 255)


def composite_glow(canvas_arr, x, y, radius, alpha_01):
    """Soft circular glow to mask the centre during wrap phase."""
    if radius < 2 or alpha_01 < 0.01:
        return
    h, w = canvas_arr.shape[:2]
    ri = int(radius * 1.4) + 1
    x0, x1 = max(0, int(x) - ri), min(w, int(x) + ri + 1)
    y0, y1 = max(0, int(y) - ri), min(h, int(y) + ri + 1)
    if x0 >= x1 or y0 >= y1:
        return

    yy, xx = np.mgrid[y0:y1, x0:x1]
    dist = np.sqrt((xx - x) ** 2 + (yy - y) ** 2)
    norm = dist / radius

    gauss = np.exp(-1.6 * norm ** 2)
    gauss[norm > 1.3] = 0.0
    src_a = gauss * alpha_01

    t = np.clip(norm, 0, 1)
    src_r = 244.0 - t * 22.0
    src_g = 247.0 - t * 18.0
    src_b = 255.0 - t * 8.0

    dst_a = canvas_arr[y0:y1, x0:x1, 3] / 255.0
    out_a = src_a + dst_a * (1.0 - src_a)
    mask = out_a > 1e-6
    if not mask.any():
        return
    safe = np.where(mask, out_a, 1.0)
    for c, sc in enumerate([src_r, src_g, src_b]):
        dc = canvas_arr[y0:y1, x0:x1, c]
        canvas_arr[y0:y1, x0:x1, c] = np.where(
            mask, (sc * src_a + dc * dst_a * (1.0 - src_a)) / safe, dc,
        )
    canvas_arr[y0:y1, x0:x1, 3] = np.clip(out_a * 255.0, 0, 255)


# ══════════════════════════════════════════════════════════════════════════
# Wind spiral class
# ══════════════════════════════════════════════════════════════════════════

class WindSpiral:
    """A single wind spiral stream wrapping around cell centre."""

    def __init__(self, base_angle, direction, turns, inner_r, outer_r,
                 max_width, curl_strength=0.7):
        self.base_angle = base_angle
        self.direction = direction      # +1 CW, -1 CCW
        self.turns = turns
        self.inner_r = inner_r
        self.outer_r = outer_r
        self.max_width = max_width
        self.curl_strength = curl_strength

    def _point(self, t, radius_scale, angle_offset):
        """Point at parameter t (0 = outer tip, 1 = inner centre)."""
        angle = (self.base_angle + angle_offset
                 + self.direction * t * self.turns * 2.0 * math.pi)
        r = (self.outer_r + (self.inner_r - self.outer_r) * t) * radius_scale
        # Curl at the inner tip
        if t > 0.85:
            ct = (t - 0.85) / 0.15
            angle += self.direction * ct * math.pi * self.curl_strength
            r *= (1.0 - 0.35 * ct)
        return cx + r * math.cos(angle), cy + r * math.sin(angle)

    def _width(self, t):
        """Ribbon half-width. Tapered at both ends."""
        return self.max_width * 0.5 * math.sin(t * math.pi) ** 0.45

    def draw(self, canvas_arr, t_start, t_end, radius_scale,
             angle_offset, alpha_mult, num_samples=250, glow=True):
        """Render this spiral ribbon onto canvas_arr."""
        if t_end <= t_start or alpha_mult < 0.01:
            return
        EDGE = 18
        for i in range(num_samples):
            t = t_start + (t_end - t_start) * i / (num_samples - 1)
            x, y = self._point(t, radius_scale, angle_offset)
            hw = self._width(t)
            if hw < 0.5:
                continue
            if x < -hw * 2 or x > CELL + hw * 2 or y < -hw * 2 or y > CELL + hw * 2:
                continue
            # Taper alpha at visible ends
            ef = min(i / EDGE, (num_samples - 1 - i) / EDGE, 1.0)
            a01 = alpha_mult * ef
            if a01 < 0.004:
                continue
            composite_dot(canvas_arr, x, y, hw, a01)

        # Inner glow pass — narrower, brighter
        if glow:
            for i in range(0, num_samples, 2):
                t = t_start + (t_end - t_start) * i / (num_samples - 1)
                x, y = self._point(t, radius_scale, angle_offset)
                hw = self._width(t) * 0.32
                if hw < 0.5:
                    continue
                if x < -hw * 2 or x > CELL + hw * 2 or y < -hw * 2 or y > CELL + hw * 2:
                    continue
                ef = min(i / EDGE, (num_samples - 1 - i) / EDGE, 1.0)
                a01 = alpha_mult * ef * 0.7
                if a01 < 0.004:
                    continue
                composite_dot(canvas_arr, x, y, hw, a01, bright=True)


# ══════════════════════════════════════════════════════════════════════════
# Spiral definitions
# ══════════════════════════════════════════════════════════════════════════

# Three main thick streams
MAIN_SPIRALS = [
    WindSpiral(0.0,               1,  2.0,  12, 148, 32, curl_strength=0.85),
    WindSpiral(math.pi * 2 / 3,  -1,  1.8,  15, 138, 36, curl_strength=0.65),
    WindSpiral(math.pi * 4 / 3,   1,  2.3,  10, 144, 28, curl_strength=0.95),
]

# Two thinner secondary wisps
SECONDARY_SPIRALS = [
    WindSpiral(math.pi / 4,      -1,  1.5,  22, 128, 18, curl_strength=0.5),
    WindSpiral(math.pi * 5 / 4,   1,  1.6,  24, 122, 16, curl_strength=0.4),
]


# ══════════════════════════════════════════════════════════════════════════
# Animation keyframes
# ══════════════════════════════════════════════════════════════════════════

def _main_params(frame):
    """(t_start, t_end, radius_scale, angle_offset, alpha_mult)"""
    rot = frame * 0.055
    if frame == 0:  return (0.0,  0.35, 1.40, rot, 0.65)
    if frame == 1:  return (0.0,  0.52, 1.22, rot, 0.80)
    if frame == 2:  return (0.0,  0.75, 1.05, rot, 0.92)
    if frame == 3:  return (0.0,  0.90, 0.82, rot, 1.00)   # vanish
    if frame == 4:  return (0.0,  1.00, 0.70, rot, 1.00)
    if frame == 5:  return (0.0,  1.00, 0.65, rot, 1.00)
    if frame <= 12:
        p = (frame - 5) / 7.0
        return (0.03 + p * 0.35,
                1.0  - p * 0.45,
                0.68 + p * 1.6,
                rot,
                max(0, 1.0 - p * 0.65))
    p = (frame - 12) / 3.0
    return (0.30, 0.55, 2.3 + p * 0.4, rot, max(0, 0.30 - p * 0.30))


def _secondary_params(frame):
    rot = frame * 0.055
    if frame <= 1:  return (0.0,  0.20, 1.50, rot, 0.30)
    if frame == 2:  return (0.0,  0.50, 1.15, rot, 0.60)
    if frame == 3:  return (0.0,  0.75, 0.90, rot, 0.80)
    if frame == 4:  return (0.0,  0.95, 0.75, rot, 0.90)
    if frame == 5:  return (0.0,  1.00, 0.70, rot, 0.90)
    if frame <= 12:
        p = (frame - 5) / 7.0
        ts = 0.05 + p * 0.30
        te = 1.0  - p * 0.50
        return (ts, max(ts + 0.05, te), 0.72 + p * 1.4,
                rot, max(0, 0.9 - p * 0.65))
    p = (frame - 12) / 3.0
    return (0.25, 0.50, 2.0 + p * 0.5, rot, max(0, 0.20 - p * 0.20))


# ══════════════════════════════════════════════════════════════════════════
# Snow / ice particles (drawn with PIL for crisp shapes)
# ══════════════════════════════════════════════════════════════════════════

def draw_sparkle(ctx, x, y, size, alpha):
    if alpha <= 0 or size < 1:
        return
    a = int(max(0, min(255, alpha)))
    s = max(1, int(size))
    ctx.line([(x, y - s), (x, y + s)], fill=(220, 230, 250, a), width=1)
    ctx.line([(x - s, y), (x + s, y)], fill=(220, 230, 250, a), width=1)
    ctx.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(240, 245, 255, a))


def draw_snowflake(ctx, x, y, size, alpha, rotation=0):
    if alpha <= 0 or size < 2:
        return
    a = int(max(0, min(255, alpha)))
    col = (230, 240, 255, a)
    for k in range(6):
        ang = rotation + k * math.pi / 3
        ex = x + size * math.cos(ang)
        ey = y + size * math.sin(ang)
        ctx.line([(int(x), int(y)), (int(ex), int(ey))], fill=col, width=1)
        mx = x + size * 0.55 * math.cos(ang)
        my = y + size * 0.55 * math.sin(ang)
        for b in [-1, 1]:
            ba = ang + b * math.pi / 4
            bx = mx + size * 0.3 * math.cos(ba)
            by = my + size * 0.3 * math.sin(ba)
            ctx.line([(int(mx), int(my)), (int(bx), int(by))], fill=col, width=1)


def draw_diamond(ctx, x, y, size, alpha):
    if alpha <= 0 or size < 1:
        return
    a = int(max(0, min(255, alpha)))
    s = max(1, int(size))
    pts = [(x, y - s), (x + s * 0.6, y), (x, y + s), (x - s * 0.6, y)]
    ctx.polygon([(int(p[0]), int(p[1])) for p in pts],
                fill=(210, 230, 255, a))


class SnowParticle:
    """Snowflake / sparkle / crystal that follows the wind outward."""

    def __init__(self):
        self.angle = random.uniform(0, 2 * math.pi)
        self.start_radius = random.uniform(15, 55)
        self.speed = random.uniform(1.2, 3.5)
        self.spiral_rate = random.uniform(0.06, 0.14) * random.choice([1, -1])
        self.size = random.uniform(2.5, 8.0)
        self.alpha_base = random.randint(140, 235)
        self.birth_frame = random.choices(
            [1, 2, 3, 4, 5], weights=[0.10, 0.25, 0.30, 0.20, 0.15])[0]
        self.kind = random.choices(
            ['snowflake', 'sparkle', 'dot', 'diamond'],
            weights=[0.25, 0.25, 0.35, 0.15])[0]
        self.rotation = random.uniform(0, 2 * math.pi)
        self.rot_speed = random.uniform(-0.25, 0.25)

    def get_state(self, frame):
        age = frame - self.birth_frame
        if age < 0:
            return None
        r = self.start_radius + self.speed * age * 1.4
        cur_ang = self.angle + self.spiral_rate * age
        x = cx + r * math.cos(cur_ang)
        y = cy + r * math.sin(cur_ang)
        if x < 2 or x >= CELL - 2 or y < 2 or y >= CELL - 2:
            return None
        if frame >= NUM_FRAMES - 3:
            alpha = self.alpha_base * (1.0 - (frame - (NUM_FRAMES - 3)) / 2.0)
        else:
            alpha = float(self.alpha_base)
        if age == 0:
            alpha *= 0.35
        rot = self.rotation + self.rot_speed * age
        return (x, y, self.size, max(0, alpha), self.kind, rot)


# ══════════════════════════════════════════════════════════════════════════
# Frame generation
# ══════════════════════════════════════════════════════════════════════════

def generate_frames():
    snow = [SnowParticle() for _ in range(90)]
    frames = []

    for fi in range(NUM_FRAMES):
        print(f"  Frame {fi:2d} ...", end=" ", flush=True)
        arr = np.zeros((CELL, CELL, 4), dtype=np.float64)

        # Main spirals
        mp = _main_params(fi)
        if mp[3] > 0:
            for sp in MAIN_SPIRALS:
                sp.draw(arr, *mp, num_samples=250)

        # Secondary wisps
        sp_p = _secondary_params(fi)
        if sp_p[3] > 0:
            for sp in SECONDARY_SPIRALS:
                sp.draw(arr, *sp_p, num_samples=180, glow=False)

        # Centre glow during wrap (frames 3-5)
        if 3 <= fi <= 5:
            glow_a = {3: 0.62, 4: 0.78, 5: 0.70}[fi]
            glow_r = {3: 68, 4: 80, 5: 74}[fi]
            composite_glow(arr, cx, cy, glow_r, glow_a)

        # Convert to PIL image
        canvas = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

        # Snowflakes / sparkles / crystals
        if fi >= 1:
            ctx = ImageDraw.Draw(canvas)
            for sn in snow:
                state = sn.get_state(fi)
                if state is None:
                    continue
                x, y, sz, alpha, kind, rot = state
                alpha = int(alpha)
                if alpha <= 0:
                    continue
                if kind == 'snowflake':
                    draw_snowflake(ctx, int(x), int(y), int(sz), alpha, rot)
                elif kind == 'sparkle':
                    draw_sparkle(ctx, int(x), int(y), sz, alpha)
                elif kind == 'diamond':
                    draw_diamond(ctx, int(x), int(y), sz, alpha)
                else:
                    r = max(1, int(sz * 0.7))
                    ctx.ellipse([x - r, y - r, x + r, y + r],
                                fill=(235, 242, 255, alpha))

        pix_count = np.sum(np.array(canvas)[:, :, 3] > 0)
        phase = ("GATHER" if fi <= 2 else
                 "WRAP" if fi <= 5 else
                 "RELEASE" if fi <= 12 else "FADE")
        print(f"[{phase:7s}] pixels={pix_count}")
        frames.append(canvas)

    return frames


# ══════════════════════════════════════════════════════════════════════════
# Spritesheet + JSON
# ══════════════════════════════════════════════════════════════════════════

def create_spritesheet(frames):
    rows = (len(frames) + COLS - 1) // COLS
    sheet = Image.new('RGBA', (COLS * CELL, rows * CELL), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, ((i % COLS) * CELL, (i // COLS) * CELL))
    return sheet, rows


def create_json(num_frames, rows, image_filename):
    frames_data = {}
    for i in range(num_frames):
        name = f"poof_{i:03d}"
        frames_data[name] = {
            "filename": f"{name}.png",
            "frame": {
                "x": (i % COLS) * CELL,
                "y": (i // COLS) * CELL,
                "w": CELL, "h": CELL
            },
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": CELL, "h": CELL},
            "sourceSize": {"w": CELL, "h": CELL},
            "duration_ms": 17
        }
    return {
        "frames": frames_data,
        "meta": {
            "image": image_filename,
            "size": {"w": COLS * CELL, "h": rows * CELL},
            "format": "RGBA8888",
            "scale": 1
        },
        "animations": {
            "poof": [f"poof_{i:03d}" for i in range(num_frames)]
        }
    }


def main():
    print("=" * 60)
    print("  Snow Wind Swirl — procedural spiral vanish")
    print(f"  {NUM_FRAMES} frames, {CELL}x{CELL}")
    print(f"  Gather: 0-2, Wrap: 3-5, Release: 6-12, Fade: 13-15")
    print("=" * 60)

    frames = generate_frames()

    print(f"\n--- Assembling spritesheet ---")
    sheet, rows = create_spritesheet(frames)
    print(f"  Sheet: {sheet.size[0]}x{sheet.size[1]} ({COLS}x{rows})")

    out_png = os.path.join(OUTPUT_DIR, "snow_poof_spritesheet.png")
    out_json = os.path.join(OUTPUT_DIR, "snow_poof_spritesheet.json")

    sheet.save(out_png, optimize=True)
    print(f"  Saved: {out_png}")

    meta = create_json(NUM_FRAMES, rows, "snow_poof_spritesheet.png")
    with open(out_json, 'w') as jf:
        json.dump(meta, jf, indent=2)
    print(f"  Saved: {out_json}")

    # Debug frames
    debug_dir = os.path.join(OUTPUT_DIR, "poof_debug")
    os.makedirs(debug_dir, exist_ok=True)
    for i, f in enumerate(frames):
        f.save(os.path.join(debug_dir, f"frame_{i:02d}.png"))
    print(f"  Debug frames: {debug_dir}/")

    print(f"\n=== DONE ===")


if __name__ == "__main__":
    main()
