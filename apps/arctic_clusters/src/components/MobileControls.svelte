<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { stateBet, stateBetDerived, stateModal, stateConfig } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';

	const context = getContext();

	// ── Balance / Win / Spin text (with tween) ──
	const balanceTween = new Tween(stateBet.balanceAmount);
	const winTween = new Tween(stateBet.winBookEventAmount);

	$effect(() => { balanceTween.set(stateBet.balanceAmount); });
	$effect(() => { winTween.set(stateBet.winBookEventAmount); });

	const balanceText = $derived(numberToCurrencyString(balanceTween.current));
	const winText = $derived(bookEventAmountToCurrencyString(winTween.current));
	const spinText = $derived(numberToCurrencyString(stateBetDerived.betCost()));
	const showWin = $derived(stateBet.winBookEventAmount > 0);

	// Bet disabled / idle state
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	const betIdle = $derived(context.stateXstateDerived.isIdle());

	// Arrow disabled states
	const smallest = $derived(stateConfig.betAmountOptions[0]);
	const biggest = $derived(stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]);
	const decreaseDisabled = $derived(!betIdle || stateBet.betAmount <= smallest);
	const increaseDisabled = $derived(!betIdle || stateBet.betAmount >= biggest);

	// ── Handlers ──
	const handleSpin = () => {
		if (!disabled) context.eventEmitter.broadcast({ type: 'bet' });
	};

	const handleAutoPlay = () => {
		context.eventEmitter.broadcast({ type: 'autoSpinOpen' });
	};

	const handleFastPlay = () => {
		context.eventEmitter.broadcast({ type: 'turboToggle' });
	};

	const handleBuyBonus = () => {
		context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
	};

	const handleInfo = () => {
		context.eventEmitter.broadcast({ type: 'gameInfoOpen' } as any);
	};

	const handleBetMenu = () => {
		if (betIdle) {
			context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
			stateModal.modal = { name: 'betAmountMenu' };
		}
	};

	const handleBetIncrease = () => {
		if (!betIdle) return;
		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);
		stateBetDerived.setBetAmount(nextBigger || biggest);
	};

	const handleBetDecrease = () => {
		if (!betIdle) return;
		const nextSmaller = [...stateConfig.betAmountOptions]
			.sort((a, b) => b - a)
			.find((option) => option < stateBet.betAmount);
		stateBetDerived.setBetAmount(nextSmaller || smallest);
	};
</script>

<div class="mobile-controls">
	<!-- ── Button row ── -->
	<div class="button-row">
		<button class="ctrl-btn info-btn" onclick={handleInfo}>
			<span class="info-icon">i</span>
		</button>

		<button class="ctrl-btn auto-btn" onclick={handleAutoPlay}>
			<img src="/assets/sprites/buttons/arctic_clusters_autoplay.png" alt="Auto" />
		</button>

		<button
			class="ctrl-btn spin-btn"
			class:disabled
			onclick={handleSpin}
		>
			<img src="/assets/sprites/buttons/play_button.png" alt="Spin" />
		</button>

		<button class="ctrl-btn fast-btn" onclick={handleFastPlay}>
			<img src="/assets/sprites/buttons/arctic_clusters_fast_play.png" alt="Fast" />
		</button>

		<button class="ctrl-btn buy-btn" onclick={handleBuyBonus}>
			<img src="/assets/sprites/buttons/black_magic_studios_buy_button.png" alt="Buy" />
		</button>
	</div>

	<!-- ── Info bar ── -->
	<div class="info-bar">
		<div class="info-section balance-section" onclick={handleBetMenu}>
			<span class="label">BALANCE</span>
			<span class="value">{balanceText}</span>
		</div>

		{#if showWin}
			<div class="info-section win-section">
				<span class="label">WIN</span>
				<span class="value win-value">{winText}</span>
			</div>
		{/if}

		<div class="info-section spin-section">
			<span class="label">SPIN</span>
			<div class="bet-control">
				<button
					class="arrow-btn"
					class:arrow-disabled={decreaseDisabled}
					onclick={handleBetDecrease}
				>▼</button>
				<span class="value" onclick={handleBetMenu}>{spinText}</span>
				<button
					class="arrow-btn"
					class:arrow-disabled={increaseDisabled}
					onclick={handleBetIncrease}
				>▲</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.mobile-controls {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: none;
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}

	/* ── Button row ── */
	.button-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(8px, 3vw, 16px);
		pointer-events: auto;
		padding: 6px 0;
	}

	.ctrl-btn {
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.1s ease, opacity 0.1s ease;

		&:active {
			transform: scale(0.92);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			pointer-events: none;
		}
	}

	/* Sizing: small buttons < spin button */
	.info-btn,
	.auto-btn,
	.fast-btn,
	.buy-btn {
		width: clamp(36px, 10vw, 56px);
		height: clamp(36px, 10vw, 56px);
	}

	.spin-btn {
		width: clamp(56px, 16vw, 84px);
		height: clamp(56px, 16vw, 84px);

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	/* Info "i" button circle */
	.info-btn {
		border-radius: 50%;
		background: rgba(30, 53, 80, 0.95);
		border: 1.5px solid rgba(136, 204, 255, 0.4);
	}

	.info-icon {
		font-family: Georgia, serif;
		font-size: clamp(18px, 5vw, 28px);
		font-weight: bold;
		font-style: italic;
		color: #88ccff;
		line-height: 1;
	}

	/* ── Info bar ── */
	.info-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: 100%;
		max-width: 420px;
		background: rgba(16, 22, 36, 0.94);
		border-top: 1px solid rgba(100, 180, 255, 0.15);
		pointer-events: auto;
		padding: 4px 0;
	}

	.info-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2px 6px;
		min-width: 0;

		&:not(:last-child) {
			border-right: 1px solid rgba(100, 180, 255, 0.12);
		}
	}

	.label {
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: clamp(8px, 2.2vw, 11px);
		font-weight: 700;
		color: #88ccff;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.value {
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: clamp(11px, 3vw, 15px);
		font-weight: 700;
		color: #ffffff;
		line-height: 1.3;
		white-space: nowrap;
	}

	.win-value {
		color: #00ffcc;
	}

	/* ── Bet control (arrows + value) ── */
	.bet-control {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.arrow-btn {
		border: none;
		background: transparent;
		color: #88ccff;
		font-size: clamp(10px, 2.8vw, 14px);
		cursor: pointer;
		padding: 2px 4px;
		line-height: 1;
		transition: color 0.15s;

		&:hover { color: #ccffff; }
		&.arrow-disabled {
			color: rgba(136, 204, 255, 0.3);
			cursor: not-allowed;
		}
	}

	.balance-section {
		cursor: pointer;
	}

	.spin-section .value {
		cursor: pointer;
	}
</style>
