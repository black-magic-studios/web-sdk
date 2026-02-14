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
	let fastPlayTexture = $state<Texture>(Texture.EMPTY);
	let evenFasterTexture = $state<Texture>(Texture.EMPTY);
	let buyTexture = $state<Texture>(Texture.EMPTY);
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
	const SMALL_BUTTON_SCALE_RATIO = 1.4 * 0.5; // 50% of play button size
	const BUY_BUTTON_SCALE_RATIO = 1.4 * 0.8; // 80% of play button size
	const SPIN_BUTTON_MARGIN_RATIO = 0.06; // Margin from right edge for spin button
	const BUY_MARGIN_RATIO = 0.06; // Margin from left edge for buy button
	const SMALL_BUTTON_GAP_RATIO = 0.01; // Horizontal gap between small buttons
	
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
	const smallButtonSize = $derived(scaledBarHeight * SMALL_BUTTON_SCALE_RATIO);
	const buyButtonSize = $derived(scaledBarHeight * BUY_BUTTON_SCALE_RATIO);
	
	// Dynamic button X positions (relative to bar center at x=0)
	const smallButtonGap = $derived(scaledBarWidth * SMALL_BUTTON_GAP_RATIO);
	
	// Spin button: positioned toward the right side, leaving room for small buttons on the right
	const spinButtonX = $derived(0);
	
	// Small buttons in a row to the RIGHT of spin button: autoplay, fast play, even faster play
	// They go left to right after the spin button (can overlap bar edge)
	const autoplayX = $derived(spinButtonX + (spinButtonSize * 0.5) + smallButtonGap + (smallButtonSize * 0.5));
	const fastPlayX = $derived(autoplayX + smallButtonSize + smallButtonGap);
	const evenFasterX = $derived(fastPlayX + smallButtonSize + smallButtonGap);
	
	// Buy button: positioned to the LEFT of the bar (outside the bar area)
	const buyButtonX = $derived(-(scaledBarWidth * 0.5) - (scaledBarWidth * BUY_MARGIN_RATIO) - (buyButtonSize * 0.5));
	
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
			const [bar, play, auto, fastPlay, evenFaster, buy] = await Promise.all([
				Assets.load('/assets/sprites/buttons/play_bar_new.png'),
				Assets.load('/assets/sprites/buttons/play_button.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_autoplay.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_fast_play.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_even_faster_play.png'),
				Assets.load('/assets/sprites/buttons/black_magic_studios_buy_button.png'),
			]);
			
			barTexture = bar;
			barNativeWidth = bar.width;
			barNativeHeight = bar.height;
			
			playTexture = play;
			autoTexture = auto;
			fastPlayTexture = fastPlay;
			evenFasterTexture = evenFaster;
			buyTexture = buy;
			
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
	
	const handleFastPlay = () => {
		context.eventEmitter.broadcast({ type: 'turboToggle' });
	};
	
	const handleEvenFasterPlay = () => {
		// TODO: Implement even faster play mode
		context.eventEmitter.broadcast({ type: 'turboToggle' });
	};
	
	const handleBuyBonus = () => {
		context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
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
			- All buttons share this y position for perfect alignment
		-->
		<Container x={0} y={0} zIndex={1}>
			
			<!-- SPIN BUTTON (centered) -->
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

			<!-- AUTOPLAY BUTTON (right of spin button) -->
			<Container x={autoplayX} y={0}>
				<!-- Hit area (invisible) -->
				<Circle
					diameter={smallButtonSize}
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
					width={smallButtonSize}
					height={smallButtonSize}
					anchor={0.5}
				/>
			</Container>
			
			<!-- FAST PLAY BUTTON (right of autoplay) -->
			<Container x={fastPlayX} y={0}>
				<!-- Hit area (invisible) -->
				<Circle
					diameter={smallButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerup={handleFastPlay}
				/>
				<!-- Visual (centered with anchor 0.5) -->
				<BaseSprite
					texture={fastPlayTexture}
					width={smallButtonSize}
					height={smallButtonSize}
					anchor={0.5}
				/>
			</Container>
			
			<!-- EVEN FASTER PLAY BUTTON (right of fast play) -->
			<Container x={evenFasterX} y={0}>
				<!-- Hit area (invisible) -->
				<Circle
					diameter={smallButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerup={handleEvenFasterPlay}
				/>
				<!-- Visual (centered with anchor 0.5) -->
				<BaseSprite
					texture={evenFasterTexture}
					width={smallButtonSize}
					height={smallButtonSize}
					anchor={0.5}
				/>
			</Container>
			
			<!-- BUY BONUS BUTTON (to the left of the bar) -->
			<Container x={buyButtonX} y={0}>
				<!-- Hit area (invisible) -->
				<Circle
					diameter={buyButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerup={handleBuyBonus}
				/>
				<!-- Visual (centered with anchor 0.5) -->
				<BaseSprite
					texture={buyTexture}
					width={buyButtonSize}
					height={buyButtonSize}
					anchor={0.5}
				/>
			</Container>
			
		</Container>
	{/if}
	
	</Container>
</BoardContainer>


