#!/usr/bin/env python3
"""
Per-symbol GLOW-TO-WHITE vanish spritesheet.

The symbol gradually glows white:
  - Frames 0-3:   Faint halo appears, subtle white cast
  - Frames 4-7:   Glow intensifies, symbol whitens
  - Frames 8-11:  Symbol almost fully white, halo bright & large
  - Frames 12-13: Fully white silhouette + peak halo flash
  - Frames 14-15: Bright flash pulse (snowPuff explosion takes over)

Each symbol gets its own spritesheet using its silhouette from the atlas.
The overlay is composited ON TOP of the symbol at runtime, so we render:
  1. A soft gaussian halo (glow behind/around the symbol)
  2. The symbol silhouette filled white at increasing opacity

16 frames, 320×320, 8 columns → 2560×640.
"""

from PIL import Image, ImageFilter
import numpy as np
import json
import os

# ── paths ──
SYMBOLS_DIR = "/workspaces/web-sdk/apps/arctic_clusters/static/assets/sprites/symbolsStatic"
OUTPUT_DIR  = "/workspaces/web-sdk/apps/arctic_clusters/static/assets/spines/tumbleWin"

CELL = 320
NUM_FRAMES = 16
COLS = 8
PAD = (CELL - 256) // 2   # 32 px padding each side

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




def load_symbol_alpha(sym_name, atlas_arr):
    """Load 256×256 alpha mask from the atlas (symbolsStatic.webp)."""
    if sym_name in SYMBOL_REGIONS:
        rx, ry = SYMBOL_REGIONS[sym_name]
        return atlas_arr[ry:ry+256, rx:rx+256, 3]

    # Generic circle fallback
    yy, xx = np.mgrid[0:256, 0:256]
    d = np.sqrt((xx - 128)**2 + (yy - 128)**2)
    return np.where(d < 100, 255, 0).astype(np.uint8)


def generate_frames(alpha256, symbol_name):
    """Generate 16 glow-to-white frames for one symbol."""

    # --- Build the white silhouette at full res (256×256) ---
    # This is a white-filled shape matching the symbol's alpha
    silhouette_alpha = alpha256.copy().astype(np.float64)

    # --- Build halo: blurred, expanded version of the silhouette ---
    # Convert alpha to PIL for gaussian blur
    alpha_pil = Image.fromarray(alpha256)

    frames = []
    for fi in range(NUM_FRAMES):
        # Progress: 0.0 to 1.0
        t = fi / (NUM_FRAMES - 1)

        # === Glow intensity curve ===
        # Slow build, then accelerates, holds at peak
        if t < 0.25:
            # Frames 0-3: subtle
            glow_t = t * 1.2  # 0 → 0.3
        elif t < 0.55:
            # Frames 4-8: building
            glow_t = 0.3 + (t - 0.25) * 2.33  # 0.3 → 1.0
        else:
            # Frames 9-15: peak
            glow_t = 1.0

        # === White overlay alpha (applied to symbol silhouette) ===
        # How opaque the white fill is over the symbol
        white_alpha = min(1.0, glow_t * 1.05)

        # === Halo parameters ===
        # Blur radius and opacity increase with glow
        halo_blur = 8 + glow_t * 28  # 8 → 36 px blur
        halo_opacity = glow_t * 0.75  # 0 → 0.75
        halo_scale = 1.0 + glow_t * 0.35  # slight size increase

        # === Flash pulse at the end ===
        if fi >= NUM_FRAMES - 3:
            flash_t = (fi - (NUM_FRAMES - 3)) / 2.0  # 0→1
            # Pulse: bright then dim a tiny bit
            halo_opacity = min(1.0, 0.75 + 0.25 * (1.0 - flash_t * 0.3))
            halo_blur = 36 + flash_t * 12
            halo_scale = 1.35 + flash_t * 0.15

        # --- Render the frame ---
        canvas = np.zeros((CELL, CELL, 4), dtype=np.float64)

        # 1) HALO — blurred, scaled silhouette in white
        # Scale the alpha mask
        scaled_size = int(256 * halo_scale)
        alpha_scaled = alpha_pil.resize((scaled_size, scaled_size), Image.LANCZOS)
        # Blur it
        blur_r = max(1, int(halo_blur))
        alpha_blurred = alpha_scaled.filter(ImageFilter.GaussianBlur(radius=blur_r))
        halo_arr = np.array(alpha_blurred).astype(np.float64) / 255.0

        # Center in 320×320
        offset_x = (CELL - scaled_size) // 2
        offset_y = (CELL - scaled_size) // 2

        # Paste halo into canvas
        for dy in range(halo_arr.shape[0]):
            cy = offset_y + dy
            if cy < 0 or cy >= CELL:
                continue
            for dx in range(halo_arr.shape[1]):
                cx = offset_x + dx
                if cx < 0 or cx >= CELL:
                    continue
                a = halo_arr[dy, dx] * halo_opacity
                if a < 0.003:
                    continue
                # White halo with slight blue tint (icy)
                r, g, b = 230.0, 240.0, 255.0
                da = canvas[cy, cx, 3] / 255.0
                oa = a + da * (1.0 - a)
                if oa > 1e-6:
                    canvas[cy, cx, 0] = (r * a + canvas[cy, cx, 0] * da * (1.0 - a)) / oa
                    canvas[cy, cx, 1] = (g * a + canvas[cy, cx, 1] * da * (1.0 - a)) / oa
                    canvas[cy, cx, 2] = (b * a + canvas[cy, cx, 2] * da * (1.0 - a)) / oa
                    canvas[cy, cx, 3] = oa * 255.0

        # 2) WHITE SILHOUETTE — sharp symbol shape filled white
        for sy in range(256):
            cy = PAD + sy
            for sx in range(256):
                cx = PAD + sx
                sa = silhouette_alpha[sy, sx] / 255.0 * white_alpha
                if sa < 0.003:
                    continue
                # Bright white (warmer/brighter as glow increases)
                warmth = glow_t * 0.15
                r = 240.0 + warmth * 15.0  # 240 → 255
                g = 245.0 + warmth * 10.0  # 245 → 255
                b = 255.0
                da = canvas[cy, cx, 3] / 255.0
                oa = sa + da * (1.0 - sa)
                if oa > 1e-6:
                    canvas[cy, cx, 0] = (r * sa + canvas[cy, cx, 0] * da * (1.0 - sa)) / oa
                    canvas[cy, cx, 1] = (g * sa + canvas[cy, cx, 1] * da * (1.0 - sa)) / oa
                    canvas[cy, cx, 2] = (b * sa + canvas[cy, cx, 2] * da * (1.0 - sa)) / oa
                    canvas[cy, cx, 3] = oa * 255.0

        frame_img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
        frames.append(frame_img)

    return frames


