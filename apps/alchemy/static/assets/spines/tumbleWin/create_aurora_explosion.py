#!/usr/bin/env python3
"""
Convert explosion sprites to aurora borealis colors.
Only applies color to the bright/white parts of the original explosion.
"""

from PIL import Image
import numpy as np
import json
import os

# Frame data from the atlas
EXPLOSION_FRAMES = [
    {"name": "symbexpl_01", "bounds": (1227, 279, 157, 158), "offsets": (43, 34, 240, 240), "rotate": False},
    {"name": "symbexpl_02", "bounds": (1397, 104, 175, 174), "offsets": (31, 28, 240, 240), "rotate": False},
    {"name": "symbexpl_03", "bounds": (1394, 280, 204, 202), "offsets": (17, 17, 240, 240), "rotate": False},
    {"name": "symbexpl_04", "bounds": (1394, 484, 204, 207), "offsets": (16, 17, 240, 240), "rotate": False},
    {"name": "symbexpl_05", "bounds": (607, 46, 215, 217), "offsets": (12, 10, 240, 240), "rotate": False},
    {"name": "symbexpl_06", "bounds": (1391, 903, 213, 217), "offsets": (10, 11, 240, 240), "rotate": False},
    {"name": "symbexpl_07", "bounds": (1350, 1122, 212, 218), "offsets": (11, 7, 240, 240), "rotate": True},
    {"name": "symbexpl_08", "bounds": (1172, 647, 220, 220), "offsets": (7, 9, 240, 240), "rotate": False},
    {"name": "symbexpl_09", "bounds": (403, 2, 197, 196), "offsets": (22, 22, 240, 240), "rotate": False},
    {"name": "symbexpl_10", "bounds": (1026, 40, 198, 197), "offsets": (21, 21, 240, 240), "rotate": False},
    {"name": "symbexpl_11", "bounds": (1026, 239, 199, 198), "offsets": (21, 21, 240, 240), "rotate": False},
    {"name": "symbexpl_12", "bounds": (817, 334, 201, 199), "offsets": (20, 20, 240, 240), "rotate": True},
    {"name": "symbexpl_13", "bounds": (824, 131, 201, 200), "offsets": (20, 20, 240, 240), "rotate": True},
]

# Aurora borealis colors (purple -> teal -> cyan -> green)
AURORA_COLORS = [
    (148, 87, 196),   # Purple
    (100, 120, 200),  # Purple-blue
    (60, 180, 190),   # Teal
    (80, 210, 180),   # Cyan-teal
    (100, 230, 170),  # Cyan-green
    (130, 240, 160),  # Light green
]

def extract_frame(atlas_img, frame_data):
    """Extract a single frame from the atlas."""
    x, y, w, h = frame_data["bounds"]
    offset_x, offset_y, full_w, full_h = frame_data["offsets"]
    rotate = frame_data["rotate"]
    
    if rotate:
        region = atlas_img.crop((x, y, x + h, y + w))
        region = region.rotate(90, expand=True)
    else:
        region = atlas_img.crop((x, y, x + w, y + h))
    
    full_frame = Image.new('RGBA', (full_w, full_h), (0, 0, 0, 0))
    full_frame.paste(region, (offset_x, offset_y))
    
    return full_frame

def interpolate_color(color1, color2, t):
    """Interpolate between two colors."""
    return tuple(int(c1 + (c2 - c1) * t) for c1, c2 in zip(color1, color2))

def get_aurora_color(position):
    """Get aurora color based on normalized position (0-1)."""
    num_colors = len(AURORA_COLORS)
    scaled_pos = position * (num_colors - 1)
    idx = int(scaled_pos)
    t = scaled_pos - idx
    
    if idx >= num_colors - 1:
        return AURORA_COLORS[-1]
    
    return interpolate_color(AURORA_COLORS[idx], AURORA_COLORS[idx + 1], t)

