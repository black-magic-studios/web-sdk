import _ from 'lodash';
import type { Tween } from 'svelte/motion';

import { stateBet } from 'state-shared';
import { createEnhanceBoard, createReelForCascading } from 'utils-slots';
import { createGetWinLevelDataByWinLevelAlias } from 'utils-shared/winLevel';

import type { GameType, Position, RawSymbol, SymbolState } from './types';
import { stateLayoutDerived } from './stateLayout';
import { winLevelMap } from './winLevelMap';
import { eventEmitter } from './eventEmitter';
import {
	SYMBOL_HEIGHT,
	INITIAL_BOARD,
	BOARD_DIMENSIONS,
	SPIN_OPTIONS_DEFAULT,
	SPIN_OPTIONS_FAST,
	INITIAL_SYMBOL_STATE,
	SCATTER_LAND_SOUND_MAP,
	BOARD_ASPECT_RATIO,
	GRID_COLS,
	GRID_ROWS,
	GRID_GAP_X,
	GRID_GAP_Y,
} from './constants';

// Major-scale pitch rates (do-re-mi-fa-sol) for scatter landing sounds
// Each step is a major-scale interval: 0, 2, 4, 5, 7 semitones above root
const SCATTER_PITCH_RATES = [1.0, 1.122, 1.260, 1.335, 1.498] as const;

const onSymbolLand = ({ rawSymbol }: { rawSymbol: RawSymbol }) => {
	if (rawSymbol.name === 'S' || rawSymbol.name === 'SS') {
		eventEmitter.broadcast({ type: 'soundScatterCounterIncrease' });
		// scatterLandIndex() returns 1-5 (post-increment); map to 0-based pitch index
		const rate = SCATTER_PITCH_RATES[scatterLandIndex() - 1];
		eventEmitter.broadcast({
			type: 'soundOnceWithRate',
			name: 'bonus_symbol_land',
			rate,
			volume: 0.4,
		});
		// Progressive shake: light for 1st scatter, medium for 2nd, heavy for 3+
		const count = stateGame.scatterCounter;
		const intensity = count >= 3 ? 'heavy' : count === 2 ? 'medium' : 'light';
		eventEmitter.broadcast({ type: 'screenShake', intensity });
	}

	if (rawSymbol.name === 'W') {
		eventEmitter.broadcast({
			type: 'soundOnce',
			name: 'sfx_multiplier_landing',
		});
	}
};

const board = _.range(BOARD_DIMENSIONS.x).map((reelIndex) => {
	const reel = createReelForCascading({
		reelIndex,
		symbolHeight: SYMBOL_HEIGHT,
		initialSymbols: INITIAL_BOARD[reelIndex],
		initialSymbolState: INITIAL_SYMBOL_STATE,
		onReelStopping: () => {
			eventEmitter.broadcast({
				type: 'soundOnce',
				name: 'sfx_reel_stop_1',
				forcePlay: !stateBet.isTurbo,
			});
		},
		onSymbolLand,
	});

	reel.reelState.spinOptions = () =>
		reel.reelState.spinType === 'fast' ? SPIN_OPTIONS_FAST : SPIN_OPTIONS_DEFAULT;

	return reel;
});

export type Reel = (typeof board)[number];
export type ReelSymbol = Reel['reelState']['symbols'][number];

export type TumbleSymbol = {
	symbolY: Tween<number>;
	symbolScale: number;
	rawSymbol: RawSymbol;
	symbolState: SymbolState;
	oncomplete: () => void;
	onvanish?: () => void;
};

export type MultiplierSymbol = {
	initX: number;
	initY: number;
	symbolX: Tween<number>;
	symbolY: Tween<number>;
	rawSymbol: RawSymbol;
	symbolState: SymbolState;
	oncomplete: () => void;
};

export const stateGame = $state({
	board,
	gameType: 'basegame' as GameType,
	tumbleBoardAdding: [] as TumbleSymbol[][],
	tumbleBoardBase: [] as TumbleSymbol[][],
	multiplierBoard: [] as (MultiplierSymbol | undefined)[][],
	// Pending multiplier grid to be applied after explosion animation
	pendingMultiplierGrid: null as number[][] | null,
	// Active multiplier grid - persists across component remounts
	multiplierGrid: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	] as number[][],
	// Multiplier animation state — stored globally so it survives MultiplierGrid remounts
	// (Board hides/shows during tumble, which destroys and recreates MultiplierGrid)
	multiplierCellScales: new Map() as Map<string, any>,
	multiplierPreviousGrid: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	] as number[][],
	multiplierExplodingCells: new Set() as Set<string>,
	scatterCounter: 0,
	// Scatter position history from freeSpinTrigger / retrigger / superBonusTrigger
	// Each entry is the scatter positions at a tumble step: [0] = reveal, [1] = after 1st tumble, …
	scatterPositionHistory: [] as Position[][],
	// Aurora state
	auroraPositions: [] as Position[],
	auroraMeterTotal: 0,
	// Aurora wild tracking: positions of all wilds placed via aurora this spin
	auroraWildPositions: [] as Position[],
	// Count of aurora wilds that connected (were part of winning clusters) — per spin
	auroraWildsConnected: 0,
	// Session-wide total of aurora wilds that were part of winning clusters (accumulates across free spins)
	auroraWildsSessionTotal: 0,
	// Whether we are in wild release phase
	isWildRelease: false,
	// Number of wilds still to place during wild release (counts down)
	wildReleaseRemaining: 0,
	// Signal to speed up the current aurora wild placement animation
	auroraWildSkipRequested: false,
	// Whether a spin is currently active (show wild counter)
	spinActive: false,
	// Whether a popup/dialog is open (blocks Space key, etc.)
	popupOpen: false,
	// Brief notification when Space is pressed while a menu/popup is open
	spaceBlockedNotice: false,
	// Brief notification when Space is pressed with insufficient balance
	insufficientBalanceNotice: false,
});

