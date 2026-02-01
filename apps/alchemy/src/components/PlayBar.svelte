<script lang="ts">
	import { onMount } from 'svelte';
	import { BaseSprite, Container, Circle } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';
	import { BAR_WIDTH_RATIO, BUTTON_GAP_RATIO } from '../game/uiLayout';
	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// Texture state
	let barTexture = $state<Texture>(Texture.EMPTY);
	let playTexture = $state<Texture>(Texture.EMPTY);
	let autoTexture = $state<Texture>(Texture.EMPTY);
	let assetsLoaded = $state(false);

	// Original bar texture dimensions (for scale calculation)
	// Use reasonable defaults based on expected asset size to prevent initial bad positioning
	const DEFAULT_BAR_WIDTH = 1200;
	const DEFAULT_BAR_HEIGHT = 120;
	let barNativeWidth = $state(DEFAULT_BAR_WIDTH);
	let barNativeHeight = $state(DEFAULT_BAR_HEIGHT);

	// ============================================================
	// CONFIGURATION - ALL VALUES ARE RATIOS (Resolution Independent)
	// ============================================================
	const SPIN_BUTTON_SCALE_RATIO = 1.4;
	const AUTO_BUTTON_SCALE_RATIO = 0.55;
	const AUTOPLAY_MARGIN_RATIO = 0.06;
	
	// Margin below the board as ratio of board height
	const PLAYBAR_MARGIN_RATIO = 0.05;

	// ============================================================
	// DERIVED LAYOUT (reactive - updates on resize)
	// ============================================================

	// Target bar width (linked to dynamic board width)
	const targetBarWidth = $derived(boardLayout.width * BAR_WIDTH_RATIO);
	
	// Bar scale factor
	const barScale = $derived(barNativeWidth > 0 ? targetBarWidth / barNativeWidth : 1);
	
	// Scaled bar dimensions
	const scaledBarWidth = $derived(barNativeWidth * barScale);
	const scaledBarHeight = $derived(barNativeHeight * barScale);
	
	// Dynamic button sizes based on bar height
	const spinButtonSize = $derived(scaledBarHeight * SPIN_BUTTON_SCALE_RATIO);
	const autoButtonSize = $derived(scaledBarHeight * AUTO_BUTTON_SCALE_RATIO);
	
	// Dynamic button X positions (relative to bar center at x=0)
	const autoplayX = $derived((scaledBarWidth * 0.5) - (scaledBarWidth * AUTOPLAY_MARGIN_RATIO) - (autoButtonSize * 0.5));
	const buttonGap = $derived(scaledBarWidth * BUTTON_GAP_RATIO);
	const spinButtonX = $derived(autoplayX - (autoButtonSize * 0.5) - buttonGap - (spinButtonSize * 0.5));
	
	// ============================================================
	// POSITION RELATIVE TO BOARD
	// BoardContainer has pivot at (width/2, height/2), which means:
	// - Local (0, 0) = TOP-LEFT of board
	// - Local (width/2, height/2) = CENTER of board
	// - Local (width/2, height) = BOTTOM-CENTER of board
	// ============================================================
	
	// X: Center horizontally = half the board width
	const containerX = $derived(boardLayout.width / 2);
	
	// Y: Position below the board
	// boardLayout.height = bottom edge of board (in local coords)
	// + scaledBarHeight / 2 = offset so bar's center is below board
	// + margin = gap between board and bar
	const margin = $derived(boardLayout.height * PLAYBAR_MARGIN_RATIO);
	const containerY = $derived(boardLayout.height + (scaledBarHeight / 2) + margin);

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
			console.log('PlayBar: Assets loaded, native bar size:', bar.width, 'x', bar.height);
			console.log('PlayBar: Board dimensions:', boardLayout.width, 'x', boardLayout.height);
			console.log('PlayBar: Container position will be x:', containerX, 'y:', containerY);
		} catch (error) {
			console.error('Failed to load PlayBar assets:', error);
		}
	});
	
	// Debug: Log position changes
	$effect(() => {
		if (assetsLoaded) {
			console.log('PlayBar position updated - x:', containerX, 'y:', containerY, 
				'boardHeight:', boardLayout.height, 'scaledBarHeight:', scaledBarHeight);
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
	PLAYBAR - Inside BoardContainer for proper scaling/positioning
	- zIndex: 20 (highest, always on top of symbols)
	- Position: Below the board, relative to board center
	- BoardContainer pivot is (width/2, height/2), so x=0,y=0 is board center
-->
<BoardContainer zIndex={20}>
	<Container x={containerX} y={containerY}>
	
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
</BoardContainer>


