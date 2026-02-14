<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { Sprite, getContextApp } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';

	const context = getContext();
	const contextApp = getContextApp();

	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	const frameTexture = $derived(
		(contextApp.stateApp.loadedAssets?.reelFrameEdge || PIXI.Texture.EMPTY) as PIXI.Texture,
	);

	// Get actual texture dimensions dynamically
	const texWidth = $derived(frameTexture.width || 1);
	const texHeight = $derived(frameTexture.height || 1);

	// Add border padding around the symbols (in pixels, adjust as needed)
	const BORDER_PADDING = 0;

	// Scale frame to fit the mask area plus border padding
	const targetWidth = $derived(MASK_WIDTH + BORDER_PADDING * 2);
	const targetHeight = $derived(MASK_HEIGHT + BORDER_PADDING * 2);

	// NOTE: This component is rendered inside `boardRoot` (already positioned).
	// Use board-local center so the frame stays locked to the mask/board center.
	const x = $derived(boardLayout.width * 0.5);
	const y = $derived(boardLayout.height * 0.5);
</script>

<!-- Outer frame wraps the mask and scales from the mask rect -->
<Sprite
	key="reelFrameEdge"
	anchor={0.5}
	x={x}
	y={y}
	width={targetWidth}
	height={targetHeight}
/>
