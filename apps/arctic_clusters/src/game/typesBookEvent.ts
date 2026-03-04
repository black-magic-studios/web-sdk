import type { BetType } from 'rgs-requests';

import type { SymbolName, RawSymbol, GameType, Position } from './types';

type BookEventReveal = {
	index: number;
	type: 'reveal';
	board: RawSymbol[][];
	paddingPositions: number[];
	anticipation: number[];
	gameType: GameType;
};

type BookEventWinInfo = {
	index: number;
	type: 'winInfo';
	totalWin: number;
	wins: {
		symbol: SymbolName;
		win: number;
		positions: Position[];
		meta: {
			globalMult: number;
			clusterMult: number;
			winWithoutMult: number;
			overlay: Position;
		};
	}[];
};

type BookEventSetTumbleWin = {
	index: number;
	type: 'updateTumbleWin';
	amount: number;
};

type BookEventSetTotalWin = {
	index: number;
	type: 'setTotalWin';
	amount: number;
};

type BookEventFreeSpinTrigger = {
	index: number;
	type: 'freeSpinTrigger';
	totalFs: number;
	positions: Position[];
	/** Scatter positions at each tumble step: [0] = initial reveal, [1] = after 1st tumble, etc. */
	positionHistory: Position[][];
};

type BookEventUpdateFreeSpin = {
	index: number;
	type: 'updateFreeSpin';
	amount: number;
	total: number;
};

type BookEventUpdateGlobalMult = {
	index: number;
	type: 'updateGlobalMult';
	globalMult: number;
};

type BookEventFreeSpinEnd = {
	index: number;
	type: 'freeSpinEnd';
	amount: number;
	winLevel: number;
	totalWilds: number;
};

type BookEventTumbleBoard = {
	index: number;
	type: 'tumbleBoard';
	explodingSymbols: Position[];
	newSymbols: RawSymbol[][];
};

type BookEventFinalWin = {
	index: number;
	type: 'finalWin';
	amount: number;
};

type BookEventSetWin = {
	index: number;
	type: 'setWin';
	amount: number;
	winLevel: number;
};

// new
type BookEventUpdateGrid = {
	index: number;
	type: 'updateGrid';
	gridMultipliers: number[][];
};

type BookEventFreeSpinRetrigger = {
	index: number;
	type: 'freeSpinRetrigger';
	totalFs: number;
	positions: Position[];
	/** Scatter positions at each tumble step: [0] = initial reveal, [1] = after 1st tumble, etc. */
	positionHistory: Position[][];
};

type BookEventSuperBonusTrigger = {
	index: number;
	type: 'superBonusTrigger';
	totalFs: number;
	positions: Position[];
	/** Scatter positions at each tumble step: [0] = initial reveal, [1] = after 1st tumble, etc. */
	positionHistory: Position[][];
};

// aurora
type BookEventAuroraReveal = {
	index: number;
	type: 'auroraReveal';
	positions: Position[];
};

type BookEventAuroraMeterUpdate = {
	index: number;
	type: 'auroraMeterUpdate';
	cellsCollected: number;
	meterTotal: number;
};

type BookEventAuroraExplode = {
	index: number;
	type: 'auroraExplode';
	positions: Position[];
};

type BookEventAuroraWildPlace = {
	index: number;
	type: 'auroraWildPlace';
	position: Position;
	meterBefore: number;
	meterAfter: number;
};

type BookEventAuroraSpinStart = {
	index: number;
	type: 'auroraSpinStart';
	totalWildsCollected: number;
};

type BookEventWildRelease = {
	index: number;
	type: 'wildRelease';
	wildsToPlace: number;
};

type BookEventBuyBonusTrigger = {
	index: number;
	type: 'buyBonusTrigger';
	cost: number;
	totalFs: number;
};

type BookEventWildMeterUpdate = {
	index: number;
	type: 'wildMeterUpdate';
	delta: number;
	meterBefore: number;
	meterAfter: number;
	consumedPositions: Position[];
};

type BookEventWinCapReached = {
	index: number;
	type: 'winCapReached';
	cappedAmount: number;
};

// customised
type BookEventCreateBonusSnapshot = {
	index: number;
	type: 'createBonusSnapshot';
	bookEvents: BookEvent[];
};

export type BookEvent =
	| BookEventReveal
	| BookEventWinInfo
	| BookEventSetTumbleWin
	| BookEventSetTotalWin
	| BookEventFreeSpinTrigger
	| BookEventUpdateFreeSpin
	| BookEventUpdateGlobalMult
	| BookEventTumbleBoard
	| BookEventCreateBonusSnapshot
	| BookEventFinalWin
	| BookEventSetWin
	| BookEventFreeSpinEnd
	// new
	| BookEventUpdateGrid
	| BookEventFreeSpinRetrigger
	// aurora
	| BookEventAuroraReveal
	| BookEventAuroraMeterUpdate
	| BookEventAuroraExplode
	| BookEventAuroraWildPlace
	| BookEventAuroraSpinStart
	| BookEventWildRelease
	// super bonus
	| BookEventSuperBonusTrigger
	// buy bonus / wild meter / win cap
	| BookEventBuyBonusTrigger
	| BookEventWildMeterUpdate
	| BookEventWinCapReached
	// customised
	| BookEventCreateBonusSnapshot;

export type Bet = BetType<BookEvent>;
export type BookEventOfType<T> = Extract<BookEvent, { type: T }>;
export type BookEventContext = { bookEvents: BookEvent[] };
