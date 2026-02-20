<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { stateBet, stateBetDerived, stateModal, stateConfig, stateUrlDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';

	type Props = { hidden?: boolean };
	const props: Props = $props();

	const context = getContext();
	const isSocial = $derived(stateUrlDerived.social());

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

	// Labels adapt for social mode
	const betLabel = $derived(isSocial ? 'SPIN' : 'BET');

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

			<button class="ctrl-btn fast-btn fs-turbo-btn" onclick={handleFastPlay}>
				<img src="/assets/sprites/buttons/arctic_clusters_fast_play.png" alt="Fast" />
			</button>
		</div>
	{:else}
		<!-- ═══ NORMAL MODE ═══ -->
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
		<button class="info-section balance-section" onclick={handleBetMenu}>
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
			<div class="bet-control">
				<button
					class="arrow-btn"
					class:arrow-disabled={decreaseDisabled}
					onclick={handleBetDecrease}
				>▼</button>
				<button class="value bet-menu-btn" onclick={handleBetMenu}>{spinText}</button>
				<button
					class="arrow-btn"
					class:arrow-disabled={increaseDisabled}
					onclick={handleBetIncrease}
				>▲</button>
			</div>
		</div>
	</div>
	{/if}
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
		transition: opacity 0.2s ease, transform 0.2s ease;
		overflow: hidden;

		&.hidden {
			opacity: 0;
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
		padding: 2px 0;
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

	/*
	 * Board-relative sizing (portrait board ≈ 94vw):
	 *   Spin button  ≈ 16.5% of board width  → 15.5vw
	 *   Side buttons  ≈ 45% of spin diameter  → 7vw
	 */
	.info-btn,
	.auto-btn,
	.fast-btn,
	.buy-btn {
		width: clamp(26px, 7vw, 36px);
		height: clamp(26px, 7vw, 36px);
	}

	.spin-btn {
		width: clamp(52px, 15.5vw, 76px);
		height: clamp(52px, 15.5vw, 76px);

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
		padding: 2px 0;
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
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: clamp(11px, 3vw, 15px);
		font-weight: 700;
		color: #ffffff;
		line-height: 1.3;
		white-space: nowrap;
		padding: 0;
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
</style>
