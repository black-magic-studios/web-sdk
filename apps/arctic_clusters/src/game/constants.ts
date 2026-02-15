import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

// ============================================================
// DYNAMIC LAYOUT SYSTEM
// Board scales to fit available screen space while maintaining aspect ratio.
// All dimensions are computed reactively in stateGame.svelte.ts
// ============================================================

// Board aspect ratio (source of truth - the shape we want to maintain)
// Square 1:1 ratio for arctic clusters theme
export const BOARD_ASPECT_RATIO = 1; // Square board

// Grid configuration (fixed - determines symbol count)
export const GRID_COLS = 7;
export const GRID_ROWS = 7;
// Grid gaps between cells (in board units)
export const GRID_GAP_X = 0;
export const GRID_GAP_Y = 0;

// UI padding ratios (relative to screen dimensions)
export const UI_PADDING_RATIO = {
	top: 0.02,      // 2% of screen height for top margin
	bottom: 0.12,   // 12% for playbar area
	left: 0.02,     // 2% side margins
	right: 0.02,
};

// ============================================================
// LEGACY STATIC VALUES (for components not yet migrated to dynamic)
// These will be removed once all components use stateGameDerived
// ============================================================
export const MASK_WIDTH = 916;
export const MASK_HEIGHT = 916; // Square mask to match 1:1 aspect ratio
export const MASK_ASPECT = MASK_WIDTH / MASK_HEIGHT; // 1:1
export const SYMBOL_WIDTH = MASK_WIDTH / GRID_COLS;   // ~130.86
export const SYMBOL_HEIGHT = MASK_HEIGHT / GRID_ROWS; // ~130.86
export const SYMBOL_SIZE = (SYMBOL_WIDTH + SYMBOL_HEIGHT) / 2; // ~130.86

