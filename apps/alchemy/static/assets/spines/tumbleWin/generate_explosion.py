#!/usr/bin/env python3
"""
Star Explosion — Reference-image-based spritesheet generator.

Uses starexplosion_one.png (a single reference frame at ~70% animation progress)
and warps it radially to create a full build-up → peak → fade-out animation.

Build-up:  Radially scale reference INWARD (small→full) — fast, 16 frames
Burst/out: Subtle expansion (~1.35x max) with alpha fade — smooth, 24 frames

Key constraint: rays must NEVER be clipped by cell edges. Max scale is kept
low enough that the reference content stays within the 440×440 cell.

40 frames at 440×440, 8 columns → 8×5 grid = 3520×2200.
"""

from PIL import Image, ImageFilter
import numpy as np
from scipy.ndimage import map_coordinates
import json
import os

OUTPUT_DIR = "/workspaces/web-sdk/apps/alchemy/static/assets/spines/tumbleWin"
CELL = 440
NUM_FRAMES = 40
COLS = 8
KEY_FRAME = 16  # 40% — short build-up, long smooth burst

cx, cy = CELL // 2, CELL // 2


# ── Easing helpers ────────────────────────────────────────────────────────

def ease_out_cubic(t):
    t = np.clip(t, 0, 1)
    return 1.0 - (1.0 - t) ** 3

def ease_out_quad(t):
    t = np.clip(t, 0, 1)
    return 1.0 - (1.0 - t) ** 2

def ease_in_quad(t):
    t = np.clip(t, 0, 1)
    return t ** 2

