#!/usr/bin/env python3
"""
Per-symbol wind-sweep vanish animation.

Wind streaks blow ACROSS and OVER the symbol — some sweep through it,
some curl around it, some pass over the top.  A final dense gust fully
covers the symbol as it sweeps across, and when the gust passes,
the symbol is gone.

Animation (16 frames, 320×320):
  0-3   Gather  — wispy streaks sweep in from one side, crossing the symbol
  4-6   Gust    — dense wind band sweeps across, fully obscuring the symbol
                   (symbol vanishes behind the gust at frame 4-5)
  7-12  Trail   — wind continues past with trailing wisps & swirls
  13-15 Fade    — last wisps dissipate

Each symbol gets a unique spritesheet.  The contour is used to size
the gust coverage area, not to keep streams away from the symbol.

16 frames, 320×320, 8 columns → 2560×640.
"""

from PIL import Image, ImageDraw
import numpy as np
import json
import os
import math

# ── paths ──
SYMBOLS_DIR = "/workspaces/web-sdk/apps/arctic_clusters/static/assets/sprites/symbolsStatic"
OUTPUT_DIR  = "/workspaces/web-sdk/apps/arctic_clusters/static/assets/spines/tumbleWin"

CELL = 320
NUM_FRAMES = 16
COLS = 8
CX, CY = CELL // 2, CELL // 2
PAD = (CELL - 256) // 2   # 32

SYMBOL_REGIONS = {
    "H1": (0,   0),
    "H2": (256, 0),
    "H3": (512, 0),
    "H4": (0,   512),
    "L1": (256, 512),
    "L2": (0,   256),
    "L3": (256, 256),
    "L4": (512, 256),
}


# ═══════════════════════════════════════════════════════════════════
# RENDERING
# ═══════════════════════════════════════════════════════════════════

def composite_dot(arr, x, y, radius, alpha01, bright=False):
    """Soft gaussian dot onto float64 H×W×4 array (0-255 range)."""
    if radius < 0.5 or alpha01 < 0.003:
        return
    h, w = arr.shape[:2]
    ri = int(radius * 1.4) + 2
    x0, x1 = max(0, int(x) - ri), min(w, int(x) + ri + 1)
    y0, y1 = max(0, int(y) - ri), min(h, int(y) + ri + 1)
    if x0 >= x1 or y0 >= y1:
        return
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d = np.sqrt((xx - x)**2 + (yy - y)**2)
    n = d / radius
    g = np.exp(-2.2 * n**2)
    g[n > 1.5] = 0.0
    sa = g * alpha01
    t = np.clip(n, 0, 1)
    if bright:
        sr, sg_, sb = 255.0, 254.0, 255.0
    else:
        sr = 245.0 - t * 35.0
        sg_ = 248.0 - t * 26.0
        sb = 255.0 - t * 12.0
    da = arr[y0:y1, x0:x1, 3] / 255.0
    oa = sa + da * (1.0 - sa)
    m = oa > 1e-6
    if not m.any():
        return
    s = np.where(m, oa, 1.0)
    for c, sc in enumerate([sr, sg_, sb]):
        dc = arr[y0:y1, x0:x1, c]
        arr[y0:y1, x0:x1, c] = np.where(
            m, (sc * sa + dc * da * (1.0 - sa)) / s, dc)
    arr[y0:y1, x0:x1, 3] = np.clip(oa * 255.0, 0, 255)


# ═══════════════════════════════════════════════════════════════════
# CONTOUR EXTRACTION (for sizing only)
# ═══════════════════════════════════════════════════════════════════

def extract_contour_radius(alpha_mask):
    """Return average and max radius of the symbol silhouette (in 320-space)."""
    mask = alpha_mask > 40
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return 90, 90, CX, CY
    cx = float(xs.mean()) + PAD
    cy = float(ys.mean()) + PAD
    dists = np.sqrt((xs + PAD - cx)**2 + (ys + PAD - cy)**2)
    return float(dists.mean()), float(np.percentile(dists, 95)), cx, cy


# ═══════════════════════════════════════════════════════════════════
# SWEEP STREAM — a curved band that blows ACROSS the cell
# ═══════════════════════════════════════════════════════════════════

