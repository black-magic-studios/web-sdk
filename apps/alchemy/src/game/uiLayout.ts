// ============================================================
// MASK-DRIVEN LAYOUT
// The mask (916x742) defines the visible play area.
// Frame scales to match the mask dimensions exactly.
// ============================================================

// Mask native dimensions and aspect ratio (from reel_mask.png: 916x742)
export const MASK_NATIVE_WIDTH = 916;
export const MASK_NATIVE_HEIGHT = 742;
export const MASK_ASPECT_RATIO = MASK_NATIVE_WIDTH / MASK_NATIVE_HEIGHT; // ~1.2345 (wider than tall)

// Calculate mask dimensions that fit around the board while preserving aspect ratio
// We scale based on board width to ensure symbols fit horizontally
export const getMaskDimensions = (boardLayout: { width: number; height: number }) => {
	// Scale factor: how much to scale the mask to fit the board
	// Use a multiplier that gives good coverage around the symbols
	const MASK_SCALE = 1.35; // Adjust this to control how much border around symbols
	
	const width = boardLayout.width * MASK_SCALE;
	const height = width / MASK_ASPECT_RATIO; // Preserve aspect ratio
	
	return { width, height };
};

// Frame offsets relative to board center
export const FRAME_X_OFFSET = 0;
export const FRAME_Y_OFFSET = 20;

// Grid scale from BoardContainer (symbol grid is scaled down slightly)
export const GRID_SCALE = 0.96;

// PlayBar constants
export const BAR_WIDTH_RATIO = 1.15;
export const REEL_PADDING_RATIO = -0.085;
export const BUTTON_GAP_RATIO = 0.02;
