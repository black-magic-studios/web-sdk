<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Container } from 'pixi-svelte';
	import { getContextBoard } from 'components-shared';

	import { getContext } from '../game/context';

	type Props = {
		x: number;
		y: number;
		animating: boolean;
		children: Snippet;
	};

	const props: Props = $props();
	const context = getContext();
	const boardContext = getContextBoard();

	// Use dynamic board width/height for bounds check (cached via $derived)
	const boardWidth = $derived(context.stateGameDerived.boardLayout().width);
	const boardHeight = $derived(context.stateGameDerived.boardLayout().height);

	const show = $derived(
		(boardContext.animate && props.animating) || (!boardContext.animate && !props.animating),
	);
	const left = 0;
	const top = 0;
	const right = $derived(boardWidth);
	const bottom = $derived(boardHeight);
	const inFrame = $derived(
		props.x >= left && props.x <= right && props.y >= top && props.y <= bottom,
	);
</script>

{#if show && inFrame}
	<Container x={props.x} y={props.y} zIndex={props.animating ? 1000 : 0}>
		{@render props.children()}
	</Container>
{/if}