class SweepStream:
    """
    A wind band that sweeps from one side of the cell to the other,
    passing over/across/through the symbol.
    
    Parametrised by entry angle and curvature.  The path is a
    cubic Bézier from one edge to the other, curving through/near
    the symbol centre.
    """

    def __init__(self, rng, sym_cx, sym_cy, sym_r, role="sweep"):
        self.role = role  # "sweep", "gust", "trail"

        # Direction the wind blows from (angle of entry point)
        self.entry_angle = rng.uniform(0, 2 * math.pi)
        
        # Some variation in exit direction (not exactly opposite)
        self.exit_offset = rng.uniform(-0.4, 0.4)
        
        # Entry/exit distance from centre
        edge_r = CELL * 0.55
        ea = self.entry_angle
        xa = self.exit_angle
        
        # Bézier control points
        self.p0 = (sym_cx + edge_r * math.cos(ea),
                    sym_cy + edge_r * math.sin(ea))
        self.p3 = (sym_cx + edge_r * math.cos(xa),
                    sym_cy + edge_r * math.sin(xa))
        
        # Control points curve through/near the symbol
        mid_r = sym_r * rng.uniform(0.0, 0.6)  # 0 = through centre
        mid_angle = rng.uniform(0, 2 * math.pi)
        
        # First control point: between entry and centre, with offset
        t1_angle = ea + (xa - ea) * 0.3 + rng.uniform(-0.3, 0.3)
        cp1_r = rng.uniform(sym_r * 0.3, sym_r * 1.2)
        self.p1 = (sym_cx + cp1_r * math.cos(t1_angle),
                    sym_cy + cp1_r * math.sin(t1_angle))
        
        # Second control point: between centre and exit
        t2_angle = ea + (xa - ea) * 0.7 + rng.uniform(-0.3, 0.3)
        cp2_r = rng.uniform(sym_r * 0.2, sym_r * 1.0)
        self.p2 = (sym_cx + cp2_r * math.cos(t2_angle),
                    sym_cy + cp2_r * math.sin(t2_angle))

        # Width & timing differ by role
        if role == "gust":
            self.max_width = rng.uniform(38, 60)
            self.alpha_base = rng.uniform(0.85, 1.0)
            self.appear_frame = rng.choice([2, 3])
            self.sweep_frames = rng.uniform(4.0, 6.0)
        elif role == "trail":
            self.max_width = rng.uniform(10, 24)
            self.alpha_base = rng.uniform(0.35, 0.65)
            self.appear_frame = rng.choice([5, 6, 7, 8])
            self.sweep_frames = rng.uniform(5.0, 8.0)
        else:  # sweep
            self.max_width = rng.uniform(12, 30)
            self.alpha_base = rng.uniform(0.45, 0.80)
            self.appear_frame = rng.choice([0, 0, 1, 1, 2])
            self.sweep_frames = rng.uniform(5.0, 8.0)
    
    @property
    def exit_angle(self):
        return self.entry_angle + math.pi + self.exit_offset

    def _bezier(self, t):
        """Cubic Bézier curve point at parameter t."""
        u = 1 - t
        x = (u**3 * self.p0[0] + 3 * u**2 * t * self.p1[0] +
             3 * u * t**2 * self.p2[0] + t**3 * self.p3[0])
        y = (u**3 * self.p0[1] + 3 * u**2 * t * self.p1[1] +
             3 * u * t**2 * self.p2[1] + t**3 * self.p3[1])
        return x, y

    def render(self, arr, frame, n_samples=200):
        """Draw this stream for the given animation frame."""
        # How far along the sweep has progressed (0 = not started, 1 = fully past)
        progress = (frame - self.appear_frame) / self.sweep_frames
        if progress < -0.1 or progress > 1.3:
            return

        # The visible portion of the Bézier: a sliding window
        # The "head" moves from 0→1 over time, with a tail following
        tail_len = 0.45  # how much of the trail is visible behind head
        head = max(0, min(1, progress))
        tail = max(0, head - tail_len)

        EDGE = 14
        for i in range(n_samples):
            t = tail + (head - tail) * i / (n_samples - 1)
            if t < 0 or t > 1:
                continue
            x, y = self._bezier(t)

            # Skip if far off canvas
            if x < -40 or x > CELL + 40 or y < -40 or y > CELL + 40:
                continue

            # Width: thick in the middle of the visible section, tapered at edges
            local_t = (i / (n_samples - 1))  # 0→1 within visible section
            hw = self.max_width * 0.5 * math.sin(local_t * math.pi) ** 0.4
            if hw < 0.5:
                continue

            # Alpha
            ef = min(i / EDGE, (n_samples - 1 - i) / EDGE, 1.0)
            
            # Fade in at start of appearance, fade out at end
            appear_fade = min(1.0, max(0, (progress + 0.1) / 0.3))
            exit_fade = min(1.0, max(0, (1.3 - progress) / 0.3))
            
            a = self.alpha_base * ef * appear_fade * exit_fade
            if a < 0.004:
                continue
            composite_dot(arr, x, y, hw, a)

        # Bright inner core
        if self.alpha_base > 0.4 and head > tail + 0.05:
            for i in range(0, n_samples, 3):
                t = tail + (head - tail) * i / (n_samples - 1)
                if t < 0 or t > 1:
                    continue
                x, y = self._bezier(t)
                if x < -20 or x > CELL + 20 or y < -20 or y > CELL + 20:
                    continue
                local_t = i / (n_samples - 1)
                hw = self.max_width * 0.15 * math.sin(local_t * math.pi) ** 0.5
                if hw < 0.4:
                    continue
                ef = min(i / EDGE, (n_samples - 1 - i) / EDGE, 1.0)
                appear_fade = min(1.0, max(0, (progress + 0.1) / 0.3))
                exit_fade = min(1.0, max(0, (1.3 - progress) / 0.3))
                a = self.alpha_base * ef * appear_fade * exit_fade * 0.5
                if a < 0.004:
                    continue
                composite_dot(arr, x, y, hw, a, bright=True)


