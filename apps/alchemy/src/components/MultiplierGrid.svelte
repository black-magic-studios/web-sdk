<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridClear' };
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { BitmapText, Container, Sprite } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';

	type Props = {
		/** Render inside an existing BoardContainer (board-local coordinates). */
		inBoardSpace?: boolean;
		/** Whether this is the persistent instance (for debugging) */
		persistent?: boolean;
	};

	const props: Props = $props();

	const context = getContext();
	const DEFAULT_GRID = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	];

	// Instance ID for tracking mount/unmount
	const instanceId = Math.random().toString(36).slice(2, 8);

	// Use GLOBAL state from context - survives component remounts!
	const grid = $derived(context.stateGame.multiplierGrid);

	// Lifecycle logging
	onMount(() => {
		console.log(`[MultiplierGrid:${instanceId}] 🟢 MOUNTED at ${Date.now()}, inBoardSpace=${props.inBoardSpace}, persistent=${props.persistent}`);
	});

	onDestroy(() => {
		console.log(`[MultiplierGrid:${instanceId}] 🔴 DESTROYED at ${Date.now()}, inBoardSpace=${props.inBoardSpace}, persistent=${props.persistent}`);
	});

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());

	// Cell size - match CellGrid sizing (0.96 gap ratio)
	const CELL_GAP_RATIO = 0.96;
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);

	// Check if grid has any multipliers > 1
	const hasMultipliers = $derived(grid.some((reel) => reel.some((m) => m > 1)));

	// Tint colors for each multiplier level
	const MULTIPLIER_TINTS: Record<number, number> = {
		2: 0x44ff44,     // Green
		4: 0x4488ff,     // Blue
		8: 0xaa44ff,     // Purple
		16: 0xffaa44,    // Orange
		32: 0xff4444,    // Red
		64: 0xffff44,    // Gold
		128: 0x44ffff,   // Cyan
		256: 0xff44aa,   // Pink
		512: 0xffffff,   // White
		1024: 0xff00ff,  // Magenta
	};

	function getMultiplierTint(multiplier: number): number {
		return MULTIPLIER_TINTS[multiplier] ?? 0xffffff;
	}

	context.eventEmitter.subscribeOnMount({
		multiplierGridUpdate: (emitterEvent) => {
			const multiplierCount = emitterEvent.grid.flat().filter(m => m > 1).length;
			console.log(`[MultiplierGrid:${instanceId}] 📥 UPDATE at ${Date.now()}`, {
				multiplierCount,
				grid: JSON.stringify(emitterEvent.grid),
			});
			// Update GLOBAL state - persists across component remounts
			context.stateGame.multiplierGrid = emitterEvent.grid;
		},
		multiplierGridClear: () => {
			console.log(`[MultiplierGrid:${instanceId}] 🧹 CLEAR at ${Date.now()}`);
			console.trace('[MultiplierGrid] Clear call stack:');
			// Update GLOBAL state
			context.stateGame.multiplierGrid = DEFAULT_GRID;
		},
	});

	// Track hasMultipliers changes
	let prevHasMultipliers = false;
	$effect(() => {
		if (hasMultipliers !== prevHasMultipliers) {
			console.log(`[MultiplierGrid:${instanceId}] 👁️ VISIBILITY changed at ${Date.now()}:`, {
				from: prevHasMultipliers,
				to: hasMultipliers,
				cellWidth,
				cellHeight,
			});
			prevHasMultipliers = hasMultipliers;
		}
	});
</script>

{#snippet content()}
	{#if hasMultipliers && cellWidth > 0 && cellHeight > 0}
		{#each grid as reel, reelIndex}
			{#each reel as multiplier, rowIndex}
				{#if multiplier > 1}
					<Container
						x={getSymbolXDynamic(reelIndex, symbolWidth)}
						y={getSymbolYDynamic(rowIndex, symbolHeight)}
					>
						<Sprite
							key="multiplierCell"
							anchor={0.5}
							width={cellWidth}
							height={cellHeight}
							tint={getMultiplierTint(multiplier)}
						/>
						<BitmapText
							x={-symbolWidth * 0.05}
							anchor={{
								x: 0.5,
								y: 0.5,
							}}
							text={`${multiplier} X`}
							style={{
								fontFamily: 'gold',
								fontSize: symbolSize * 0.5,
								letterSpacing: -5,
							}}
						/>
					</Container>
				{/if}
			{/each}
		{/each}
	{/if}
{/snippet}

{#if props.inBoardSpace}
	{@render content()}
{:else}
	<BoardContainer zIndex={5}>
		{@render content()}
	</BoardContainer>
{/if}
