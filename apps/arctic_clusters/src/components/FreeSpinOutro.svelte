<script lang="ts" module>
	import type { WinLevelData } from '../game/winLevelMap';

	export type EmitterEventFreeSpinOutro =
		| { type: 'freeSpinOutroShow' }
		| { type: 'freeSpinOutroHide' }
		| { type: 'freeSpinOutroCountUp'; amount: number; winLevelData: WinLevelData };
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { stateBetDerived } from 'state-shared';
	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(true);
	let amount = $state(0);
	let winLevelData = $state<WinLevelData | undefined>(undefined);
	let displayAmount = $state(0);
	let countUpCompleted = $state(false);
	let oncomplete = $state(() => {});
	let animFrame = $state<number | null>(null);

	const isBigWin = $derived(winLevelData?.type === 'big');
	const displayText = $derived(bookEventAmountToCurrencyString(displayAmount));

	context.eventEmitter.subscribeOnMount({
		freeSpinOutroShow: () => (show = true),
		freeSpinOutroHide: async () => {
			show = false;
			stopCountUp();
			displayAmount = 0;
			countUpCompleted = false;
			winLevelData = undefined;
		},
		freeSpinOutroCountUp: async (emitterEvent) => {
			amount = emitterEvent.amount;
			winLevelData = emitterEvent.winLevelData;
			displayAmount = 0;
			countUpCompleted = false;
			startCountUp();
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});

	function startCountUp() {
		const target = amount;
		const duration = (winLevelData?.presentDuration ?? 6000) / stateBetDerived.timeScale();
		const startTime = performance.now();

		function tick() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = progress * progress;
			displayAmount = Math.round(eased * target);

			if (progress < 1) {
				animFrame = requestAnimationFrame(tick);
			} else {
				displayAmount = target;
				countUpCompleted = true;
			}
		}

		animFrame = requestAnimationFrame(tick);
	}

	function stopCountUp() {
		if (animFrame !== null) {
			cancelAnimationFrame(animFrame);
			animFrame = null;
		}
	}

	function skipOrDismiss() {
		if (!countUpCompleted) {
			stopCountUp();
			displayAmount = amount;
			countUpCompleted = true;
		} else {
			oncomplete();
		}
	}
</script>

{#if show && winLevelData}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fs-outro-overlay" onclick={skipOrDismiss}>
		<div class="fs-outro-backdrop"></div>
		<div class="fs-outro-content">
			<div class="fs-outro-title">{isBigWin ? 'FREE SPINS' : 'YOU WIN'}</div>
			<div class="fs-outro-amount" class:completed={countUpCompleted}>{displayText}</div>
			<div class="fs-outro-label">TOTAL WIN</div>
			{#if countUpCompleted}
				<div class="fs-outro-hint">TAP TO CONTINUE</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.fs-outro-overlay {
		position: fixed;
		inset: 0;
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		animation: overlayFadeIn 0.3s ease forwards;
	}

	.fs-outro-backdrop {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgba(5, 25, 55, 0.80) 0%,
			rgba(2, 12, 35, 0.90) 60%,
			rgba(0, 5, 20, 0.96) 100%
		);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.fs-outro-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(4px, 1.2vh, 12px);
		animation: contentPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.fs-outro-title {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(22px, 5vw, 48px);
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #7ec8ff;
		text-shadow:
			0 0 20px rgba(100, 180, 255, 0.6),
			0 0 40px rgba(60, 140, 255, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.fs-outro-amount {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(40px, 12vw, 120px);
		font-weight: 900;
		color: #ffffff;
		line-height: 1;
		text-shadow:
			0 0 20px rgba(120, 200, 255, 0.7),
			0 0 50px rgba(60, 160, 255, 0.4),
			0 4px 8px rgba(0, 0, 0, 0.6);
		transition: transform 0.15s ease;
		animation: amountGlow 2s ease-in-out infinite alternate;

		&.completed {
			animation: amountPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
	}

	.fs-outro-label {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(12px, 3vw, 24px);
		font-weight: 700;
		letter-spacing: 0.2em;
		color: rgba(120, 200, 255, 0.6);
		text-transform: uppercase;
	}

	.fs-outro-hint {
		margin-top: clamp(8px, 2vh, 20px);
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(10px, 2.5vw, 16px);
		font-weight: 600;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		animation: hintPulse 2s ease-in-out infinite;
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes contentPop {
		from { opacity: 0; transform: scale(0.6); }
		to { opacity: 1; transform: scale(1); }
	}

	@keyframes amountGlow {
		from { text-shadow: 0 0 20px rgba(120, 200, 255, 0.7), 0 0 50px rgba(60, 160, 255, 0.4), 0 4px 8px rgba(0, 0, 0, 0.6); }
		to { text-shadow: 0 0 30px rgba(120, 200, 255, 0.9), 0 0 70px rgba(60, 160, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.6); }
	}

	@keyframes amountPulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	@keyframes hintPulse {
		0%, 100% { opacity: 0.45; }
		50% { opacity: 0.8; }
	}
</style>
