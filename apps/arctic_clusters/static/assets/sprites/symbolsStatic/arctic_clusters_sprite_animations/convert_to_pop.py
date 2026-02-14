#!/usr/bin/env python3
"""
Convert explosion sprite to white pop effect.
- Identifies dark/smoky pixels (low saturation, low brightness) and converts them to white
- Identifies yellow/orange explosion pixels and converts them to white
- Preserves the original alpha channel
"""

from PIL import Image
import numpy as np
import colorsys

def rgb_to_hsv_vectorized(r, g, b):
    """Convert RGB arrays to HSV."""
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    
    v = maxc
    s = np.where(maxc != 0, (maxc - minc) / maxc, 0)
    
    # Hue calculation
    h = np.zeros_like(r)
    delta = maxc - minc
    
    # Avoid division by zero
    mask = delta != 0
    
    # Red is max
    red_mask = mask & (maxc == r)
    h[red_mask] = ((g[red_mask] - b[red_mask]) / delta[red_mask]) % 6
    
    # Green is max
    green_mask = mask & (maxc == g)
    h[green_mask] = (b[green_mask] - r[green_mask]) / delta[green_mask] + 2
    
    # Blue is max
    blue_mask = mask & (maxc == b)
    h[blue_mask] = (r[blue_mask] - g[blue_mask]) / delta[blue_mask] + 4
    
    h = h / 6.0  # Normalize to 0-1
    
    return h, s, v

def analyze_image(img_path):
    """Analyze the image to understand color distribution."""
    img = Image.open(img_path).convert('RGBA')
    pixels = np.array(img)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    # Only analyze visible pixels (alpha > 0)
    visible_mask = a > 10
    
    h, s, v = rgb_to_hsv_vectorized(r, g, b)
    
    print("=== Image Analysis ===")
    print(f"Image size: {img.size}")
    print(f"Total pixels: {pixels.shape[0] * pixels.shape[1]}")
    print(f"Visible pixels (alpha > 10): {np.sum(visible_mask)}")
    
    if np.sum(visible_mask) > 0:
        print(f"\nVisible pixel stats:")
        print(f"  Hue range: {h[visible_mask].min():.3f} - {h[visible_mask].max():.3f}")
        print(f"  Saturation range: {s[visible_mask].min():.3f} - {s[visible_mask].max():.3f}")
        print(f"  Value/Brightness range: {v[visible_mask].min():.3f} - {v[visible_mask].max():.3f}")
        
        # Identify smoky pixels (low saturation, darker)
        smoky_mask = visible_mask & (s < 0.3) & (v < 0.7)
        print(f"\nSmoky pixels (low sat, darker): {np.sum(smoky_mask)}")
        
        # Identify yellow/orange pixels (hue around 0.08-0.17, which is yellow-orange range)
        yellow_mask = visible_mask & (h >= 0.05) & (h <= 0.2) & (s > 0.3)
        print(f"Yellow/orange pixels: {np.sum(yellow_mask)}")
        
        # Bright pixels
        bright_mask = visible_mask & (v > 0.8)
        print(f"Bright pixels (v > 0.8): {np.sum(bright_mask)}")
        
        # Dark pixels
        dark_mask = visible_mask & (v < 0.3)
        print(f"Dark pixels (v < 0.3): {np.sum(dark_mask)}")
    
    return img, pixels

def convert_to_white_pop(img_path, output_path):
    """
    Convert the explosion to a white pop effect.
    All visible pixels become white, preserving original alpha for shape.
    """
    img = Image.open(img_path).convert('RGBA')
    pixels = np.array(img)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    # Create new image - all visible pixels become white
    new_pixels = np.zeros_like(pixels)
    new_pixels[:,:,0] = 255  # R = white
    new_pixels[:,:,1] = 255  # G = white
    new_pixels[:,:,2] = 255  # B = white
    new_pixels[:,:,3] = a    # Preserve original alpha
    
    # Create output image
    output_img = Image.fromarray(new_pixels.astype('uint8'), 'RGBA')
    output_img.save(output_path)
    print(f"Saved white version to: {output_path}")
    return output_img

def convert_smoke_to_white_keep_explosion(img_path, output_path):
    """
    Convert only the dark smoky parts to white, keep the yellow explosion.
    """
    img = Image.open(img_path).convert('RGBA')
    pixels = np.array(img).astype(np.float32)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    h, s, v = rgb_to_hsv_vectorized(r, g, b)
    
    visible_mask = a > 10
    
    # Identify smoky/dark pixels: low saturation OR dark value
    # These are the grayish smoke particles
    smoky_mask = visible_mask & ((s < 0.4) | (v < 0.5))
    
    new_pixels = pixels.copy()
    
    # Convert smoky pixels to white
    new_pixels[:,:,0][smoky_mask] = 255
    new_pixels[:,:,1][smoky_mask] = 255
    new_pixels[:,:,2][smoky_mask] = 255
    
    output_img = Image.fromarray(new_pixels.astype('uint8'), 'RGBA')
    output_img.save(output_path)
    print(f"Saved smoke-to-white version to: {output_path}")
    return output_img

def convert_all_to_white_preserve_luminosity(img_path, output_path):
    """
    Convert all colors to white but use original luminosity for alpha.
    This creates a cleaner pop effect where brighter areas are more visible.
    """
    img = Image.open(img_path).convert('RGBA')
    pixels = np.array(img).astype(np.float32)
    
    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]
    
    # Calculate luminosity
    luminosity = 0.299 * r + 0.587 * g + 0.114 * b
    
    # New alpha = original alpha * (luminosity factor)
    # This makes bright parts more visible, dark smoke less visible
    # Normalize luminosity to 0-1 range
    lum_normalized = luminosity / 255.0
    
    # Boost the luminosity effect - make bright areas pop more
    lum_boosted = np.clip(lum_normalized * 1.5, 0, 1)
    
    # New alpha combines original alpha with boosted luminosity
    new_alpha = (a / 255.0) * lum_boosted * 255.0
    
    new_pixels = np.zeros_like(pixels)
    new_pixels[:,:,0] = 255  # White
    new_pixels[:,:,1] = 255
    new_pixels[:,:,2] = 255
    new_pixels[:,:,3] = np.clip(new_alpha, 0, 255)
    
    output_img = Image.fromarray(new_pixels.astype('uint8'), 'RGBA')
    output_img.save(output_path)
    print(f"Saved luminosity-based white pop to: {output_path}")
    return output_img

if __name__ == "__main__":
    input_path = "ui_explosion_backup.png"
    
    print("Analyzing original image...")
    analyze_image(input_path)
    
    print("\n" + "="*50)
    print("Creating variations...")
    print("="*50 + "\n")
    
    # Option 1: All white, original alpha (simple)
    convert_to_white_pop(input_path, "ui_explosion_all_white.png")
    
    # Option 2: Smoke to white, keep yellow explosion colors
    convert_smoke_to_white_keep_explosion(input_path, "ui_explosion_smoke_white.png")
    
    # Option 3: All white, but use luminosity to modify alpha (pop effect - removes dark smoke visibility)
    convert_all_to_white_preserve_luminosity(input_path, "ui_explosion.png")
    
    print("\n=== Done! ===")
    print("Created 3 versions:")
    print("  1. ui_explosion_all_white.png - Everything white, original alpha")
    print("  2. ui_explosion_smoke_white.png - Smoke white, yellow kept")
    print("  3. ui_explosion.png - White pop effect (dark smoke faded out)")
