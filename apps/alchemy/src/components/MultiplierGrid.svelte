<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridClear' };
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';
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

	// ────────────────────────────────────────────────────────
	// Per-cell scale-pop entrance animation (Option B + C)
	// Each newly-appearing multiplier cell pops in individually,
	// staggered by reel to match explosion wave timing.
	// ────────────────────────────────────────────────────────

	// Stagger constants — Euclidean distance from center, outermost pops first.
	// Grid update is already delayed 250ms into the explosion sequence by the handler,
	// so these offsets are relative to that point.
	const CENTER_REEL = 3;
	const CENTER_ROW = 3;
	const MAX_DIST = Math.sqrt(CENTER_REEL ** 2 + CENTER_ROW ** 2); // ~4.24
	const DIST_STAGGER_MS = 60; // ms per unit of Euclidean distance
	const MICRO_STAGGER_MS = 12; // small offset to break ties at same distance
	const BASE_OFFSET_MS = 100; // minimum delay from grid update for outermost cells
	const POP_DURATION_MS = 250;

	// Map of "reel,row" → Tween for active cell scales
	let cellScales = $state<Map<string, Tween<number>>>(new Map());
	// Track the previous grid to detect newly-appearing cells
	let previousGrid: number[][] = DEFAULT_GRID.map((r) => [...r]);

	function getCellKey(reel: number, row: number) {
		return `${reel},${row}`;
	}

	function getCellScale(reel: number, row: number): number {
		const tween = cellScales.get(getCellKey(reel, row));
		return tween ? tween.current : 1;
	}

	/** Animate newly-appearing cells with staggered scale-pop entrance. */
	function animateNewCells(newGrid: number[][]) {
		const nextScales = new Map(cellScales);

		for (let reel = 0; reel < newGrid.length; reel++) {
			for (let row = 0; row < newGrid[reel].length; row++) {
				const key = getCellKey(reel, row);
				const newVal = newGrid[reel][row];
				const prevVal = previousGrid[reel]?.[row] ?? 0;

				if (newVal > 1 && prevVal <= 1) {
					// Newly appearing cell — start at scale 0, pop in after delay
					const tween = new Tween(0);
					nextScales.set(key, tween);
					// Outermost cells pop in first, with micro-offset to break ties
					const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
					const microOffset = ((reel + row) % 4) * MICRO_STAGGER_MS;
					const delay = ((MAX_DIST - dist) * DIST_STAGGER_MS) + microOffset + BASE_OFFSET_MS;
					setTimeout(() => {
						tween.set(1, { duration: POP_DURATION_MS, easing: backOut });
					}, delay);
				} else if (newVal > 1 && prevVal > 1 && newVal !== prevVal) {
					// Multiplier upgraded — quick scale pulse
					const existing = nextScales.get(key);
					if (existing) {
						const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
						const microOffset = ((reel + row) % 4) * MICRO_STAGGER_MS;
						const delay = ((MAX_DIST - dist) * DIST_STAGGER_MS) + microOffset + BASE_OFFSET_MS;
						setTimeout(async () => {
							await existing.set(1.2, { duration: POP_DURATION_MS * 0.4, easing: backOut });
							await existing.set(1, { duration: POP_DURATION_MS * 0.4 });
						}, delay);
					}
				} else if (newVal <= 1) {
					// Cell removed
					nextScales.delete(key);
				}
			}
		}

		cellScales = nextScales;
		previousGrid = newGrid.map((r) => [...r]);
	}

	// Aurora-borealis gradient multiplier cells (pre-rendered for performance)
	// Each tier uses a unique gradient asset for maximum visual quality
	type MultiplierAssetKey = 
		| 'multiplierCell2x' | 'multiplierCell4x' | 'multiplierCell8x' 
		| 'multiplierCell16x' | 'multiplierCell32x' | 'multiplierCell64x'
		| 'multiplierCell128x' | 'multiplierCell256x' | 'multiplierCell512x' 
		| 'multiplierCell1024x';

	const MULTIPLIER_ASSETS: Record<number, MultiplierAssetKey> = {
		2: 'multiplierCell2x',
		4: 'multiplierCell4x',
		8: 'multiplierCell8x',
		16: 'multiplierCell16x',
		32: 'multiplierCell32x',
		64: 'multiplierCell64x',
		128: 'multiplierCell128x',
		256: 'multiplierCell256x',
		512: 'multiplierCell512x',
		1024: 'multiplierCell1024x',
	};

	function getMultiplierAssetKey(multiplier: number): MultiplierAssetKey {
		return MULTIPLIER_ASSETS[multiplier] ?? 'multiplierCell2x';
	}

	context.eventEmitter.subscribeOnMount({
		multiplierGridUpdate: (emitterEvent) => {
			const multiplierCount = emitterEvent.grid.flat().filter(m => m > 1).length;
			console.log(`[MultiplierGrid:${instanceId}] 📥 UPDATE at ${Date.now()}`, {
				multiplierCount,
				grid: JSON.stringify(emitterEvent.grid),
			});
			// Kick off per-cell staggered pop-in animations
			animateNewCells(emitterEvent.grid);
			// Update GLOBAL state - persists across component remounts
			context.stateGame.multiplierGrid = emitterEvent.grid;
		},
		multiplierGridClear: () => {
			console.log(`[MultiplierGrid:${instanceId}] 🧹 CLEAR at ${Date.now()}`);
			console.trace('[MultiplierGrid] Clear call stack:');
			// Reset animation state
			cellScales = new Map();
			previousGrid = DEFAULT_GRID.map((r) => [...r]);
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
					{@const s = getCellScale(reelIndex, rowIndex)}
					{#if s > 0}
						<Container
							x={getSymbolXDynamic(reelIndex, symbolWidth)}
							y={getSymbolYDynamic(rowIndex, symbolHeight)}
							scale={s}
						>
							<Sprite
								key={getMultiplierAssetKey(multiplier)}
								anchor={0.5}
								width={cellWidth}
								height={cellHeight}
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