def apply_aurora_to_white_only(img, frame_index, total_frames):
    """
    Apply aurora gradient only to bright/white pixels.
    Dark pixels become transparent.
    """
    pixels = np.array(img).astype(np.float32)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    # Calculate brightness/luminosity
    luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
    
    # Only keep bright pixels (the white/light parts of the explosion)
    # Threshold: pixels with luminosity > 0.4 are considered "white"
    brightness_threshold = 0.4
    
    height, width = pixels.shape[:2]
    center_y, center_x = height / 2, width / 2
    max_dist = np.sqrt(center_x**2 + center_y**2)
    
    # Color offset based on frame for animated color shift
    color_offset = frame_index / total_frames * 0.5
    
    new_pixels = np.zeros_like(pixels)
    
    for y in range(height):
        for x in range(width):
            orig_alpha = a[y, x]
            lum = luminosity[y, x]
            
            if orig_alpha > 0 and lum > brightness_threshold:
                # This is a bright pixel - apply aurora color
                
                # Calculate position for gradient (radial from center)
                dist = np.sqrt((x - center_x)**2 + (y - center_y)**2) / max_dist
                angle = np.arctan2(y - center_y, x - center_x)
                angle_norm = (angle + np.pi) / (2 * np.pi)
                
                # Combine for color position
                color_pos = (dist * 0.5 + angle_norm * 0.5 + color_offset) % 1.0
                
                aurora_color = get_aurora_color(color_pos)
                
                # Scale brightness - brighter original = brighter aurora
                brightness_scale = (lum - brightness_threshold) / (1.0 - brightness_threshold)
                brightness_scale = np.clip(brightness_scale * 1.5, 0, 1)
                
                # Apply aurora color with brightness
                new_pixels[y, x, 0] = min(255, aurora_color[0] * brightness_scale + 255 * brightness_scale * 0.2)
                new_pixels[y, x, 1] = min(255, aurora_color[1] * brightness_scale + 255 * brightness_scale * 0.2)
                new_pixels[y, x, 2] = min(255, aurora_color[2] * brightness_scale + 255 * brightness_scale * 0.2)
                new_pixels[y, x, 3] = orig_alpha * brightness_scale
    
    return Image.fromarray(new_pixels.astype('uint8'), 'RGBA')

def create_spritesheet(frames, output_size=256, cols=4):
    """Create a spritesheet from frames."""
    num_frames = len(frames)
    rows = (num_frames + cols - 1) // cols
    
    sheet_width = cols * output_size
    sheet_height = rows * output_size
    
    sheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
    
    for i, frame in enumerate(frames):
        resized = frame.resize((output_size, output_size), Image.Resampling.LANCZOS)
        
        col = i % cols
        row = i // cols
        x = col * output_size
        y = row * output_size
        
        sheet.paste(resized, (x, y))
    
    return sheet, rows, cols

def create_json_metadata(num_frames, frame_size, cols, rows, output_filename):
    """Create JSON metadata in PixiJS spritesheet format."""
    frames_data = {}
    
    for i in range(num_frames):
        col = i % cols
        row = i // cols
        
        frame_name = f"frame_{i:03d}"
        frames_data[frame_name] = {
            "filename": f"{frame_name}.png",
            "frame": {
                "x": col * frame_size,
                "y": row * frame_size,
                "w": frame_size,
                "h": frame_size
            },
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": frame_size,
                "h": frame_size
            },
            "sourceSize": {
                "w": frame_size,
                "h": frame_size
            },
            "duration_ms": 42
        }
    
    metadata = {
        "frames": frames_data,
        "meta": {
            "app": "aurora-explosion-converter",
            "version": "1.0",
            "image": output_filename.replace('.json', '.png'),
            "format": "RGBA8888",
            "size": {
                "w": cols * frame_size,
                "h": (num_frames + cols - 1) // cols * frame_size
            },
            "scale": "1"
        },
        "animations": {
            "explosion": [f"frame_{i:03d}" for i in range(num_frames)]
        }
    }
    
    return metadata

def main():
    atlas_path = "/workspaces/web-sdk/apps/cluster/static/assets/spines/symbols3/symbols3.png"
    print(f"Loading atlas from: {atlas_path}")
    atlas_img = Image.open(atlas_path).convert('RGBA')
    
    print(f"\nExtracting {len(EXPLOSION_FRAMES)} explosion frames...")
    frames = []
    for frame_data in EXPLOSION_FRAMES:
        frame = extract_frame(atlas_img, frame_data)
        frames.append(frame)
    
    print("\nApplying aurora colors to white parts only...")
    aurora_frames = []
    for i, frame in enumerate(frames):
        aurora_frame = apply_aurora_to_white_only(frame, i, len(frames))
        aurora_frames.append(aurora_frame)
        print(f"  Processed frame {i+1}/{len(frames)}")
    
    output_size = 256
    cols = 4
    print(f"\nCreating spritesheet...")
    sheet, rows, cols = create_spritesheet(aurora_frames, output_size, cols)
    
    output_dir = "/workspaces/web-sdk/apps/alchemy/static/assets/spines/tumbleWin"
    
    png_filename = "aurora_explosion_spritesheet.png"
    json_filename = "aurora_explosion_spritesheet.json"
    
    png_path = os.path.join(output_dir, png_filename)
    json_path = os.path.join(output_dir, json_filename)
    
    sheet.save(png_path)
    print(f"Saved spritesheet to: {png_path}")
    
    metadata = create_json_metadata(len(aurora_frames), output_size, cols, rows, json_filename)
    with open(json_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {json_path}")
    
    # Save individual frames for inspection
    frames_dir = os.path.join(output_dir, "aurora_explosion_frames")
    os.makedirs(frames_dir, exist_ok=True)
    for i, frame in enumerate(aurora_frames):
        frame.save(os.path.join(frames_dir, f"frame_{i:03d}.png"))
    print(f"Saved individual frames to: {frames_dir}/")
    
    print("\n=== Done! ===")

if __name__ == "__main__":
    main()
