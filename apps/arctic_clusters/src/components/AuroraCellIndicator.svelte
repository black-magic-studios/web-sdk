<script lang="ts" module>
	import type { Position } from '../game/types';

	export type EmitterEventAuroraCellIndicator =
		| { type: 'auroraCellsReveal'; positions: Position[] }
		| { type: 'auroraCellsExplode'; positions: Position[] }
		| { type: 'auroraCellsClear' };
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, cubicInOut, cubicIn } from 'svelte/easing';
	import { Container, Graphics } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';
	import { GRID_COLS, GRID_ROWS } from '../game/constants';

	type Props = {
		inBoardSpace?: boolean;
	};

	const props: Props = $props();

	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());

	const CELL_GAP_RATIO = 0.96;
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);
	const CR_RATIO = 0.1;
	const cr = $derived(Math.round(cellWidth * CR_RATIO));

	// ── Aurora colours ──
	const GLOW_COLOR = 0x33eeaa;
	const BORDER_COLOR_AURORA = 0x44ffbb;
	const EXPLODE_COLOR = 0xffffff;

	// ── State ──
	type CellIndicator = {
		reel: number;
		row: number;
		alpha: Tween<number>;
		scale: Tween<number>;
		glowAlpha: Tween<number>;
		borderAlpha: Tween<number>;
		exploding: boolean;
	};

	let cells: CellIndicator[] = $state([]);

	// ── Pulse animation loop ──
	let raf = 0;
	let pulsePhase = $state(0);

	onMount(() => {
		const t0 = performance.now();
		function tick() {
			pulsePhase = ((performance.now() - t0) * 0.001) % (Math.PI * 2);
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => cancelAnimationFrame(raf));

	// Sine pulse for breathing effect (0.6 – 1.0 range)
	const pulseValue = $derived(0.6 + 0.4 * Math.sin(pulsePhase * 1.8));
	// Secondary slower pulse for border
	const borderPulse = $derived(0.4 + 0.6 * Math.sin(pulsePhase * 1.2 + 0.5));

	const posKey = (reel: number, row: number) => `${reel}_${row}`;

	// ── Event handlers ──
	context.eventEmitter.subscribeOnMount({
		auroraCellsReveal: async ({ positions }) => {
			// Stagger cell reveals by distance from board center
			const centerReel = (GRID_COLS - 1) / 2;
			const centerRow = (GRID_ROWS - 1) / 2;

			const sorted = [...positions].sort((a, b) => {
				const distA = Math.sqrt((a.reel - centerReel) ** 2 + (a.row - centerRow) ** 2);
				const distB = Math.sqrt((b.reel - centerReel) ** 2 + (b.row - centerRow) ** 2);
				return distA - distB;
			});

			const newCells: CellIndicator[] = sorted.map((pos, i) => ({
				reel: pos.reel,
				row: pos.row,
				alpha: new Tween(0, { duration: 400, easing: cubicOut, delay: i * 60 }),
				scale: new Tween(0.5, { duration: 500, easing: cubicOut, delay: i * 60 }),
				glowAlpha: new Tween(0, { duration: 600, easing: cubicOut, delay: i * 60 + 100 }),
				borderAlpha: new Tween(0, { duration: 500, easing: cubicOut, delay: i * 60 + 50 }),
				exploding: false,
			}));

			cells = newCells;

			// Animate in
			for (const cell of newCells) {
				cell.alpha.set(0.85);
				cell.scale.set(1.0);
				cell.glowAlpha.set(0.7);
				cell.borderAlpha.set(0.9);
			}
		},

		auroraCellsExplode: async ({ positions }) => {
			const explodeKeys = new Set(positions.map((p) => posKey(p.reel, p.row)));

			// Flash bright then expand + fade out the exploding cells
			const explodingCells = cells.filter((c) => explodeKeys.has(posKey(c.reel, c.row)));

			for (const cell of explodingCells) {
				cell.exploding = true;
				// Flash bright white
				cell.alpha.set(1.0, { duration: 80, easing: cubicOut });
				cell.glowAlpha.set(1.0, { duration: 80, easing: cubicOut });
				cell.borderAlpha.set(1.0, { duration: 80, easing: cubicOut });
				cell.scale.set(1.15, { duration: 80, easing: cubicOut });
			}

			// Wait for flash
			await new Promise((r) => setTimeout(r, 100));

			// Expand and fade
			for (const cell of explodingCells) {
				cell.alpha.set(0, { duration: 350, easing: cubicIn });
				cell.glowAlpha.set(0, { duration: 300, easing: cubicIn });
				cell.borderAlpha.set(0, { duration: 300, easing: cubicIn });
				cell.scale.set(1.5, { duration: 400, easing: cubicOut });
			}

			// Wait for animation to finish
			await new Promise((r) => setTimeout(r, 420));

			// Remove exploded cells from the array
			cells = cells.filter((c) => !explodeKeys.has(posKey(c.reel, c.row)));
		},

		auroraCellsClear: () => {
			if (cells.length === 0) return;
			// Fade out all remaining cells
			for (const cell of cells) {
				cell.alpha.set(0, { duration: 300, easing: cubicInOut });
				cell.scale.set(0.85, { duration: 300, easing: cubicInOut });
				cell.glowAlpha.set(0, { duration: 250 });
				cell.borderAlpha.set(0, { duration: 250 });
			}
			// Clear after fade
			setTimeout(() => {
				cells = [];
			}, 350);
		},
	});

	// ── Draw functions ──
	const drawGlow = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		cornerRadius: number,
		exploding: boolean,
	) => {
		const glowPad = w * 0.12;
		g.roundRect(
			-(w + glowPad * 2) / 2,
			-(h + glowPad * 2) / 2,
			w + glowPad * 2,
			h + glowPad * 2,
			cornerRadius + 4,
		);
		g.fill({ color: exploding ? EXPLODE_COLOR : GLOW_COLOR });
	};

	const drawBorder = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		cornerRadius: number,
		exploding: boolean,
	) => {
		g.roundRect(-w / 2, -h / 2, w, h, cornerRadius);
		g.stroke({ color: exploding ? EXPLODE_COLOR : BORDER_COLOR_AURORA, width: 2.5, alignment: 0.5 });
	};

	const drawInnerGlow = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		cornerRadius: number,
		exploding: boolean,
	) => {
		g.roundRect(-w / 2, -h / 2, w, h, cornerRadius);
		g.fill({ color: exploding ? EXPLODE_COLOR : 0x22dd88 });
	};
