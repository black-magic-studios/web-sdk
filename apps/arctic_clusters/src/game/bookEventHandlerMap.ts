import _ from 'lodash';

import { recordBookEvent, checkIsMultipleRevealEvents, type BookEventHandlerMap } from 'utils-book';
import { stateBet } from 'state-shared';
import { waitForResolve } from 'utils-shared/wait';
import { BOOK_AMOUNT_MULTIPLIER } from 'constants-shared/bet';

import { eventEmitter } from './eventEmitter';
import { playBookEvent } from './utils';
import { winLevelMap, type WinLevel, type WinLevelData } from './winLevelMap';
import { stateGame, stateGameDerived } from './stateGame.svelte';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';
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
	if (stateBet.activeBetModeKey === 'SUPERSPIN' || stateGame.gameType === 'freegame') {
		// check if SUPERSPIN, when finishing a bet.
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
	} else {
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_main' });
	}
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
	console.log(`[spinWithMultipliers] 🎰 Starting multiplier spin at ${Date.now()}`);

	// 1. Start clearing old symbols
	await stateGameDerived.enhancedBoard.preSpin({});

	// 2. Wait for all reels to finish falling out (hanging state)
	await Promise.all(
		stateGame.board.map(async (reel) => {
			await waitForResolve((resolve) => (reel.reelState.readyToSpin = resolve));
		}),
	);
	console.log(`[spinWithMultipliers] ✅ Board empty at ${Date.now()}`);

	// 3. Reveal multiplier grid (only changed cells will pop)
	eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
	await eventEmitter.broadcastAsync({ type: 'multiplierGridReveal', grid: initialGrid });
	console.log(`[spinWithMultipliers] ✅ Grid reveal complete at ${Date.now()}`);

	// 4. Drop new symbols (spin() will re-check readyToSpin but the $effect
	//    fires immediately since reels are still in 'hanging' state)
	await stateGameDerived.enhancedBoard.spin({ revealEvent });
	console.log(`[spinWithMultipliers] ✅ Symbols landed at ${Date.now()}`);
};

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>, { bookEvents }: BookEventContext) => {
		const rt0 = performance.now();
		console.log(`[bookEventHandlerMap] 🎰 REVEAL at ${Date.now()} - new spin starting`, {
			gameType: bookEvent.gameType,
			boardReels: bookEvent.board.length,
			boardRows: bookEvent.board[0]?.length,
			paddingPositions: bookEvent.paddingPositions,
			anticipation: bookEvent.anticipation,
		});
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
			console.log(`[bookEventHandlerMap] 🧹 Broadcasting multiplierGridClear at ${Date.now()}`);
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

		console.log(`[reveal] 🔍 pre-spin state: isMultMode=${isMultMode}, isBonusGame=${isBonusGame}, gameType=${stateGame.gameType} t=+${(performance.now()-rt0).toFixed(0)}ms`);
		// Log board reel states before spin
		stateGame.board.forEach((reel, i) => {
			console.log(`[reveal] reel[${i}] symbolCount=${reel.reelState.symbols.length} states=[${reel.reelState.symbols.map(s => s.symbolState).join(',')}]`);
		});

		if (isMultMode) {
			// Multiplier mode: clear board → show grid (diff) → drop symbols
			// Works for both base game and bonus game spins — the grid reveal
			// handler skips cells that already match, so repeated spins are no-ops.
			console.log(`[reveal] ⚡ spinWithMultipliers path t=+${(performance.now()-rt0).toFixed(0)}ms`);
			console.log(`[reveal] 📊 initialGrid from board:`, JSON.stringify(initialGrid));
			console.log(`[reveal] 📊 currentGrid (stateGame):`, JSON.stringify(stateGame.multiplierGrid));
			console.log(`[reveal] 📊 previousGrid (stateGame):`, JSON.stringify(stateGame.multiplierPreviousGrid));
			// Log cells that differ between current displayed grid and new reveal grid
			const diffs: string[] = [];
			for (let reel = 0; reel < initialGrid.length; reel++) {
				for (let row = 0; row < initialGrid[reel].length; row++) {
					const cur = stateGame.multiplierGrid[reel]?.[row] ?? 0;
					const next = initialGrid[reel][row];
					if (cur !== next) {
						diffs.push(`[${reel},${row}]: ${cur}→${next}`);
					}
				}
			}
			if (diffs.length > 0) {
				console.log(`[reveal] ⚠️ Grid diffs (current→new): ${diffs.join(', ')}`);
			} else {
				console.log(`[reveal] ✅ Grid unchanged — no diffs`);
			}
			await spinWithMultipliers({ revealEvent: bookEvent, initialGrid });
		} else {
			// Normal spin (no multiplier data in board)
			console.log(`[reveal] 🔄 enhancedBoard.spin() path t=+${(performance.now()-rt0).toFixed(0)}ms`);
			await stateGameDerived.enhancedBoard.spin({ revealEvent: bookEvent });
		}
		console.log(`[reveal] ✅ spin complete t=+${(performance.now()-rt0).toFixed(0)}ms`);
		eventEmitter.broadcast({ type: 'soundScatterCounterClear' });
	},
	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		console.log(`[bookEventHandlerMap] 🏆 WIN_INFO at ${Date.now()}`, { totalWin: bookEvent.totalWin });

		// Count aurora wilds that are part of winning clusters
		// During wild release, do NOT accumulate — the session total is frozen and only decrements
		console.log(`[winInfo] aurora check: wildPositions=${stateGame.auroraWildPositions.length}, isWildRelease=${stateGame.isWildRelease}, sessionTotal=${stateGame.auroraWildsSessionTotal}`);
		if (stateGame.auroraWildPositions.length > 0 && !stateGame.isWildRelease) {
			const allWinPositions = _.flatten(bookEvent.wins.map((win) => win.positions));
			const winPosKeys = new Set(allWinPositions.map((p) => `${p.reel}_${p.row}`));
			let newConnected = 0;
			for (const wp of stateGame.auroraWildPositions) {
				if (winPosKeys.has(`${wp.reel}_${wp.row}`)) {
					newConnected++;
				}
			}
			// Accumulate: add newly connected wilds to the per-spin count AND session total
			const added = newConnected - stateGame.auroraWildsConnected;
			if (added > 0) {
				stateGame.auroraWildsConnected = newConnected;
				stateGame.auroraWildsSessionTotal += added;
			}
		}

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
			console.log(`[bookEventHandlerMap] 🏆 WIN_INFO animation complete at ${Date.now()}`);
		};

		const promise2 = async () => {
			await eventEmitter.broadcastAsync({
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
		};

		await Promise.all([promise1(), promise2()]);
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
	freeSpinTrigger: async (bookEvent: BookEventOfType<'freeSpinTrigger'>) => {
		// Reset session-wide wild tracking for new bonus
		stateGame.auroraWildsSessionTotal = 0;
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		// animate scatters
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
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
	freeSpinRetrigger: async (bookEvent: BookEventOfType<'freeSpinTrigger'>) => {
		// Do NOT reset session total on retrigger — wilds continue accumulating
		// animate scatters
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
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
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];

		// Reset wild release state
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		stateGame.auroraWildsSessionTotal = 0;

		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		stateGame.gameType = 'basegame';
		eventEmitter.broadcast({ type: 'boardFrameGlowHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'freeSpinOutroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_youwon_panel' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinOutroCountUp',
			amount: bookEvent.amount,
			winLevelData,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'freeSpinOutroHide' });
		eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerUnfold' });
		eventEmitter.broadcast({ type: 'drawerButtonHide' });
	},
	tumbleBoard: async (bookEvent: BookEventOfType<'tumbleBoard'>) => {
		const tb0 = performance.now();
		console.log(`[bookEventHandlerMap] 🎢 TUMBLE_BOARD start t=0ms | exploding=${bookEvent.explodingSymbols.length} | pendingGrid=${!!stateGame.pendingMultiplierGrid}`);
		eventEmitter.broadcast({ type: 'boardHide' });
		eventEmitter.broadcast({ type: 'tumbleBoardShow' });
		eventEmitter.broadcast({ type: 'tumbleBoardInit', addingBoard: bookEvent.newSymbols });
		console.log(`[bookEventHandlerMap] 🕐 init done t=${(performance.now()-tb0).toFixed(0)}ms — starting vanish`);

		// 1. Play glow → vanish + explosion per cell (all staggered inside TumbleBoard)
		await eventEmitter.broadcastAsync({
			type: 'tumbleBoardVanish',
			explodingPositions: bookEvent.explodingSymbols,
		});
		console.log(`[bookEventHandlerMap] ✅ Vanish + explosions complete t=${(performance.now()-tb0).toFixed(0)}ms`);

		// 2. Reveal multiplier grid cells (pop in same stagger order) AFTER all vanish+explosions
		if (stateGame.pendingMultiplierGrid) {
			const gridToApply = stateGame.pendingMultiplierGrid;
			stateGame.pendingMultiplierGrid = null;
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
			await eventEmitter.broadcastAsync({ type: 'multiplierGridReveal', grid: gridToApply });
			console.log(`[bookEventHandlerMap] ✅ Cell reveals complete t=${(performance.now()-tb0).toFixed(0)}ms`);
		}

		// 2. Remove exploded symbols, slide remaining down
		eventEmitter.broadcast({ type: 'tumbleBoardRemoveExploded' });
		console.log(`[bookEventHandlerMap] ⬇️ Starting slideDown t=${(performance.now()-tb0).toFixed(0)}ms`);
		await eventEmitter.broadcastAsync({ type: 'tumbleBoardSlideDown' });
		console.log(`[bookEventHandlerMap] ⬇️ SlideDown complete t=${(performance.now()-tb0).toFixed(0)}ms`);

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

		console.log(`[bookEventHandlerMap] 🎢 TUMBLE_BOARD complete t=${(performance.now()-tb0).toFixed(0)}ms`);
	},
	setWin: async (bookEvent: BookEventOfType<'setWin'>) => {
		// Compute win level client-side from win/bet ratio (ignore RGS winLevel)
		const winLevelData = getWinLevelFromAmount(bookEvent.amount);

		eventEmitter.broadcast({ type: 'winShow' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'winUpdate',
			amount: bookEvent.amount,
			winLevelData,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'winHide' });
	},
	updateGrid: async (bookEvent: BookEventOfType<'updateGrid'>) => {
		const multiplierCount = bookEvent.gridMultipliers.flat().filter(m => m > 1).length;
		console.log(`[bookEventHandlerMap] 📊 UPDATE_GRID at ${Date.now()}`, { multiplierCount, grid: bookEvent.gridMultipliers });

		// If the incoming grid matches what's already displayed (e.g. the initial
		// grid that was revealed during spinWithMultipliers), skip it — no need
		// to re-animate cells that are already at the correct multiplier.
		if (gridsMatch(stateGame.multiplierGrid, bookEvent.gridMultipliers)) {
			console.log(`[bookEventHandlerMap] 📊 UPDATE_GRID skipped — grid unchanged`);
			return;
		}

		// Store pending grid - will be applied after explosion animation in tumbleBoard
		stateGame.pendingMultiplierGrid = bookEvent.gridMultipliers;
	},
	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		console.log(`[bookEventHandlerMap] 🏁 FINAL_WIN at ${Date.now()} - cascade sequence ended`);
		// Note: multiplierGridClear is NOT called here - grid persists until next spin
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
		// Clear any remaining aurora overlays at end of cascade
		eventEmitter.broadcast({ type: 'auroraCellsClear' });
		stateGame.auroraPositions = [];
		// Mark spin as ended (wild counter will fade out)
		stateGame.spinActive = false;
	},
	// aurora
	auroraReveal: async (bookEvent: BookEventOfType<'auroraReveal'>) => {
		console.log(`[bookEventHandlerMap] ✨ AURORA_REVEAL at ${Date.now()}`, { positions: bookEvent.positions });
		// Store aurora positions in state for reference by later auroraExplode events
		stateGame.auroraPositions = bookEvent.positions;
		// Show aurora overlays — these are the canonical positions from the math engine
		eventEmitter.broadcast({ type: 'auroraCellsReveal', positions: bookEvent.positions });
	},
	auroraMeterUpdate: async (bookEvent: BookEventOfType<'auroraMeterUpdate'>) => {
		console.log(`[bookEventHandlerMap] 🌊 AURORA_METER_UPDATE at ${Date.now()}`, { cellsCollected: bookEvent.cellsCollected, meterTotal: bookEvent.meterTotal });
		// Update meter state — UI component can derive from this
		stateGame.auroraMeterTotal = bookEvent.meterTotal;
	},
	auroraExplode: async (bookEvent: BookEventOfType<'auroraExplode'>) => {
		console.log(`[bookEventHandlerMap] 💫 AURORA_EXPLODE at ${Date.now()}`, { positions: bookEvent.positions });
		// Play explosion animation on the consumed aurora cells (async — waits for animation)
		await eventEmitter.broadcastAsync({ type: 'auroraCellsExplode', positions: bookEvent.positions });
		// Remove exploded positions from state
		const explodeKeys = new Set(bookEvent.positions.map((p) => `${p.reel}_${p.row}`));
		stateGame.auroraPositions = stateGame.auroraPositions.filter(
			(p) => !explodeKeys.has(`${p.reel}_${p.row}`),
		);
	},
	auroraWildPlace: async (bookEvent: BookEventOfType<'auroraWildPlace'>) => {
		console.log(`[bookEventHandlerMap] 🃏 AURORA_WILD_PLACE at ${Date.now()}`, {
			position: bookEvent.position,
			meterBefore: bookEvent.meterBefore,
			meterAfter: bookEvent.meterAfter,
			boardReelCount: stateGame.board.length,
			reelSymbolCount: stateGame.board[bookEvent.position.reel]?.reelState.symbols.length,
			currentSymbol: stateGame.board[bookEvent.position.reel]?.reelState.symbols[bookEvent.position.row]?.rawSymbol,
			currentState: stateGame.board[bookEvent.position.reel]?.reelState.symbols[bookEvent.position.row]?.symbolState,
		});
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

		// 1. Play border-trace + flash animation on the target cell (async — waits for full anim)
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_landing' });
		await eventEmitter.broadcastAsync({ type: 'wildPlacementAnimate', position: { reel, row } });

		// 2. Swap to wild symbol (the flash has already happened, so the swap feels like a reveal)
		reelSymbol.rawSymbol = { name: 'W' as any, wild: true };
		reelSymbol.symbolState = 'land';

		// 3. Detect wild release from meterBefore > 0 (no separate wildRelease event in some data formats)
		//    When meterBefore > 0 this is a wild release placement → set flag and decrement
		if (bookEvent.meterBefore != null && bookEvent.meterBefore > 0) {
			if (!stateGame.isWildRelease) {
				stateGame.isWildRelease = true;
				stateGame.wildReleaseRemaining = bookEvent.meterBefore;
				console.log(`[auroraWildPlace] 🌟 Detected wild release start: meterBefore=${bookEvent.meterBefore}`);
			}
			if (stateGame.auroraWildsSessionTotal > 0) {
				stateGame.auroraWildsSessionTotal--;
			}
			if (stateGame.wildReleaseRemaining > 0) {
				stateGame.wildReleaseRemaining--;
			}
			console.log(`[auroraWildPlace] 📉 wildRelease decrement: remaining=${stateGame.wildReleaseRemaining}, sessionTotal=${stateGame.auroraWildsSessionTotal}`);
		}

		// 4. Brief pause to let player see the wild in place + constellation decrement
		await new Promise((r) => setTimeout(r, 450));

		// 5. Settle to static so the next winInfo can transition to 'win' and trigger oncomplete
		reelSymbol.symbolState = 'static';
		console.log(`[auroraWildPlace] ✅ wild placed at [${reel}][${row}], state now: ${reelSymbol.symbolState}`);
	},
	wildRelease: async (bookEvent: BookEventOfType<'wildRelease'>) => {
		console.log(`[bookEventHandlerMap] 🌟 WILD_RELEASE at ${Date.now()}`, { wildsToPlace: bookEvent.wildsToPlace });
		// Enter wild release phase — the session total becomes the starting count
		// and counts down as each wild is placed
		stateGame.isWildRelease = true;
		stateGame.wildReleaseRemaining = bookEvent.wildsToPlace;
		stateGame.spinActive = true;
	},
	superBonusTrigger: async (bookEvent: BookEventOfType<'superBonusTrigger'>) => {
		// Reset session-wide wild tracking for new bonus
		stateGame.auroraWildsSessionTotal = 0;
		stateGame.isWildRelease = false;
		stateGame.wildReleaseRemaining = 0;
		// Super bonus trigger — same flow as freeSpinTrigger (SS scatter instead of S)
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
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
