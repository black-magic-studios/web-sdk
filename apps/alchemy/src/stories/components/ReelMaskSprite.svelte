<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../../game/context';
	import { getMaskDimensions, FRAME_X_OFFSET, FRAME_Y_OFFSET } from '../../game/uiLayout';

	const context = getContext();

	// Mask dimensions drive the layout - frame will scale to match
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const maskDims = $derived(getMaskDimensions(boardLayout));
</script>

<!--
	Sprite-based reel mask overlay (story-only).
	Must be at MainContainer level to share coordinate space with BoardFrame.
	Mask dimensions are the source of truth - frame scales to match.
-->
<Sprite
	key="reelMask"
	anchor={0.5}
	x={boardLayout.x + FRAME_X_OFFSET}
	y={boardLayout.y + FRAME_Y_OFFSET}
	width={maskDims.width}
	height={maskDims.height}
/>
