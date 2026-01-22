<script lang="ts">
	import { Rectangle } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { SYMBOL_WIDTH, SYMBOL_HEIGHT } from '../game/constants';

	type Props = { debug?: boolean };

	const props: Props = $props();
	const context = getContext();
</script>

{#if props.debug}
	<Rectangle
		alpha={0.5}
		backgroundColor={0xffffff}
		width={context.stateGameDerived.boardLayout().width}
		height={context.stateGameDerived.boardLayout().height}
	/>
{/if}

<Rectangle
	isMask
	x={-SYMBOL_WIDTH}
	y={-SYMBOL_HEIGHT * 0.5}
	width={context.stateGameDerived.boardLayout().width + SYMBOL_WIDTH * 2}
	height={context.stateGameDerived.boardLayout().height + SYMBOL_HEIGHT}
/>
