import { type CascadingReelSymbolState } from 'utils-slots';
import type config from './config';

export type SymbolName = keyof typeof config.symbols;
export type RawSymbol = { name: SymbolName; multiplier?: number; scatter?: boolean; aurora?: boolean; wild?: boolean };
export type BetMode = keyof typeof config.betModes;
export type GameType = keyof typeof config.paddingReels;

/** True for any game type that is a free-spin/bonus round (music stays on bgm_freespin). */
export const isFreegameType = (gameType: GameType | string): boolean =>
	gameType === 'freegame' ||
	gameType === 'freegame_wild_release' ||
	gameType === 'super' ||
	gameType === 'super_wild_release';

export const SYMBOL_STATES = [
	'static',
	'spin',
	'land',
	'win',
	'postWinStatic',
	'explosion',
] as const;

export type SymbolState = CascadingReelSymbolState | (typeof SYMBOL_STATES)[number];

export type Position = {
	reel: number;
	row: number;
};
