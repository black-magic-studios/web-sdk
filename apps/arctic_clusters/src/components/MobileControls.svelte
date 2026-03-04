<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { stateBet, stateBetDerived, stateMeta, stateConfig, stateI18nDerived, stateUrlDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';
	import BetMenu from './BetMenu.svelte';
	import AutoplayMenu from './AutoplayMenu.svelte';

	type Props = { hidden?: boolean };
	const props: Props = $props();

	const context = getContext();
	const isReplay = $derived(stateUrlDerived.replay());

	// ── Free spin state ──
	let inFreeSpins = $state(false);
	let fsCurrent = $state(0);
	let fsTotal = $state(0);

	// Per-spin win (from tumbleWinAmount events)
	let spinWin = $state(0);
	const spinWinTween = new Tween(0);
	$effect(() => { spinWinTween.set(spinWin); });
	const spinWinText = $derived(bookEventAmountToCurrencyString(spinWinTween.current));
	const showSpinWin = $derived(spinWin > 0);

	// Total win during free spins
	const totalWinTween = new Tween(0);
	$effect(() => { totalWinTween.set(stateBet.winBookEventAmount); });
	const totalWinText = $derived(bookEventAmountToCurrencyString(totalWinTween.current));

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (inFreeSpins = true),
		freeSpinCounterHide: () => { inFreeSpins = false; spinWin = 0; },
		freeSpinCounterUpdate: (ev) => {
			if (ev.current !== undefined) fsCurrent = ev.current;
			if (ev.total !== undefined) fsTotal = ev.total;
		},
		tumbleWinAmountUpdate: (ev) => { spinWin = ev.amount; },
		tumbleWinAmountReset: () => { spinWin = 0; },
		tumbleWinAmountHide: () => { spinWin = 0; },
	});

	// Labels adapt for social mode via sweeps_en language file
	const betLabel = $derived(stateI18nDerived.translate('BET'));

	// ── Balance / Win / Spin text (with tween) ──
	const balanceTween = new Tween(stateBet.balanceAmount);
	const winTween = new Tween(stateBet.winBookEventAmount);

	// Track currency so we can skip animation on currency switch
	let prevCurrency = stateBet.currency;
	$effect(() => {
		const instant = stateBet.currency !== prevCurrency;
		prevCurrency = stateBet.currency;
		balanceTween.set(stateBet.balanceAmount, { duration: instant ? 0 : undefined });
	});
	$effect(() => {
		const instant = stateBet.currency !== prevCurrency;
		winTween.set(stateBet.winBookEventAmount, { duration: instant ? 0 : undefined });
	});

	const balanceText = $derived(numberToCurrencyString(balanceTween.current));
	const winText = $derived(bookEventAmountToCurrencyString(winTween.current));
	const spinText = $derived(numberToCurrencyString(stateBetDerived.betCost()));
	const showWin = $derived(stateBet.winBookEventAmount > 0);

	// Bet disabled / idle state — bypass balance check in replay mode
	// Inline the computation so Svelte 5 tracks all reactive dependencies directly
	const disabled = $derived.by(() => {
		const mode = stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toUpperCase()]
			?? stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toLowerCase()];
		const costMult = mode?.type === 'activate' ? (mode.costMultiplier ?? 1) : 1;
		const cost = stateBet.betAmount * costMult;
		const available = cost > 0 && cost <= stateBet.balanceAmount;
		return !available && !stateUrlDerived.replay();
	});
	const betIdle = $derived(context.stateXstateDerived.isIdle());

	// Arrow disabled states
	const smallest = $derived(stateConfig.betAmountOptions[0]);
	const biggest = $derived(stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]);
	const decreaseDisabled = $derived(!betIdle || stateBet.betAmount <= smallest);
	const increaseDisabled = $derived(!betIdle || stateBet.betAmount >= biggest);

	// Bet menu (inline, matching autoplay style)
	let betMenuOpen = $state(false);

	// ── Handlers ──
	const handleSpin = () => {
		if (!disabled && !stateUrlDerived.replay()) context.eventEmitter.broadcast({ type: 'bet' });
	};

	let autoplayMenuOpen = $state(false);

	const handleAutoPlay = () => {
		// Block autoplay activation during bonus/free spins
		if (inFreeSpins && !stateBetDerived.hasAutoBetCounter()) return;
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		if (stateBetDerived.hasAutoBetCounter()) {
			stateBet.autoSpinsCounter = 0;
		} else {
			autoplayMenuOpen = !autoplayMenuOpen;
		}
	};

	const turboImg = $derived(
		stateBet.speedMode === 2 ? './assets/sprites/buttons_new/play_bar_0002_turbo_super_turbo.png'
		: stateBet.speedMode === 1 ? './assets/sprites/buttons_new/play_bar_0002_turbo_turbo.png'
		: './assets/sprites/buttons_new/play_bar_0002_turbo_normal.png'
	);

	const handleFastPlay = () => {
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		const next = ((stateBet.speedMode + 1) % 3) as 0 | 1 | 2;
		stateBetDerived.updateSpeedMode(next, { persistent: true });
	};

	const handleBuyBonus = () => {
		// Block buy bonus while autoplay is active
		if (stateBetDerived.hasAutoBetCounter()) return;
		// Block buy bonus during bonus/free spins
		if (inFreeSpins) return;
		context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
	};

	const handleDeactivateMode = () => {
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		stateBet.activeBetModeKey = 'BASE';
	};

	// Whether a cost-multiplier mode is active (ANTE, M2X, etc.)
	const hasActiveCostMode = $derived(stateBetDerived.betCost() !== stateBet.betAmount);

	const handleInfo = () => {
		context.eventEmitter.broadcast({ type: 'gameInfoOpen' } as any);
	};

	const handleBetMenu = () => {
		if (betIdle) {
			context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
			betMenuOpen = !betMenuOpen;
		}
	};

	const handleBetIncrease = () => {
		if (!betIdle) return;
		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);
		stateBetDerived.setBetAmount(nextBigger || biggest);
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_1' });
	};

	const handleBetDecrease = () => {
		if (!betIdle) return;
		const nextSmaller = [...stateConfig.betAmountOptions]
			.sort((a, b) => b - a)
			.find((option) => option < stateBet.betAmount);
		stateBetDerived.setBetAmount(nextSmaller || smallest);
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_2' });
	};
