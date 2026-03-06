<script lang="ts">
	import { stateSound } from 'state-shared';
	import { getContext } from '../game/context';

	type Props = { show: boolean; onclose: () => void };
	let { show = $bindable(), onclose }: Props = $props();

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const menuScale = $derived(Math.min(1, Math.max(0.55, (boardLayout.width * 1.25) / 500)));
	const isPortrait = $derived(window.innerHeight > window.innerWidth);
	const menuStyle = $derived.by(() => {
		if (isPortrait) {
			return `left: 50%; right: auto; transform: translateX(-50%) scale(${menuScale}); transform-origin: bottom center;`;
		}
		const playbarLeft = Math.max(0, boardLayout.x - (boardLayout.width * 1.25) / 2);
		return `left: ${playbarLeft}px; transform: scale(${menuScale}); transform-origin: bottom left;`;
	});

	const handleInfo = () => {
		context.eventEmitter.broadcast({ type: 'gameInfoOpen' } as any);
		onclose();
	};

	const toggleSfx = () => {
		stateSound.volumeValueSoundEffect = stateSound.volumeValueSoundEffect > 0 ? 0 : 75;
	};

	const toggleMusic = () => {
		stateSound.volumeValueMusic = stateSound.volumeValueMusic > 0 ? 0 : 75;
	};
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onclose}></div>

	<div class="menu" style="{menuStyle}">
		<!-- INFO row -->
		<button class="menu-row info-row" onclick={handleInfo}>
			<span class="icon-circle">
				<span class="icon-i">i</span>
			</span>
			<span class="row-label">INFO</span>
		</button>

		<!-- SFX Volume -->
		<div class="menu-row volume-row">
			<button class="icon-circle" onclick={toggleSfx}>
				<svg class="vol-icon" viewBox="0 0 24 24" fill="none">
					<path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
					{#if stateSound.volumeValueSoundEffect > 0}
						<path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
						<path d="M18.07 5.93a9 9 0 010 12.14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					{:else}
						<line x1="18" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
						<line x1="22" y1="9" x2="18" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					{/if}
				</svg>
			</button>
			<input
				type="range"
				min="0"
				max="100"
				bind:value={stateSound.volumeValueSoundEffect}
				class="slider"
			/>
		</div>

		<!-- Music Volume -->
		<div class="menu-row volume-row">
			<button class="icon-circle" onclick={toggleMusic}>
				<svg class="vol-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
					{#if stateSound.volumeValueMusic === 0}
						<line x1="2" y1="4" x2="22" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					{/if}
				</svg>
			</button>
			<input
				type="range"
				min="0"
				max="100"
				bind:value={stateSound.volumeValueMusic}
				class="slider"
			/>
		</div>

		<!-- Close -->
		<button class="close-row" onclick={onclose}>
			<span class="close-x">✕</span>
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
		left: 0;
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
		min-width: 180px;
		max-width: calc(100vw - 16px);
		animation: menuSlideIn 0.2s ease-out;
	}

	@keyframes menuSlideIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.menu-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		border: none;
		background: transparent;
		color: #d0e8f8;
		cursor: pointer;
		transition: background 0.15s;
		font-family: 'Montserrat', Arial, sans-serif;

		&:hover {
			background: rgba(80, 140, 200, 0.1);
		}
	}

	.info-row {
		border-bottom: 1px solid rgba(120, 180, 220, 0.12);
	}

	.row-label {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}

	.icon-circle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(60, 100, 140, 0.3);
		border: 1.5px solid rgba(120, 180, 220, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		color: #90c8e8;

		&:hover {
			background: rgba(80, 130, 180, 0.4);
			border-color: rgba(140, 200, 240, 0.5);
		}
	}

	.icon-i {
		font-family: Georgia, serif;
		font-size: 16px;
		font-weight: bold;
		font-style: italic;
		color: #90c8e8;
		line-height: 1;
	}

	.vol-icon {
		width: 18px;
		height: 18px;
		color: #90c8e8;
	}

	.volume-row {
		padding: 8px 16px;
		cursor: default;

		&:last-of-type {
			border-bottom: 1px solid rgba(120, 180, 220, 0.12);
		}
	}

	.slider {
		flex: 1;
		-webkit-appearance: none;
		appearance: none;
		height: 4px;
		border-radius: 2px;
		background: rgba(80, 130, 180, 0.3);
		outline: none;
		cursor: pointer;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background: #68b8e0;
			border: 2px solid rgba(20, 20, 30, 0.9);
			cursor: pointer;
			transition: background 0.15s;

			&:hover {
				background: #90d0f0;
			}
		}

		&::-moz-range-thumb {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background: #68b8e0;
			border: 2px solid rgba(20, 20, 30, 0.9);
			cursor: pointer;
		}
	}

	.close-row {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: background 0.15s;

		&:hover {
			background: rgba(200, 80, 80, 0.15);
		}
	}

	.close-x {
		font-size: 18px;
		color: #90c8e8;
		font-weight: 300;
	}
</style>
