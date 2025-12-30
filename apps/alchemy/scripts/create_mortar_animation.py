#!/usr/bin/env python3
"""
Create a simple mortar & pestle animation for H2.

This script:
1. Adds the mortar image to symbols.png atlas
2. Updates symbols.atlas with the new region
3. Creates a simple h2.json based on l4.json structure
"""

from PIL import Image
import json
import shutil

# Paths
SPINES_DIR = "/workspaces/web-sdk/apps/alchemy/static/assets/spines/symbols"
STATIC_SPRITES_DIR = "/workspaces/web-sdk/apps/alchemy/static/assets/sprites/symbolsStatic"

def backup_files():
    """Backup original files"""
    shutil.copy(f"{SPINES_DIR}/symbols.png", f"{SPINES_DIR}/symbols_original.png")
    shutil.copy(f"{SPINES_DIR}/symbols.atlas", f"{SPINES_DIR}/symbols_original.atlas")
    shutil.copy(f"{SPINES_DIR}/h2.json", f"{SPINES_DIR}/h2_original.json")
    print("✓ Backed up original files")

def extract_mortar_image():
    """Extract mortar from static sprite sheet"""
    img = Image.open(f"{STATIC_SPRITES_DIR}/symbolsStatic.png")
    # h2 is at position (1, 203) with size 200x199
    mortar = img.crop((1, 203, 1+200, 203+199))
    mortar.save("/tmp/mortar.png")
    print(f"✓ Extracted mortar image: {mortar.size}")
    return mortar

def add_mortar_to_atlas(mortar_img):
    """Add mortar image to symbols.png atlas"""
    atlas = Image.open(f"{SPINES_DIR}/symbols.png")
    print(f"  Atlas size: {atlas.size}")
    
    # t2_coin is at (193, 345) with size 168x167
    # We'll replace that spot with our mortar (resized to fit)
    mortar_resized = mortar_img.resize((168, 167), Image.Resampling.LANCZOS)
    
    # Also create glow/shine versions (just the mortar with alpha adjustments)
    # t2_glow is at (2, 363) with size 189x183
    mortar_glow = mortar_img.resize((189, 183), Image.Resampling.LANCZOS)
    
    # Paste the mortar in place of t2_coin
    atlas.paste(mortar_resized, (193, 345), mortar_resized)
    print(f"  ✓ Replaced t2_coin at (193, 345) with mortar")
    
    # Paste the mortar glow in place of t2_glow
    atlas.paste(mortar_glow, (2, 363), mortar_glow)
    print(f"  ✓ Replaced t2_glow at (2, 363) with mortar glow")
    
    # Save
    atlas.save(f"{SPINES_DIR}/symbols.png")
    print("✓ Updated symbols.png")
    
    # Also convert to webp
    atlas.save(f"{SPINES_DIR}/symbols.webp", "WEBP", quality=90)
    print("✓ Created symbols.webp")

