<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { getMaskDimensions, FRAME_X_OFFSET, FRAME_Y_OFFSET } from '../game/uiLayout';

	type Props = {
		isMask?: boolean;
		inBoardSpace?: boolean;
		scale?: number;
		alpha?: number;
	};

	const props: Props = $props();

	const context = getContext();

	// Mask dimensions drive the layout - frame will scale to match
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const maskDims = $derived(getMaskDimensions(boardLayout));

	const scale = $derived(props.scale ?? 1);
	const scaledWidth = $derived(maskDims.width * scale);
	const scaledHeight = $derived(maskDims.height * scale);

	const boardSpaceX = $derived((maskDims.width - scaledWidth) * 0.5);
	const boardSpaceY = $derived((maskDims.height - scaledHeight) * 0.5);
	const containerSpaceX = $derived(boardLayout.x + FRAME_X_OFFSET);
	const containerSpaceY = $derived(boardLayout.y + FRAME_Y_OFFSET);
</script>

<!--
	Sprite-based reel mask overlay.
	Must be at MainContainer level to share coordinate space with BoardFrame.
	Mask dimensions are the source of truth - frame scales to match.
-->
<Sprite
	key="reelMask"
	isMask={props.isMask}
	alpha={props.alpha}
	anchor={props.inBoardSpace ? 0 : 0.5}
	x={props.inBoardSpace ? boardSpaceX : containerSpaceX}
	y={props.inBoardSpace ? boardSpaceY : containerSpaceY}
	width={scaledWidth}
	height={scaledHeight}
/>
