import _ from 'lodash';

import { recordBookEvent, checkIsMultipleRevealEvents, type BookEventHandlerMap } from 'utils-book';
import { stateBet, stateBetDerived } from 'state-shared';
import { waitForResolve } from 'utils-shared/wait';
import { BOOK_AMOUNT_MULTIPLIER } from 'constants-shared/bet';

import { eventEmitter } from './eventEmitter';
import { playBookEvent } from './utils';
import { winLevelMap, type WinLevel, type WinLevelData } from './winLevelMap';
import { stateGame, stateGameDerived } from './stateGame.svelte';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';
import { isFreegameType } from './types';
import type { RawSymbol, Position } from './types';

/**
 * Compute win level from the win amount (in book event units).
 * Thresholds are win-to-bet multiplier cutoffs:
 *   ≥25000× → max, ≥100× → epic, ≥50× → mega, ≥25× → superwin, ≥10× → big
 * Falls back to the winLevelMap key for smaller wins.
 */
const WIN_LEVEL_THRESHOLDS: { multiplier: number; level: WinLevel }[] = [
	{ multiplier: 25000, level: 10 }, // MAX WIN (true max payout only)
	{ multiplier: 100, level: 9 },    // EPIC WIN!
	{ multiplier: 50, level: 8 },     // MEGA WIN
	{ multiplier: 25, level: 7 },     // SUPER WIN
	{ multiplier: 10, level: 6 },     // BIG WIN
];

const getWinLevelFromAmount = (bookEventAmount: number): WinLevelData => {
	const winMultiplier = bookEventAmount / BOOK_AMOUNT_MULTIPLIER;
	for (const { multiplier, level } of WIN_LEVEL_THRESHOLDS) {
		if (winMultiplier >= multiplier) {
			return winLevelMap[level];
		}
	}
	// Below 10× — no big win presentation
	return winLevelMap[1];
};

const winLevelSoundsPlay = ({ winLevelData }: { winLevelData: WinLevelData }) => {
	if (winLevelData?.alias === 'max') eventEmitter.broadcastAsync({ type: 'uiHide' });
	if (winLevelData?.sound?.sfx) {
		eventEmitter.broadcast({ type: 'soundOnce', name: winLevelData.sound.sfx });
	}
	if (winLevelData?.sound?.bgm) {
		eventEmitter.broadcast({ type: 'soundMusic', name: winLevelData.sound.bgm });
	}
	if (winLevelData?.type === 'big') {
		eventEmitter.broadcast({ type: 'soundLoop', name: 'sfx_bigwin_coinloop' });
	}
};

const winLevelSoundsStop = () => {
	eventEmitter.broadcast({ type: 'soundStop', name: 'sfx_bigwin_coinloop' });
	// Don't change music here — the caller (setWin, freeSpinEnd, etc.)
	// is responsible for setting the correct music after the win presentation.
	eventEmitter.broadcastAsync({ type: 'uiShow' });
};

const animateSymbols = async ({ positions }: { positions: Position[] }) => {
	eventEmitter.broadcast({ type: 'boardShow' });
	await eventEmitter.broadcastAsync({
		type: 'boardWithAnimateSymbols',
		symbolPositions: positions,
	});
};

/**
 * Extract the initial multiplier grid from a reveal event's board data.
 * Outer ring cells (row 0, row 6, col 0, col 6) have no multiplier.
 * Returns a 7×7 grid of multiplier values (0 = no multiplier).
 */
const extractInitialGrid = (board: RawSymbol[][]): number[][] => {
	const grid: number[][] = [];
	for (let reel = 0; reel < board.length; reel++) {
		const col: number[] = [];
		// Skip padding rows at index 0 and last index (board is 7×9, grid needs 7×7)
		for (let row = 1; row < board[reel].length - 1; row++) {
			col.push(board[reel][row].multiplier ?? 0);
		}
		grid.push(col);
	}
	return grid;
};

/** Check if two 7×7 grids are identical. */
const gridsMatch = (a: number[][], b: number[][]): boolean => {
	for (let reel = 0; reel < a.length; reel++) {
		for (let row = 0; row < a[reel].length; row++) {
			if (a[reel][row] !== b[reel][row]) return false;
		}
	}
	return true;
};

/** Check if a grid has any multipliers > 1. */
const gridHasMultipliers = (grid: number[][]): boolean => {
	return grid.some((col) => col.some((m) => m > 1));
};