// Horizontal padding for first symbol (0 = symbols start at left edge)
export const REEL_PADDING = 0;

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [
	[
		{
			name: 'L1',
		},
		{
			name: 'H1',
		},
		{
			name: 'L1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
	],
	[
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'L1',
		},
		{
			name: 'L1',
		},
		{
			name: 'H4',
		},
		{
			name: 'L2',
		},
		{
			name: 'H4',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'H4',
		},
		{
			name: 'L1',
		},
		{
			name: 'H2',
		},
		{
			name: 'H2',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
		{
			name: 'H2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
	],
	[
		{
			name: 'L1',
		},
		{
			name: 'L1',
		},
		{
			name: 'H3',
		},
		{
			name: 'H1',
		},
		{
			name: 'H1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
	],
	[
		{
			name: 'L1',
		},
		{
			name: 'L2',
		},
		{
			name: 'L2',
		},
		{
			name: 'H1',
		},
		{
			name: 'H4',
		},
		{
			name: 'H4',
		},
		{
			name: 'H2',
		},
		{
			name: 'H3',
		},
		{
			name: 'H2',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H1',
		},
		{
			name: 'L3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H3',
		},
		{
			name: 'H2',
		},
	],
];

export const BOARD_DIMENSIONS = { x: GRID_COLS, y: GRID_ROWS };

// Board now matches mask dimensions exactly
export const BOARD_SIZES = {
	width: MASK_WIDTH,
	height: MASK_HEIGHT,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'H5'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';

const M_SIZE = 0.3;
const HIGH_SYMBOL_SIZE = 0.9;
const LOW_SYMBOL_SIZE = 0.9;
const SPECIAL_SYMBOL_SIZE = 1;

const SPIN_OPTIONS_SHARED = {
	reelFallInDelay: 80,
	reelPaddingMultiplierNormal: 1.25,
	reelPaddingMultiplierAnticipated: 18,
	reelFallOutDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 3.5,
	symbolFallInInterval: 30,
	symbolFallInBounceSpeed: 0.15,
	symbolFallInBounceSizeMulti: 0.5,
	symbolFallOutSpeed: 3.5,
	symbolFallOutInterval: 20,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 7,
	symbolFallInInterval: 0,
	symbolFallInBounceSpeed: 0.3,
	symbolFallInBounceSizeMulti: 0.25,
	symbolFallOutSpeed: 7,
	symbolFallOutInterval: 0,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

const explosion = {
	type: 'spriteSheet',
	assetKey: 'snowPuff',
	animationName: 'explosion',
	sizeRatios: { width: 1.5, height: 1.5 },
	animationSpeed: 1.3333,
	frameCount: 40,
	frameHeight: 440,
};

const h1Static = { type: 'sprite', assetKey: 'h1.webp', sizeRatios: { width: 1.0, height: 1.0 } };
const h1Win = { 
	type: 'spriteSheet', 
	assetKey: 'h1WinAnimation', 
	animationName: 'h1_win', 
	sizeRatios: { width: 1.0, height: 1.0 },
	frameHeight: 256,
	frameCount: 32,
	animationSpeed: 0.7,
};
const h2Static = { type: 'sprite', assetKey: 'h2.webp', sizeRatios: { width: 1, height: 1 } };
const h3Static = { type: 'sprite', assetKey: 'h3.webp', sizeRatios: { width: 1, height: 1 } };
const h4Static = { type: 'sprite', assetKey: 'h4.webp', sizeRatios: { width: 1, height: 1 } };
const h5Static = { type: 'sprite', assetKey: 'h5.webp', sizeRatios: { width: 1, height: 1 } };

const l1Static = { type: 'sprite', assetKey: 'l1.webp', sizeRatios: { width: 1, height: 1 } };
const l2Static = { type: 'sprite', assetKey: 'l2.webp', sizeRatios: { width: 1, height: 1 } };
const l3Static = { type: 'sprite', assetKey: 'l3.webp', sizeRatios: { width: 1, height: 1 } };
const l4Static = { type: 'sprite', assetKey: 'l4.webp', sizeRatios: { width: 1, height: 1 } };

const sStatic = { type: 'sprite', assetKey: 'S', sizeRatios: { width: 1, height: 1 } };
const wSizeRatiosStatic = { width: 1.0, height: 1.0 };

const m2Static = {
	type: 'sprite',
	assetKey: 'm1_2x.png',
	sizeRatios: { width: 0.88, height: 0.88 },
};
const m4Static = {
	type: 'sprite',
	assetKey: 'm1_4x.png',
	sizeRatios: { width: 0.88, height: 0.88 },
};
const m5Static = { type: 'sprite', assetKey: 'm2_5x.png', sizeRatios: { width: 1, height: 1 } };
const m7Static = { type: 'sprite', assetKey: 'm2_7x.png', sizeRatios: { width: 1, height: 1 } };
const m10Static = { type: 'sprite', assetKey: 'm3_10x.png', sizeRatios: { width: 1, height: 1 } };

const wSizeRatios = { width: 1.0, height: 1.0 };


export const SYMBOL_INFO_MAP = {
	H1: {
		explosion,
		win: h1Win,
		postWinStatic: h1Static,
		static: h1Static,
		spin: h1Static,
		land: h1Static,
	},
	H2: {
		explosion,
		win: h2Static,
		postWinStatic: h2Static,
		static: h2Static,
		spin: h2Static,
		land: h2Static,
	},
	H3: {
		explosion,
		win: h3Static,
		postWinStatic: h3Static,
		static: h3Static,
		spin: h3Static,
		land: h3Static,
	},
	H4: {
		explosion,
		win: h4Static,
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	H5: {
		explosion,
		win: h5Static,
		postWinStatic: h5Static,
		static: h5Static,
		spin: h5Static,
		land: h5Static,
	},
	L1: {
		explosion,
		win: l1Static,
		postWinStatic: l1Static,
		static: l1Static,
		spin: l1Static,
		land: l1Static,
	},
	L2: {
		explosion,
		win: l2Static,
		postWinStatic: l2Static,
		static: l2Static,
		spin: l2Static,
		land: l2Static,
	},
	L3: {
		explosion,
		win: l3Static,
		postWinStatic: l3Static,
		static: l3Static,
		spin: l3Static,
		land: l3Static,
	},
	L4: {
		explosion,
		win: l4Static,
		postWinStatic: l4Static,
		static: l4Static,
		spin: l4Static,
		land: l4Static,
	},
	W: {
		explosion,
		postWinStatic: { type: 'sprite', assetKey: 'W', sizeRatios: wSizeRatios },
		static: { type: 'sprite', assetKey: 'W', sizeRatios: wSizeRatios },
		spin: { type: 'sprite', assetKey: 'W', sizeRatios: wSizeRatios },
		win: { type: 'sprite', assetKey: 'W', sizeRatios: wSizeRatios },
		land: { type: 'sprite', assetKey: 'W', sizeRatios: wSizeRatios },
	},
	S: {
		explosion,
		postWinStatic: sStatic,
		static: sStatic,
		spin: sStatic,
		win: sStatic,
		land: sStatic,
	},
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
