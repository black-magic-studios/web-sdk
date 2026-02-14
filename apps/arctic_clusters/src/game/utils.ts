import _ from 'lodash';
import { stateBet } from 'state-shared';
import { createPlayBookUtils } from 'utils-book';
import { createGetEmptyPaddedBoard } from 'utils-slots';

import {
	SYMBOL_WIDTH,
	SYMBOL_HEIGHT,
	SYMBOL_INFO_MAP,
	BOARD_DIMENSIONS,
	GRID_GAP_X,
	GRID_GAP_Y,
} from './constants';
import { eventEmitter } from './eventEmitter';
import type { Bet, BookEventOfType } from './typesBookEvent';
import { bookEventHandlerMap } from './bookEventHandlerMap';
import type { RawSymbol, SymbolState } from './types';

// general utils
export const { getEmptyBoard } = createGetEmptyPaddedBoard({ reelsDimensions: BOARD_DIMENSIONS });
export const { playBookEvent, playBookEvents } = createPlayBookUtils({ bookEventHandlerMap });
export const playBet = async (bet: Bet) => {
	stateBet.winBookEventAmount = 0;
	await playBookEvents(bet.state);
	eventEmitter.broadcast({ type: 'stopButtonEnable' });
};

// resume bet
const BOOK_EVENT_TYPES_TO_RESERVE_FOR_SNAPSHOT = [
	'updateGlobalMult',
	'freeSpinTrigger',
	'updateFreeSpin',
	'setTotalWin',
];

export const convertTorResumableBet = (betToResume: Bet) => {
	const resumingIndex = Number(betToResume.event);
	const bookEventsBeforeResume = betToResume.state.filter(
		(_, eventIndex) => eventIndex < resumingIndex,
	);
	const bookEventsAfterResume = betToResume.state.filter(
		(_, eventIndex) => eventIndex >= resumingIndex,
	);

	const bookEventToCreateSnapshot: BookEventOfType<'createBonusSnapshot'> = {
		index: 0,
		type: 'createBonusSnapshot',
		bookEvents: bookEventsBeforeResume.filter((bookEvent) =>
			BOOK_EVENT_TYPES_TO_RESERVE_FOR_SNAPSHOT.includes(bookEvent.type),
		),
	};

	const stateToResume = [bookEventToCreateSnapshot, ...bookEventsAfterResume];

	return { ...betToResume, state: stateToResume };
};

// ============================================================
// SYMBOL POSITION UTILS
// Legacy static versions (for components not yet migrated)
// ============================================================
export const getSymbolX = (reelIndex: number) => SYMBOL_WIDTH * (reelIndex + 0.5);
export const getSymbolY = (symbolIndexOfBoard: number) => (symbolIndexOfBoard + 0.5) * SYMBOL_HEIGHT;

// ============================================================
// DYNAMIC SYMBOL POSITION UTILS
// Use these with reactive dimensions from stateGameDerived
// ============================================================
export const getSymbolXDynamic = (reelIndex: number, symbolWidth: number) => 
	symbolWidth * (reelIndex + 0.5) + GRID_GAP_X * reelIndex;

export const getSymbolYDynamic = (symbolIndexOfBoard: number, symbolHeight: number) => 
	(symbolIndexOfBoard + 0.5) * symbolHeight + GRID_GAP_Y * symbolIndexOfBoard;

export const getSymbolKey = ({ rawSymbol }: { rawSymbol: RawSymbol }) => {
	// Only use multiplier suffix if the combined key exists in the symbol map.
	// Regular symbols (H1, L2, etc.) carry a `multiplier` field from the math SDK
	// to indicate cell multiplier state, but they don't have separate visual variants.
	if (rawSymbol.multiplier !== undefined) {
		const combinedKey = `${rawSymbol.name}_${rawSymbol.multiplier}` as keyof typeof SYMBOL_INFO_MAP;
		if (combinedKey in SYMBOL_INFO_MAP) {
			return combinedKey;
		}
	}
	return rawSymbol.name as keyof typeof SYMBOL_INFO_MAP;
};

export const getSymbolInfo = ({
	rawSymbol,
	state,
}: {
	rawSymbol: RawSymbol;
	state: SymbolState;
}) => {
	const symbolKey = getSymbolKey({ rawSymbol });
	return SYMBOL_INFO_MAP[symbolKey][state];
};
