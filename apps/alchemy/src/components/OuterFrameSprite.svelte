<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { Sprite, getContextApp } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';

	const context = getContext();
	const contextApp = getContextApp();

	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// Frame texture dimensions (reelframe_overlay_1024x832.png)
	const FRAME_TEX = { width: 1024, height: 832 };
	// Inner mask area dimensions (must match reel_mask.png: 916x742)
	const INNER_MASK = { width: 916, height: 742 };

	const frameTexture = $derived(
		(contextApp.stateApp.loadedAssets?.reelFrameEdge || PIXI.Texture.EMPTY) as PIXI.Texture,
	);

	// Calculate scale so the inner 916x742 area matches the mask dimensions
	const scaleX = $derived(MASK_WIDTH / INNER_MASK.width);
	const scaleY = $derived(MASK_HEIGHT / INNER_MASK.height);
	const scale = $derived(Math.max(scaleX, scaleY));

	const width = $derived(FRAME_TEX.width * scale);
	const height = $derived(FRAME_TEX.height * scale);

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
	width={width}
	height={height}
/>