# ═══════════════════════════════════════════════════════════════════
# SPIRAL ACCENT — curling wisps that wrap around/over the symbol
# ═══════════════════════════════════════════════════════════════════

class SpiralAccent:
    """Curling wisp that spirals in/out near the symbol."""
    
    def __init__(self, rng, sym_cx, sym_cy, sym_r):
        self.cx, self.cy = sym_cx, sym_cy
        self.base_angle = rng.uniform(0, 2 * math.pi)
        self.direction = rng.choice([-1, 1])
        self.turns = rng.uniform(0.8, 1.5)
        self.inner_r = rng.uniform(0, sym_r * 0.3)   # can go through centre
        self.outer_r = rng.uniform(sym_r * 0.9, sym_r * 1.6)
        self.max_width = rng.uniform(8, 18)
        self.appear_frame = rng.choice([1, 2, 3, 4])
        self.duration = rng.uniform(5, 9)
        self.alpha_base = rng.uniform(0.3, 0.6)
    
    def render(self, arr, frame, n_samples=140):
        progress = (frame - self.appear_frame) / self.duration
        if progress < -0.05 or progress > 1.15:
            return
        
        # Visible arc slides: head advances, tail follows
        head = max(0, min(1, progress * 1.3))
        tail = max(0, head - 0.5)
        
        EDGE = 12
        for i in range(n_samples):
            t = tail + (head - tail) * i / (n_samples - 1)
            if t < 0 or t > 1:
                continue
            
            angle = self.base_angle + self.direction * t * self.turns * 2 * math.pi
            r = self.outer_r + (self.inner_r - self.outer_r) * t
            x = self.cx + r * math.cos(angle)
            y = self.cy + r * math.sin(angle)
            
            if x < -15 or x > CELL + 15 or y < -15 or y > CELL + 15:
                continue
            
            hw = self.max_width * 0.5 * math.sin((i / (n_samples - 1)) * math.pi) ** 0.45
            if hw < 0.5:
                continue
            
            ef = min(i / EDGE, (n_samples - 1 - i) / EDGE, 1.0)
            appear_fade = min(1.0, max(0, progress / 0.2))
            exit_fade = min(1.0, max(0, (1.15 - progress) / 0.2))
            a = self.alpha_base * ef * appear_fade * exit_fade
            if a < 0.004:
                continue
            composite_dot(arr, x, y, hw, a)


# ═══════════════════════════════════════════════════════════════════
# SNOW / ICE PARTICLES
# ═══════════════════════════════════════════════════════════════════

def draw_sparkle(ctx, x, y, size, alpha):
    if alpha <= 0 or size < 1:
        return
    a = int(min(255, max(0, alpha)))
    s = max(1, int(size))
    ctx.line([(x, y - s), (x, y + s)], fill=(220, 230, 250, a), width=1)
    ctx.line([(x - s, y), (x + s, y)], fill=(220, 230, 250, a), width=1)
    ctx.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(240, 245, 255, a))


