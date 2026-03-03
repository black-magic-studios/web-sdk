import type { BaseBet } from 'utils-bet';
import { stateMeta } from './stateMeta.svelte';
import { stateConfig } from './stateConfig.svelte';

export type Currency = string;
export type BetToResume = BaseBet | null;
export type BetModeKey = string;

export const stateBet = $state({
	currency: 'USD' as Currency,
	balanceAmount: 0,
	betAmount: 1,
	wageredBetAmount: 1,
	betToResume: null as BetToResume,
	activeBetModeKey: 'BASE' as BetModeKey,
	winBookEventAmount: 0,
	autoSpinsLoss: 0,
	autoSpinsCounter: 0,
	autoSpinsLossLimitAmount: Infinity,
	autoSpinsSingleWinLimitAmount: Infinity,
	stopOnBonus: false,
	lastSpinHadBonus: false,
	isSpaceHold: false,
	isTurbo: false,
	/** 3-mode speed: 0 = normal, 1 = turbo (1.5×), 2 = super turbo (2× + skip win anims) */
	speedMode: 0 as 0 | 1 | 2,
});

const correctBetAmount = (value: number) => {
	if (value <= 0) return 0;
	// Only allow values that exist in the RGS betLevels list
	const options: number[] = stateConfig.betAmountOptions;
	if (options.length > 0 && !options.includes(value)) {
		// Snap to the nearest valid bet level
		const closest = options.reduce((prev, curr) =>
			Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
		);
		return closest;
	}
	return value;
};

const setBetAmount = (value: number) => {
	stateBet.betAmount = correctBetAmount(value);
};

const updateBetAmount = (update: (value: number) => number) => {
	stateBet.betAmount = correctBetAmount(update(stateBet.betAmount));
};

let isTurboLocked = false;

const updateIsTurbo = (value: boolean, options: { persistent: boolean }) => {
	const { persistent } = options;

	if (!persistent && isTurboLocked) return;
	if (persistent) isTurboLocked = value;

	stateBet.isTurbo = value;
	// Keep speedMode in sync for apps that still use the binary toggle
	if (!value) stateBet.speedMode = 0;
	else if (stateBet.speedMode === 0) stateBet.speedMode = 1;
};

const updateSpeedMode = (mode: 0 | 1 | 2, options: { persistent: boolean }) => {
	const { persistent } = options;
	const turboOn = mode >= 1;

	if (!persistent && isTurboLocked) return;
	if (persistent) isTurboLocked = turboOn;

	stateBet.speedMode = mode;
	stateBet.isTurbo = turboOn;
};

const activeBetMode = () => stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toUpperCase()]
	?? stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toLowerCase()]
	?? null;
const isContinuousBet = () => stateBet.autoSpinsCounter > 1 || stateBet.isSpaceHold;
/** Speed multiplier: normal = 1, turbo = 1.5, super turbo = 2 */
const timeScale = () => {
	if (stateBet.speedMode === 2) return 2;
	if (stateBet.speedMode === 1) return 1.5;
	return stateBet.isTurbo ? 2 : 1; // fallback for apps using binary toggle
};
/** True when super turbo — skip symbol win animations, show only glow */
const skipWinAnimation = () => stateBet.speedMode === 2;
const betCostMultiplier = () =>
	stateBetDerived.activeBetMode().type === 'activate'
		? stateBetDerived.activeBetMode().costMultiplier
		: 1;
const betCost = () => stateBet.betAmount * betCostMultiplier();
const isBetCostAvailable = () => betCost() > 0 && betCost() <= stateBet.balanceAmount;
const hasAutoBetCounter = () => stateBet.autoSpinsCounter !== 0;

export const stateBetDerived = {
	setBetAmount,
	updateBetAmount,
	updateIsTurbo,
	updateSpeedMode,
	activeBetMode,
	isContinuousBet,
	timeScale,
	skipWinAnimation,
	betCost,
	isBetCostAvailable,
	hasAutoBetCounter,
};