</script>

{#snippet content()}
	{#each cells as cell (posKey(cell.reel, cell.row))}
		{@const baseAlpha = cell.alpha.current}
		{@const s = cell.scale.current}
		{#if baseAlpha > 0.01}
			<Container
				x={getSymbolXDynamic(cell.reel, symbolWidth)}
				y={getSymbolYDynamic(cell.row - 1, symbolHeight)}
				scale={s}
				alpha={baseAlpha}
			>
				<!-- Outer glow pulse -->
				<Graphics
					draw={(g) => drawGlow(g, cellWidth, cellHeight, cr, cell.exploding)}
					alpha={cell.glowAlpha.current * (cell.exploding ? 0.6 : pulseValue * 0.25)}
				/>

				<!-- Inner fill -->
				<Graphics
					draw={(g) => drawInnerGlow(g, cellWidth, cellHeight, cr, cell.exploding)}
					alpha={cell.glowAlpha.current * (cell.exploding ? 0.3 : 0.08)}
				/>

				<!-- Pulsing aurora border -->
				<Graphics
					draw={(g) => drawBorder(g, cellWidth, cellHeight, cr, cell.exploding)}
					alpha={cell.borderAlpha.current * (cell.exploding ? 1.0 : borderPulse)}
				/>
			</Container>
		{/if}
	{/each}
{/snippet}

{#if props.inBoardSpace}
	{@render content()}
{:else}
	{@render content()}
{/if}
