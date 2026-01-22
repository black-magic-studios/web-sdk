<script lang="ts">
	import { Rectangle } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { getMaskDimensions } from '../game/uiLayout';

	type Props = {
		debug?: boolean;
		scale?: number;
	};

	const props: Props = $props();
	const context = getContext();

	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const maskDims = $derived(getMaskDimensions(boardLayout));

	const scale = $derived(props.scale ?? 1);
	const scaledWidth = $derived(maskDims.width * scale);
	const scaledHeight = $derived(maskDims.height * scale);
	const x = $derived((maskDims.width - scaledWidth) * 0.5);
	const y = $derived((maskDims.height - scaledHeight) * 0.5);
</script>

{#if props.debug}
	<Rectangle
		alpha={0.5}
		backgroundColor={0xffffff}
		x={x}
		y={y}
		width={scaledWidth}
		height={scaledHeight}
	/>
{/if}

<Rectangle isMask x={x} y={y} width={scaledWidth} height={scaledHeight} />
