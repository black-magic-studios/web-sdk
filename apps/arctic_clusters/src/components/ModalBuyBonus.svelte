<script lang="ts">
	import { zIndex } from 'constants-shared/zIndex';
	import { stateBet } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { stateBonus } from 'components-ui-html/src/stateBonus.svelte';
	import { getContextEventEmitter } from 'utils-event-emitter';

	import PopupLight from './PopupLight.svelte';

	type Props = {
		show: boolean;
		onclose: () => void;
	};

	const props: Props = $props();
	const { eventEmitter } = getContextEventEmitter();

	// ── Multiplier mode definitions ──
	const MULT_MODES = [
		{ key: 'M2X', label: '2x', cost: 2.9 },
		{ key: 'M4X', label: '4x', cost: 5.8 },
		{ key: 'M8X', label: '8x', cost: 11.2 },
		{ key: 'M16X', label: '16x', cost: 23.0 },
		{ key: 'M32X', label: '32x', cost: 46.2 },
		{ key: 'M64X', label: '64x', cost: 90.6 },
		{ key: 'M128X', label: '128x', cost: 181.8 },
		{ key: 'M256X', label: '256x', cost: 354.5 },
		{ key: 'M512X', label: '512x', cost: 665.1 },
		{ key: 'M1024X', label: '1024x', cost: 1110.8 },
	] as const;

	let multIndex = $state(0);
	const currentMult = $derived(MULT_MODES[multIndex]);

	const multUp = () => {
		if (multIndex < MULT_MODES.length - 1) multIndex++;
	};
	const multDown = () => {
		if (multIndex > 0) multIndex--;
	};

	// ── Card actions ──
	const activateMode = (modeKey: string) => {
		stateBonus.selectedBetModeKey = modeKey;
		stateBet.activeBetModeKey = modeKey;
		eventEmitter.broadcast({ type: 'soundPressGeneral' as any });
		props.onclose();
	};

	const buyMode = (modeKey: string) => {
		stateBonus.selectedBetModeKey = modeKey;
		stateBet.activeBetModeKey = modeKey;
		eventEmitter.broadcast({ type: 'bet' as any });
		eventEmitter.broadcast({ type: 'soundPressGeneral' as any });
		props.onclose();
	};

	// ── Computed costs ──
	const anteCost = $derived(stateBet.betAmount * 1.2);
	const multCost = $derived(stateBet.betAmount * currentMult.cost);
	const bonusCost = $derived(stateBet.betAmount * 100);
	const superCost = $derived(stateBet.betAmount * 200);

	const canAfford = (cost: number) => stateBet.betAmount > 0 && stateBet.balanceAmount >= cost;
</script>

{#if props.show}
	<PopupLight zIndex={zIndex.modal} onclose={props.onclose}>
		<div class="modal-content">
			<div class="cards-row">
				<!-- Card 1: Extra Chance -->
				<button
					class="card"
					class:disabled={!canAfford(anteCost)}
					disabled={!canAfford(anteCost)}
					onclick={() => activateMode('ANTE')}
				>
					<span class="card-title">EXTRA CHANCE</span>
					<span class="card-desc">Extra chance to trigger the bonus each spin.</span>
					<span class="card-price">{numberToCurrencyString(anteCost)}</span>
					<span class="card-btn">ACTIVATE</span>
				</button>

				<!-- Card 2: xN Spins (multiplier selector) -->
				<div class="card mult-card">
					<span class="card-title">x{currentMult.label.replace('x', '')} SPINS</span>
					<span class="card-desc">Every cell starts with a {currentMult.label} multiplier.</span>

					<div class="mult-selector">
						<button class="arrow-btn" onclick={multDown} disabled={multIndex === 0}>&#9660;</button>
						<span class="mult-value">{currentMult.label}</span>
						<button class="arrow-btn" onclick={multUp} disabled={multIndex === MULT_MODES.length - 1}>&#9650;</button>
					</div>

					<span class="card-price">{numberToCurrencyString(multCost)}</span>
					<button
						class="card-btn activate-btn"
						class:disabled={!canAfford(multCost)}
						disabled={!canAfford(multCost)}
						onclick={() => activateMode(currentMult.key)}
					>ACTIVATE</button>
				</div>

				<!-- Card 3: Buy Bonus -->
				<button
					class="card"
					class:disabled={!canAfford(bonusCost)}
					disabled={!canAfford(bonusCost)}
					onclick={() => buyMode('BONUS')}
				>
					<span class="card-title">BUY BONUS</span>
					<span class="card-desc">Instantly trigger the free spins bonus round.</span>
					<span class="card-price">{numberToCurrencyString(bonusCost)}</span>
					<span class="card-btn">BUY</span>
				</button>

				<!-- Card 4: Buy Super Bonus -->
				<button
					class="card"
					class:disabled={!canAfford(superCost)}
					disabled={!canAfford(superCost)}
					onclick={() => buyMode('SUPER')}
				>
					<span class="card-title">BUY SUPER BONUS</span>
					<span class="card-desc">Trigger the enhanced free spins with higher multipliers.</span>
					<span class="card-price">{numberToCurrencyString(superCost)}</span>
					<span class="card-btn">BUY</span>
				</button>
			</div>
		</div>
	</PopupLight>
{/if}

<style lang="scss">
	.modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		z-index: 100;
		position: relative;
	}

	.cards-row {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 90vw;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem 0.75rem 0.6rem;
		width: 180px;
		min-height: 220px;
		border-radius: 12px;
		background: rgba(0, 20, 40, 0.7);
		border: 1px solid rgba(100, 200, 255, 0.2);
		color: white;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, transform 0.1s;
		font-family: 'proxima-nova', sans-serif;

		&:hover:not(.disabled) {
			background: rgba(20, 60, 100, 0.8);
			border-color: rgba(100, 200, 255, 0.5);
			transform: scale(1.03);
		}

		&:active:not(.disabled) {
			transform: scale(0.97);
		}

		&.disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.mult-card {
		cursor: default;

		&:hover {
			background: rgba(0, 20, 40, 0.7);
			border-color: rgba(100, 200, 255, 0.2);
			transform: none;
		}
	}

	.card-title {
		font-size: 1rem;
		font-weight: 700;
		text-align: center;
		line-height: 1.2;
		letter-spacing: 0.04em;
	}

	.card-desc {
		font-size: 0.72rem;
		text-align: center;
		opacity: 0.7;
		line-height: 1.35;
		flex: 1;
		display: flex;
		align-items: center;
	}

	.card-price {
		font-size: 1rem;
		font-weight: 600;
		color: #66ddaa;
		text-align: center;
	}

	.card-btn {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		padding: 0.35rem 1.2rem;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: transparent;
		color: white;
		cursor: pointer;
		transition: background 0.12s;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	// ── Multiplier selector ──
	.mult-selector {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.mult-value {
		font-size: 1.6rem;
		font-weight: 800;
		color: #88eeff;
		min-width: 4.5rem;
		text-align: center;
	}

	.arrow-btn {
		font-size: 1rem;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.08);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.12s;

		&:hover:not(:disabled) {
			background: rgba(255, 255, 255, 0.2);
		}

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}

	.activate-btn {
		width: 100%;
		text-align: center;

		&.disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}
</style>
