<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as PIXI from 'pixi.js';

	import { Container, Graphics } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		children: Snippet;
		zIndex?: number;
		masked?: boolean;
	};

	const props: Props = $props();
	const context = getContext();

	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// Draw a rectangle mask matching the board dimensions
	// In local coordinates (after pivot), the board goes from (0,0) to (width, height)
	const drawMask = (g: PIXI.Graphics) => {
		g.rect(0, 0, boardLayout.width, boardLayout.height);
		g.fill({ color: 0xffffff });
	};
</script>

<Container
	x={boardLayout.x}
	y={boardLayout.y}
	pivot={boardLayout.pivot}
	zIndex={props.zIndex}
	sortableChildren={true}
>
	{#if props.masked}
		<Graphics draw={drawMask} isMask />
	{/if}
	{@render props.children()}
</Container>
