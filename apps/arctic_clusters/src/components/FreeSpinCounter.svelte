<script lang="ts" module>
	export type EmitterEventFreeSpinCounter =
		| { type: 'freeSpinCounterShow' }
		| { type: 'freeSpinCounterHide' }
		| { type: 'freeSpinCounterUpdate'; current?: number; total?: number };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { stateBet, stateBetDerived } from 'state-shared';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(false);
	let current = $state(0);
	let total = $state(0);

	// Per-spin win (from tumbleWinAmount events)
	let spinWin = $state(0);
	const spinWinTween = new Tween(0);
	$effect(() => { spinWinTween.set(spinWin); });
	const spinWinText = $derived(bookEventAmountToCurrencyString(spinWinTween.current));
	const showSpinWin = $derived(spinWin > 0);

	// Total win (from stateBet — set by setTotalWin events)
	const totalWinTween = new Tween(0);
	$effect(() => { totalWinTween.set(stateBet.winBookEventAmount); });
	const totalWinText = $derived(bookEventAmountToCurrencyString(totalWinTween.current));
	const showTotalWin = $derived(stateBet.winBookEventAmount > 0);

	// Pop animation on counter change
	let pop = $state(false);

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (show = true),
		freeSpinCounterHide: () => {
			show = false;
			spinWin = 0;
		},
		freeSpinCounterUpdate: (emitterEvent) => {
			if (emitterEvent.current !== undefined) {
				current = emitterEvent.current;
				pop = true;
				setTimeout(() => (pop = false), 350 / stateBetDerived.timeScale());
			}
			if (emitterEvent.total !== undefined) total = emitterEvent.total;
		},
		// Listen to tumble win updates for per-spin win
		tumbleWinAmountUpdate: (emitterEvent) => {
			spinWin = emitterEvent.amount;
		},
		tumbleWinAmountReset: () => {
			spinWin = 0;
		},
		tumbleWinAmountHide: () => {
			spinWin = 0;
		},
	});
</script>

{#if show}
	<div class="fs-hud">
		<!-- Left: Per-spin win -->
		<div class="fs-hud-section win-section">
			{#if showSpinWin}
				<span class="fs-hud-label">WIN</span>
				<span class="fs-hud-value win-value">{spinWinText}</span>
			{/if}
		</div>

		<!-- Center: Total win (top) + Free spin counter (bottom) -->
		<div class="fs-hud-center">
			{#if showTotalWin}
				<div class="fs-total-win">
					<span class="fs-hud-label">TOTAL WIN</span>
					<span class="fs-hud-value total-value">{totalWinText}</span>
				</div>
			{/if}
			<div class="fs-spin-counter" class:pop>
				<span class="fs-hud-label">FREE SPINS</span>
				<span class="fs-hud-value">{current} <span class="fs-of">OF</span> {total}</span>
			</div>
		</div>

		<!-- Right: empty for balance -->
		<div class="fs-hud-section"></div>
	</div>
{/if}

<style lang="scss">
	.fs-hud {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 200;
		display: flex;
		align-items: stretch;
		justify-content: center;
		background: rgba(10, 16, 30, 0.95);
		border-top: 1px solid rgba(100, 180, 255, 0.18);
		padding: clamp(4px, 1vh, 8px) 0;
		padding-bottom: env(safe-area-inset-bottom, 0px);
		pointer-events: none;
		animation: slideUp 0.3s ease forwards;
	}

	.fs-hud-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 0 clamp(6px, 2vw, 16px);
	}

	.fs-hud-center {
		flex: 1.4;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: clamp(2px, 0.5vh, 6px);
		border-left: 1px solid rgba(100, 180, 255, 0.12);
		border-right: 1px solid rgba(100, 180, 255, 0.12);
		padding: 0 clamp(8px, 2vw, 20px);
	}

	.fs-total-win {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.fs-spin-counter {
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

		&.pop {
			transform: scale(1.1);
		}
	}

	.fs-hud-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(8px, 2vw, 11px);
		font-weight: 700;
		color: rgba(120, 200, 255, 0.75);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.fs-hud-value {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(13px, 3.5vw, 20px);
		font-weight: 900;
		color: #ffffff;
		line-height: 1.2;
		white-space: nowrap;
	}

	.win-value {
		color: #00ffcc;
		text-shadow: 0 0 8px rgba(0, 255, 200, 0.3);
	}

	.total-value {
		color: #ffffff;
		text-shadow: 0 0 8px rgba(100, 180, 255, 0.3);
	}

	.fs-of {
		font-size: 0.7em;
		font-weight: 600;
		color: rgba(160, 210, 255, 0.55);
	}

	.win-section {
		min-height: clamp(30px, 6vh, 50px);
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(100%); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
