import _ from 'lodash';

import { recordBookEvent, checkIsMultipleRevealEvents, type BookEventHandlerMap } from 'utils-book';
import { stateBet } from 'state-shared';

import { eventEmitter } from './eventEmitter';
import { playBookEvent } from './utils';
import { winLevelMap, type WinLevel, type WinLevelData } from './winLevelMap';
import { stateGame, stateGameDerived } from './stateGame.svelte';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';
import type { Position } from './types';

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

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>, { bookEvents }: BookEventContext) => {
		console.log(`[bookEventHandlerMap] 🎰 REVEAL at ${Date.now()} - new spin starting`);
		eventEmitter.broadcast({ type: 'tumbleWinAmountReset' });
		// Reset aurora state for new spin
		stateGame.auroraPositions = [];
		// Clear multiplier grid only in base game — during free spins/super bonus,
		// multipliers persist across spins and are managed by updateGrid events
		const isBonusGame = checkIsMultipleRevealEvents({ bookEvents });
		if (!isBonusGame) {
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
		await stateGameDerived.enhancedBoard.spin({ revealEvent: bookEvent });
		eventEmitter.broadcast({ type: 'soundScatterCounterClear' });
	},
	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		console.log(`[bookEventHandlerMap] 🏆 WIN_INFO at ${Date.now()}`, { totalWin: bookEvent.totalWin });
		const promise1 = async () => {
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_winlevel_small' });
			await animateSymbols({ positions: _.flatten(bookEvent.wins.map((win) => win.positions)) });
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
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];

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
		// Store pending grid - will be applied after explosion animation in tumbleBoard
		const multiplierCount = bookEvent.gridMultipliers.flat().filter(m => m > 1).length;
		console.log(`[bookEventHandlerMap] 📊 UPDATE_GRID at ${Date.now()}`, { multiplierCount, grid: bookEvent.gridMultipliers });
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
		console.log(`[bookEventHandlerMap] 🃏 AURORA_WILD_PLACE at ${Date.now()}`, { position: bookEvent.position, meterBefore: bookEvent.meterBefore, meterAfter: bookEvent.meterAfter });
		// Place wild symbol on the board at the given position with a brief animation
		const { reel, row } = bookEvent.position;
		const reelSymbol = stateGame.board[reel].reelState.symbols[row];

		// Swap to wild and trigger land animation
		reelSymbol.rawSymbol = { name: 'W' as any, wild: true };
		reelSymbol.symbolState = 'land';

		// Brief delay between wild placements so they don't all appear at once
		await new Promise((r) => setTimeout(r, 120));
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
