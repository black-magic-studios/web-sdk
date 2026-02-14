#!/usr/bin/env python3
"""
Extract explosion sprites from cluster's symbols3 atlas and convert them to white.
Creates a new spritesheet compatible with arctic_clusters's spritesheet format.
"""

from PIL import Image
import numpy as np
import json
import os

# Atlas data for symbexpl frames from cluster's symbols3.atlas (scale: 0.6)
# We need to scale these coordinates back to the actual image size
ATLAS_SCALE = 0.6

# Frame data from the atlas (already at scaled coordinates)
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

def extract_frame(atlas_img, frame_data):
    """Extract a single frame from the atlas."""
    x, y, w, h = frame_data["bounds"]
    offset_x, offset_y, full_w, full_h = frame_data["offsets"]
    rotate = frame_data["rotate"]
    
    # Extract the region from atlas
    if rotate:
        # When rotated, width and height are swapped in the atlas
        region = atlas_img.crop((x, y, x + h, y + w))
        region = region.rotate(90, expand=True)
    else:
        region = atlas_img.crop((x, y, x + w, y + h))
    
    # Create full-size frame with proper positioning
    # The offsets tell us where the content sits within the full frame
    full_frame = Image.new('RGBA', (full_w, full_h), (0, 0, 0, 0))
    full_frame.paste(region, (offset_x, offset_y))
    
    return full_frame

def convert_to_white(img):
    """Convert all visible pixels to white while preserving alpha."""
    pixels = np.array(img).astype(np.float32)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    # Create new image - all visible pixels become white
    new_pixels = np.zeros_like(pixels)
    new_pixels[:,:,0] = 255  # R = white
    new_pixels[:,:,1] = 255  # G = white
    new_pixels[:,:,2] = 255  # B = white
    new_pixels[:,:,3] = a    # Preserve original alpha
    
    return Image.fromarray(new_pixels.astype('uint8'), 'RGBA')

def create_spritesheet(frames, output_size=256, cols=4):
    """Create a spritesheet from frames."""
    num_frames = len(frames)
    rows = (num_frames + cols - 1) // cols
    
    sheet_width = cols * output_size
    sheet_height = rows * output_size
    
    sheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
    
    for i, frame in enumerate(frames):
        # Resize frame to output size
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
            "duration_ms": 42  # ~24fps
        }
    
    metadata = {
        "frames": frames_data,
        "meta": {
            "app": "explosion-converter",
            "version": "1.0",
            "image": output_filename.replace('.json', '.png'),
            "format": "RGBA8888",
            "size": {
                "w": cols * frame_size,
                "h": rows * frame_size
            },
            "scale": "1"
        },
        "animations": {
            "explosion": [f"frame_{i:03d}" for i in range(num_frames)]
        }
    }
    
    return metadata

def main():
    # Load cluster's atlas
    atlas_path = "/workspaces/web-sdk/apps/cluster/static/assets/spines/symbols3/symbols3.png"
    print(f"Loading atlas from: {atlas_path}")
    atlas_img = Image.open(atlas_path).convert('RGBA')
    print(f"Atlas size: {atlas_img.size}")
    
    # Extract all explosion frames
    print(f"\nExtracting {len(EXPLOSION_FRAMES)} explosion frames...")
    frames = []
    for frame_data in EXPLOSION_FRAMES:
        frame = extract_frame(atlas_img, frame_data)
        print(f"  Extracted {frame_data['name']}: {frame.size}")
        frames.append(frame)
    
    # Convert all frames to white
    print("\nConverting frames to white...")
    white_frames = [convert_to_white(f) for f in frames]
    
    # Create spritesheet
    output_size = 256  # Size per frame
    cols = 4
    print(f"\nCreating spritesheet ({output_size}x{output_size} per frame, {cols} columns)...")
    sheet, rows, cols = create_spritesheet(white_frames, output_size, cols)
    print(f"Spritesheet size: {sheet.size} ({cols} cols x {rows} rows)")
    
    # Save outputs
    output_dir = "/workspaces/web-sdk/apps/arctic_clusters/static/assets/spines/tumbleWin"
    
    png_filename = "white_explosion_spritesheet.png"
    json_filename = "white_explosion_spritesheet.json"
    
    png_path = os.path.join(output_dir, png_filename)
    json_path = os.path.join(output_dir, json_filename)
    
    sheet.save(png_path)
    print(f"\nSaved spritesheet to: {png_path}")
    
    # Create and save JSON metadata
    metadata = create_json_metadata(len(white_frames), output_size, cols, rows, json_filename)
    with open(json_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {json_path}")
    
    # Also save individual frames for inspection
    frames_dir = os.path.join(output_dir, "white_explosion_frames")
    os.makedirs(frames_dir, exist_ok=True)
    for i, frame in enumerate(white_frames):
        frame.save(os.path.join(frames_dir, f"frame_{i:03d}.png"))
    print(f"Saved individual frames to: {frames_dir}/")
    
    print("\n=== Done! ===")
    print(f"Now update arctic_clusters's assets.ts to use '{json_filename}' instead of snow_puff")

if __name__ == "__main__":
    main()
