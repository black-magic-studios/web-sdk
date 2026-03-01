<script lang="ts">
	import { getContext } from '../game/context';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	const loaded = $derived(context.stateApp.loaded);
	const progress = $derived(context.stateApp.loadingProgress);

	function handleClick() {
		if (loaded) props.onloaded();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="loading-overlay" class:loaded onclick={handleClick}>
	<div class="content">
		<!-- Feature characters image — renders on top of the title -->
		<div class="image-wrapper">
			<img
				src="./assets/sprites/symbolsStatic/feature_characters.png"
				alt="Arctic Clusters Characters"
				class="feature-image"
			/>
		</div>

		<!-- Title sits below but overlaps the paws at the bottom of the image -->
		<div class="title-wrap">
			<h1 class="game-title">ARCTIC CLUSTERS</h1>
		</div>

		{#if !loaded}
			<div class="progress-wrap">
				<div class="progress-track">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
			</div>
		{:else}
			<div class="click-prompt">CLICK TO PLAY</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.loading-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		cursor: default;
		background: transparent;

		&.loaded {
			cursor: pointer;
		}
	}

	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: min(900px, 92vw);
		padding: 0 16px;
	}

	/* Image renders above the title (z-index 2 vs 1) */
	.image-wrapper {
		position: relative;
		z-index: 2;
		width: 100%;
	}

	.feature-image {
		width: 100%;
		max-height: 54vh;
		object-fit: contain;
		display: block;
		filter: drop-shadow(0 8px 32px rgba(30, 200, 150, 0.22));
	}

	/* Pull title up so the characters' paws hang slightly over it */
	.title-wrap {
		position: relative;
		z-index: 1;
		margin-top: -5%;
		width: 100%;
		text-align: center;
	}

	.game-title {
		font-family: 'Montserrat', 'Arial Black', Arial, sans-serif;
		font-size: clamp(26px, 5.5vw, 68px);
		font-weight: 900;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #ffffff;
		text-shadow:
			0 0 18px rgba(50, 220, 180, 0.95),
			0 0 36px rgba(50, 180, 255, 0.45),
			0 2px 6px rgba(0, 0, 0, 0.9);
		margin: 0;
		padding: 6px 0;
	}

	.progress-wrap {
		margin-top: 24px;
		width: 70%;
		max-width: 480px;
	}

	.progress-track {
		width: 100%;
		height: 5px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #0ac8a0, #4466ff, #a040d0, #0ac8a0);
		background-size: 200% 100%;
		border-radius: 3px;
		transition: width 0.15s ease;
		animation: shimmer 2.2s linear infinite;
	}

	.click-prompt {
		margin-top: 24px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(13px, 2.2vw, 20px);
		font-weight: 700;
		letter-spacing: 0.22em;
		color: rgba(100, 225, 200, 0.92);
		animation: pulse 1.6s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%   { background-position: 0% 0; }
		100% { background-position: 200% 0; }
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.45; }
	}
</style>
