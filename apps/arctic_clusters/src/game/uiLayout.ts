import { MASK_WIDTH, MASK_HEIGHT, MASK_ASPECT } from './constants';

// ============================================================
// MASK-DRIVEN LAYOUT
// The mask (916x742) defines the visible play area.
// Frame scales to match the mask dimensions exactly.
// All dimensions now derive from constants.ts
// ============================================================

// Re-export mask dimensions for components that need them
export { MASK_WIDTH, MASK_HEIGHT, MASK_ASPECT };

// Calculate mask/frame dimensions from board layout
// Since board now equals mask dimensions, this returns the board size directly
export const getMaskDimensions = (boardLayout: { width: number; height: number }) => ({
	width: boardLayout.width,
	height: boardLayout.height,
});

// Frame offsets relative to board center
export const FRAME_X_OFFSET = 0;
export const FRAME_Y_OFFSET = 0;

// Grid scale from BoardContainer
// Set to 1.0 so symbols fill the mask exactly
// Symbols are centered in their cells, so visual padding comes from symbol artwork
export const GRID_SCALE = 1.0;

// PlayBar constants
export const BAR_WIDTH_RATIO = 1.15;
export const REEL_PADDING_RATIO = -0.085;
export const BUTTON_GAP_RATIO = 0.02;