def draw_snowflake(ctx, x, y, size, alpha, rot=0):
    if alpha <= 0 or size < 2:
        return
    a = int(min(255, max(0, alpha)))
    col = (230, 240, 255, a)
    for k in range(6):
        ang = rot + k * math.pi / 3
        ex, ey = x + size * math.cos(ang), y + size * math.sin(ang)
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
    a = int(min(255, max(0, alpha)))
    s = max(1, int(size))
    pts = [(x, y - s), (x + s * 0.6, y), (x, y + s), (x - s * 0.6, y)]
    ctx.polygon([(int(p[0]), int(p[1])) for p in pts], fill=(210, 230, 255, a))


class SnowParticle:
    """Snowflake/sparkle/crystal carried by the wind."""

    def __init__(self, rng, wind_angle, sym_cx, sym_cy):
        # Particles move roughly in the wind direction
        self.angle = wind_angle + rng.uniform(-0.6, 0.6)
        self.start_x = sym_cx + rng.uniform(-80, 80)
        self.start_y = sym_cy + rng.uniform(-80, 80)
        self.speed_x = math.cos(self.angle) * rng.uniform(4, 12)
        self.speed_y = math.sin(self.angle) * rng.uniform(4, 12)
        self.wobble = rng.uniform(1, 4)
        self.wobble_freq = rng.uniform(0.3, 0.7)
        self.size = rng.uniform(2.5, 7.5)
        self.alpha_base = rng.randint(130, 230)
        self.birth = rng.choice([0, 1, 2, 3, 4], p=[.1, .25, .3, .2, .15])
        self.kind = rng.choice(["snowflake", "sparkle", "dot", "diamond"],
                                p=[.25, .25, .35, .15])
        self.rot = rng.uniform(0, 2 * math.pi)
        self.rot_speed = rng.uniform(-0.3, 0.3)

    def get(self, frame):
        age = frame - self.birth
        if age < 0:
            return None
        x = self.start_x + self.speed_x * age
        y = self.start_y + self.speed_y * age
        # Wobble perpendicular to wind direction
        perp = self.angle + math.pi / 2
        wb = self.wobble * math.sin(age * self.wobble_freq * 2 * math.pi)
        x += wb * math.cos(perp)
        y += wb * math.sin(perp)
        if x < 0 or x >= CELL or y < 0 or y >= CELL:
            return None
        alpha = float(self.alpha_base)
        if frame >= NUM_FRAMES - 3:
            alpha *= max(0, 1.0 - (frame - (NUM_FRAMES - 3)) / 2.0)
        if age == 0:
            alpha *= 0.3
        return x, y, self.size, max(0, alpha), self.kind, self.rot + self.rot_speed * age


# ═══════════════════════════════════════════════════════════════════
# FRAME GENERATION
# ═══════════════════════════════════════════════════════════════════

