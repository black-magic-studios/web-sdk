#!/usr/bin/env python3
"""
Process baby bear spritesheets (H1 symbol replacement):
1. Extract all 192 frames from 4 source sheets (1280x720 each, 6 cols, 32px gutter)
2. Resize each frame to 168x168 (matching fox/narwhal format)
3. Pack into a single 14x14 spritesheet (baby_bear_win_14x14_192f.png)
4. Generate PixiJS JSON atlas (baby_bear_win_14x14_192f.json)
5. Extract first frame as new H1 static sprite (256x256, to replace in symbolsStatic.webp)
6. Generate glow spritesheet (glow_H1_spritesheet.png + .json) from first frame
"""
import json, math, os
from PIL import Image, ImageFilter, ImageEnhance

BASE = '/workspaces/web-sdk/apps/arctic_clusters/static/assets/sprites/symbolsStatic/arctic_clusters_sprite_animations'
GLOW_DIR = '/workspaces/web-sdk/apps/arctic_clusters/static/assets/spines/tumbleWin'
STATIC_DIR = '/workspaces/web-sdk/apps/arctic_clusters/static/assets/sprites/symbolsStatic'

# Source atlas metadata
ATLAS_PATH = os.path.join(BASE, 'baby_bear_spritesheet_black_atlas.json')
with open(ATLAS_PATH) as f:
    atlas = json.load(f)

TOTAL_FRAMES = atlas['total_frames']  # 192
FRAME_W = atlas['frame_size']['w']     # 1280
FRAME_H = atlas['frame_size']['h']     # 720

# Target size (matching fox/narwhal)
TARGET_SIZE = 168
GRID_COLS = 14
GRID_ROWS = math.ceil(TOTAL_FRAMES / GRID_COLS)  # 14

print(f"Total frames: {TOTAL_FRAMES}, Source: {FRAME_W}x{FRAME_H}")
print(f"Target: {TARGET_SIZE}x{TARGET_SIZE}, Grid: {GRID_COLS}x{GRID_ROWS}")

# Load source sheets
sheets = {}
for i in range(1, 5):
    path = os.path.join(BASE, f'baby_bear_spritesheet_black_{i:02d}.png')
    sheets[i] = Image.open(path)
    print(f"Loaded sheet {i}: {sheets[i].size}")

# Extract and resize all frames
frames = []
for frame_info in atlas['frames']:
    idx = frame_info['index']
    sheet_num = frame_info['sheet']
    x, y = frame_info['x'], frame_info['y']
    w, h = frame_info['w'], frame_info['h']
    
    sheet = sheets[sheet_num]
    crop = sheet.crop((x, y, x + w, y + h))
    
    # Resize to target size (square, maintaining aspect ratio with padding)
    # Source is 1280x720 (16:9), need to fit into 168x168
    # Scale to fit height, then center horizontally
    scale = TARGET_SIZE / max(w, h)
    new_w = round(w * scale)
    new_h = round(h * scale)
    resized = crop.resize((new_w, new_h), Image.LANCZOS)
    
    # Create square canvas and paste centered
    square = Image.new('RGBA', (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))
    paste_x = (TARGET_SIZE - new_w) // 2
    paste_y = (TARGET_SIZE - new_h) // 2
    square.paste(resized, (paste_x, paste_y))
    frames.append(square)

print(f"Extracted and resized {len(frames)} frames")

# ── 1. Create 14x14 spritesheet ──
sheet_w = GRID_COLS * TARGET_SIZE
sheet_h = GRID_ROWS * TARGET_SIZE
spritesheet = Image.new('RGBA', (sheet_w, sheet_h), (0, 0, 0, 0))

for i, frame in enumerate(frames):
    col = i % GRID_COLS
    row = i // GRID_COLS
    spritesheet.paste(frame, (col * TARGET_SIZE, row * TARGET_SIZE))

output_png = os.path.join(BASE, 'baby_bear_win_14x14_192f.png')
spritesheet.save(output_png, 'PNG', optimize=True)
print(f"Saved spritesheet: {output_png} ({sheet_w}x{sheet_h})")

# ── 2. Generate PixiJS JSON atlas ──
json_data = {"frames": {}, "meta": {}}
for i in range(TOTAL_FRAMES):
    col = i % GRID_COLS
    row = i // GRID_COLS
    key = f"anim_{i:03d}"
    json_data["frames"][key] = {
        "filename": f"{key}.png",
        "frame": {"x": col * TARGET_SIZE, "y": row * TARGET_SIZE, "w": TARGET_SIZE, "h": TARGET_SIZE},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": TARGET_SIZE, "h": TARGET_SIZE},
        "sourceSize": {"w": TARGET_SIZE, "h": TARGET_SIZE},
        "duration_ms": 42,
    }

json_data["meta"] = {
    "image": "baby_bear_win_14x14_192f.png",
    "format": "RGBA8888",
    "size": {"w": sheet_w, "h": sheet_h},
    "scale": "1",
}

output_json = os.path.join(BASE, 'baby_bear_win_14x14_192f.json')
with open(output_json, 'w') as f:
    json.dump(json_data, f, indent=4)
print(f"Saved JSON atlas: {output_json}")

# ── 3. Create static H1 sprite (256x256) from first frame ──
first_frame_big = frames[0].resize((256, 256), Image.LANCZOS)
static_path = os.path.join(STATIC_DIR, 'h1_baby_bear_static.png')
first_frame_big.save(static_path, 'PNG')
print(f"Saved static H1: {static_path}")

