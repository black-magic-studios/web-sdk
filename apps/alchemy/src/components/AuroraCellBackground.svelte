<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics, BaseSprite } from 'pixi-svelte';

	type Props = {
		width: number;
		height: number;
		multiplier: number;
		/** Container opacity. Default 0.5 */
		alpha?: number;
	};

	const props: Props = $props();

	// ────────────────────────────────────────────────────────
	// Aurora color definitions
	//
	// Each multiplier gets a unique palette defined as layered
	// linear-gradient sweeps at different angles. The first
	// sweep fully fills the canvas (alpha 1.0), subsequent
	// sweeps blend on top for smooth colour transitions.
	// This guarantees full cell coverage with no dark gaps.
	//
	// The canvas is 2× the cell size so we can pan across it
	// cheaply for the drifting animation.
	// ────────────────────────────────────────────────────────

	type SweepDef = {
		/** Angle in degrees (0 = left→right, 90 = top→bottom) */
		angle: number;
		/** Color stops distributed evenly along the gradient line */
		stops: string[];
		/** Layer opacity (first sweep should be 1.0 for full coverage) */
		alpha: number;
	};

	type AuroraTier = {
		sweeps: SweepDef[];
	};

	function getAuroraTier(mult: number): AuroraTier {
		// ── Real aurora color reference ──────────────────────
		// Green  (oxygen, most common):  #33cc55 → #22aa44 → #44dd66
		// Red    (oxygen, high alt):     #bb3333 → #cc4444 → #aa2222
		// Pink   (nitrogen, lower alt):  #cc4488 → #dd5599 → #bb3377
		// Purple (nitrogen, lower alt):  #7744bb → #6633aa → #8855cc
		// Blue   (nitrogen, lower edge): #3344aa → #2255bb → #4455cc
		// Yellow (red + green mix):      #ccbb33 → #bbaa22 → #ddcc44
		//
		// Progression: 3 colours at 2x → full 6-colour spectrum at 1024x.
		// Each sweep is a full-canvas linear gradient at a different angle.
		// The first sweep (alpha 1.0) guarantees full cell coverage.

		switch (mult) {
			case 2:
				// 3 colours: vivid green + bright teal + emerald
				return {
					sweeps: [
						{ angle: 130, stops: ['#22cc55', '#33ee77', '#22dd88'], alpha: 1.0 },
						{ angle: 40,  stops: ['#28ee70', '#44ffaa', '#22dd66'], alpha: 0.65 },
						{ angle: 0,   stops: ['#33dd80', '#55ffbb', '#2aee77'], alpha: 0.4 },
					],
				};
			case 4:
				// 3 colours: bright green + vivid teal + cyan
				return {
					sweeps: [
						{ angle: 135, stops: ['#22dd77', '#33bbcc', '#33ee88'], alpha: 1.0 },
						{ angle: 45,  stops: ['#33ee88', '#44ccdd', '#44ff99'], alpha: 0.65 },
						{ angle: 85,  stops: ['#28dd80', '#3ac0cc', '#38ee8a'], alpha: 0.4 },
					],
				};
			case 8:
				// 3 colours: green + vivid blue + bright purple
				return {
					sweeps: [
						{ angle: 140, stops: ['#33ee88', '#4466dd', '#8844dd'], alpha: 1.0 },
						{ angle: 40,  stops: ['#44ff99', '#5577ee', '#9955ee'], alpha: 0.6 },
						{ angle: 90,  stops: ['#38ee8a', '#4a66dd', '#8040dd'], alpha: 0.4 },
					],
				};
			case 16:
				// 4 colours: green + blue + purple + hot pink
				return {
					sweeps: [
						{ angle: 130, stops: ['#33ee88', '#4466dd', '#9955ee', '#ee55aa'], alpha: 1.0 },
						{ angle: 50,  stops: ['#44ff99', '#5577ee', '#aa66ff', '#ff66bb'], alpha: 0.6 },
						{ angle: 0,   stops: ['#38ee8a', '#4a60dd', '#8850ee', '#e050a0'], alpha: 0.4 },
					],
				};
			case 32:
				// 4 colours: green + purple + pink + blue (richer)
				return {
					sweeps: [
						{ angle: 145, stops: ['#44ff99', '#9955ee', '#ee55aa', '#4466dd'], alpha: 1.0 },
						{ angle: 35,  stops: ['#33ee88', '#aa66ff', '#ff66bb', '#5577ee'], alpha: 0.6 },
						{ angle: 85,  stops: ['#3dee8a', '#8850ee', '#e050a0', '#4a60dd'], alpha: 0.4 },
					],
				};
			case 64:
				// 5 colours: green + gold + pink + purple + blue
				return {
					sweeps: [
						{ angle: 125, stops: ['#33ee88', '#ddcc33', '#ee55aa', '#9955ee', '#4466dd'], alpha: 1.0 },
						{ angle: 50,  stops: ['#44ff99', '#eedd44', '#ff66bb', '#aa66ff', '#5577ee'], alpha: 0.6 },
						{ angle: 90,  stops: ['#38ee8a', '#d0c030', '#e050a0', '#8850ee', '#4a60dd'], alpha: 0.35 },
					],
				};
			case 128:
				// 5 colours: blue + green + purple + pink + gold (shifted)
				return {
					sweeps: [
						{ angle: 140, stops: ['#4466dd', '#33ee88', '#9955ee', '#ee55aa', '#ddcc33'], alpha: 1.0 },
						{ angle: 30,  stops: ['#5577ee', '#44ff99', '#aa66ff', '#ff66bb', '#eedd44'], alpha: 0.6 },
						{ angle: 80,  stops: ['#4a60dd', '#38ee8a', '#8850ee', '#e050a0', '#d0c030'], alpha: 0.35 },
					],
				};
			case 256:
				// 6 colours: green + gold + red + pink + purple + blue
				return {
					sweeps: [
						{ angle: 135, stops: ['#33ee88', '#ddcc33', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 1.0 },
						{ angle: 45,  stops: ['#44ff99', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5577ee'], alpha: 0.55 },
						{ angle: 90,  stops: ['#38ee8a', '#d0c030', '#d04040', '#e050a0', '#8850ee', '#4a60dd'], alpha: 0.35 },
					],
				};
			case 512:
				// 6 colours: all aurora hues, warm-shifted
				return {
					sweeps: [
						{ angle: 130, stops: ['#dd4444', '#eedd44', '#44ff99', '#4466dd', '#9955ee', '#ee55aa'], alpha: 1.0 },
						{ angle: 40,  stops: ['#ee5555', '#ffee55', '#55ffaa', '#5577ee', '#aa66ff', '#ff66bb'], alpha: 0.55 },
						{ angle: 85,  stops: ['#d04040', '#d4d030', '#48ff98', '#4a60dd', '#8850ee', '#e050a0'], alpha: 0.35 },
					],
				};
			case 1024:
				// Full spectrum at maximum intensity
				return {
					sweeps: [
						{ angle: 140, stops: ['#44ff88', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5588ff'], alpha: 1.0 },
						{ angle: 35,  stops: ['#55ffaa', '#eedd44', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 0.55 },
						{ angle: 90,  stops: ['#33ee77', '#ddcc33', '#cc3333', '#dd4499', '#8844dd', '#3355cc'], alpha: 0.35 },
					],
				};
			default:
				// Fallback — full spectrum
				return {
					sweeps: [
						{ angle: 140, stops: ['#44ff88', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5588ff'], alpha: 1.0 },
						{ angle: 35,  stops: ['#55ffaa', '#eedd44', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 0.55 },
						{ angle: 90,  stops: ['#33ee77', '#ddcc33', '#cc3333', '#dd4499', '#8844dd', '#3355cc'], alpha: 0.35 },
					],
				};
		}
	}

	// ────────────────────────────────────────────────────────
	// Canvas texture generation (one-shot, cached per mult)
	//
	// Each sweep is a full-canvas linear gradient at a given
	// angle, painted with source-over compositing.  The first
	// sweep (alpha 1.0) fully covers the canvas — no dark
	// background leak.  Subsequent sweeps blend at lower alpha
	// for smooth colour transitions.
	// ────────────────────────────────────────────────────────

	const textureCache = new Map<string, PIXI.Texture>();

	function getTierKey(mult: number): string {
		return `aurora_${mult}`;
	}

	/** Compute gradient start/end points for a given angle so the gradient spans the full canvas diagonal. */
	function gradientEndpoints(angle: number, w: number, h: number) {
		const rad = (angle * Math.PI) / 180;
		const dx = Math.cos(rad);
		const dy = Math.sin(rad);
		const halfW = w / 2;
		const halfH = h / 2;
		const proj = Math.abs(dx * halfW) + Math.abs(dy * halfH);
		const cx = w / 2;
		const cy = h / 2;
		return { x0: cx - dx * proj, y0: cy - dy * proj, x1: cx + dx * proj, y1: cy + dy * proj };
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

		// Paint gradient sweeps — first one is opaque, the rest blend on top
		for (const sweep of tier.sweeps) {
			const { x0, y0, x1, y1 } = gradientEndpoints(sweep.angle, cw, ch);
			const grad = ctx.createLinearGradient(x0, y0, x1, y1);

			for (let i = 0; i < sweep.stops.length; i++) {
				grad.addColorStop(i / (sweep.stops.length - 1), sweep.stops[i]);
			}

			ctx.globalAlpha = sweep.alpha;
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, cw, ch);
		}

		ctx.globalAlpha = 1;

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
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

<Container alpha={props.alpha ?? 0.5}>
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
