import type { BetType } from 'rgs-requests';

import type { SymbolName, RawSymbol, GameType, Position } from './types';

// book events shared with scatter game
type BookEventReveal = {
	index: number;
	type: 'reveal';
	board: RawSymbol[][];
	paddingPositions?: number[];
	reelPositions?: number[];
	anticipation: number[];
	gameType: GameType;
	hostCell?: Position;
};

type BookEventHostInfection = {
	index: number;
	type: 'hostInfection';
	hostPosition: Position;
	infectedCells: Position[];
	germs: number[][];
};

type BookEventSetTotalWin = {
	index: number;
	type: 'setTotalWin';
	amount: number;
};

type BookEventFinalWin = {
	index: number;
	type: 'finalWin';
	amount: number;
};

type BookEventFreeSpinTrigger = {
	index: number;
	type: 'freeSpinTrigger';
	totalFs: number;
	positions: Position[];
};

type BookEventFreeSpinRetrigger = {
	index: number;
	type: 'freeSpinRetrigger';
	totalFs: number;
	positions: Position[];
};

type BookEventUpdateFreeSpin = {
	index: number;
	type: 'updateFreeSpin';
	amount: number;
	total: number;
};

type BookEventSetWin = {
	index: number;
	type: 'setWin';
	amount: number;
	winLevel: number;
};

type BookEventFreeSpinEnd = {
	index: number;
	type: 'freeSpinEnd';
	amount: number;
	winLevel: number;
	maxMitosisReached?: boolean;
};

type BookEventWinInfo = {
	index: number;
	type: 'winInfo';
	totalWin: number;
	wins: {
		symbol: SymbolName;
		matchingReels?: number;
		kind?: number;
		win: number;
		positions: Position[];
		meta: {
			basePay?: number;
			germMultiplier?: number;
			wayCount?: number;
			lineIndex?: number;
			multiplier?: number;
			winWithoutMult?: number;
			globalMult?: number;
			lineMultiplier?: number;
		};
	}[];
};

type BookEventUpdateGerms = {
	index: number;
	type: 'updateGerms';
	germs: number[][];
};

type BookEventMitosisRespin = {
	index: number;
	type: 'mitosisRespin';
	mitosisPositions: {
		reel: number;
		row: number;
		germsBefore: number;
		germsAfter: number;
		newSymbol: SymbolName;
	}[];
	boardAfter: RawSymbol[][];
};

type BookEventUpdateRespinWin = {
	index: number;
	type: 'updateRespinWin';
	amount: number;
};

type BookEventMitosis = {
	index: number;
	type: 'mitosis';
	mitosisPositions: {
		reel: number;
		row: number;
		germsBefore: number;
		germsAfter: number;
	}[];
	germs: number[][];
};

type BookEventRespin = {
	index: number;
	type: 'respin';
	respinPositions: {
		reel: number;
		row: number;
		newSymbol: SymbolName;
	}[];
	boardAfter: RawSymbol[][];
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
	| BookEventSetTotalWin
	| BookEventFreeSpinTrigger
	| BookEventFreeSpinRetrigger
	| BookEventUpdateFreeSpin
	| BookEventFinalWin
	| BookEventSetWin
	| BookEventFreeSpinEnd
	| BookEventUpdateGerms
	| BookEventMitosisRespin
	| BookEventUpdateRespinWin
	| BookEventWinCapReached
	| BookEventHostInfection
	| BookEventMitosis
	| BookEventRespin
	| BookEventCreateBonusSnapshot;

export type Bet = BetType<BookEvent>;
export type BookEventOfType<T> = Extract<BookEvent, { type: T }>;
export type BookEventContext = { bookEvents: BookEvent[] };