# Also update the symbolsStatic.webp - replace h1 region (0,0,256,256)
symbols_static_path = os.path.join(STATIC_DIR, 'symbolsStatic.webp')
symbols_static = Image.open(symbols_static_path).convert('RGBA')
symbols_static.paste(first_frame_big, (0, 0))
symbols_static.save(symbols_static_path, 'WEBP', quality=90)
print(f"Updated symbolsStatic.webp with new H1")

# ── 4. Generate glow spritesheet ──
# Glow: 16 frames, 320x320, fade from colored glow to white
# Using the first frame as the source shape
GLOW_SIZE = 320
GLOW_FRAMES = 16
glow_source = frames[0].resize((GLOW_SIZE - 40, GLOW_SIZE - 40), Image.LANCZOS)

glow_frames_list = []
for i in range(GLOW_FRAMES):
    t = i / (GLOW_FRAMES - 1)  # 0.0 to 1.0
    
    canvas = Image.new('RGBA', (GLOW_SIZE, GLOW_SIZE), (0, 0, 0, 0))
    
    # Create a glowing version with blue-white color shift
    # Start with the symbol, apply increasing gaussian blur + brightness
    blur_radius = 3 + t * 20
    brightness_factor = 1.2 + t * 1.5
    
    # Make the source glow
    glow = glow_source.copy()
    
    # Extract alpha and create a colored glow from it
    alpha = glow.split()[3]
    
    # Blur the alpha to create glow extent
    alpha_blurred = alpha.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    
    # Color: transition from icy blue (100, 180, 255) to white (255, 255, 255)
    r = int(100 + 155 * t)
    g = int(180 + 75 * t)
    b = 255
    
    # Create colored glow layer
    color_layer = Image.new('RGBA', (GLOW_SIZE - 40, GLOW_SIZE - 40), (r, g, b, 0))
    color_layer.putalpha(alpha_blurred)
    
    # Increase brightness/opacity toward the end
    enhancer = ImageEnhance.Brightness(color_layer)
    color_layer = enhancer.enhance(brightness_factor)
    
    # Fade overall opacity: strong in middle, fade at end
    opacity = 1.0 if t < 0.7 else 1.0 - ((t - 0.7) / 0.3)
    if opacity < 1.0:
        # Reduce alpha
        r2, g2, b2, a2 = color_layer.split()
        a2 = a2.point(lambda p: int(p * opacity))
        color_layer = Image.merge('RGBA', (r2, g2, b2, a2))
    
    # Paste centered
    paste_x = (GLOW_SIZE - (GLOW_SIZE - 40)) // 2
    paste_y = (GLOW_SIZE - (GLOW_SIZE - 40)) // 2
    canvas.paste(color_layer, (paste_x, paste_y), color_layer)
    
    glow_frames_list.append(canvas)

# Pack glow into 8x2 (or Nx1 row for 16 frames at 320px → 5120 x 320)
glow_sheet_w = GLOW_FRAMES * GLOW_SIZE  # 16 * 320 = 5120
glow_sheet_h = GLOW_SIZE  # 320 (single row, but original is 2560x640 which is 8x2)
# Actually the original is 2560x640 → 8 cols, 2 rows
GLOW_COLS = 8
GLOW_ROWS = 2
glow_sheet_w = GLOW_COLS * GLOW_SIZE  # 2560
glow_sheet_h = GLOW_ROWS * GLOW_SIZE  # 640
glow_sheet = Image.new('RGBA', (glow_sheet_w, glow_sheet_h), (0, 0, 0, 0))

for i, gf in enumerate(glow_frames_list):
    col = i % GLOW_COLS
    row = i // GLOW_COLS
    glow_sheet.paste(gf, (col * GLOW_SIZE, row * GLOW_SIZE))

glow_png_path = os.path.join(GLOW_DIR, 'glow_H1_spritesheet.png')
glow_sheet.save(glow_png_path, 'PNG', optimize=True)
print(f"Saved glow spritesheet: {glow_png_path}")

# Generate glow JSON
glow_json = {"frames": {}, "meta": {}, "animations": {}}
poof_list = []
for i in range(GLOW_FRAMES):
    col = i % GLOW_COLS
    row = i // GLOW_COLS
    key = f"poof_{i:03d}"
    poof_list.append(key)
    glow_json["frames"][key] = {
        "filename": f"{key}.png",
        "frame": {"x": col * GLOW_SIZE, "y": row * GLOW_SIZE, "w": GLOW_SIZE, "h": GLOW_SIZE},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": GLOW_SIZE, "h": GLOW_SIZE},
        "sourceSize": {"w": GLOW_SIZE, "h": GLOW_SIZE},
        "duration_ms": 17,
    }
glow_json["meta"] = {
    "image": "glow_H1_spritesheet.png",
    "size": {"w": glow_sheet_w, "h": glow_sheet_h},
    "format": "RGBA8888",
    "scale": 1,
}
glow_json["animations"] = {"poof": poof_list}

glow_json_path = os.path.join(GLOW_DIR, 'glow_H1_spritesheet.json')
with open(glow_json_path, 'w') as f:
    json.dump(glow_json, f, indent=2)
print(f"Saved glow JSON: {glow_json_path}")

print("\n✅ All done!")
