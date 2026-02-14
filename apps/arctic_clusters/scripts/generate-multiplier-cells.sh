#!/bin/bash

# Aurora-Borealis Multiplier Cell Generator
# Creates gradient PNG assets for multiplier tiers 2x through 1024x
# Each tier's gradient starts with the previous tier's end color for continuity

OUTPUT_DIR="/workspaces/web-sdk/apps/arctic_clusters/static/assets/sprites/reelsFrame/cell/multipliers"
SIZE=1024
CORNER_RADIUS=80  # Rounded corners for cell shape

# Deep navy outline color
OUTLINE_COLOR="#061423"
OUTLINE_WIDTH=12

# Function to create a gradient multiplier cell with proper fill
create_cell_gradient() {
    local multiplier=$1
    local color1=$2
    local color2=$3
    local color3=$4
    local glow_color=$5
    local output_file="$OUTPUT_DIR/multi_cell_${multiplier}x.png"
    
    echo "Creating ${multiplier}x multiplier cell..."
    
    local margin=$((OUTLINE_WIDTH / 2 + 2))
    local inner=$((SIZE - margin * 2))
    
    # Step 1: Create the 3-stop diagonal gradient (rotated 45 degrees for SW to NE)
    # We create a 2x2 grid of colors and resize with interpolation
    convert -size 2x2 xc:none \
        -fill "${color1}" -draw "point 0,1" \
        -fill "${color2}" -draw "point 0,0" \
        -fill "${color2}" -draw "point 1,1" \
        -fill "${color3}" -draw "point 1,0" \
        -filter Gaussian -resize ${SIZE}x${SIZE}! \
        /tmp/gradient_${multiplier}.png
    
    # Step 2: Create rounded rectangle mask
    convert -size ${SIZE}x${SIZE} xc:none \
        -fill white \
        -draw "roundrectangle ${margin},${margin} $((SIZE-margin)),$((SIZE-margin)) ${CORNER_RADIUS},${CORNER_RADIUS}" \
        /tmp/mask_${multiplier}.png
    
    # Step 3: Apply mask to gradient
    convert /tmp/gradient_${multiplier}.png /tmp/mask_${multiplier}.png \
        -compose CopyOpacity -composite \
        /tmp/filled_${multiplier}.png
    
    # Step 4: Add navy outline
    convert /tmp/filled_${multiplier}.png \
        \( -size ${SIZE}x${SIZE} xc:none \
           -fill none -stroke "${OUTLINE_COLOR}" -strokewidth ${OUTLINE_WIDTH} \
           -draw "roundrectangle ${margin},${margin} $((SIZE-margin)),$((SIZE-margin)) ${CORNER_RADIUS},${CORNER_RADIUS}" \
        \) \
        -compose Over -composite \
        /tmp/outlined_${multiplier}.png
    
    # Step 5: Add white inner highlight rim
    convert /tmp/outlined_${multiplier}.png \
        \( -size ${SIZE}x${SIZE} xc:none \
           -fill none -stroke "rgba(255,255,255,0.25)" -strokewidth 4 \
           -draw "roundrectangle $((margin+8)),$((margin+8)) $((SIZE-margin-8)),$((SIZE-margin-8)) $((CORNER_RADIUS-8)),$((CORNER_RADIUS-8))" \
        \) \
        -compose Over -composite \
        "${output_file}"
    
    # Cleanup temp files
    rm -f /tmp/gradient_${multiplier}.png /tmp/mask_${multiplier}.png /tmp/filled_${multiplier}.png /tmp/outlined_${multiplier}.png
    
    echo "  ✓ Created: ${output_file}"
}

echo "========================================"
echo "Aurora-Borealis Multiplier Cell Generator"
echo "========================================"
echo ""
echo "Output directory: ${OUTPUT_DIR}"
echo "Size: ${SIZE}x${SIZE}px"
echo ""

# Create all multiplier cells with aurora gradient specs
# Format: multiplier, color1 (start), color2 (mid), color3 (end), glow

# 2x: Green-to-cyan-to-blue (aurora start)
create_cell_gradient 2 "#21E6A6" "#2CCBFF" "#1B6DFF" "#2CCBFF"

# 4x: Blue-to-indigo-to-purple (cold, higher energy)
create_cell_gradient 4 "#1B6DFF" "#3B46FF" "#7B2CFF" "#5B4DFF"

# 8x: Purple-to-violet-to-magenta (electric)
create_cell_gradient 8 "#7B2CFF" "#B517FF" "#FF3DCE" "#C24CFF"

# 16x: Magenta-to-fuchsia-to-pink (celebratory)
create_cell_gradient 16 "#FF3DCE" "#FF3E8A" "#FF77C8" "#FF4FA8"

# 32x: Pink-to-red-to-orange (warm aurora notes)
create_cell_gradient 32 "#FF77C8" "#FF5E72" "#FF9A3D" "#FF6B6B"

# 64x: Orange-to-amber-to-gold (luminous)
create_cell_gradient 64 "#FF9A3D" "#FFC44D" "#FFEAA6" "#FFD36B"

# 128x: Gold-to-yellow-to-lime (aurora flare)
create_cell_gradient 128 "#FFEAA6" "#FFD54A" "#B7FF4A" "#DFFF6B"

# 256x: Lime-to-mint-to-cyan (signature aurora, intense)
create_cell_gradient 256 "#B7FF4A" "#2DFFB2" "#3DFFFD" "#66FFD8"

# 512x: Cyan-to-sky-to-blue (high-voltage icy)
create_cell_gradient 512 "#3DFFFD" "#55D4FF" "#2A7BFF" "#6BE5FF"

# 1024x: Blue-to-ultraviolet-to-white (peak intensity, jackpot)
create_cell_gradient 1024 "#2A7BFF" "#7A2CFF" "#FFFFFF" "#B8A7FF"

echo ""
echo "========================================"
echo "Generation complete!"
echo "========================================"
echo ""
ls -la "${OUTPUT_DIR}"
