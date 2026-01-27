<script lang="ts">
	import { Rectangle } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = { debug?: boolean };

	const props: Props = $props();
	const context = getContext();

	// Use dynamic dimensions from stateGameDerived (cached)
	const maskWidth = $derived(context.stateGameDerived.maskWidth());
	const maskHeight = $derived(context.stateGameDerived.maskHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());
</script>

{#if props.debug}
	<Rectangle
		alpha={0.5}
		backgroundColor={0xffffff}
		width={maskWidth}
		height={maskHeight}
	/>
{/if}

<Rectangle
	isMask
	x={0}
	y={0}
	width={maskWidth}
	height={maskHeight}
/>