def generate_frames_fast(alpha256, symbol_name):
    """Vectorised version — much faster than pixel loops."""

    silhouette_alpha = alpha256.astype(np.float64) / 255.0
    alpha_pil = Image.fromarray(alpha256)

    # Per-symbol deterministic seed for aurora color variation
    rng = np.random.RandomState(abs(hash(symbol_name)) % (2**31))
    # Pick a subtle aurora hue angle per symbol (cycles through green/teal/purple)
    aurora_phase = rng.uniform(0, 2 * np.pi)

    frames = []
    for fi in range(NUM_FRAMES):
        t = fi / (NUM_FRAMES - 1)

        # Glow curve: slow build → accelerate → hold at peak
        if t < 0.25:
            glow_t = t * 1.2           # 0 → 0.3
        elif t < 0.55:
            glow_t = 0.3 + (t - 0.25) * 2.33  # 0.3 → 1.0
        else:
            glow_t = 1.0

        white_alpha = min(1.0, glow_t * 1.05)

        # Halo: much tighter — barely exceeds the symbol shape
        halo_blur = 4 + glow_t * 12      # 4→16 (was 8→36)
        halo_opacity = glow_t * 0.55      # 0→0.55 (was 0→0.75)
        halo_scale = 1.0 + glow_t * 0.08  # 1.0→1.08 (was 1.0→1.35)

        if fi >= NUM_FRAMES - 3:
            flash_t = (fi - (NUM_FRAMES - 3)) / 2.0
            halo_opacity = min(0.85, 0.55 + 0.30 * (1.0 - flash_t * 0.3))
            halo_blur = 16 + flash_t * 4   # was 36+12
            halo_scale = 1.08 + flash_t * 0.04  # was 1.35+0.15

        canvas = np.zeros((CELL, CELL, 4), dtype=np.float64)

        # --- HALO (vectorised) --- aurora-tinted soft glow behind symbol
        scaled_size = int(256 * halo_scale)
        alpha_scaled = alpha_pil.resize((scaled_size, scaled_size), Image.LANCZOS)
        blur_r = max(1, int(halo_blur))
        alpha_blurred = alpha_scaled.filter(ImageFilter.GaussianBlur(radius=blur_r))
        halo_arr = np.array(alpha_blurred).astype(np.float64) / 255.0

        ox = (CELL - scaled_size) // 2
        oy = (CELL - scaled_size) // 2

        src_y0 = max(0, -oy)
        src_x0 = max(0, -ox)
        src_y1 = min(halo_arr.shape[0], CELL - oy)
        src_x1 = min(halo_arr.shape[1], CELL - ox)
        dst_y0 = max(0, oy)
        dst_x0 = max(0, ox)
        dst_y1 = dst_y0 + (src_y1 - src_y0)
        dst_x1 = dst_x0 + (src_x1 - src_x0)

        if dst_y1 > dst_y0 and dst_x1 > dst_x0:
            h_slice = halo_arr[src_y0:src_y1, src_x0:src_x1]
            sa = h_slice * halo_opacity

            # Aurora halo color — shifts through green/teal/purple per frame
            # Primarily white but with visible aurora tint, especially in early/mid frames
            aurora_t = aurora_phase + fi * 0.35
            # Aurora contribution: strong early, fades toward white at peak
            aurora_strength = max(0.08, 0.65 * (1.0 - glow_t * 0.7))
            # Green channel boosted, blue stays high, red pulled down for teal
            ar = 160.0 + 95.0 * (1.0 - aurora_strength)   # 160→255 (teal-ish when strong)
            ag = 210.0 + 45.0 * (1.0 - aurora_strength) + aurora_strength * 45.0 * np.sin(aurora_t)
            ab = 220.0 + 35.0 * (1.0 - aurora_strength) + aurora_strength * 35.0 * np.cos(aurora_t * 0.7 + 1.0)
            # Purple shift on alternate frames
            ar += aurora_strength * 25.0 * max(0, np.sin(aurora_t * 1.3 + 2.5))
            # Clamp
            sr, sg, sb = min(255, max(120, ar)), min(255, max(180, ag)), min(255, max(200, ab))

            da = canvas[dst_y0:dst_y1, dst_x0:dst_x1, 3] / 255.0
            oa = sa + da * (1.0 - sa)
            safe = np.where(oa > 1e-6, oa, 1.0)

            canvas[dst_y0:dst_y1, dst_x0:dst_x1, 0] = np.where(
                oa > 1e-6,
                (sr * sa + canvas[dst_y0:dst_y1, dst_x0:dst_x1, 0] * da * (1.0 - sa)) / safe,
                canvas[dst_y0:dst_y1, dst_x0:dst_x1, 0])
            canvas[dst_y0:dst_y1, dst_x0:dst_x1, 1] = np.where(
                oa > 1e-6,
                (sg * sa + canvas[dst_y0:dst_y1, dst_x0:dst_x1, 1] * da * (1.0 - sa)) / safe,
                canvas[dst_y0:dst_y1, dst_x0:dst_x1, 1])
            canvas[dst_y0:dst_y1, dst_x0:dst_x1, 2] = np.where(
                oa > 1e-6,
                (sb * sa + canvas[dst_y0:dst_y1, dst_x0:dst_x1, 2] * da * (1.0 - sa)) / safe,
                canvas[dst_y0:dst_y1, dst_x0:dst_x1, 2])
            canvas[dst_y0:dst_y1, dst_x0:dst_x1, 3] = oa * 255.0

        # --- HOLOGRAPHIC SILHOUETTE with prismatic color bands ---
        # Iridescent rainbow shimmer across the symbol shape
        # Direct hue-wheel mapping for vivid, saturated colors
        band_offset = aurora_phase + fi * 0.6  # animate band position

        # Holographic intensity: pearly iridescent, mostly white/silver
        # Strong enough to see rainbow shimmer, but white is the dominant tone
        holo_strength = max(0.10, 0.35 * (1.0 - glow_t * 0.5))

        # Build hue map: each pixel gets a unique hue based on position
        yy = np.arange(256).reshape(-1, 1) / 255.0  # 0→1 vertical
        xx = np.arange(256).reshape(1, -1) / 255.0  # 0→1 horizontal

        # Hue varies with vertical + diagonal for prismatic iridescence
        # Multiple frequency components for complex holographic pattern
        hue = (yy * 1.8 + xx * 0.6 + band_offset / (2 * np.pi)) % 1.0
        hue = np.broadcast_to(hue, (256, 256)).copy()

        # Secondary iridescent shimmer (faster frequency, smaller amplitude)
        shimmer = np.sin(yy * np.pi * 5.0 + xx * np.pi * 3.0 + band_offset * 1.5) * 0.15
        hue = (hue + shimmer) % 1.0

        # HSL to RGB conversion — high lightness for pearly/silver look
        # Saturation moderate so colors are visible but not dominant
        sat = 0.65
        lit = 0.82

        def hsl_channel(p, q, t):
            t = t % 1.0
            r = np.where(t < 1/6, p + (q - p) * 6 * t,
                np.where(t < 1/2, q,
                np.where(t < 2/3, p + (q - p) * (2/3 - t) * 6,
                p)))
            return r

        q = np.where(lit < 0.5, lit * (1 + sat), lit + sat - lit * sat)
        p = 2 * lit - q

        color_r = hsl_channel(p, q, hue + 1/3) * 255
        color_g = hsl_channel(p, q, hue) * 255
        color_b = hsl_channel(p, q, hue - 1/3) * 255

        # Blend toward white: holographic → white as glow progresses
        hs = holo_strength
        fill_r = (255.0 * (1.0 - hs) + color_r * hs).copy()
        fill_g = (255.0 * (1.0 - hs) + color_g * hs).copy()
        fill_b = (255.0 * (1.0 - hs) + color_b * hs).copy()

        sa = silhouette_alpha * white_alpha

        region = canvas[PAD:PAD+256, PAD:PAD+256]
        da = region[:, :, 3] / 255.0
        oa = sa + da * (1.0 - sa)
        safe = np.where(oa > 1e-6, oa, 1.0)

        region[:, :, 0] = np.where(oa > 1e-6,
            (fill_r * sa + region[:, :, 0] * da * (1.0 - sa)) / safe, region[:, :, 0])
        region[:, :, 1] = np.where(oa > 1e-6,
            (fill_g * sa + region[:, :, 1] * da * (1.0 - sa)) / safe, region[:, :, 1])
        region[:, :, 2] = np.where(oa > 1e-6,
            (fill_b * sa + region[:, :, 2] * da * (1.0 - sa)) / safe, region[:, :, 2])
        region[:, :, 3] = oa * 255.0
        canvas[PAD:PAD+256, PAD:PAD+256] = region

        frame_img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
        frames.append(frame_img)

    return frames