// ============================================================
// DYNAMIC BOARD LAYOUT - Computed once, derived from it
// Board scales to fit available screen space while maintaining aspect ratio
// ============================================================

const boardLayout = () => {
	const canvas = stateLayoutDerived.canvasSizes();
	const layout = stateLayoutDerived.layoutType();
	const isPortrait = layout === 'portrait' || layout === 'tablet';

	// Use only a portion of the canvas so we leave room for the reel frame + UI
	// while keeping the board centered and responsive.
	//
	// Design targets (portrait):
	//   Board  ≈ 65–70% of vertical playable area (width-constrained for 7×7 square grid)
	//   Width  ≈ full screen minus minimal side padding
	//   Spin   ≈ 15–18% of board width
	//   Side   ≈ 40–50% of spin diameter
	const BOARD_CANVAS_RATIO = isPortrait ? 0.94 : 0.7;
	// Reserve bottom space for HTML overlay controls (smaller reserve ⇒ bigger board)
	const MOBILE_BOTTOM_RESERVE = isPortrait ? canvas.height * 0.05 : 0;

	const availableWidth = canvas.width * BOARD_CANVAS_RATIO;
	const availableHeight = isPortrait
		? (canvas.height - MOBILE_BOTTOM_RESERVE) * 0.95
		: canvas.height * BOARD_CANVAS_RATIO;

	// Fit board maintaining aspect ratio
	let width: number;
	let height: number;

	if (availableWidth / availableHeight > BOARD_ASPECT_RATIO) {
		// Screen is wider than board aspect - constrain by height
		height = availableHeight;
		width = height * BOARD_ASPECT_RATIO;
	} else {
		// Screen is taller than board aspect - constrain by width
		width = availableWidth;
		height = width / BOARD_ASPECT_RATIO;
	}

	// Center position (relative to full canvas)
	// On portrait, push board down to leave room for wild meter above
	const centerX = canvas.width / 2;
	const centerY = isPortrait
		? (canvas.height - MOBILE_BOTTOM_RESERVE) / 2 + canvas.height * 0.1
		: canvas.height / 2;

	return {
		x: centerX,
		y: centerY,
		anchor: { x: 0.5, y: 0.5 },
		pivot: { x: width / 2, y: height / 2 },
		width,
		height,
	};
};

// Derived symbol dimensions (cached - only recalculates when boardLayout changes)
const symbolWidth = () =>
	(boardLayout().width - (GRID_COLS - 1) * GRID_GAP_X) / GRID_COLS;
const symbolHeight = () =>
	(boardLayout().height - (GRID_ROWS - 1) * GRID_GAP_Y) / GRID_ROWS;
const symbolSize = () => (symbolWidth() + symbolHeight()) / 2;

// Derived mask dimensions (same as board for masking)
const maskWidth = () => boardLayout().width;
const maskHeight = () => boardLayout().height;

const boardRaw = () =>
	board.map((reel) => reel.reelState.symbols.map((reelSymbol) => reelSymbol.rawSymbol));

const tumbleBoardCombined = () => {
	const tumbleBoardCombined = stateGame.tumbleBoardBase.map((tumbleReelBase, reelIndex) => {
		const tumbleReelAdding = stateGame.tumbleBoardAdding[reelIndex] ?? [];

		// Separate padding (first/last) from visible symbols.
		// Padding must NOT participate in the cascade — it stays at fixed positions.
		// Without this, the top padding symbol slides into the visible area after explosions,
		// causing symbol mismatches (e.g. L1 snowflake appearing where H1 polar bear should be).
		const topPadding = tumbleReelBase[0];
		const bottomPadding = tumbleReelBase[tumbleReelBase.length - 1];
		const visibleBase = tumbleReelBase.slice(1, -1);

		return [topPadding, ...tumbleReelAdding, ...visibleBase, bottomPadding];
	});

	return tumbleBoardCombined;
};

const scatterLandIndex = () => {
	if (stateGame.scatterCounter > 5) return 5;
	if (stateGame.scatterCounter < 1) return 1;
	return stateGame.scatterCounter as 1 | 2 | 3 | 4 | 5;
};

const { enhanceBoard } = createEnhanceBoard();
const enhancedBoard = enhanceBoard({ board: stateGame.board });

// win levels

export const { getWinLevelDataByWinLevelAlias } = createGetWinLevelDataByWinLevelAlias({
	winLevelMap,
});

export const stateGameDerived = {
	onSymbolLand,
	boardLayout,
	boardRaw,
	tumbleBoardCombined,
	scatterLandIndex,
	enhancedBoard,
	getWinLevelDataByWinLevelAlias,
	// Dynamic dimensions (cached via Svelte's $derived when used in components)
	symbolWidth,
	symbolHeight,
	symbolSize,
	maskWidth,
	maskHeight,
};
