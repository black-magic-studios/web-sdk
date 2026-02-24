#!/usr/bin/env python3
"""
Generate hover, pressed, and state variants for the new playbar buttons.

Buttons to process:
- autoplay (play_bar_0000_auto_play.png) → hover, pressed, spinning frames
- play button (play_bar_0001_playbutton.png) → hover, pressed
- turbo (play_bar_0002_turbo.png) → base (greyed arrows), turbo (1 arrow lit), super turbo (both lit), + hover/pressed for each
- increase (play_bar_0006_Increase.png) → hover, pressed
- decrease (play_bar_0007_Decrease.png) → hover, pressed
"""

from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageChops
import os
import math

SRC_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'assets', 'sprites', 'buttons_new')
OUT_DIR = SRC_DIR  # Output alongside originals


def load(name):
    return Image.open(os.path.join(SRC_DIR, name)).convert('RGBA')


def save(img, name):
    path = os.path.join(OUT_DIR, name)
    img.save(path)
    print(f'  saved: {name} ({img.size[0]}x{img.size[1]})')


def make_hover(img):
    """Brighten the image slightly for hover state."""
    # Increase brightness by ~20%
    enhancer = ImageEnhance.Brightness(img)
    brightened = enhancer.enhance(1.25)
    # Preserve original alpha
    r, g, b, a = brightened.split()
    _, _, _, orig_a = img.split()
    return Image.merge('RGBA', (r, g, b, orig_a))


def make_pressed(img):
    """Darken and slightly shrink for pressed state."""
    # Darken by ~15%
    enhancer = ImageEnhance.Brightness(img)
    darkened = enhancer.enhance(0.78)
    # Preserve original alpha
    r, g, b, a = darkened.split()
    _, _, _, orig_a = img.split()
    darkened = Image.merge('RGBA', (r, g, b, orig_a))
    
    # Scale down slightly (95%) and re-center to give "push" feel
    w, h = darkened.size
    new_w, new_h = int(w * 0.94), int(h * 0.94)
    shrunk = darkened.resize((new_w, new_h), Image.LANCZOS)
    
    result = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    offset_x = (w - new_w) // 2
    offset_y = (h - new_h) // 2
    result.paste(shrunk, (offset_x, offset_y))
    return result


def grey_out(img, factor=0.5):
    """Reduce saturation and lower alpha to grey out an image."""
    # Desaturate
    enhancer = ImageEnhance.Color(img)
    desat = enhancer.enhance(0.3)
    # Lower brightness
    enhancer2 = ImageEnhance.Brightness(desat)
    dimmed = enhancer2.enhance(factor)
    # Reduce alpha
    r, g, b, a = dimmed.split()
    _, _, _, orig_a = img.split()
    new_a = orig_a.point(lambda p: int(p * 0.5))
    return Image.merge('RGBA', (r, g, b, new_a))


def rotate_image(img, angle):
    """Rotate image around center, preserving size and transparency."""
    return img.rotate(angle, resample=Image.BICUBIC, expand=False, center=None)


# ============================================================
# AUTOPLAY BUTTON
# ============================================================
def generate_autoplay():
    print('=== AUTOPLAY ===')
    base = load('play_bar_0000_auto_play.png')
    
    # Standard hover/pressed
    save(base, 'autoplay_base.png')
    save(make_hover(base), 'autoplay_hover.png')
    save(make_pressed(base), 'autoplay_pressed.png')
    
    # Spinning animation frames (8 frames of rotation)
    # These show the autoplay arrows spinning while autoplay is running
    num_frames = 8
    for i in range(num_frames):
        angle = -(i * 360 / num_frames)  # Negative for clockwise
        rotated = rotate_image(base, angle)
        save(rotated, f'autoplay_spinning_{i:02d}.png')
    
    print(f'  Generated {num_frames} spinning frames')


# ============================================================
# PLAY BUTTON
# ============================================================
def generate_play_button():
    print('=== PLAY BUTTON ===')
    base = load('play_bar_0001_playbutton.png')
    
    save(base, 'playbutton_base.png')
    save(make_hover(base), 'playbutton_hover.png')
    save(make_pressed(base), 'playbutton_pressed.png')


# ============================================================
# TURBO BUTTON – 3 speed modes
# ============================================================
def generate_turbo():
    """
    The turbo button has 2 arrows.
    - Base (normal speed): both arrows greyed out
    - Turbo: one arrow full color, one greyed
    - Super turbo: both arrows full color
    Each also gets hover/pressed variants.
    
    Strategy: Split the turbo image into left and right halves (the two arrows),
    then composite with different treatments.
    """
    print('=== TURBO ===')
    base = load('play_bar_0002_turbo.png')
    w, h = base.size
    
    # The turbo icon is 80x80 with two arrows (>> style)
    # We'll create variants by manipulating the overall appearance
    
    # Analyze the image to find the arrow regions
    # The arrows on the icon are the ">>" chevrons
    # Left arrow occupies roughly left 55%, right arrow roughly right 55% (overlapping in center)
    mid = w // 2
    
    # Create masks for left and right arrows by analyzing pixel positions
    # For a >> icon, the left > is roughly in the left portion, right > in the right
    pixels = base.load()
    
    # Create left-arrow-only and right-arrow-only masks
    # We'll split at vertical center
    left_mask = Image.new('L', (w, h), 0)
    right_mask = Image.new('L', (w, h), 0)
    left_pixels = left_mask.load()
    right_pixels = right_mask.load()
    
    _, _, _, alpha = base.split()
    alpha_pixels = alpha.load()
    
    for y in range(h):
        for x in range(w):
            a = alpha_pixels[x, y]
            if a > 10:
                if x < mid:
                    left_pixels[x, y] = 255
                else:
                    right_pixels[x, y] = 255
    
    # Greyed version of the full button
    greyed = grey_out(base, factor=0.6)
    
    # === BASE MODE (normal speed): both arrows greyed ===
    save(greyed, 'turbo_base.png')
    save(make_hover(greyed), 'turbo_base_hover.png')
    save(make_pressed(greyed), 'turbo_base_pressed.png')
    
    # === TURBO MODE: right arrow (second >) full color, left greyed ===
    turbo = greyed.copy()
    # Paste original pixels only where right mask is active
    for y in range(h):
        for x in range(w):
            if right_pixels[x, y] > 0:
                turbo.putpixel((x, y), base.getpixel((x, y)))
    save(turbo, 'turbo_turbo.png')
    save(make_hover(turbo), 'turbo_turbo_hover.png')
    save(make_pressed(turbo), 'turbo_turbo_pressed.png')
    
    # === SUPER TURBO MODE: both arrows full color ===
    save(base, 'turbo_super.png')
    save(make_hover(base), 'turbo_super_hover.png')
    save(make_pressed(base), 'turbo_super_pressed.png')


# ============================================================
# INCREASE / DECREASE BUTTONS
# ============================================================
def generate_arrows():
    print('=== INCREASE ===')
    inc = load('play_bar_0006_Increase.png')
    save(inc, 'increase_base.png')
    save(make_hover(inc), 'increase_hover.png')
    save(make_pressed(inc), 'increase_pressed.png')
    
    print('=== DECREASE ===')
    dec = load('play_bar_0007_Decrease.png')
    save(dec, 'decrease_base.png')
    save(make_hover(dec), 'decrease_hover.png')
    save(make_pressed(dec), 'decrease_pressed.png')


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    generate_autoplay()
    generate_play_button()
    generate_turbo()
    generate_arrows()
    print('\nDone! All variants generated.')
