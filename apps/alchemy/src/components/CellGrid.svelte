<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';
	import { GRID_COLS, GRID_ROWS } from '../game/constants';
	import BoardContainer from './BoardContainer.svelte';

	type Props = {
		/** Render inside an existing BoardContainer (board-local coordinates). */
		inBoardSpace?: boolean;
	};

	const props: Props = $props();

	const context = getContext();

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());

	// Cell size slightly smaller than symbol to create visual gap
	const CELL_GAP_RATIO = 0.96; // 4% gap between cells
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);

	// Create array of grid positions
	const gridPositions = Array.from({ length: GRID_COLS }, (_, col) =>
		Array.from({ length: GRID_ROWS }, (_, row) => ({ col, row }))
	).flat();
</script>

{#snippet content()}
	{#each gridPositions as { col, row }}
		<Container
			x={getSymbolXDynamic(col, symbolWidth)}
			y={getSymbolYDynamic(row, symbolHeight)}
		>
			<Sprite
				key="cellBackground"
				anchor={0.5}
				width={cellWidth}
				height={cellHeight}
			/>
		</Container>
	{/each}
{/snippet}

{#if props.inBoardSpace}
	{@render content()}
{:else}
	<BoardContainer>
		{@render content()}
	</BoardContainer>
{/if}
