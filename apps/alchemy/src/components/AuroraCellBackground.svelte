<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics, BaseSprite } from 'pixi-svelte';

	type Props = {
		width: number;
		height: number;
		multiplier: number;
	};

	const props: Props = $props();

	// ────────────────────────────────────────────────────────
	// Color tier definitions
	//
	// Each tier paints 5–6 irregular blobs at varied positions,
	// sizes and opacities onto a single canvas. The canvas is
	// oversized (2× cell) so we can pan across it cheaply for
	// the drifting animation — no per-frame gradient rebuilds.
	// ────────────────────────────────────────────────────────

	type BlobDef = {
		/** Normalised x (0–1 across the canvas) */
		nx: number;
		/** Normalised y */
		ny: number;
		/** Normalised radius */
		nr: number;
		/** CSS color string */
		color: string;
		/** Peak opacity at blob center */
		alpha: number;
	};

	type AuroraTier = {
		base: string;
		blobs: BlobDef[];
	};

	function getAuroraTier(mult: number): AuroraTier {
		// Each multiplier gets its own unique aurora spectrum
		switch (mult) {
			case 2:
				// Cool ocean — cyan + steel blue
				return {
					base: '#020810',
					blobs: [
						{ nx: 0.15, ny: 0.15, nr: 0.50, color: '#2288bb', alpha: 1.0 },
						{ nx: 0.45, ny: 0.30, nr: 0.40, color: '#33ccee', alpha: 0.95 },
						{ nx: 0.75, ny: 0.55, nr: 0.45, color: '#1155aa', alpha: 0.90 },
						{ nx: 0.30, ny: 0.70, nr: 0.38, color: '#44aacc', alpha: 0.85 },
						{ nx: 0.80, ny: 0.80, nr: 0.35, color: '#113388', alpha: 0.80 },
					],
				};
			case 4:
				// Teal forest — teal + emerald green
				return {
					base: '#020a08',
					blobs: [
						{ nx: 0.20, ny: 0.12, nr: 0.48, color: '#22bbaa', alpha: 1.0 },
						{ nx: 0.55, ny: 0.35, nr: 0.42, color: '#33dd88', alpha: 0.95 },
						{ nx: 0.80, ny: 0.60, nr: 0.40, color: '#119988', alpha: 0.85 },
						{ nx: 0.15, ny: 0.65, nr: 0.35, color: '#22cc77', alpha: 0.90 },
						{ nx: 0.70, ny: 0.85, nr: 0.32, color: '#228877', alpha: 0.80 },
					],
				};
			case 8:
				// Classic aurora — purple + teal + green
				return {
					base: '#030414',
					blobs: [
						{ nx: 0.15, ny: 0.10, nr: 0.48, color: '#7744cc', alpha: 1.0 },
						{ nx: 0.40, ny: 0.30, nr: 0.38, color: '#22bbaa', alpha: 0.95 },
						{ nx: 0.65, ny: 0.50, nr: 0.42, color: '#33ee77', alpha: 0.90 },
						{ nx: 0.25, ny: 0.65, nr: 0.35, color: '#55ccee', alpha: 0.85 },
						{ nx: 0.80, ny: 0.75, nr: 0.38, color: '#5533bb', alpha: 0.80 },
						{ nx: 0.50, ny: 0.15, nr: 0.28, color: '#2299aa', alpha: 0.85 },
					],
				};
			case 16:
				// Vivid spectrum — green + cyan + violet
				return {
					base: '#030312',
					blobs: [
						{ nx: 0.18, ny: 0.12, nr: 0.50, color: '#22ff66', alpha: 1.0 },
						{ nx: 0.50, ny: 0.35, nr: 0.42, color: '#44eeff', alpha: 0.95 },
						{ nx: 0.80, ny: 0.55, nr: 0.45, color: '#8844dd', alpha: 0.90 },
						{ nx: 0.30, ny: 0.60, nr: 0.36, color: '#33ccaa', alpha: 0.90 },
						{ nx: 0.70, ny: 0.80, nr: 0.38, color: '#6622cc', alpha: 0.85 },
						{ nx: 0.15, ny: 0.80, nr: 0.30, color: '#22aa55', alpha: 0.80 },
					],
				};
			case 32:
				// Electric — bright green + magenta + blue
				return {
					base: '#040210',
					blobs: [
						{ nx: 0.12, ny: 0.15, nr: 0.48, color: '#44ff44', alpha: 1.0 },
						{ nx: 0.45, ny: 0.30, nr: 0.40, color: '#dd33aa', alpha: 0.95 },
						{ nx: 0.78, ny: 0.50, nr: 0.44, color: '#3366ff', alpha: 0.90 },
						{ nx: 0.25, ny: 0.55, nr: 0.35, color: '#55ee88', alpha: 0.90 },
						{ nx: 0.65, ny: 0.78, nr: 0.38, color: '#cc44cc', alpha: 0.85 },
						{ nx: 0.50, ny: 0.10, nr: 0.30, color: '#2255ee', alpha: 0.80 },
					],
				};
			case 64:
				// Solar flare — gold + orange + magenta + purple
				return {
					base: '#0a0308',
					blobs: [
						{ nx: 0.15, ny: 0.10, nr: 0.48, color: '#ffaa22', alpha: 1.0 },
						{ nx: 0.45, ny: 0.28, nr: 0.42, color: '#ff5544', alpha: 0.95 },
						{ nx: 0.75, ny: 0.50, nr: 0.45, color: '#dd33bb', alpha: 0.90 },
						{ nx: 0.28, ny: 0.60, nr: 0.36, color: '#ff8833', alpha: 0.90 },
						{ nx: 0.60, ny: 0.78, nr: 0.40, color: '#9922dd', alpha: 0.85 },
						{ nx: 0.85, ny: 0.20, nr: 0.30, color: '#ff6644', alpha: 0.80 },
					],
				};
			case 128:
				// Nebula — deep violet + rose + cyan streaks
				return {
					base: '#06020e',
					blobs: [
						{ nx: 0.12, ny: 0.12, nr: 0.50, color: '#9933ff', alpha: 1.0 },
						{ nx: 0.50, ny: 0.28, nr: 0.42, color: '#ff4488', alpha: 0.95 },
						{ nx: 0.78, ny: 0.50, nr: 0.44, color: '#33ddff', alpha: 0.90 },
						{ nx: 0.25, ny: 0.58, nr: 0.36, color: '#bb55ee', alpha: 0.90 },
						{ nx: 0.65, ny: 0.78, nr: 0.38, color: '#ff66aa', alpha: 0.85 },
						{ nx: 0.40, ny: 0.12, nr: 0.30, color: '#6622ee', alpha: 0.85 },
					],
				};
			case 256:
				// Plasma storm — hot pink + electric blue + white-green
				return {
					base: '#040212',
					blobs: [
						{ nx: 0.15, ny: 0.10, nr: 0.50, color: '#ff2299', alpha: 1.0 },
						{ nx: 0.48, ny: 0.30, nr: 0.44, color: '#2266ff', alpha: 0.95 },
						{ nx: 0.80, ny: 0.48, nr: 0.42, color: '#88ff88', alpha: 0.90 },
						{ nx: 0.28, ny: 0.62, nr: 0.38, color: '#ee44cc', alpha: 0.90 },
						{ nx: 0.68, ny: 0.80, nr: 0.36, color: '#4488ff', alpha: 0.85 },
						{ nx: 0.50, ny: 0.15, nr: 0.28, color: '#ccffcc', alpha: 0.80 },
						{ nx: 0.82, ny: 0.18, nr: 0.30, color: '#ff55bb', alpha: 0.85 },
					],
				};
			case 512:
				// Cosmic fire — crimson + gold + white core + violet edge
				return {
					base: '#080204',
					blobs: [
						{ nx: 0.15, ny: 0.12, nr: 0.50, color: '#ff3322', alpha: 1.0 },
						{ nx: 0.45, ny: 0.28, nr: 0.44, color: '#ffcc22', alpha: 0.95 },
						{ nx: 0.75, ny: 0.50, nr: 0.42, color: '#ff5544', alpha: 0.90 },
						{ nx: 0.30, ny: 0.55, nr: 0.38, color: '#ffee88', alpha: 0.90 },
						{ nx: 0.60, ny: 0.78, nr: 0.40, color: '#aa22ee', alpha: 0.85 },
						{ nx: 0.45, ny: 0.42, nr: 0.24, color: '#ffffff', alpha: 0.75 },
						{ nx: 0.82, ny: 0.22, nr: 0.30, color: '#ff8844', alpha: 0.85 },
					],
				};
			case 1024:
				// Supernova — white/cyan core + hot-pink + electric blue + green
				return {
					base: '#050214',
					blobs: [
						{ nx: 0.15, ny: 0.10, nr: 0.50, color: '#aaffff', alpha: 1.0 },
						{ nx: 0.45, ny: 0.25, nr: 0.40, color: '#ff3399', alpha: 0.95 },
						{ nx: 0.75, ny: 0.50, nr: 0.45, color: '#3366ff', alpha: 0.90 },
						{ nx: 0.30, ny: 0.55, nr: 0.38, color: '#33ff88', alpha: 0.95 },
						{ nx: 0.60, ny: 0.78, nr: 0.42, color: '#cc44ff', alpha: 0.85 },
						{ nx: 0.45, ny: 0.40, nr: 0.22, color: '#ffffff', alpha: 0.80 },
						{ nx: 0.80, ny: 0.20, nr: 0.32, color: '#55eeff', alpha: 0.85 },
						{ nx: 0.15, ny: 0.80, nr: 0.30, color: '#ff55aa', alpha: 0.80 },
					],
				};
			default: {
				// Beyond 1024 — use supernova palette as fallback
				return {
					base: '#050214',
					blobs: [
						{ nx: 0.15, ny: 0.10, nr: 0.50, color: '#aaffff', alpha: 1.0 },
						{ nx: 0.45, ny: 0.25, nr: 0.40, color: '#ff3399', alpha: 0.95 },
						{ nx: 0.75, ny: 0.50, nr: 0.45, color: '#3366ff', alpha: 0.90 },
						{ nx: 0.30, ny: 0.55, nr: 0.38, color: '#33ff88', alpha: 0.95 },
						{ nx: 0.60, ny: 0.78, nr: 0.42, color: '#cc44ff', alpha: 0.85 },
						{ nx: 0.45, ny: 0.40, nr: 0.22, color: '#ffffff', alpha: 0.80 },
						{ nx: 0.80, ny: 0.20, nr: 0.32, color: '#55eeff', alpha: 0.85 },
						{ nx: 0.15, ny: 0.80, nr: 0.30, color: '#ff55aa', alpha: 0.80 },
					],
				};
			}
		}
	}

	// ────────────────────────────────────────────────────────
	// Canvas texture generation (one-shot, cached per multiplier)
	//
	// The canvas is 2× the cell size. Blobs are painted with
	// 'lighter' (additive) compositing on a dark base, which
	// makes overlapping colors mix into bright neon highlights.
	// ────────────────────────────────────────────────────────

	// Texture cache — shared across all instances of the same multiplier
	const textureCache = new Map<string, PIXI.Texture>();

	function getTierKey(mult: number): string {
		return `aurora_${mult}`;
	}

	function buildAuroraTexture(cellW: number, cellH: number, mult: number): PIXI.Texture {
		const key = `${getTierKey(mult)}_${Math.round(cellW)}_${Math.round(cellH)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const tier = getAuroraTier(mult);

		// Canvas is 2× cell to allow panning headroom
		const cw = Math.round(cellW * 2);
		const ch = Math.round(cellH * 2);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Base fill
		ctx.fillStyle = tier.base;
		ctx.fillRect(0, 0, cw, ch);

		// Paint blobs with additive blending for bright neon output
		ctx.globalCompositeOperation = 'lighter';

		for (const blob of tier.blobs) {
			const cx = blob.nx * cw;
			const cy = blob.ny * ch;
			const r = blob.nr * Math.max(cw, ch);

			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
			grad.addColorStop(0, withAlpha(blob.color, blob.alpha));
			grad.addColorStop(0.35, withAlpha(blob.color, blob.alpha * 0.8));
			grad.addColorStop(0.65, withAlpha(blob.color, blob.alpha * 0.3));
			grad.addColorStop(1, withAlpha(blob.color, 0));

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, cw, ch);
		}

		ctx.globalCompositeOperation = 'source-over';

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	/** Inject alpha into a hex colour string → rgba */
	function withAlpha(hex: string, a: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r},${g},${b},${a})`;
	}

	// ────────────────────────────────────────────────────────
	// Rounded-rect mask (drawn once, only redraws on resize)
	// ────────────────────────────────────────────────────────
	const CORNER_RADIUS = 12;

	const drawMask = (g: PIXI.Graphics) => {
		g.roundRect(-props.width / 2, -props.height / 2, props.width, props.height, CORNER_RADIUS);
		g.fill({ color: 0xffffff });
	};

	// ────────────────────────────────────────────────────────
	// Drift animation — pan the oversized texture slowly
	//
	// Only updates 2 numbers per frame (sprite x/y), no
	// gradient or canvas work. Cost ≈ negligible.
	// ────────────────────────────────────────────────────────
	const DRIFT_PX = 10;
	const DRIFT_SPEED = 0.0008;

	let panX = $state(0);
	let panY = $state(0);
	let raf = 0;

	onMount(() => {
		const t0 = performance.now();
		// Use a random phase offset per instance so cells don't drift in sync
		const phase = Math.random() * Math.PI * 2;
		function tick() {
			const t = performance.now() - t0;
			panX = Math.sin(t * DRIFT_SPEED + phase) * DRIFT_PX;
			panY = Math.cos(t * DRIFT_SPEED * 0.7 + phase * 0.6) * DRIFT_PX;
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => cancelAnimationFrame(raf));

	// ────────────────────────────────────────────────────────
	// Derived values
	// ────────────────────────────────────────────────────────
	const texture = $derived(
		(props.width > 0 && props.height > 0)
			? buildAuroraTexture(props.width, props.height, props.multiplier)
			: PIXI.Texture.EMPTY,
	);

	// Sprite is 2× cell size, centered. panX/panY shifts it within the mask.
	const spriteX = $derived(-props.width / 2 + panX - props.width / 4);
	const spriteY = $derived(-props.height / 2 + panY - props.height / 4);
</script>

<Container>
	<!-- Rounded-rect mask -->
	<Graphics draw={drawMask} isMask />

	<!-- Pre-rendered aurora texture, panned for drift -->
	<BaseSprite
		texture={texture}
		x={spriteX}
		y={spriteY}
		width={props.width * 2}
		height={props.height * 2}
	/>
</Container>