/**
 * Spin with multiplier grid reveal.
 * 1. preSpin() — old symbols fall out
 * 2. Wait for board to be empty (all reels hanging)
 * 3. Reveal multiplier grid (with pop animation for changed cells)
 * 4. spin() — new symbols drop in
 */
const spinWithMultipliers = async ({
	revealEvent,
	initialGrid,
}: {
	revealEvent: BookEventOfType<'reveal'>;
	initialGrid: number[][];
}) => {
	// 1. Start clearing old symbols
	await stateGameDerived.enhancedBoard.preSpin({});

	// 2. Wait for all reels to finish falling out (hanging state)
	await Promise.all(
		stateGame.board.map(async (reel) => {
			await waitForResolve((resolve) => (reel.reelState.readyToSpin = resolve));
		}),
	);

	// 3. Reveal multiplier grid (only changed cells will pop)
	eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
	await eventEmitter.broadcastAsync({ type: 'multiplierGridReveal', grid: initialGrid });

	// 3b. During free spins, briefly highlight ≥32× multipliers while board is empty
		if (isFreegameType(stateGame.gameType)) {
		await eventEmitter.broadcastAsync({ type: 'multiplierGridHighlightHigh' });
	}

	// 4. Drop new symbols (spin() will re-check readyToSpin but the $effect
	//    fires immediately since reels are still in 'hanging' state)
	await stateGameDerived.enhancedBoard.spin({ revealEvent });
};

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>, { bookEvents }: BookEventContext) => {
		const rt0 = performance.now();
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountReset' });
		// Reset aurora state for new spin
		stateGame.auroraPositions = [];
		// Reset per-spin wild tracking (session total is NOT reset here — it accumulates across spins)
		stateGame.auroraWildPositions = [];
		stateGame.auroraWildsConnected = 0;
		stateGame.spinActive = true;

		const isBonusGame = checkIsMultipleRevealEvents({ bookEvents });

		// Check if this is a multiplier mode (board cells have multiplier data)
		const initialGrid = extractInitialGrid(bookEvent.board);
		const isMultMode = gridHasMultipliers(initialGrid);

		// Clear multiplier grid only for normal base game spins.
		// - Multiplier modes: keep grid so spinWithMultipliers can diff against it
		//   (only pop cells that actually changed).
		// - Bonus games: multipliers persist across spins and are managed by updateGrid events.
		if (!isBonusGame && !isMultMode) {
			eventEmitter.broadcast({ type: 'multiplierGridClear' });
		}
		if (isBonusGame) {
			eventEmitter.broadcast({ type: 'stopButtonEnable' });
			recordBookEvent({ bookEvent });
		}

		// Extract aurora cell positions from the reveal board BEFORE spin starts.
		// This lets us light up the cell backgrounds while reels are still dropping.
		const auroraPositions: Position[] = [];
		bookEvent.board.forEach((reel, reelIndex) => {
			reel.forEach((symbol, symbolIndex) => {
				if (symbol.aurora) {
					// Use symbolIndex directly — positions use padded board indexing
					// (row 0 = top padding, rows 1-7 = active, row 8 = bottom padding)
					auroraPositions.push({ reel: reelIndex, row: symbolIndex });
				}
			});
		});

		if (auroraPositions.length > 0) {
			eventEmitter.broadcast({ type: 'auroraCellsReveal', positions: auroraPositions });
		} else {
			eventEmitter.broadcast({ type: 'auroraCellsClear' });
		}

		stateGame.gameType = bookEvent.gameType;

		// Show aurora spin notification before the wild release board drops
		const isWildRelease = bookEvent.gameType === 'freegame_wild_release' || bookEvent.gameType === 'super_wild_release';
		if (isWildRelease && stateGame.auroraWildsSessionTotal > 0) {
			await eventEmitter.broadcastAsync({
				type: 'auroraSpinShow',
				wildsToPlace: stateGame.auroraWildsSessionTotal,
			});
			eventEmitter.broadcast({ type: 'auroraSpinHide' });
		}

		// Filter anticipation: Only slow down reels if 2+ scatters have already
		// landed on preceding reels.  The server marks *all* potential anticipation
		// reels, but the game should only anticipate when a 3rd scatter could
		// trigger the bonus (i.e. 2 are already visible).
		const filteredAnticipation = bookEvent.anticipation.map((val, reelIndex) => {
			if (!val) return 0;
			// Count scatter/super-scatter symbols on reels BEFORE this one
			// (active rows only — indices 1..7 in padded board)
			let precedingScatters = 0;
			for (let r = 0; r < reelIndex; r++) {
				const reel = bookEvent.board[r];
				if (!reel) continue;
				for (let row = 1; row < reel.length - 1; row++) {
					const sym = reel[row];
					if (sym && (sym.name === 'S' || sym.name === 'SS')) {
						precedingScatters++;
					}
				}
			}
			return precedingScatters >= 2 ? val : 0;
		});
		// Use the filtered anticipation for the spin
		const revealWithFilteredAnticipation = { ...bookEvent, anticipation: filteredAnticipation };

		if (isMultMode) {
			// Multiplier mode: clear board → show grid (diff) → drop symbols
			// Works for both base game and bonus game spins — the grid reveal
			// handler skips cells that already match, so repeated spins are no-ops.
			await spinWithMultipliers({ revealEvent: revealWithFilteredAnticipation, initialGrid });
		} else {
			// Normal spin (no multiplier data in board)
			await stateGameDerived.enhancedBoard.spin({ revealEvent: revealWithFilteredAnticipation });
		}
		eventEmitter.broadcast({ type: 'soundScatterCounterClear' });
	},
	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		// Wild meter updates are handled by the server via wildMeterUpdate events.
		// No client-side aurora wild counting — math is the source of truth.

		// Signal Sound.svelte to briefly boost music volume on this win
		eventEmitter.broadcast({ type: 'soundBoostMusicOnWin' });

		const promise1 = async () => {
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_winlevel_small' });
			// Deduplicate positions — multiple wins can share symbols, and processing
			// the same reelSymbol twice in parallel causes oncomplete overwrite deadlock.
			const allPositions = _.flatten(bookEvent.wins.map((win) => win.positions));
			const seen = new Set<string>();
			const uniquePositions = allPositions.filter((p) => {
				const key = `${p.reel}_${p.row}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
			await animateSymbols({ positions: uniquePositions });
		};

		// Fire-and-forget: floating win amounts animate independently
		// without blocking the game flow
		eventEmitter.broadcast({
			type: 'showClusterWinAmounts',
			wins: bookEvent.wins.map((win) => {
				return {
					win: win.meta.winWithoutMult,
					mult: win.meta.clusterMult,
					result: win.meta.winWithoutMult * win.meta.clusterMult,
					reel: win.meta.overlay.reel,
					row: win.meta.overlay.row,
				};
			}),
		});

		await promise1();
	},
	updateTumbleWin: async (bookEvent: BookEventOfType<'updateTumbleWin'>) => {
		if (bookEvent.amount > 0) {
			eventEmitter.broadcast({ type: 'tumbleWinAmountShow' });
			eventEmitter.broadcast({
				type: 'tumbleWinAmountUpdate',
				amount: bookEvent.amount,
				animate: false,
			});
		}
	},
	setTotalWin: async (bookEvent: BookEventOfType<'setTotalWin'>) => {
		stateBet.winBookEventAmount = bookEvent.amount;
	},
	buyBonusTrigger: async (bookEvent: BookEventOfType<'buyBonusTrigger'>) => {
		// Only reset state here — the intro/transition is handled by freeSpinTrigger
		// or superBonusTrigger which fires after the tumble with bonus symbols.
		stateGame.auroraWildsSessionTotal = 0;
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
	},
	freeSpinTrigger: async (bookEvent: BookEventOfType<'freeSpinTrigger'>) => {
		// Reset session-wide wild tracking for new bonus
		stateGame.auroraWildsSessionTotal = 0;
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		// Store scatter tumble history for gravity animation during tumble sequence
		stateGame.scatterPositionHistory = bookEvent.positionHistory ?? [];
		// Animate scatters at their final post-tumble positions (backend now sends correct coords)
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin intro — crossfade base music → bonus intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_bonus_intro', duration: 500 });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
		// Crossfade bonus intro → freespin gameplay music
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_freespin', duration: 500 });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: 1, // resets when multiplier === 1
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerButtonShow' });
		eventEmitter.broadcast({ type: 'drawerFold' });
	},
	freeSpinRetrigger: async (bookEvent: BookEventOfType<'freeSpinRetrigger'>) => {
		// Do NOT reset session total on retrigger — wilds continue accumulating
		// Store scatter tumble history for gravity animation during tumble sequence
		stateGame.scatterPositionHistory = bookEvent.positionHistory ?? [];
		// Animate scatters at their final post-tumble positions
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin retrigger intro — crossfade to bonus intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_bonus_intro', duration: 500 });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
		// Crossfade bonus intro → freespin gameplay music
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_freespin', duration: 500 });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: 1, // resets when multiplier === 1
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
	},
	updateFreeSpin: async (bookEvent: BookEventOfType<'updateFreeSpin'>) => {
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: bookEvent.amount,
			total: bookEvent.total,
		});
	},
	updateGlobalMult: async (bookEvent: BookEventOfType<'updateGlobalMult'>) => {
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		if (bookEvent.globalMult === 1) {
			eventEmitter.broadcast({ type: 'tumbleWinAmountReset' });
		}
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: bookEvent.globalMult, // resets when multiplier === 1
		});
	},
	freeSpinEnd: async (bookEvent: BookEventOfType<'freeSpinEnd'>) => {
		// Fallback to winLevel 1 (zero/small, 0-duration) when winLevel is 0 or out of range
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel] ?? winLevelMap[1];

		// Reset wild release state
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		stateGame.auroraWildsSessionTotal = 0;

		// Reset buy-type bet modes (e.g. BONUS) so the next spin doesn't auto-buy again.
		// 'activate' modes (ANTE, Nx multipliers) persist intentionally — the player chose them.
		if (stateBetDerived.activeBetMode()?.type === 'buy') {
			stateBet.activeBetModeKey = 'BASE';
		}

		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		stateGame.gameType = 'basegame';
		// Play bonus exit music as we leave free spins
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_bonus_exit', duration: 500 });
		eventEmitter.broadcast({ type: 'boardFrameGlowHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'freeSpinOutroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_youwon_panel' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinOutroCountUp',
			amount: stateBet.winBookEventAmount,
			winLevelData,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'freeSpinOutroHide' });
		eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		// Crossfade bonus exit → base game music
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_main', duration: 500 });
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerUnfold' });
		eventEmitter.broadcast({ type: 'drawerButtonHide' });
	},
	tumbleBoard: async (bookEvent: BookEventOfType<'tumbleBoard'>) => {
		eventEmitter.broadcast({ type: 'boardHide' });
		eventEmitter.broadcast({ type: 'tumbleBoardShow' });
		eventEmitter.broadcast({ type: 'tumbleBoardInit', addingBoard: bookEvent.newSymbols });

		// 1. Play glow → vanish + explosion per cell — sound fires per-cell inside TumbleBoard
		await eventEmitter.broadcastAsync({
			type: 'tumbleBoardVanish',
			explodingPositions: bookEvent.explodingSymbols,
		});

		// 2. Reveal multiplier grid cells (pop in same stagger order) AFTER all vanish+explosions
		if (stateGame.pendingMultiplierGrid) {
			const gridToApply = stateGame.pendingMultiplierGrid;
			stateGame.pendingMultiplierGrid = null;
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
			await eventEmitter.broadcastAsync({ type: 'multiplierGridReveal', grid: gridToApply });
		}

		// 3. Remove exploded symbols, slide remaining down
		eventEmitter.broadcast({ type: 'tumbleBoardRemoveExploded' });
		await eventEmitter.broadcastAsync({ type: 'tumbleBoardSlideDown' });

		// 3. Settle board back to static
		eventEmitter.broadcast({
			type: 'boardSettle',
			board: stateGameDerived
				.tumbleBoardCombined()
				.map((tumbleReel) => tumbleReel.map((tumbleSymbol) => tumbleSymbol.rawSymbol)),
		});
		eventEmitter.broadcast({ type: 'tumbleBoardHide' });
		eventEmitter.broadcast({ type: 'boardShow' });
		eventEmitter.broadcast({ type: 'tumbleBoardReset' });
	},
	setWin: async (bookEvent: BookEventOfType<'setWin'>) => {
		// Use server-provided winLevel — math is the source of truth
		const winLevel = (bookEvent.winLevel || 1) as WinLevel;
		const winLevelData = winLevelMap[winLevel] ?? winLevelMap[1];

		// Skip win presentation entirely when there's nothing to show (e.g. winLevel 0/1).
		// This avoids a dead-state lag between tumble-end and a subsequent trigger event
		// (freeSpinTrigger/superBonusTrigger) that now appears after setWin in the new math flow.
		if (!winLevelData.presentDuration) {
			return;
		}

		eventEmitter.broadcast({ type: 'winShow' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'winUpdate',
			amount: bookEvent.amount,
			winLevelData,
		});
		winLevelSoundsStop();
		// Restore the appropriate music after win presentation
		if (stateBet.activeBetModeKey === 'SUPERSPIN' || isFreegameType(stateGame.gameType)) {
			eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_freespin', duration: 500 });
		} else {
			eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_main', duration: 500 });
		}
		eventEmitter.broadcast({ type: 'winHide' });
	},
	updateGrid: async (bookEvent: BookEventOfType<'updateGrid'>) => {
		// If the incoming grid matches what's already displayed (e.g. the initial
		// grid that was revealed during spinWithMultipliers), skip it — no need
		// to re-animate cells that are already at the correct multiplier.
		if (gridsMatch(stateGame.multiplierGrid, bookEvent.gridMultipliers)) {
			return;
		}

		// Store pending grid - will be applied after explosion animation in tumbleBoard
		stateGame.pendingMultiplierGrid = bookEvent.gridMultipliers;
	},
	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		// Note: multiplierGridClear is NOT called here - grid persists until next spin
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		// Tumble win total stays visible — it will be hidden at next spin start
		// (no blocking delay so the player can immediately press spin)
		// Clear any remaining aurora overlays at end of cascade
		eventEmitter.broadcast({ type: 'auroraCellsClear' });
		stateGame.auroraPositions = [];
		// Mark spin as ended (wild counter will fade out)
		stateGame.spinActive = false;
	},
	// aurora
	auroraReveal: async (bookEvent: BookEventOfType<'auroraReveal'>) => {
		// Store aurora positions in state for reference by later auroraExplode events
		stateGame.auroraPositions = bookEvent.positions;
		// Show aurora overlays — these are the canonical positions from the math engine
		eventEmitter.broadcast({ type: 'auroraCellsReveal', positions: bookEvent.positions });
	},
	auroraMeterUpdate: async (bookEvent: BookEventOfType<'auroraMeterUpdate'>) => {
		// Update meter state — UI component can derive from this
		stateGame.auroraMeterTotal = bookEvent.meterTotal;
	},
	auroraExplode: async (bookEvent: BookEventOfType<'auroraExplode'>) => {
		// Play explosion animation on the consumed aurora cells (async — waits for animation)
		await eventEmitter.broadcastAsync({ type: 'auroraCellsExplode', positions: bookEvent.positions });
		// Remove exploded positions from state
		const explodeKeys = new Set(bookEvent.positions.map((p) => `${p.reel}_${p.row}`));
		stateGame.auroraPositions = stateGame.auroraPositions.filter(
			(p) => !explodeKeys.has(`${p.reel}_${p.row}`),
		);
	},
	auroraWildPlace: async (bookEvent: BookEventOfType<'auroraWildPlace'>) => {
		const { reel, row } = bookEvent.position;
		if (!stateGame.board[reel]) {
			console.error(`[auroraWildPlace] ❌ reel ${reel} does not exist! board has ${stateGame.board.length} reels`);
			return;
		}
		if (!stateGame.board[reel].reelState.symbols[row]) {
			console.error(`[auroraWildPlace] ❌ reel[${reel}][${row}] does not exist! reel has ${stateGame.board[reel].reelState.symbols.length} symbols`);
			return;
		}
		const reelSymbol = stateGame.board[reel].reelState.symbols[row];

		// Track aurora wild position for connected-wild counting
		stateGame.auroraWildPositions = [...stateGame.auroraWildPositions, { reel, row }];

		// Clear any pending skip from previous placement
		stateGame.auroraWildSkipRequested = false;

		// 1. Play border-trace + flash animation on the target cell (async — waits for full anim)
		eventEmitter.broadcast({ type: 'soundOnceWithRate', name: 'wild_placement', rate: 1.0, volume: 0.4 });
		await eventEmitter.broadcastAsync({ type: 'wildPlacementAnimate', position: { reel, row } });

		// 2. Swap to wild symbol (the flash has already happened, so the swap feels like a reveal)
		reelSymbol.rawSymbol = { name: 'W' as any, wild: true };
		reelSymbol.symbolState = 'land';

		// 3. Detect wild release from meterBefore > 0 (no separate wildRelease event in some data formats)
		//    Use server-authoritative meterAfter to update session total
		if (bookEvent.meterBefore != null && bookEvent.meterBefore > 0) {
			if (!stateGame.isWildRelease) {
				stateGame.isWildRelease = true;
				stateGame.wildReleaseRemaining = bookEvent.meterBefore;
			}
			// Use server-authoritative meterAfter value
			stateGame.auroraWildsSessionTotal = bookEvent.meterAfter;
			if (stateGame.wildReleaseRemaining > 0) {
				stateGame.wildReleaseRemaining--;
			}
		}

		// 4. Brief pause to let player see the wild in place + constellation decrement
		//    Skip immediately if player clicked/pressed space
		if (!stateGame.auroraWildSkipRequested) {
			await new Promise<void>((r) => {
				const timeout = setTimeout(r, 450 / stateBetDerived.timeScale());
				const checkSkip = () => {
					if (stateGame.auroraWildSkipRequested) {
						clearTimeout(timeout);
						r();
					} else {
						rafId = requestAnimationFrame(checkSkip);
					}
				};
				let rafId = requestAnimationFrame(checkSkip);
			});
		}

		// 5. Settle to static so the next winInfo can transition to 'win' and trigger oncomplete
		reelSymbol.symbolState = 'static';
		stateGame.auroraWildSkipRequested = false;
	},
	auroraSpinStart: async (bookEvent: BookEventOfType<'auroraSpinStart'>) => {
		// Signal that the Final Aurora Spin is beginning — wilds collected during
		// the bonus round will now be placed. Prepare wild release state.
		stateGame.isWildRelease = true;
		stateGame.wildReleaseRemaining = bookEvent.totalWildsCollected;
		stateGame.spinActive = true;
	},
	wildRelease: async (bookEvent: BookEventOfType<'wildRelease'>) => {
		// Enter wild release phase — the session total becomes the starting count
		// and counts down as each wild is placed
		stateGame.isWildRelease = true;
		stateGame.wildReleaseRemaining = bookEvent.wildsToPlace;
		stateGame.spinActive = true;
	},
	wildMeterUpdate: async (bookEvent: BookEventOfType<'wildMeterUpdate'>) => {
		// Update session total from the server-authoritative meterAfter value
		stateGame.auroraWildsSessionTotal = bookEvent.meterAfter;
		// Play a sound to acknowledge the bank increase.
		if (bookEvent.delta > 0) {
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_win' });
		}
	},
	winCapReached: async (bookEvent: BookEventOfType<'winCapReached'>) => {
		// Win cap hit (25,000× bet) — tumbles stop. No special presentation needed beyond
		// the normal setWin / freeSpinEnd flow that follows.
	},
	superBonusTrigger: async (bookEvent: BookEventOfType<'superBonusTrigger'>) => {
		// Reset session-wide wild tracking for new bonus
		stateGame.auroraWildsSessionTotal = 0;
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		// Store scatter tumble history for gravity animation during tumble sequence
		stateGame.scatterPositionHistory = bookEvent.positionHistory ?? [];
		// Animate scatters at their final post-tumble positions
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// Crossfade base music → bonus intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_bonus_intro', duration: 500 });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
		// Crossfade bonus intro → freespin gameplay music
		eventEmitter.broadcast({ type: 'soundMusicCrossfade', name: 'bgm_freespin', duration: 500 });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: 1,
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerButtonShow' });
		eventEmitter.broadcast({ type: 'drawerFold' });
	},
	// customised
	createBonusSnapshot: async (bookEvent: BookEventOfType<'createBonusSnapshot'>) => {
		const { bookEvents } = bookEvent;

		function findLastBookEvent<T>(type: T) {
			return _.findLast(bookEvents, (bookEvent) => bookEvent.type === type) as
				| BookEventOfType<T>
				| undefined;
		}

		const lastFreeSpinTriggerEvent = findLastBookEvent('freeSpinTrigger' as const);
		const lastUpdateFreeSpinEvent = findLastBookEvent('updateFreeSpin' as const);
		const lastSetTotalWinEvent = findLastBookEvent('setTotalWin' as const);
		const lastUpdateGlobalMultEvent = findLastBookEvent('updateGlobalMult' as const);

		if (lastFreeSpinTriggerEvent) await playBookEvent(lastFreeSpinTriggerEvent, { bookEvents });
		if (lastUpdateFreeSpinEvent) playBookEvent(lastUpdateFreeSpinEvent, { bookEvents });
		if (lastSetTotalWinEvent) playBookEvent(lastSetTotalWinEvent, { bookEvents });
		if (lastUpdateGlobalMultEvent) playBookEvent(lastUpdateGlobalMultEvent, { bookEvents });
	},
};