def generate_frames(sym_cx, sym_cy, avg_r, max_r, symbol_name):
    """Generate 16 wind-sweep frames for one symbol."""
    rng = np.random.RandomState(abs(hash(symbol_name)) % (2**31))

    # All streams share a dominant wind direction (with variation)
    wind_angle = rng.uniform(math.pi * 0.6, math.pi * 1.0)  # roughly left-to-right/diagonal

    # — Sweep streams: cross over the symbol —
    sweeps = []
    for _ in range(5):
        s = SweepStream(rng, sym_cx, sym_cy, max_r, "sweep")
        # Bias entry angles near the dominant wind direction
        s.entry_angle = wind_angle + rng.uniform(-0.7, 0.7)
        s.exit_offset = rng.uniform(-0.35, 0.35)
        # Recompute endpoints
        ea, xa = s.entry_angle, s.exit_angle
        edge_r = CELL * 0.55
        s.p0 = (sym_cx + edge_r * math.cos(ea), sym_cy + edge_r * math.sin(ea))
        s.p3 = (sym_cx + edge_r * math.cos(xa), sym_cy + edge_r * math.sin(xa))
        # Control points cross through/near centre
        cp1_r = rng.uniform(0, max_r * 0.8)
        cp1_a = ea + rng.uniform(0.5, 1.5) * (1 if rng.random() > 0.5 else -1)
        s.p1 = (sym_cx + cp1_r * math.cos(cp1_a), sym_cy + cp1_r * math.sin(cp1_a))
        cp2_r = rng.uniform(0, max_r * 0.7)
        cp2_a = xa + rng.uniform(-1.0, 1.0)
        s.p2 = (sym_cx + cp2_r * math.cos(cp2_a), sym_cy + cp2_r * math.sin(cp2_a))
        sweeps.append(s)

    # — Gust streams: thick, dense, fully cover the symbol —
    gusts = []
    for _ in range(4):
        g = SweepStream(rng, sym_cx, sym_cy, max_r, "gust")
        g.entry_angle = wind_angle + rng.uniform(-0.3, 0.3)
        g.exit_offset = rng.uniform(-0.2, 0.2)
        ea, xa = g.entry_angle, g.exit_angle
        edge_r = CELL * 0.55
        g.p0 = (sym_cx + edge_r * math.cos(ea), sym_cy + edge_r * math.sin(ea))
        g.p3 = (sym_cx + edge_r * math.cos(xa), sym_cy + edge_r * math.sin(xa))
        # Control points go through the centre for full coverage
        cp1_r = rng.uniform(0, max_r * 0.4)
        cp1_a = ea + rng.uniform(0.3, 1.0)
        g.p1 = (sym_cx + cp1_r * math.cos(cp1_a), sym_cy + cp1_r * math.sin(cp1_a))
        cp2_r = rng.uniform(0, max_r * 0.3)
        cp2_a = xa + rng.uniform(-0.5, 0.5)
        g.p2 = (sym_cx + cp2_r * math.cos(cp2_a), sym_cy + cp2_r * math.sin(cp2_a))
        gusts.append(g)

    # — Trail streams: lighter wisps after the gust —
    trails = []
    for _ in range(4):
        t = SweepStream(rng, sym_cx, sym_cy, max_r, "trail")
        t.entry_angle = wind_angle + rng.uniform(-0.8, 0.8)
        t.exit_offset = rng.uniform(-0.4, 0.4)
        ea, xa = t.entry_angle, t.exit_angle
        edge_r = CELL * 0.55
        t.p0 = (sym_cx + edge_r * math.cos(ea), sym_cy + edge_r * math.sin(ea))
        t.p3 = (sym_cx + edge_r * math.cos(xa), sym_cy + edge_r * math.sin(xa))
        cp1_r = rng.uniform(max_r * 0.2, max_r * 1.0)
        cp1_a = ea + rng.uniform(0.3, 1.2)
        t.p1 = (sym_cx + cp1_r * math.cos(cp1_a), sym_cy + cp1_r * math.sin(cp1_a))
        cp2_r = rng.uniform(max_r * 0.2, max_r * 0.9)
        cp2_a = xa + rng.uniform(-0.8, 0.8)
        t.p2 = (sym_cx + cp2_r * math.cos(cp2_a), sym_cy + cp2_r * math.sin(cp2_a))
        trails.append(t)

    # — Spiral accents: curling wisps around/over the symbol —
    spirals = [SpiralAccent(rng, sym_cx, sym_cy, max_r) for _ in range(4)]

    # — Snow particles (carried in the wind direction) —
    snow = [SnowParticle(rng, wind_angle + math.pi, sym_cx, sym_cy)
            for _ in range(85)]

    all_streams = sweeps + gusts + trails

    frames = []
    for fi in range(NUM_FRAMES):
        arr = np.zeros((CELL, CELL, 4), dtype=np.float64)

        # Draw all sweep/gust/trail streams
        for st in all_streams:
            st.render(arr, fi)

        # Draw spiral accents
        for sp in spirals:
            sp.render(arr, fi)

        canvas = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

        # Snow/sparkles/crystals
        if fi >= 1:
            ctx = ImageDraw.Draw(canvas)
            for sn in snow:
                state = sn.get(fi)
                if state is None:
                    continue
                x, y, sz, a, kind, rot = state
                a = int(a)
                if a <= 0:
                    continue
                if kind == "snowflake":
                    draw_snowflake(ctx, int(x), int(y), int(sz), a, rot)
                elif kind == "sparkle":
                    draw_sparkle(ctx, int(x), int(y), sz, a)
                elif kind == "diamond":
                    draw_diamond(ctx, int(x), int(y), sz, a)
                else:
                    r = max(1, int(sz * 0.7))
                    ctx.ellipse([x - r, y - r, x + r, y + r],
                                fill=(235, 242, 255, a))

        frames.append(canvas)
    return frames


