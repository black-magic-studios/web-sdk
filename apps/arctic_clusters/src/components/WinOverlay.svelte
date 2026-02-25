<script lang="ts" module>
	import type { WinLevelData } from '../game/winLevelMap';

	export type EmitterEventWin =
		| { type: 'winShow' }
		| { type: 'winHide' }
		| { type: 'winUpdate'; amount: number; winLevelData: WinLevelData };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { waitForResolve } from 'utils-shared/wait';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { stateBetDerived } from 'state-shared';
	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(false);
	let amount = $state(0);
	let winLevelData = $state<WinLevelData | undefined>(undefined);
	let displayAmount = $state(0);
	let countUpCompleted = $state(false);
	let oncomplete = $state(() => {});
	let animFrame = $state<number | null>(null);
	let autoDismissTimer = $state<ReturnType<typeof setTimeout> | null>(null);

	/** Brief pause (ms) to show final amount before auto-dismissing */
	const AUTO_DISMISS_DELAY = 1500;

	// Only show for big wins (level 6+)
	const isBigWin = $derived(winLevelData?.type === 'big');
	const winText = $derived(winLevelData?.text ?? '');
	const displayText = $derived(bookEventAmountToCurrencyString(displayAmount));

	context.eventEmitter.subscribeOnMount({
		winShow: () => {
			show = true;
		},
		winHide: () => {
			show = false;
			stopCountUp();
			clearAutoDismiss();
			displayAmount = 0;
			countUpCompleted = false;
			winLevelData = undefined;
		},
		winUpdate: async (emitterEvent) => {
			amount = emitterEvent.amount;
			winLevelData = emitterEvent.winLevelData;

			// For small/medium wins, resolve immediately (no overlay)
			if (emitterEvent.winLevelData.type !== 'big') {
				displayAmount = emitterEvent.amount;
				countUpCompleted = true;
				return;
			}

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
			// Ease-in curve: starts slow, accelerates
			const progress = Math.min(elapsed / duration, 1);
			const eased = progress * progress; // quadratic ease-in
			displayAmount = Math.round(eased * target);

			if (progress < 1) {
				animFrame = requestAnimationFrame(tick);
			} else {
				displayAmount = target;
				countUpCompleted = true;
				scheduleAutoDismiss();
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

	function scheduleAutoDismiss() {
		clearAutoDismiss();
		autoDismissTimer = setTimeout(() => {
			oncomplete();
		}, AUTO_DISMISS_DELAY / stateBetDerived.timeScale());
	}

	function clearAutoDismiss() {
		if (autoDismissTimer !== null) {
			clearTimeout(autoDismissTimer);
			autoDismissTimer = null;
		}
	}

	function skipOrDismiss() {
		if (!countUpCompleted) {
			// Skip to end of count-up, then auto-dismiss after brief pause
			stopCountUp();
			displayAmount = amount;
			countUpCompleted = true;
			scheduleAutoDismiss();
		} else {
			// Already showing final result — dismiss immediately
			clearAutoDismiss();
			oncomplete();
		}
	}
</script>

{#if show && isBigWin}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="win-overlay" class:visible={show} onclick={skipOrDismiss}>
		<div class="win-backdrop"></div>
		<div class="win-content">
			{#if winText}
				<div class="win-level-text">{winText}</div>
			{/if}
			<div class="win-amount" class:completed={countUpCompleted}>{displayText}</div>
			{#if countUpCompleted}
				<div class="win-tap-hint">TAP TO CONTINUE</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.win-overlay {
		position: fixed;
		inset: 0;
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		animation: overlayFadeIn 0.3s ease forwards;
	}

	.win-backdrop {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgba(0, 40, 20, 0.75) 0%,
			rgba(0, 20, 10, 0.88) 60%,
			rgba(0, 10, 5, 0.95) 100%
		);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.win-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(8px, 2vh, 20px);
		animation: contentPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.win-level-text {
		font-family: 'proxima-nova', 'Arial Black', Arial, sans-serif;
		font-size: clamp(28px, 8vw, 72px);
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #00ffaa;
		text-shadow:
			0 0 20px rgba(0, 255, 170, 0.6),
			0 0 40px rgba(0, 255, 170, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.5);
		animation: textGlow 1.5s ease-in-out infinite alternate;
	}

	.win-amount {
		font-family: 'proxima-nova', 'Arial Black', Arial, sans-serif;
		font-size: clamp(40px, 12vw, 120px);
		font-weight: 900;
		color: #ffffff;
		text-shadow:
			0 0 15px rgba(255, 255, 255, 0.4),
			0 0 30px rgba(0, 200, 255, 0.2),
			0 4px 8px rgba(0, 0, 0, 0.6);
		line-height: 1;
		letter-spacing: 0.02em;
		transition: transform 0.15s ease;

		&.completed {
			animation: amountPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
	}

	.win-tap-hint {
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: clamp(10px, 2.5vw, 16px);
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		animation: hintFadeIn 0.4s ease 0.2s both;
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes contentPop {
		from { opacity: 0; transform: scale(0.7); }
		to { opacity: 1; transform: scale(1); }
	}

	@keyframes textGlow {
		from { text-shadow: 0 0 20px rgba(0, 255, 170, 0.6), 0 0 40px rgba(0, 255, 170, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5); }
		to { text-shadow: 0 0 30px rgba(0, 255, 170, 0.8), 0 0 60px rgba(0, 255, 170, 0.5), 0 2px 4px rgba(0, 0, 0, 0.5); }
	}

	@keyframes amountPulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	@keyframes hintFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
