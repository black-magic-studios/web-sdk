<script lang="ts" module>
	export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow' }
		| { type: 'freeSpinIntroHide' }
		| { type: 'freeSpinIntroUpdate'; totalFreeSpins: number };
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';
	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(false);
	let freeSpinsFromEvent = $state(0);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: () => (show = true),
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroUpdate: async (emitterEvent) => {
			freeSpinsFromEvent = emitterEvent.totalFreeSpins;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});

	function dismiss() {
		oncomplete();
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fs-intro-overlay" onclick={dismiss}>
		<div class="fs-intro-backdrop"></div>
		<div class="fs-intro-content">
			<div class="fs-intro-title">YOU WON</div>
			<div class="fs-intro-count">{freeSpinsFromEvent}</div>
			<div class="fs-intro-subtitle">FREE SPINS</div>
			<div class="fs-intro-hint">TAP TO CONTINUE</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.fs-intro-overlay {
		position: fixed;
		inset: 0;
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		animation: overlayFadeIn 0.3s ease forwards;
	}

	.fs-intro-backdrop {
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

	.fs-intro-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(4px, 1.5vh, 14px);
		animation: contentPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.fs-intro-title {
		font-family: 'proxima-nova', 'Arial Black', Arial, sans-serif;
		font-size: clamp(24px, 6vw, 56px);
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #7ec8ff;
		text-shadow:
			0 0 20px rgba(100, 180, 255, 0.6),
			0 0 40px rgba(60, 140, 255, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.fs-intro-count {
		font-family: 'proxima-nova', 'Arial Black', Arial, sans-serif;
		font-size: clamp(60px, 18vw, 160px);
		font-weight: 900;
		color: #ffffff;
		line-height: 1;
		text-shadow:
			0 0 30px rgba(120, 200, 255, 0.7),
			0 0 60px rgba(60, 160, 255, 0.4),
			0 0 100px rgba(0, 100, 200, 0.2),
			0 4px 8px rgba(0, 0, 0, 0.6);
		animation: countGlow 2s ease-in-out infinite alternate;
	}

	.fs-intro-subtitle {
		font-family: 'proxima-nova', 'Arial Black', Arial, sans-serif;
		font-size: clamp(14px, 3.5vw, 28px);
		font-weight: 700;
		letter-spacing: 0.2em;
		color: rgba(120, 200, 255, 0.7);
		text-transform: uppercase;
	}

	.fs-intro-hint {
		margin-top: clamp(10px, 3vh, 30px);
		font-family: 'proxima-nova', Arial, sans-serif;
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

	@keyframes countGlow {
		from { text-shadow: 0 0 30px rgba(120, 200, 255, 0.7), 0 0 60px rgba(60, 160, 255, 0.4), 0 0 100px rgba(0, 100, 200, 0.2), 0 4px 8px rgba(0, 0, 0, 0.6); }
		to { text-shadow: 0 0 40px rgba(120, 200, 255, 0.9), 0 0 80px rgba(60, 160, 255, 0.6), 0 0 120px rgba(0, 100, 200, 0.3), 0 4px 8px rgba(0, 0, 0, 0.6); }
	}

	@keyframes hintPulse {
		0%, 100% { opacity: 0.45; }
		50% { opacity: 0.8; }
	}
</style>