def smoothstep(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


# ── Reference image loading ──────────────────────────────────────────────

def load_reference():
    """Load starexplosion_one.png, center it on a 440×440 canvas."""
    ref_path = os.path.join(OUTPUT_DIR, "starexplosion_one.png")
    ref_raw = Image.open(ref_path)
    ref_arr = np.array(ref_raw).astype(float)

    # Find center of mass
    alpha = ref_arr[:, :, 3]
    ys, xs = np.where(alpha > 10)
    weights = alpha[ys, xs]
    cx_mass = np.average(xs, weights=weights)
    cy_mass = np.average(ys, weights=weights)

    # Center on canvas
    canvas = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
    ox = int(cx - cx_mass)
    oy = int(cy - cy_mass)
    canvas.paste(ref_raw, (ox, oy))

    return np.array(canvas).astype(float)


# ── Coordinate grids (computed once) ─────────────────────────────────────

yy, xx = np.mgrid[0:CELL, 0:CELL]
dx = (xx - cx).astype(float)
dy = (yy - cy).astype(float)
dist = np.sqrt(dx ** 2 + dy ** 2)
WHITE = np.array([255.0, 255.0, 255.0])


# ── Warping / frame generation ───────────────────────────────────────────

def warp_frame(source, scale_factor, alpha_mult=1.0, brightness_mult=1.0, blur_radius=0):
    """
    Radially warp source around center by scale_factor.
    scale < 1 = shrink (build-up), scale > 1 = expand (burst).
    Uses bilinear interpolation for smooth results.
    """
    src_x = (dx / scale_factor) + cx
    src_y = (dy / scale_factor) + cy

    result = np.zeros((CELL, CELL, 4), dtype=float)
    for ch in range(4):
        result[:, :, ch] = map_coordinates(
            source[:, :, ch], [src_y, src_x],
            order=1, mode='constant', cval=0
        )

    result[:, :, 3] *= alpha_mult
    if brightness_mult != 1.0:
        result[:, :, :3] = np.clip(result[:, :, :3] * brightness_mult, 0, 255)

    result = np.clip(result, 0, 255)
    img = Image.fromarray(result.astype(np.uint8))

    if blur_radius > 0:
        img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    return img


def add_core_glow(frame_arr, radius, brightness):
    """Add a soft white glow at center."""
    glow = np.exp(-0.5 * (dist / max(radius, 1)) ** 2) * brightness
    frame_arr[:, :, 0] = np.clip(frame_arr[:, :, 0] + WHITE[0] * glow, 0, 255)
    frame_arr[:, :, 1] = np.clip(frame_arr[:, :, 1] + WHITE[1] * glow, 0, 255)
    frame_arr[:, :, 2] = np.clip(frame_arr[:, :, 2] + WHITE[2] * glow, 0, 255)
    frame_arr[:, :, 3] = np.clip(frame_arr[:, :, 3] + glow * 255, 0, 255)
    return frame_arr


# ══════════════════════════════════════════════════════════════════════════
# Frame generation
# ══════════════════════════════════════════════════════════════════════════

def generate_frame(i, ref_frame):
    """
    Generate a single animation frame.

    Frames 0–KEY_FRAME: BUILD-UP (scale from tiny spark up to 1.0)
    Frames KEY_FRAME+1–39: BURST (subtle 1.0→1.35 expansion + alpha fade)

    The burst uses very gentle scaling so rays are never clipped by cell edges.
    The dissipation effect comes primarily from alpha fade + slight blur,
    NOT from aggressive zooming.
    """
    if i <= KEY_FRAME:
        # ── BUILD-UP: fast ramp from spark to full reference ──
        p = i / KEY_FRAME  # 0..1

        if p < 0.15:
            # Spark: tiny, blurred, faint
            pp = p / 0.15
            scale = 0.08 + 0.17 * ease_out_quad(pp)
            alpha = 0.3 * ease_out_quad(pp)
            bright = 1.8
            blur_r = 1.5
            core_r = 8 * pp
            core_b = 0.6 * pp
        elif p < 0.50:
            # Fast growth
            pp = (p - 0.15) / 0.35
            scale = 0.25 + 0.45 * ease_out_cubic(pp)
            alpha = 0.3 + 0.5 * ease_out_quad(pp)
            bright = 1.8 - 0.6 * pp
            blur_r = 1.5 - 1.0 * pp
            core_r = 8 + 30 * ease_out_quad(pp)
            core_b = 0.6 + 0.3 * pp
        else:
            # Final approach to full size
            pp = (p - 0.50) / 0.50
            scale = 0.70 + 0.30 * ease_out_quad(pp)
            alpha = 0.8 + 0.20 * ease_out_quad(pp)
            bright = 1.2 - 0.2 * pp
            blur_r = max(0, 0.5 - 0.5 * pp)
            core_r = 38 + 15 * pp
            core_b = 0.9 - 0.2 * pp

        f = warp_frame(ref_frame, scale, alpha, bright, blur_r)
        f_arr = np.array(f).astype(float)
        if core_b > 0.01:
            f_arr = add_core_glow(f_arr, core_r, core_b * 0.5)
        return Image.fromarray(np.clip(f_arr, 0, 255).astype(np.uint8))

    else:
        # ── BURST: gentle expansion + fade ──
        # Max scale 1.35 keeps rays well within the 440px cell
        p = (i - KEY_FRAME) / (NUM_FRAMES - 1 - KEY_FRAME)

        # Gentle outward drift — NOT a zoom, just subtle expansion
        scale = 1.0 + 0.35 * ease_out_cubic(p)

        # Alpha: main dissipation driver — smooth fade to zero
        alpha = max(0, 1.0 - smoothstep(p) * 1.05)

        # Slight brightness boost at burst start, then dim
        if p < 0.08:
            bright = 1.0 + 0.15 * (1 - p / 0.08)
        else:
            bright = 1.0 - 0.15 * smoothstep((p - 0.08) / 0.92)

        # Increasing blur sells the dissipation without needing scale
        blur_r = 0.2 + 1.5 * ease_out_quad(p)

        # Core glow fades out
        core_r = max(2, 45 * (1 - ease_out_cubic(p)))
        core_b = max(0, 0.5 * (1 - p ** 0.4))

        f = warp_frame(ref_frame, scale, alpha, bright, blur_r)
        f_arr = np.array(f).astype(float)
        if core_b > 0.01:
            f_arr = add_core_glow(f_arr, core_r, core_b * 0.3)
        return Image.fromarray(np.clip(f_arr, 0, 255).astype(np.uint8))


# ══════════════════════════════════════════════════════════════════════════
# Spritesheet + JSON output
# ══════════════════════════════════════════════════════════════════════════

def create_spritesheet(frames):
    rows = (len(frames) + COLS - 1) // COLS
    sheet = Image.new('RGBA', (COLS * CELL, rows * CELL), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, ((i % COLS) * CELL, (i // COLS) * CELL))
    return sheet, rows


def create_json_metadata(num_frames, rows, image_filename):
    frames_data = {}
    for i in range(num_frames):
        name = f"explosion_{i:03d}"
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
            "duration_ms": 13
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
            "explosion": [f"explosion_{i:03d}" for i in range(num_frames)]
        }
    }


def main():
    print("=" * 60)
    print("  Star Explosion — Reference Image Warp")
    print(f"  {NUM_FRAMES} frames, {CELL}×{CELL}, keyframe at {KEY_FRAME}")
    print(f"  Build-up: {KEY_FRAME} frames | Burst: {NUM_FRAMES - KEY_FRAME} frames")
    print(f"  Max burst scale: 1.35x (no clipping)")
    print("=" * 60)

    ref_frame = load_reference()
    print(f"\n  Loaded reference image, centered on {CELL}×{CELL} canvas")

    print(f"\n--- Generating {NUM_FRAMES} frames ---")
    frames = []
    for i in range(NUM_FRAMES):
        f = generate_frame(i, ref_frame)
        content = np.sum(np.array(f)[:, :, 3] > 0)
        t = i / (NUM_FRAMES - 1)
        print(f"  Frame {i:2d}: t={t:.3f}, pixels={content}")
        frames.append(f)

    print(f"\n--- Assembling spritesheet ---")
    sheet, rows = create_spritesheet(frames)
    print(f"  Sheet: {sheet.size[0]}×{sheet.size[1]} ({COLS}×{rows})")

    out_png = os.path.join(OUTPUT_DIR, "starexplosion_centered.png")
    out_json = os.path.join(OUTPUT_DIR, "starexplosion_spritesheet.json")

    sheet.save(out_png, optimize=True)
    print(f"  Saved: {out_png}")

    meta = create_json_metadata(NUM_FRAMES, rows, "starexplosion_centered.png")
    with open(out_json, 'w') as f:
        json.dump(meta, f, indent=2)
    print(f"  Saved: {out_json}")

    print(f"\n=== DONE ===")


if __name__ == "__main__":
    main()