# ═══════════════════════════════════════════════════════════════════
# SPRITESHEET + JSON
# ═══════════════════════════════════════════════════════════════════

def save_spritesheet(frames, symbol_name):
    rows = (len(frames) + COLS - 1) // COLS
    sheet = Image.new("RGBA", (COLS * CELL, rows * CELL), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, ((i % COLS) * CELL, (i // COLS) * CELL))

    base = f"wind_{symbol_name}_spritesheet"
    png_path = os.path.join(OUTPUT_DIR, f"{base}.png")
    json_path = os.path.join(OUTPUT_DIR, f"{base}.json")

    sheet.save(png_path, optimize=True)

    frames_data = {}
    for i in range(len(frames)):
        name = f"poof_{i:03d}"
        frames_data[name] = {
            "filename": f"{name}.png",
            "frame": {"x": (i % COLS) * CELL, "y": (i // COLS) * CELL,
                      "w": CELL, "h": CELL},
            "rotated": False, "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": CELL, "h": CELL},
            "sourceSize": {"w": CELL, "h": CELL},
            "duration_ms": 17,
        }
    meta = {
        "frames": frames_data,
        "meta": {"image": f"{base}.png",
                 "size": {"w": COLS * CELL, "h": rows * CELL},
                 "format": "RGBA8888", "scale": 1},
        "animations": {"poof": [f"poof_{i:03d}" for i in range(len(frames))]},
    }
    with open(json_path, "w") as jf:
        json.dump(meta, jf, indent=2)
    print(f"  -> {png_path}  ({sheet.size[0]}x{sheet.size[1]})")


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("  Per-symbol wind SWEEP generator")
    print("  Wind blows across/over/through each symbol")
    print("=" * 60)

    atlas_path = os.path.join(SYMBOLS_DIR, "symbolsStatic.webp")
    atlas = Image.open(atlas_path).convert("RGBA")
    atlas_arr = np.array(atlas)
    print(f"  Atlas: {atlas.size}")

    for sym, (rx, ry) in SYMBOL_REGIONS.items():
        print(f"\n--- {sym} ---")
        alpha256 = atlas_arr[ry:ry+256, rx:rx+256, 3]
        avg_r, max_r, sym_cx, sym_cy = extract_contour_radius(alpha256)
        print(f"  centre=({sym_cx:.0f},{sym_cy:.0f})  avg_r={avg_r:.0f}  max_r={max_r:.0f}")

        frames = generate_frames(sym_cx, sym_cy, avg_r, max_r, sym)
        for i, f in enumerate(frames):
            px = np.sum(np.array(f)[:, :, 3] > 0)
            phase = ("GATHER" if i <= 3 else "GUST" if i <= 6 else
                     "TRAIL" if i <= 12 else "FADE")
            print(f"  frame {i:2d} [{phase:6s}] {px:6d} px")
        save_spritesheet(frames, sym)

    # generic fallback (circular)
    print("\n--- generic ---")
    frames = generate_frames(CX, CY, 90, 90, "generic")
    for i, f in enumerate(frames):
        px = np.sum(np.array(f)[:, :, 3] > 0)
        phase = ("GATHER" if i <= 3 else "GUST" if i <= 6 else
                 "TRAIL" if i <= 12 else "FADE")
        print(f"  frame {i:2d} [{phase:6s}] {px:6d} px")
    save_spritesheet(frames, "generic")

    # Debug frames for first symbol
    debug_dir = os.path.join(OUTPUT_DIR, "wind_debug")
    os.makedirs(debug_dir, exist_ok=True)
    sym0 = list(SYMBOL_REGIONS.keys())[0]
    alpha256 = atlas_arr[0:256, 0:256, 3]
    avg_r, max_r, sx, sy = extract_contour_radius(alpha256)
    dbg = generate_frames(sx, sy, avg_r, max_r, sym0)
    for i, f in enumerate(dbg):
        f.save(os.path.join(debug_dir, f"{sym0}_frame_{i:02d}.png"))
    print(f"\n  Debug: {debug_dir}/")

    print("\n=== DONE ===")


if __name__ == "__main__":
    main()