# ═══════════════════════════════════════════════════════════════════
# SPRITESHEET + JSON
# ═══════════════════════════════════════════════════════════════════

def save_spritesheet(frames, symbol_name):
    rows = (len(frames) + COLS - 1) // COLS
    sheet = Image.new("RGBA", (COLS * CELL, rows * CELL), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, ((i % COLS) * CELL, (i // COLS) * CELL))

    base = f"glow_{symbol_name}_spritesheet"
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
    print("  Per-symbol GLOW-TO-WHITE vanish generator")
    print("  Symbol glows progressively whiter, then pops")
    print("=" * 60)

    atlas_path = os.path.join(SYMBOLS_DIR, "symbolsStatic.webp")
    atlas = Image.open(atlas_path).convert("RGBA")
    atlas_arr = np.array(atlas)
    print(f"  Atlas: {atlas.size}")

    for sym in SYMBOL_REGIONS:
        print(f"\n--- {sym} ---")
        alpha256 = load_symbol_alpha(sym, atlas_arr)
        pixel_count = np.sum(alpha256 > 40)
        print(f"  Silhouette: {pixel_count} opaque pixels")

        frames = generate_frames_fast(alpha256, sym)
        for i, f in enumerate(frames):
            fa = np.array(f)
            px = np.sum(fa[:, :, 3] > 0)
            avg_a = np.mean(fa[:, :, 3][fa[:, :, 3] > 0]) if px > 0 else 0
            phase = ("BUILD" if i <= 3 else "GLOW" if i <= 7 else
                     "WHITE" if i <= 11 else "PEAK" if i <= 13 else "FLASH")
            print(f"  frame {i:2d} [{phase:5s}] {px:6d} px  avg_a={avg_a:.0f}")
        save_spritesheet(frames, sym)

    # generic fallback
    print("\n--- generic ---")
    generic_alpha = load_symbol_alpha("generic", atlas_arr)
    frames = generate_frames_fast(generic_alpha, "generic")
    for i, f in enumerate(frames):
        fa = np.array(f)
        px = np.sum(fa[:, :, 3] > 0)
        avg_a = np.mean(fa[:, :, 3][fa[:, :, 3] > 0]) if px > 0 else 0
        phase = ("BUILD" if i <= 3 else "GLOW" if i <= 7 else
                 "WHITE" if i <= 11 else "PEAK" if i <= 13 else "FLASH")
        print(f"  frame {i:2d} [{phase:5s}] {px:6d} px  avg_a={avg_a:.0f}")
    save_spritesheet(frames, "generic")

    # Debug frames for H1
    debug_dir = os.path.join(OUTPUT_DIR, "glow_debug")
    os.makedirs(debug_dir, exist_ok=True)
    alpha256 = load_symbol_alpha("H1", atlas_arr)
    dbg = generate_frames_fast(alpha256, "H1")
    for i, f in enumerate(dbg):
        f.save(os.path.join(debug_dir, f"H1_frame_{i:02d}.png"))
    print(f"\n  Debug: {debug_dir}/")

    print("\n=== DONE ===")


if __name__ == "__main__":
    main()
