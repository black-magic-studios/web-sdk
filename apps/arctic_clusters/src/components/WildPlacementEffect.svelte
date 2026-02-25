<script lang="ts" module>
	import type { Position } from '../game/types';

	export type EmitterEventWildPlacement =
		| { type: 'wildPlacementAnimate'; position: Position };
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics } from 'pixi-svelte';

	import { stateBetDerived } from 'state-shared';
	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';

	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());

	const CELL_GAP_RATIO = 0.96;
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);

	// ── Colours ──
	const TRACE_COLOR = 0x00ffaa;
	const TRACE_GLOW_COLOR = 0x55ffcc;
	const FLASH_COLOR = 0xffffff;
	const BURST_COLOR = 0x00ffcc;

	// ── Animation state ──
	type WildEffect = {
		reel: number;
		row: number;
		/** 0→1: border trace progress */
		traceProgress: number;
		/** 0→1: flash/burst intensity */
		flashIntensity: number;
		/** 0→1: burst ring expansion */
		burstScale: number;
		/** Overall phase: 'trace' | 'flash' | 'burst' | 'done' */
		phase: 'trace' | 'flash' | 'burst' | 'done';
		startTime: number;
		resolve: () => void;
	};

	let effects: WildEffect[] = $state([]);
	let raf = 0;
	let animTime = $state(0);

	// ── Timing constants (ms) ── scaled by turbo speed
	const TRACE_DURATION = $derived(350 / stateBetDerived.timeScale());
	const FLASH_DURATION = $derived(150 / stateBetDerived.timeScale());
	const BURST_DURATION = $derived(300 / stateBetDerived.timeScale());

	onMount(() => {
		const t0 = performance.now();
		function tick() {
			animTime = performance.now() - t0;
			// Update effect states
			const now = performance.now();
			for (const fx of effects) {
				const elapsed = now - fx.startTime;
				if (fx.phase === 'trace') {
					fx.traceProgress = Math.min(1, elapsed / TRACE_DURATION);
					if (fx.traceProgress >= 1) {
						fx.phase = 'flash';
						fx.startTime = now;
					}
				} else if (fx.phase === 'flash') {
					const t = Math.min(1, elapsed / FLASH_DURATION);
					fx.flashIntensity = t < 0.5 ? t * 2 : 2 - t * 2;
					if (t >= 1) {
						fx.phase = 'burst';
						fx.startTime = now;
					}
				} else if (fx.phase === 'burst') {
					const t = Math.min(1, elapsed / BURST_DURATION);
					fx.burstScale = t;
					fx.flashIntensity = 1 - t;
					if (t >= 1) {
						fx.phase = 'done';
						fx.resolve();
					}
				}
			}
			// Remove completed effects
			effects = effects.filter((fx) => fx.phase !== 'done');
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => cancelAnimationFrame(raf));

	// ── Event listener: start wild animation ──
	context.eventEmitter.subscribeOnMount({
		wildPlacementAnimate: ({ position }) => {
			return new Promise<void>((resolve) => {
				effects = [...effects, {
					reel: position.reel,
					row: position.row,
					traceProgress: 0,
					flashIntensity: 0,
					burstScale: 0,
					phase: 'trace',
					startTime: performance.now(),
					resolve,
				}];
			});
		},
	});

	// ── Draw the border trace (two paths from top-center going left+right) ──
	const drawTrace = (g: PIXI.Graphics, w: number, h: number, progress: number) => {
		const hw = w / 2;
		const hh = h / 2;
		const cr = Math.min(w, h) * 0.08; // corner radius

		// Perimeter path as segments: top-center → top-right → right → bottom-right → bottom → bottom-left → left → top-left → top-center
		// Total half-perimeter = w + h (approx for rounded rect)
		// We trace from top-center in both directions simultaneously.

		const lineWidth = 3;
		const glowWidth = 8;
		
		// Calculate how far each side has traced (0 to 1 = half perimeter)
		const halfPerim = w + h;
		const traceDist = progress * halfPerim;

		// Build points for the right side trace (clockwise from top-center)
		const rightPoints = getTracePoints(hw, hh, cr, traceDist, 1);
		// Build points for the left side trace (counter-clockwise from top-center)
		const leftPoints = getTracePoints(hw, hh, cr, traceDist, -1);

		// Draw glow (thicker, transparent)
		if (rightPoints.length > 1) {
			g.moveTo(rightPoints[0].x, rightPoints[0].y);
			for (let i = 1; i < rightPoints.length; i++) {
				g.lineTo(rightPoints[i].x, rightPoints[i].y);
			}
			g.stroke({ color: TRACE_GLOW_COLOR, width: glowWidth, alpha: 0.3, cap: 'round', join: 'round' });
		}
		if (leftPoints.length > 1) {
			g.moveTo(leftPoints[0].x, leftPoints[0].y);
			for (let i = 1; i < leftPoints.length; i++) {
				g.lineTo(leftPoints[i].x, leftPoints[i].y);
			}
			g.stroke({ color: TRACE_GLOW_COLOR, width: glowWidth, alpha: 0.3, cap: 'round', join: 'round' });
		}

		// Draw solid trace line
		if (rightPoints.length > 1) {
			g.moveTo(rightPoints[0].x, rightPoints[0].y);
			for (let i = 1; i < rightPoints.length; i++) {
				g.lineTo(rightPoints[i].x, rightPoints[i].y);
			}
			g.stroke({ color: TRACE_COLOR, width: lineWidth, cap: 'round', join: 'round' });
		}
		if (leftPoints.length > 1) {
			g.moveTo(leftPoints[0].x, leftPoints[0].y);
			for (let i = 1; i < leftPoints.length; i++) {
				g.lineTo(leftPoints[i].x, leftPoints[i].y);
			}
			g.stroke({ color: TRACE_COLOR, width: lineWidth, cap: 'round', join: 'round' });
		}
	};

	/**
	 * Get points along the cell border from top-center going clockwise (dir=1) or counter-clockwise (dir=-1).
	 * Returns array of {x, y} points tracing `dist` pixels along the border.
	 */
	function getTracePoints(hw: number, hh: number, cr: number, dist: number, dir: number): { x: number; y: number }[] {
		const points: { x: number; y: number }[] = [];
		let remaining = dist;

		// Segments for clockwise (dir=1): top-center→TR corner, TR→BR corner, BR→bottom-center
		// Segments for CCW (dir=-1): top-center→TL corner, TL→BL corner, BL→bottom-center
		const segments = dir === 1
			? [
				// Top edge: center to right
				{ x0: 0, y0: -hh, x1: hw - cr, y1: -hh },
				// Top-right corner (approx as 2 points)
				{ x0: hw - cr, y0: -hh, x1: hw, y1: -hh + cr },
				// Right edge: top to bottom
				{ x0: hw, y0: -hh + cr, x1: hw, y1: hh - cr },
				// Bottom-right corner
				{ x0: hw, y0: hh - cr, x1: hw - cr, y1: hh },
				// Bottom edge: right to center
				{ x0: hw - cr, y0: hh, x1: 0, y1: hh },
			]
			: [
				// Top edge: center to left
				{ x0: 0, y0: -hh, x1: -(hw - cr), y1: -hh },
				// Top-left corner
				{ x0: -(hw - cr), y0: -hh, x1: -hw, y1: -hh + cr },
				// Left edge: top to bottom
				{ x0: -hw, y0: -hh + cr, x1: -hw, y1: hh - cr },
				// Bottom-left corner
				{ x0: -hw, y0: hh - cr, x1: -(hw - cr), y1: hh },
				// Bottom edge: left to center
				{ x0: -(hw - cr), y0: hh, x1: 0, y1: hh },
			];

		// Start point
		points.push({ x: segments[0].x0, y: segments[0].y0 });

		for (const seg of segments) {
			const dx = seg.x1 - seg.x0;
			const dy = seg.y1 - seg.y0;
			const segLen = Math.sqrt(dx * dx + dy * dy);
			if (segLen <= 0) continue;

			if (remaining >= segLen) {
				points.push({ x: seg.x1, y: seg.y1 });
				remaining -= segLen;
			} else {
				const t = remaining / segLen;
				points.push({ x: seg.x0 + dx * t, y: seg.y0 + dy * t });
				remaining = 0;
				break;
			}
		}

		return points;
	}

	// ── Draw the flash overlay ──
	const drawFlash = (g: PIXI.Graphics, w: number, h: number, intensity: number) => {
		const hw = w / 2;
		const hh = h / 2;
		g.roundRect(-hw, -hh, w, h, Math.min(w, h) * 0.08);
		g.fill({ color: FLASH_COLOR, alpha: intensity * 0.7 });
	};

	// ── Draw the expanding burst ring ──
	const drawBurst = (g: PIXI.Graphics, w: number, h: number, scale: number, alpha: number) => {
		const radius = (Math.max(w, h) / 2) * (0.5 + scale * 0.8);
		const thickness = Math.max(1, 4 * (1 - scale));
		g.circle(0, 0, radius);
		g.stroke({ color: BURST_COLOR, width: thickness, alpha: alpha * 0.6 });
		// Inner particle dots at cardinal + diagonal directions
		const dotRadius = 3 * (1 - scale);
		if (dotRadius > 0.5) {
			const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, -(3 * Math.PI) / 4, -Math.PI / 2, -Math.PI / 4];
			for (const angle of angles) {
				const r = radius * 0.95;
				g.circle(Math.cos(angle) * r, Math.sin(angle) * r, dotRadius);
				g.fill({ color: TRACE_COLOR, alpha: alpha * 0.8 });
			}
		}
	};
</script>

{#each effects as fx (`${fx.reel}_${fx.row}_${fx.startTime}`)}
	{@const x = getSymbolXDynamic(fx.reel, symbolWidth)}
	{@const y = getSymbolYDynamic(fx.row - 1, symbolHeight)}
	<Container {x} {y} zIndex={500}>
		<!-- Border trace -->
		{#if fx.phase === 'trace' || (fx.phase === 'flash' && fx.traceProgress > 0)}
			<Graphics
				draw={(g) => drawTrace(g, cellWidth, cellHeight, fx.traceProgress)}
				alpha={fx.phase === 'flash' ? 1 - fx.flashIntensity : 1}
			/>
		{/if}

		<!-- Flash overlay -->
		{#if fx.phase === 'flash' || (fx.phase === 'burst' && fx.flashIntensity > 0)}
			<Graphics
				draw={(g) => drawFlash(g, cellWidth, cellHeight, fx.flashIntensity)}
			/>
		{/if}

		<!-- Burst ring -->
		{#if fx.phase === 'burst'}
			<Graphics
				draw={(g) => drawBurst(g, cellWidth, cellHeight, fx.burstScale, fx.flashIntensity)}
			/>
		{/if}
	</Container>
{/each}
