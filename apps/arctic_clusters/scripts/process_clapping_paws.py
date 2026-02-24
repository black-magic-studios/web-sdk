#!/usr/bin/env python3
"""
Process clapping_paws_2 spritesheets into:
1. Win animation packed spritesheet (14x14 grid, 168x168 per frame, 192 frames)
2. Static sprite (256x256) from first frame — placed into symbolsStatic.webp at (0,0)
3. Glow spritesheet (8x2 grid, 320x320 per frame, 16 frames)

Source: 4 spritesheet PNGs + atlas JSON with 192 frames at 1280x720 each.
The frames are landscape (1280x720), so we crop to center-square (720x720) then resize.
"""

import json
from pathlib import Path
from PIL import Image, ImageFilter

BASE = Path(__file__).resolve().parent.parent
ANIM_DIR = BASE / "static" / "assets" / "sprites" / "symbolsStatic" / "arctic_clusters_sprite_animations"
STATIC_DIR = BASE / "static" / "assets" / "sprites" / "symbolsStatic"
GLOW_DIR = BASE / "static" / "assets" / "spines" / "tumbleWin"

# Target sizes
FRAME_SIZE = 168       # Win animation frame size (matches current)
STATIC_SIZE = 256      # Static symbol in symbolsStatic.webp
GLOW_SIZE = 320        # Glow frame size
GLOW_FRAMES = 16       # Number of glow frames
GRID_COLS = 14
GRID_ROWS = 14
TOTAL_FRAMES = 192

# ── Load atlas ──
atlas_path = ANIM_DIR / "clapping_paws_2_spritesheet_black_atlas.json"
with open(atlas_path) as f:
    atlas = json.load(f)

frames_meta = sorted(atlas["frames"], key=lambda fr: fr["index"])
assert len(frames_meta) == TOTAL_FRAMES, f"Expected {TOTAL_FRAMES} frames, got {len(frames_meta)}"

# ── Load source sheets ──
sheets = {}
for fr in frames_meta:
    s = fr["sheet"]
    if s not in sheets:
        path = ANIM_DIR / f"clapping_paws_2_spritesheet_black_{s:02d}.png"
        print(f"Loading sheet {s}: {path.name}")
        sheets[s] = Image.open(path).convert("RGBA")

# ── Extract & crop frames to square ──
def extract_frame(meta):
    """Extract frame from sheet, crop to center square, return RGBA image."""
    sheet = sheets[meta["sheet"]]
    x, y, w, h = meta["x"], meta["y"], meta["w"], meta["h"]
    frame = sheet.crop((x, y, x + w, y + h))
    
    # Crop to center square (720x720 from 1280x720)
    sq = min(w, h)  # 720
    left = (w - sq) // 2
    top = (h - sq) // 2
    frame = frame.crop((left, top, left + sq, top + sq))
    return frame

print("Extracting frames...")
raw_frames = [extract_frame(m) for m in frames_meta]

# ── 1. Win animation spritesheet ──
print(f"\nBuilding win animation spritesheet ({GRID_COLS}x{GRID_ROWS} @ {FRAME_SIZE}x{FRAME_SIZE})...")
win_sheet = Image.new("RGBA", (GRID_COLS * FRAME_SIZE, GRID_ROWS * FRAME_SIZE), (0, 0, 0, 0))

for i, frame in enumerate(raw_frames):
    resized = frame.resize((FRAME_SIZE, FRAME_SIZE), Image.LANCZOS)
    col = i % GRID_COLS
    row = i // GRID_COLS
    win_sheet.paste(resized, (col * FRAME_SIZE, row * FRAME_SIZE))

out_name = "clapping_paws_win_14x14_192f"
win_sheet_path = ANIM_DIR / f"{out_name}.png"
win_sheet.save(win_sheet_path, "PNG")
print(f"  Saved: {win_sheet_path.name} ({win_sheet.size[0]}x{win_sheet.size[1]})")

# Win animation JSON (PixiJS spritesheet format)
win_json = {
    "frames": {},
    "meta": {
        "image": f"{out_name}.png",
        "format": "RGBA8888",
        "size": {"w": GRID_COLS * FRAME_SIZE, "h": GRID_ROWS * FRAME_SIZE},
        "scale": "1",
    },
}
for i in range(TOTAL_FRAMES):
    col = i % GRID_COLS
    row = i // GRID_COLS
    key = f"h1_win_{i:03d}"
    win_json["frames"][key] = {
        "frame": {"x": col * FRAME_SIZE, "y": row * FRAME_SIZE, "w": FRAME_SIZE, "h": FRAME_SIZE},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME_SIZE, "h": FRAME_SIZE},
        "sourceSize": {"w": FRAME_SIZE, "h": FRAME_SIZE},
    }

