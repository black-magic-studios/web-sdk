<script lang="ts" module>
	export type EmitterEventAuroraSpinAnnounce =
		| { type: 'auroraSpinShow'; wildsToPlace: number }
		| { type: 'auroraSpinHide' };
</script>

<script lang="ts">
	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(false);
	let wildsCount = $state(0);
	let revealed = $state(false);

	context.eventEmitter.subscribeOnMount({
		auroraSpinShow: async (event) => {
			wildsCount = event.wildsToPlace;
			revealed = false;
			show = true;
			// Brief delay before showing the wilds count to let the backdrop settle
			await new Promise((r) => setTimeout(r, 350));
			revealed = true;
			// Auto-dismiss after a short display period (no tap required)
			await new Promise((r) => setTimeout(r, 2000));
		},
		auroraSpinHide: () => {
			show = false;
			revealed = false;
		},
	});
</script>

{#if show}
	<div class="aurora-overlay">
		<div class="aurora-backdrop"></div>

		<!-- Animated aurora curtain bands -->
		<div class="aurora-band band-1"></div>
		<div class="aurora-band band-2"></div>
		<div class="aurora-band band-3"></div>

		<div class="aurora-content">
			<div class="aurora-label">AURORA SPIN</div>
			{#if revealed}
				<div class="aurora-wilds-row">
					<span class="aurora-wilds-count">{wildsCount}</span>
					<span class="aurora-wilds-text">AURORA WILDS</span>
				</div>

			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.aurora-overlay {
		position: fixed;
		inset: 0;
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: overlayFadeIn 0.4s ease forwards;
		overflow: hidden;
	}

	.aurora-backdrop {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at 50% 40%,
			rgba(0, 30, 40, 0.82) 0%,
			rgba(0, 10, 25, 0.92) 55%,
			rgba(0, 4, 15, 0.97) 100%
		);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	/* Sweeping aurora curtain bands */
	.aurora-band {
		position: absolute;
		left: -20%;
		right: -20%;
		height: 160px;
		border-radius: 50%;
		filter: blur(40px);
		mix-blend-mode: screen;
		opacity: 0;
		animation: bandSweep 3.5s ease-in-out infinite;
	}

	.band-1 {
		top: 15%;
		background: linear-gradient(90deg, transparent 0%, rgba(0, 220, 180, 0.25) 40%, rgba(20, 255, 200, 0.35) 60%, transparent 100%);
		animation-delay: 0s;
	}

	.band-2 {
		top: 30%;
		background: linear-gradient(90deg, transparent 0%, rgba(80, 120, 255, 0.20) 35%, rgba(0, 200, 255, 0.30) 55%, transparent 100%);
		animation-delay: 0.6s;
	}

	.band-3 {
		top: 22%;
		background: linear-gradient(90deg, transparent 0%, rgba(180, 77, 255, 0.15) 40%, rgba(150, 50, 220, 0.22) 60%, transparent 100%);
		animation-delay: 1.1s;
	}

	.aurora-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(8px, 2vh, 20px);
	}

	.aurora-label {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(32px, 9vw, 80px);
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #b44dff;
		text-shadow:
			0 0 24px rgba(180, 77, 255, 0.7),
			0 0 50px rgba(150, 50, 220, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.7);
		animation: labelGlow 1.6s ease-in-out infinite alternate, contentPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.aurora-wilds-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(2px, 0.5vh, 8px);
		animation: rowReveal 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.aurora-wilds-count {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(52px, 14vw, 130px);
		font-weight: 900;
		line-height: 1;
		color: #ffffff;
		text-shadow:
			0 0 20px rgba(0, 220, 180, 0.6),
			0 0 40px rgba(0, 180, 255, 0.4),
			0 4px 8px rgba(0, 0, 0, 0.6);
		animation: countPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both;
	}

	.aurora-wilds-text {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(13px, 3.5vw, 26px);
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(0, 230, 200, 0.9);
		text-shadow:
			0 0 12px rgba(0, 220, 180, 0.5),
			0 1px 3px rgba(0, 0, 0, 0.5);
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes contentPop {
		from { opacity: 0; transform: scale(0.72); }
		to { opacity: 1; transform: scale(1); }
	}

	@keyframes rowReveal {
		from { opacity: 0; transform: translateY(18px) scale(0.9); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	@keyframes countPulse {
		0% { transform: scale(0.7); }
		60% { transform: scale(1.06); }
		100% { transform: scale(1); }
	}

	@keyframes labelGlow {
		from { text-shadow: 0 0 24px rgba(180, 77, 255, 0.7), 0 0 50px rgba(150, 50, 220, 0.4), 0 2px 4px rgba(0,0,0,0.7); }
		to   { text-shadow: 0 0 36px rgba(180, 77, 255, 0.95), 0 0 70px rgba(150, 50, 220, 0.6), 0 2px 4px rgba(0,0,0,0.7); }
	}

	@keyframes bandSweep {
		0%   { opacity: 0; transform: translateX(-8%) scaleX(0.9); }
		30%  { opacity: 1; }
		70%  { opacity: 0.8; }
		100% { opacity: 0; transform: translateX(8%) scaleX(1.08); }
	}
</style>