</script>

<div class="mobile-controls" class:hidden={props.hidden}>
	{#if inFreeSpins}
		<!-- ═══ FREE SPINS MODE ═══ -->
		<!-- Info bar with 4 sections + turbo button -->
		<div class="info-bar fs-bar">
			<div class="info-section">
				<span class="label">BALANCE</span>
				<span class="value">{balanceText}</span>
			</div>

			<div class="info-section">
				<span class="label">{betLabel}</span>
				<span class="value">{spinText}</span>
			</div>

			<div class="info-section fs-combined-section">
				<div class="fs-individual-border">
					<span class="label fs-label">TOTAL WIN</span>
					<span class="value">{totalWinText}</span>
				</div>
				<div class="fs-individual-border">
					<span class="label">FREE SPINS</span>
					<span class="value">{Math.max(0, fsTotal - fsCurrent)}</span>
				</div>
			</div>

			{#if !isReplay}
			<button class="ctrl-btn fast-btn fs-turbo-btn" onclick={handleFastPlay}>
				<img src={turboImg} alt="Fast" />
			</button>
			{/if}
		</div>
	{:else}
		<!-- ═══ NORMAL MODE ═══ -->
	{#if !isReplay}
	<div class="button-row">
		<button class="ctrl-btn info-btn" onclick={handleInfo}>
			<span class="info-icon">i</span>
		</button>

		<button class="ctrl-btn auto-btn" class:btn-disabled={inFreeSpins && !stateBetDerived.hasAutoBetCounter()} onclick={handleAutoPlay}>
			<img src="./assets/sprites/buttons_new/autoplay_base.png" alt="Auto" />
			{#if stateBetDerived.hasAutoBetCounter()}
				<span class="autoplay-counter">{stateBet.autoSpinsCounter === Infinity ? '∞' : stateBet.autoSpinsCounter}</span>
			{/if}
		</button>

		<button
			class="ctrl-btn spin-btn"
			class:disabled
			onclick={handleSpin}
		>
			<img src="./assets/sprites/buttons_new/play_button.png" alt="Spin" />
			{#if hasActiveCostMode && betIdle}
				<button class="deactivate-badge" onclick={(e) => { e.stopPropagation(); handleDeactivateMode(); }}>✕</button>
			{/if}
		</button>

		<button class="ctrl-btn fast-btn" onclick={handleFastPlay}>
			<img src={turboImg} alt="Fast" />
		</button>

		<button class="ctrl-btn buy-btn" class:btn-disabled={stateBetDerived.hasAutoBetCounter() || inFreeSpins} onclick={handleBuyBonus}>
			<img src="./assets/sprites/buttons_new/black_magic_studios_buy_button.png" alt={stateI18nDerived.translate('BUY')} />
		</button>
	</div>
	{/if}

	<!-- ── Info bar ── -->
	<div class="info-bar">
		<button class="info-section balance-section" onclick={isReplay ? undefined : handleBetMenu}>
			<span class="label">BALANCE</span>
			<span class="value">{balanceText}</span>
		</button>

		{#if showWin}
			<div class="info-section win-section">
				<span class="label">WIN</span>
				<span class="value win-value">{winText}</span>
			</div>
		{/if}

		<div class="info-section spin-section">
			<span class="label">{betLabel}</span>
			{#if isReplay}
				<span class="value">{spinText}</span>
			{:else}
			<div class="bet-control">
				<button
					class="arrow-btn"
					class:arrow-disabled={decreaseDisabled}
					disabled={decreaseDisabled}
					onclick={handleBetDecrease}
				>▼</button>
				<button class="value bet-menu-btn" onclick={handleBetMenu}>{spinText}</button>
				<button
					class="arrow-btn"
					class:arrow-disabled={increaseDisabled}
					disabled={increaseDisabled}
					onclick={handleBetIncrease}
				>▲</button>
			</div>
			{/if}
			{#if hasActiveCostMode}
				<span class="base-bet">{numberToCurrencyString(stateBet.betAmount)}</span>
			{/if}
		</div>
	</div>
	{/if}
</div>

<BetMenu show={betMenuOpen} onclose={() => { betMenuOpen = false; }} />
<AutoplayMenu show={autoplayMenuOpen} onclose={() => { autoplayMenuOpen = false; }} />

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
		transition: opacity 0.2s ease, transform 0.2s ease;

		&.hidden {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transform: translateY(20px);
		}
	}

	/* ── Button row ── */
	.button-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(4px, 2vw, 10px);
		pointer-events: auto;
		padding: 6px 0 4px;
		background: linear-gradient(to bottom, transparent 0%, rgba(16, 22, 36, 0.7) 30%, rgba(16, 22, 36, 0.9) 100%);
		width: 100%;
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

		&.btn-disabled {
			opacity: 0.35;
			pointer-events: none;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			pointer-events: none;
		}
	}

	/*
	 * Board-relative sizing (portrait board ≈ 94vw):
	 *   Spin button  ≈ 16.5% of board width  → 15.5vw
	 *   Side buttons  ≈ 45% of spin diameter  → 7vw
	 */
	.info-btn,
	.auto-btn,
	.fast-btn,
	.buy-btn {
		width: clamp(22px, 6vw, 34px);
		height: clamp(22px, 6vw, 34px);
	}

	.spin-btn {
		width: clamp(44px, 13vw, 70px);
		height: clamp(44px, 13vw, 70px);
		position: relative;

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	/* Scale down only on small portrait screens where controls overlap the board */
	@media (max-height: 700px) and (max-width: 500px) {
		.info-btn,
		.auto-btn,
		.fast-btn,
		.buy-btn {
			width: clamp(18px, 5vw, 28px);
			height: clamp(18px, 5vw, 28px);
		}
		.spin-btn {
			width: clamp(34px, 9vw, 50px);
			height: clamp(34px, 9vw, 50px);
		}
		.button-row {
			padding: 2px 0 1px;
		}
	}

	.deactivate-badge {
		position: absolute;
		top: -4px;
		right: -10px;
		width: clamp(14px, 4vw, 20px);
		height: clamp(14px, 4vw, 20px);
		border-radius: 50%;
		background: rgba(200, 50, 50, 0.9);
		border: 1.5px solid rgba(255, 100, 100, 0.6);
		color: #ffffff;
		font-size: clamp(7px, 2vw, 11px);
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		z-index: 5;
		pointer-events: auto;
		transition: background 0.15s, transform 0.1s;

		&:hover { background: rgba(220, 70, 70, 1); }
		&:active { transform: scale(0.9); }
	}

	/* Info "i" button circle */
	.info-btn {
		border-radius: 50%;
		background: rgba(30, 53, 80, 0.95);
		border: 1.5px solid rgba(136, 204, 255, 0.4);
	}

	.info-icon {
		font-family: Georgia, serif;
		font-size: clamp(13px, 4vw, 20px);
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
		background: rgba(16, 22, 36, 0.94);
		border-top: 1px solid rgba(100, 180, 255, 0.15);
		pointer-events: auto;
		padding: 8px 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

  .info-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 6px 8px;
		min-width: fit-content;
		overflow: visible;

		&:not(:last-child) {
			border-right: 1px solid rgba(100, 180, 255, 0.12);
		}
	}

	.label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(7px, 2vw, 11px);
		font-weight: 700;
		color: #88ccff;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		line-height: 1.4;
		white-space: nowrap;
		text-rendering: geometricPrecision;
	}

	.value {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(11px, 3vw, 15px);
		font-weight: 700;
		color: #ffffff;
		line-height: 1.3;
		white-space: nowrap;
		overflow: visible;
		max-width: 100%;
		text-rendering: geometricPrecision;
	}

	.win-value {
		color: #00ffcc;
	}

	/* ── Bet control (arrows + value) ── */
	.bet-control {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
		max-width: 100%;
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

		&:hover:not(:disabled) { color: #ccffff; }
		&:active:not(:disabled) { color: #ffffff; }
		&:disabled,
		&.arrow-disabled {
			color: rgba(136, 204, 255, 0.3);
			cursor: not-allowed;
		}
	}

	.balance-section {
		cursor: pointer;
		/* Reset button styles when using <button> */
		border: none;
		background: transparent;
		font: inherit;
	}

	.bet-menu-btn {
		cursor: pointer;
		border: none;
		background: transparent;
		font: inherit;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(9px, 2.5vw, 15px);
		font-weight: 700;
		color: #ffffff;
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0;
		max-width: 100%;
		min-width: 0;
	}

	.base-bet {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(7px, 1.8vw, 11px);
		font-weight: 500;
		color: rgba(255, 255, 255, 0.35);
		line-height: 1;
		margin-top: -1px;
	}

	/* ── Free spins mode ── */
	.fs-bar {
		flex-direction: row;
		align-items: center;
	}

	.fs-label {
		color: #00e6cc !important;
	}

	.fs-combined-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: 1px 6px;
	}

	.fs-individual-border {
		border: 1.5px solid rgba(136, 204, 255, 0.4);
		border-radius: 4px;
		padding: 1px 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.fs-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.1;
	}

	.fs-turbo-btn {
		width: clamp(26px, 7vw, 36px);
		height: clamp(26px, 7vw, 36px);
		flex-shrink: 0;
		margin: 0 clamp(4px, 1.5vw, 10px);
		pointer-events: auto;
	}

	.auto-btn {
		position: relative;
	}

	.autoplay-counter {
		position: absolute;
		bottom: -4px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Arial', sans-serif;
		font-size: clamp(9px, 2vw, 13px);
		font-weight: 700;
		color: #00ffcc;
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.8);
		pointer-events: none;
	}
</style>
