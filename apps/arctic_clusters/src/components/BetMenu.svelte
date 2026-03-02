<script lang="ts">
	import {
		stateBet,
		stateBetDerived,
		stateConfig,
	} from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';

	type Props = { show: boolean; onclose: () => void };
	let { show = $bindable(), onclose }: Props = $props();

	const context = getContext();

	const betOptions = $derived(stateConfig.betAmountOptions);
	const currentBetIndex = $derived(betOptions.indexOf(stateBet.betAmount));

	const betUp = () => {
		const idx = currentBetIndex;
		if (idx < betOptions.length - 1) {
			stateBetDerived.setBetAmount(betOptions[idx + 1]);
			context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
			if (stateBet.activeBetModeKey !== 'BASE') stateBet.activeBetModeKey = 'BASE';
		}
	};

	const betDown = () => {
		const idx = currentBetIndex;
		if (idx > 0) {
			stateBetDerived.setBetAmount(betOptions[idx - 1]);
			context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
			if (stateBet.activeBetModeKey !== 'BASE') stateBet.activeBetModeKey = 'BASE';
		}
	};

	const selectBet = (value: number) => {
		stateBetDerived.setBetAmount(value);
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		if (stateBet.activeBetModeKey !== 'BASE') stateBet.activeBetModeKey = 'BASE';
	};

	const isMaxValue = (value: number) => value === betOptions[betOptions.length - 1];
	const formatValue = (value: number) => {
		if (Math.abs(value) > 999999) return `${(Math.abs(value) / 1000000).toFixed(2)}M`;
		if (Math.abs(value) > 999) return `${(Math.abs(value) / 1000).toFixed(2)}K`;
		return Math.abs(value).toFixed(2);
	};

	const confirm = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		onclose();
	};
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onclose}></div>

	<div class="menu">
		<!-- HEADER -->
		<div class="header">
			<div class="title">SELECT YOUR BET</div>
		</div>

		<!-- BET TOGGLE (+/-) -->
		<div class="toggle-row">
			<button
				class="toggle-btn"
				class:disabled={currentBetIndex <= 0}
				onclick={betDown}
			>-</button>
			<span class="toggle-value">{numberToCurrencyString(stateBet.betAmount)}</span>
			<button
				class="toggle-btn"
				class:disabled={currentBetIndex >= betOptions.length - 1}
				onclick={betUp}
			>+</button>
		</div>

		<!-- BET OPTIONS GRID -->
		<div class="options-grid">
			{#each betOptions as option}
				<button
					class="option-chip"
					class:selected={stateBet.betAmount === option}
					onclick={() => selectBet(option)}
				>{isMaxValue(option) ? 'MAX' : formatValue(option)}</button>
			{/each}
		</div>

		<!-- CONFIRM BUTTON -->
		<button class="confirm-btn" onclick={confirm}>
			CONFIRM
		</button>
	</div>
{/if}

<style lang="scss">
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 998;
	}

	.menu {
		position: fixed;
		z-index: 999;
		bottom: calc(env(safe-area-inset-bottom, 0px) + 12%);
		right: 72px;
		display: flex;
		flex-direction: column;
		gap: 0;
		background: rgba(20, 20, 30, 0.92);
		border-radius: 14px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(120, 180, 220, 0.2);
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		min-width: 220px;
		max-width: 280px;
		animation: menuSlideIn 0.2s ease-out;
		padding-bottom: 6px;
	}

	@keyframes menuSlideIn {
		from { opacity: 0; transform: translateY(10px) scale(0.96); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	/* ── Header ── */
	.header {
		padding: 12px 14px 6px;
		text-align: center;
	}

	.title {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: rgba(144, 200, 232, 0.55);
	}

	/* ── Bet toggle row ── */
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 6px 14px 10px;
	}

	.toggle-btn {
		width: 32px;
		height: 32px;
		border: 1.5px solid rgba(120, 180, 220, 0.3);
		border-radius: 8px;
		background: rgba(80, 160, 220, 0.35);
		color: #ffffff;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 18px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;

		&:hover {
			background: rgba(100, 180, 240, 0.5);
			border-color: rgba(140, 200, 240, 0.5);
		}

		&.disabled {
			opacity: 0.3;
			cursor: not-allowed;
		}
	}

	.toggle-value {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #ffffff;
		min-width: 60px;
		text-align: center;
	}

	/* ── Options grid ── */
	.options-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 4px 14px 10px;
	}

	.option-chip {
		padding: 6px 10px;
		border: 1.5px solid rgba(120, 180, 220, 0.2);
		border-radius: 8px;
		background: rgba(40, 50, 70, 0.5);
		color: #d0e8f8;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
		min-width: 38px;
		text-align: center;

		&:hover {
			background: rgba(60, 100, 150, 0.4);
			border-color: rgba(140, 200, 240, 0.4);
		}

		&.selected {
			background: rgba(80, 160, 220, 0.35);
			border-color: #68b8e0;
			color: #ffffff;
		}
	}

	/* ── Confirm button ── */
	.confirm-btn {
		margin: 6px 14px 8px;
		padding: 10px 16px;
		border: none;
		border-radius: 10px;
		background: linear-gradient(135deg, rgba(80, 160, 220, 0.6), rgba(60, 130, 200, 0.8));
		color: #ffffff;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		text-align: center;

		&:hover {
			background: linear-gradient(135deg, rgba(100, 180, 240, 0.7), rgba(80, 150, 220, 0.9));
		}

		&:active {
			transform: scale(0.97);
		}
	}
</style>