win_json_path = ANIM_DIR / f"{out_name}.json"
with open(win_json_path, "w") as f:
    json.dump(win_json, f)
print(f"  Saved: {win_json_path.name}")

# ── 2. Static sprite ──
print(f"\nGenerating static sprite ({STATIC_SIZE}x{STATIC_SIZE})...")
static_frame = raw_frames[0].resize((STATIC_SIZE, STATIC_SIZE), Image.LANCZOS)
static_path = ANIM_DIR / "h1_clapping_paws_static.png"
static_frame.save(static_path, "PNG")
print(f"  Saved: {static_path.name}")

# Update symbolsStatic.webp — paste new H1 at (0, 0)
symbols_webp = STATIC_DIR / "symbolsStatic.webp"
symbols_png = STATIC_DIR / "symbolsStatic.png"
print(f"  Updating symbolsStatic.webp and .png...")
for sym_path in [symbols_webp, symbols_png]:
    if sym_path.exists():
        img = Image.open(sym_path).convert("RGBA")
        img.paste(static_frame, (0, 0), static_frame)
        if sym_path.suffix == ".webp":
            img.save(sym_path, "WEBP", quality=95)
        else:
            img.save(sym_path, "PNG")
        print(f"    Updated: {sym_path.name}")

# Also update the (1).png copy if it exists
symbols_copy = STATIC_DIR / "symbolsStatic (1).png"
if symbols_copy.exists():
    img = Image.open(symbols_copy).convert("RGBA")
    img.paste(static_frame, (0, 0), static_frame)
    img.save(symbols_copy, "PNG")
    print(f"    Updated: {symbols_copy.name}")

# ── 3. Glow spritesheet ──
print(f"\nGenerating glow spritesheet ({GLOW_FRAMES} frames @ {GLOW_SIZE}x{GLOW_SIZE})...")

# Use frame 0 as the base for glow
glow_base = raw_frames[0].resize((GLOW_SIZE, GLOW_SIZE), Image.LANCZOS)

glow_sheet = Image.new("RGBA", (GLOW_SIZE * 8, GLOW_SIZE * 2), (0, 0, 0, 0))
glow_json = {
    "frames": {},
    "meta": {
        "image": "glow_H1_spritesheet.png",
        "format": "RGBA8888",
        "size": {"w": GLOW_SIZE * 8, "h": GLOW_SIZE * 2},
        "scale": "1",
    },
}

for i in range(GLOW_FRAMES):
    # Create glow effect: gaussian blur with increasing then decreasing intensity
    t = i / (GLOW_FRAMES - 1)  # 0.0 to 1.0
    # Bell curve for intensity
    intensity = 1.0 - abs(2 * t - 1)  # peaks at 0.5
    
    blur_radius = 3 + intensity * 12
    
    # Create glowing version
    glow_frame = glow_base.copy()
    
    # Brighten by blending with a lighter version
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Brightness(glow_frame)
    bright = enhancer.enhance(1.0 + intensity * 1.5)
    
    # Blur for glow effect
    blurred = bright.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    
    # Composite: blurred glow behind sharp image
    composite = Image.new("RGBA", (GLOW_SIZE, GLOW_SIZE), (0, 0, 0, 0))
    composite = Image.alpha_composite(composite, blurred)
    
    # Fade sharp overlay based on intensity (more glow = less sharp)
    sharp_alpha = int(255 * (1.0 - intensity * 0.3))
    sharp = glow_base.copy()
    r, g, b, a = sharp.split()
    a = a.point(lambda p: min(p, sharp_alpha))
    sharp = Image.merge("RGBA", (r, g, b, a))
    composite = Image.alpha_composite(composite, sharp)
    
    col = i % 8
    row = i // 8
    glow_sheet.paste(composite, (col * GLOW_SIZE, row * GLOW_SIZE))
    
    key = f"poof_{i:03d}"
    glow_json["frames"][key] = {
        "filename": f"{key}.png",
        "frame": {"x": col * GLOW_SIZE, "y": row * GLOW_SIZE, "w": GLOW_SIZE, "h": GLOW_SIZE},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": GLOW_SIZE, "h": GLOW_SIZE},
        "sourceSize": {"w": GLOW_SIZE, "h": GLOW_SIZE},
        "duration_ms": 17,
    }

glow_sheet_path = GLOW_DIR / "glow_H1_spritesheet.png"
glow_json_path = GLOW_DIR / "glow_H1_spritesheet.json"
glow_sheet.save(glow_sheet_path, "PNG")
with open(glow_json_path, "w") as f:
    json.dump(glow_json, f)
print(f"  Saved: {glow_sheet_path.name} ({glow_sheet.size[0]}x{glow_sheet.size[1]})")
print(f"  Saved: {glow_json_path.name}")

print("\nDone! All H1 assets updated.")