def create_simple_h2_json():
    """Create a simple h2.json based on l4 structure but using mortar images"""
    
    # This is a minimal Spine animation that just shows the symbol with a simple glow effect
    h2_data = {
        "skeleton": {
            "hash": "mortarH2",
            "spine": "4.1.23",
            "x": -600,
            "y": -512,
            "width": 1200,
            "height": 1023,
            "images": "../images/",
        },
        "bones": [
            {"name": "root", "x": -400, "y": 400},
            {"name": "global", "parent": "root", "length": 200, "x": 400, "y": -400},
            {"name": "scale/rotate", "parent": "global", "length": 300},
            {"name": "handle", "parent": "scale/rotate", "length": 128, "color": "abe323ff"},
        ],
        "slots": [
            {"name": "t2_glow", "bone": "root", "attachment": "t2_glow"},
            {"name": "t2_glow_add", "bone": "root", "color": "ffffff00", "attachment": "t2_glow", "blend": "additive"},
            {"name": "t2_coin", "bone": "root", "attachment": "t2_coin"},
            {"name": "t2_coin_add", "bone": "root", "color": "ffffff00", "attachment": "t2_coin", "blend": "additive"},
        ],
        "skins": [
            {
                "name": "default",
                "attachments": {
                    "t2_coin": {
                        "t2_coin": {"width": 168, "height": 167}
                    },
                    "t2_glow": {
                        "t2_glow": {"width": 189, "height": 183}
                    }
                }
            }
        ],
        "animations": {
            "h2": {
                "slots": {
                    "t2_coin_add": {
                        "rgba": [
                            {"time": 0.1667, "color": "ffffff00", "curve": [0.292, 1, 0.542, 1, 0.292, 1, 0.542, 1, 0.292, 1, 0.542, 1, 0.292, 0, 0.542, 0.12]},
                            {"time": 0.6667, "color": "ffffff1d", "curve": [0.875, 1, 1.292, 1, 0.875, 1, 1.292, 1, 0.875, 1, 1.292, 1, 0.875, 0.12, 1.292, 0]},
                            {"time": 1.5, "color": "ffffff00"}
                        ]
                    },
                    "t2_glow_add": {
                        "rgba": [
                            {"time": 0.1667, "color": "ffffff00", "curve": [0.292, 1, 0.542, 1, 0.292, 1, 0.542, 1, 0.292, 1, 0.542, 1, 0.292, 0, 0.542, 0.31]},
                            {"time": 0.6667, "color": "ffffff4f", "curve": [0.875, 1, 1.292, 1, 0.875, 1, 1.292, 1, 0.875, 1, 1.292, 1, 0.875, 0.31, 1.292, 0]},
                            {"time": 1.5, "color": "ffffff00"}
                        ]
                    }
                },
                "bones": {
                    "scale/rotate": {
                        "translate": [
                            {},
                            {"time": 0.0667, "y": -2, "curve": [0.1, 0, 0.133, 0, 0.1, -2, 0.133, 11.02]},
                            {"time": 0.1667, "y": 12, "curve": [0.267, 0, 0.367, 0, 0.255, 14.61, 0.367, 15.69]},
                            {"time": 0.4667, "y": 16, "curve": [0.8, 0, 1.133, 0, 0.893, 17.34, 1.126, 19.58]},
                            {"time": 1.4667, "y": 20, "curve": [1.533, 0, 1.6, 0, 1.533, 20.08, 1.645, -4]},
                            {"time": 1.6667, "y": -4, "curve": [1.733, 0, 1.8, 0, 1.733, -4, 1.8, 0]},
                            {"time": 1.8667}
                        ],
                        "scale": [
                            {},
                            {"time": 0.0667, "x": 0.96, "y": 0.96, "curve": [0.1, 0.96, 0.14, 1.082, 0.1, 0.96, 0.14, 1.082]},
                            {"time": 0.1667, "x": 1.1, "y": 1.1, "curve": [0.234, 1.144, 0.325, 1.197, 0.234, 1.144, 0.325, 1.197]},
                            {"time": 0.4667, "x": 1.2, "y": 1.2, "curve": [0.761, 1.207, 1.149, 1.236, 0.761, 1.207, 1.149, 1.236]},
                            {"time": 1.4667, "x": 1.24, "y": 1.24, "curve": [1.533, 1.241, 1.642, 0.8, 1.533, 1.241, 1.642, 0.8]},
                            {"time": 1.6667, "x": 0.8, "y": 0.8, "curve": [1.733, 0.8, 1.802, 1.04, 1.733, 0.8, 1.802, 1.04]},
                            {"time": 1.8667, "x": 1.04, "y": 1.04, "curve": [1.911, 1.04, 1.956, 1, 1.911, 1.04, 1.956, 1]},
                            {"time": 2}
                        ]
                    },
                    "handle": {
                        "translate": [
                            {"time": 0.0667, "curve": [0.2, 0, 0.333, 0, 0.2, 8, 0.333, 39.6]},
                            {"time": 0.4667, "y": 42, "curve": [0.8, 0, 1.133, 0, 0.8, 48, 1.133, 48]},
                            {"time": 1.4667, "y": 48, "curve": [1.533, 0, 1.6, 0, 1.533, 48, 1.6, 10]},
                            {"time": 1.6667}
                        ]
                    }
                }
            },
            "h2_static": {
                "slots": {
                    "t2_glow_add": {
                        "rgba": [{"color": "ffffff00"}]
                    },
                    "t2_coin_add": {
                        "rgba": [{"color": "ffffff00"}]
                    }
                }
            }
        }
    }
    
    with open(f"{SPINES_DIR}/h2.json", 'w') as f:
        json.dump(h2_data, f, separators=(',', ':'))
    
    print("✓ Created simple h2.json animation")

def main():
    print("\n=== Creating Mortar & Pestle Animation ===\n")
    
    # Step 1: Backup
    backup_files()
    
    # Step 2: Extract mortar image
    mortar = extract_mortar_image()
    
    # Step 3: Add to atlas
    add_mortar_to_atlas(mortar)
    
    # Step 4: Create simple animation JSON
    create_simple_h2_json()
    
    print("\n✓ Done! Restart Storybook to see the new animation.\n")

if __name__ == "__main__":
    main()
