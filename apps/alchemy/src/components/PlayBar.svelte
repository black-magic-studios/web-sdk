<script lang="ts">
	import { onMount } from 'svelte';
	import { BaseSprite, Container, Circle } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';
	import { BAR_WIDTH_RATIO, REEL_PADDING_RATIO, BUTTON_GAP_RATIO } from '../game/uiLayout';
	import { getContext } from '../game/context';

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// Texture state
	let barTexture = $state<Texture>(Texture.EMPTY);
	let playTexture = $state<Texture>(Texture.EMPTY);
	let autoTexture = $state<Texture>(Texture.EMPTY);
	let assetsLoaded = $state(false);

	// Original bar texture dimensions (for scale calculation)
	let barNativeWidth = $state(1);
	let barNativeHeight = $state(1);

	// ============================================================
	// CONFIGURATION - ALL VALUES ARE RATIOS (Resolution Independent)
	// ============================================================
	// Button sizes relative to Play Bar scaled height
	const SPIN_BUTTON_SCALE_RATIO = 1.4; // Spin button = 140% of bar height
	const AUTO_BUTTON_SCALE_RATIO = 0.55; // Autoplay = 55% of bar height

	// Vertical position of buttons relative to bar height (0 = centered)
	const BUTTON_Y_RATIO = 0;

	// Autoplay margin from right edge as ratio of bar width
	const AUTOPLAY_MARGIN_RATIO = 0.06;

	// ============================================================
	// DERIVED LAYOUT (reactive - updates on resize)
	// Uses dynamic board dimensions from stateGameDerived
	// ============================================================

	// Target bar width (linked to dynamic board width)
	const targetBarWidth = $derived(boardLayout.width * BAR_WIDTH_RATIO);
	
	// Bar scale factor (only the background scales, not buttons)
	const barScale = $derived(barNativeWidth > 0 ? targetBarWidth / barNativeWidth : 1);
	
	// Scaled bar dimensions
	const scaledBarWidth = $derived(barNativeWidth * barScale);
	const scaledBarHeight = $derived(barNativeHeight * barScale);
	
	// Dynamic button sizes based on bar height
	const spinButtonSize = $derived(scaledBarHeight * SPIN_BUTTON_SCALE_RATIO);
	const autoButtonSize = $derived(scaledBarHeight * AUTO_BUTTON_SCALE_RATIO);
	
	// Dynamic button Y position (relative to bar height)
	const buttonY = $derived(scaledBarHeight * BUTTON_Y_RATIO);
	
	// Dynamic button X positions (relative to bar width)
	const autoplayX = $derived((scaledBarWidth * 0.5) - (scaledBarWidth * AUTOPLAY_MARGIN_RATIO) - (autoButtonSize * 0.5));
	const buttonGap = $derived(scaledBarWidth * BUTTON_GAP_RATIO);
	const spinButtonX = $derived(autoplayX - (autoButtonSize * 0.5) - buttonGap - (spinButtonSize * 0.5));
	
	// ============================================================
	// BOTTOM UI CONTAINER POSITION
	// Position the entire UI container directly centered under the symbols
	// Uses the same boardLayout logic as the symbols for consistency
	// ============================================================
	
	// X: Use board center X for proper alignment with symbols
	const containerX = $derived(boardLayout.x);
	
	// Y: Position directly below the board with consistent margin
	// boardLayout.y is the center of the board, add half height to get bottom edge
	const boardBottomY = $derived(boardLayout.y + boardLayout.height * 0.5);
	const barMargin = $derived(scaledBarHeight * 0.15); // Small gap between board and bar
	const halfBarHeight = $derived(scaledBarHeight * 0.5);
	const desiredY = $derived(boardBottomY + halfBarHeight + barMargin);
	const safeMargin = $derived(canvas.height * 0.02);
	const maxY = $derived(canvas.height - halfBarHeight - safeMargin);
	const containerY = $derived(Math.min(maxY, desiredY));

	// Bet disabled state
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());

	// ============================================================
	// ASSET LOADING
	// ============================================================
	
	onMount(async () => {
		try {
			const [bar, play, auto] = await Promise.all([
				Assets.load('/assets/sprites/buttons/play_bar_new.png'),
				Assets.load('/assets/sprites/buttons/play_button.png'),
				Assets.load('/assets/sprites/buttons/auto_play_square.png'),
			]);
			
			barTexture = bar;
			barNativeWidth = bar.width;
			barNativeHeight = bar.height;
			
			playTexture = play;
			autoTexture = auto;
			
			assetsLoaded = true;
			console.log('PlayBar assets loaded - Bar native size:', bar.width, 'x', bar.height);
		} catch (error) {
			console.error('Failed to load PlayBar assets:', error);
		}
	});
	
	// ============================================================
	// BUTTON HANDLERS
	// ============================================================
	
	const handleSpin = () => {
		context.eventEmitter.broadcast({ type: 'bet' });
	};
	
	const handleAutoPlay = () => {
		context.eventEmitter.broadcast({ type: 'autoSpinOpen' });
	};
</script>

<!--
	BOTTOM UI CONTAINER
	- Positioned at: Reels.CenterX, Reels.BottomY + Padding
	- All children use local coordinates relative to this container's center
	- All sizing/positioning uses RATIOS for resolution independence
-->
<Container x={containerX} y={containerY} zIndex={10}>
	
	{#if assetsLoaded}
		<!--
			LAYER 1: BACKGROUND (Scalable Element)
			- Anchor: center (0.5, 0.5)
			- Position: (0, 0) local
			- Scaling: Scales to 115% of reel width
		-->
		<BaseSprite 
			texture={barTexture} 
			anchor={0.5}
			x={0}
			y={0}
			scale={barScale}
			zIndex={0}
		/>

		<!--
			LAYER 2: BUTTONS CONTAINER
			- Positioned at y=0 (vertical center of bar)
			- Both buttons share this y position for perfect alignment
		-->
		<Container x={0} y={0} zIndex={1}>
			
			<!-- SPIN BUTTON -->
			<Container x={spinButtonX} y={0}>
				<OnHotkey hotkey="Space" {disabled} onpress={handleSpin} />
				<!-- Hit area (invisible) -->
				<Circle
					diameter={spinButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor={disabled ? 'not-allowed' : 'pointer'}
					onpointerup={disabled ? undefined : handleSpin}
				/>
				<!-- Visual (centered with anchor 0.5) -->
				<BaseSprite
					texture={playTexture}
					width={spinButtonSize}
					height={spinButtonSize}
					anchor={0.5}
					{...(disabled ? { tint: 0xaaaaaa } : {})}
				/>
			</Container>

			<!-- AUTOPLAY BUTTON -->
			<Container x={autoplayX} y={0}>
				<!-- Hit area (invisible) -->
				<Circle
					diameter={autoButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerup={handleAutoPlay}
				/>
				<!-- Visual (centered with anchor 0.5) -->
				<BaseSprite
					texture={autoTexture}
					width={autoButtonSize}
					height={autoButtonSize}
					anchor={0.5}
				/>
			</Container>
			
		</Container>
	{/if}
	
</Container>


