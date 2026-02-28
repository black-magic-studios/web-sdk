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
	const GLOW_COLOR = 0xffee00;
	const GLOW_COLOR_OUTER = 0xffcc00;
	const BORDER_COLOR_AURORA = 0xffdd00;
	const INNER_FILL_COLOR = 0xffee00;
	const CENTER_DOT_COLOR = 0xffff88;
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

		// Restore aurora cells from global state on remount (survives show/hide toggles)
		const existing = context.stateGame.auroraPositions;
		if (existing.length > 0 && cells.length === 0) {
			cells = existing.map((pos) => ({
				reel: pos.reel,
				row: pos.row,
				alpha: new Tween(0.85),
				scale: new Tween(1.0),
				glowAlpha: new Tween(0),
				borderAlpha: new Tween(0.9),
				exploding: false,
			}));
		}
	});

	onDestroy(() => cancelAnimationFrame(raf));

	// Sine pulse for breathing effect (0.65 – 1.0 range)
	const pulseValue = $derived(0.65 + 0.35 * Math.sin(pulsePhase * 1.8));
	// Secondary slower pulse for border
	const borderPulse = $derived(0.5 + 0.5 * Math.sin(pulsePhase * 1.2 + 0.5));
	// Fast sparkle pulse for center accent
	const sparklePulse = $derived(0.4 + 0.6 * Math.sin(pulsePhase * 3.0 + 1.0));

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

			// Animate in — flash glow on reveal
			for (const cell of newCells) {
				cell.alpha.set(0.85);
				cell.scale.set(1.0);
				cell.glowAlpha.set(0.7);
				cell.borderAlpha.set(0.9);
			}

			// After reveal flash, fade glow out — keep only border + center accent
			setTimeout(() => {
				for (const cell of newCells) {
					if (!cell.exploding) {
						cell.glowAlpha.set(0, { duration: 600, easing: cubicOut });
					}
				}
			}, 500);
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

	// ── 8-pointed star path helper ──
	function drawStarPath(g: PIXI.Graphics, w: number, h: number, outerFrac: number, innerFrac: number) {
		const outerRx = (w / 2) * outerFrac;
		const outerRy = (h / 2) * outerFrac;
		const innerRx = (w / 2) * innerFrac;
		const innerRy = (h / 2) * innerFrac;
		const points = 8;
		const step = Math.PI / points; // 22.5 degrees per half-step

		for (let i = 0; i < points * 2; i++) {
			const angle = i * step - Math.PI / 2;
			const isOuter = i % 2 === 0;
			const rx = isOuter ? outerRx : innerRx;
			const ry = isOuter ? outerRy : innerRy;
			const x = Math.cos(angle) * rx;
			const y = Math.sin(angle) * ry;
			if (i === 0) {
				g.moveTo(x, y);
			} else {
				g.lineTo(x, y);
			}
		}
		g.closePath();
	}

	// ── Draw functions ──
	const drawGlow = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		_cornerRadius: number,
		exploding: boolean,
	) => {
		// Glow stays within cell bounds
		drawStarPath(g, w, h, 0.95, 0.42);
		g.fill({ color: exploding ? EXPLODE_COLOR : GLOW_COLOR });
	};

	const drawBorder = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		_cornerRadius: number,
		exploding: boolean,
	) => {
		// Border within cell bounds, inward-aligned stroke
		drawStarPath(g, w * 0.95, h * 0.95, 0.92, 0.40);
		g.stroke({ color: exploding ? EXPLODE_COLOR : BORDER_COLOR_AURORA, width: 2.5, alignment: 1 });
	};

	const drawInnerGlow = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		_cornerRadius: number,
		exploding: boolean,
	) => {
		drawStarPath(g, w * 0.85, h * 0.85, 0.92, 0.40);
		g.fill({ color: exploding ? EXPLODE_COLOR : INNER_FILL_COLOR });
	};

	/** Small center diamond accent */
	const drawCenterAccent = (
		g: PIXI.Graphics,
		w: number,
		h: number,
		exploding: boolean,
	) => {
		const dx = w * 0.08;
		const dy = h * 0.08;
		g.moveTo(0, -dy);
		g.lineTo(dx, 0);
		g.lineTo(0, dy);
		g.lineTo(-dx, 0);
		g.closePath();
		g.fill({ color: exploding ? EXPLODE_COLOR : CENTER_DOT_COLOR });
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
				zIndex={-1}
			>
					<!-- Outer star glow -->
					<Graphics
						draw={(g) => {
							g.clear();
							drawGlow(g, cellWidth, cellHeight, cr, cell.exploding);
						}}
						alpha={cell.exploding ? 0.9 : cell.glowAlpha.current * pulseValue}
					/>
					<!-- Inner star fill (semi-transparent) -->
					<Graphics
						draw={(g) => {
							g.clear();
							drawInnerGlow(g, cellWidth, cellHeight, cr, cell.exploding);
						}}
						alpha={cell.exploding ? 0.85 : 0.28 * pulseValue}
					/>
					<!-- Star border -->
					<Graphics
						draw={(g) => {
							g.clear();
							drawBorder(g, cellWidth, cellHeight, cr, cell.exploding);
						}}
						alpha={cell.borderAlpha.current * (cell.exploding ? 1.0 : borderPulse * 0.8)}
					/>
					<!-- Center diamond accent -->
					<Graphics
						draw={(g) => {
							g.clear();
							drawCenterAccent(g, cellWidth, cellHeight, cell.exploding);
						}}
						alpha={cell.exploding ? 1.0 : sparklePulse * 0.7}
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
