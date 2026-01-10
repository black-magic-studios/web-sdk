<script lang="ts">
	import { onMount } from 'svelte';
	import { BaseSprite, Container } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import { ButtonBet } from 'components-ui-pixi';
	import { getContext } from '../game/context';

	const context = getContext();

	let texture = $state<Texture>(Texture.EMPTY);
	let textureLoaded = $state(false);

	// Original texture dimensions (will be populated on load)
	let textureWidth = $state(1);
	let textureHeight = $state(1);

	// ============================================================
	// RESPONSIVE LAYOUT CONFIGURATION
	// ============================================================
	
	// Play Bar width = 115% of Reel Frame width (extends slightly beyond edges)
	const PLAY_BAR_WIDTH_RATIO = 1.15;
	
	// Vertical padding below the Reel Frame (negative = overlap with frame)
	const VERTICAL_PADDING = -70;
	
	// Frame scale from BoardFrame.svelte (must match)
	const FRAME_SCALE = 1.50;

	// ============================================================
	// DERIVED LAYOUT CALCULATIONS (runs on every resize)
	// ============================================================
	
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	
	// Reel Frame dimensions (matching BoardFrame.svelte)
	const reelFrameWidth = $derived(boardLayout.width * FRAME_SCALE);
	const reelFrameHeight = $derived(boardLayout.width * FRAME_SCALE); // Square frame
	
	// Play Bar target width (115% of reel frame)
	const playBarTargetWidth = $derived(reelFrameWidth * PLAY_BAR_WIDTH_RATIO);
	
	// Calculate uniform scale to maintain aspect ratio
	// Scale based on width to achieve target width, height scales proportionally
	const playBarScale = $derived(textureWidth > 0 ? playBarTargetWidth / textureWidth : 1);
	
	// Position: Centered horizontally with Reel Container
	const centerX = $derived(boardLayout.x);
	
	// Position: Just below Reel Frame bottom edge + padding
	// With anchor 0.5, the sprite center is at Y position
	// Frame bottom = boardLayout.y + half frame height
	const belowFrameY = $derived(
		boardLayout.y + (reelFrameHeight * 0.5) + VERTICAL_PADDING
	);

	onMount(async () => {
		try {
			texture = await Assets.load('/assets/sprites/buttons/play_bar_new.png');
			textureWidth = texture.width;
			textureHeight = texture.height;
			textureLoaded = true;
			console.log('PlayBar texture loaded:', textureWidth, 'x', textureHeight);
			console.log('PlayBar scale:', playBarScale, 'target width:', playBarTargetWidth);
		} catch (error) {
			console.error('Failed to load play_bar_new texture:', error);
		}
	});
</script>

<Container x={centerX} y={belowFrameY} zIndex={10}>
	<!-- Play Bar Asset - uniform scaling maintains aspect ratio -->
	{#if textureLoaded}
		<BaseSprite 
			{texture} 
			anchor={0.5} 
			scale={playBarScale}
		/>
	{/if}

	<!-- Play Button centered on the bar -->
	<ButtonBet anchor={0.5} scale={1.2} />
</Container>
