<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics, BaseSprite } from 'pixi-svelte';

	type Props = {
		width: number;
		height: number;
		multiplier: number;
		/** Aurora tint opacity (higher = more vivid). Default 0.30 */
		alpha?: number;
		/** Tier colour (hex number). Default 0x2266aa */
		tierColor?: number;
		/** Shimmer sweep progress: <0 or >1 = hidden, 0–1 = position */
		shimmer?: number;
	};

	const props: Props = $props();

	// ────────────────────────────────────────────────────────
	// Constants
	// ────────────────────────────────────────────────────────
	const CR_RATIO = 0.10; // corner radius as fraction of width
	const BODY_COLOR = 0x1a2838; // dark blue-slate cell body
	const BORDER_COLOR = 0x384858; // subtle lighter border
	const BORDER_WIDTH = 1.5;
	const DRIFT_PX = 8;
	const DRIFT_SPEED = 0.0008;

	// ────────────────────────────────────────────────────────
	// Derived dimensions
	// ────────────────────────────────────────────────────────
	const w = $derived(props.width);
	const h = $derived(props.height);
	const cr = $derived(Math.round(w * CR_RATIO));

	// Aurora tint opacity
	const auroraAlpha = $derived(props.alpha ?? 0.30);

	// ────────────────────────────────────────────────────────
	// Aurora colour definitions per multiplier tier
	// ────────────────────────────────────────────────────────
	type SweepDef = { angle: number; stops: string[]; alpha: number };
	type AuroraTier = { sweeps: SweepDef[] };

	function getAuroraTier(mult: number): AuroraTier {
		switch (mult) {
			case 2:
				return {
					sweeps: [
						{ angle: 130, stops: ['#22cc55', '#33ee77', '#22dd88'], alpha: 1.0 },
						{ angle: 40, stops: ['#28ee70', '#44ffaa', '#22dd66'], alpha: 0.65 },
						{ angle: 0, stops: ['#33dd80', '#55ffbb', '#2aee77'], alpha: 0.4 },
					],
				};
			case 4:
				return {
					sweeps: [
						{ angle: 135, stops: ['#22dd77', '#33bbcc', '#33ee88'], alpha: 1.0 },
						{ angle: 45, stops: ['#33ee88', '#44ccdd', '#44ff99'], alpha: 0.65 },
						{ angle: 85, stops: ['#28dd80', '#3ac0cc', '#38ee8a'], alpha: 0.4 },
					],
				};
			case 8:
				return {
					sweeps: [
						{ angle: 140, stops: ['#33ee88', '#4466dd', '#8844dd'], alpha: 1.0 },
						{ angle: 40, stops: ['#44ff99', '#5577ee', '#9955ee'], alpha: 0.6 },
						{ angle: 90, stops: ['#38ee8a', '#4a66dd', '#8040dd'], alpha: 0.4 },
					],
				};
			case 16:
				return {
					sweeps: [
						{ angle: 130, stops: ['#33ee88', '#4466dd', '#9955ee', '#ee55aa'], alpha: 1.0 },
						{ angle: 50, stops: ['#44ff99', '#5577ee', '#aa66ff', '#ff66bb'], alpha: 0.6 },
						{ angle: 0, stops: ['#38ee8a', '#4a60dd', '#8850ee', '#e050a0'], alpha: 0.4 },
					],
				};
			case 32:
				return {
					sweeps: [
						{ angle: 145, stops: ['#44ff99', '#9955ee', '#ee55aa', '#4466dd'], alpha: 1.0 },
						{ angle: 35, stops: ['#33ee88', '#aa66ff', '#ff66bb', '#5577ee'], alpha: 0.6 },
						{ angle: 85, stops: ['#3dee8a', '#8850ee', '#e050a0', '#4a60dd'], alpha: 0.4 },
					],
				};
			case 64:
				return {
					sweeps: [
						{ angle: 125, stops: ['#33ee88', '#ddcc33', '#ee55aa', '#9955ee', '#4466dd'], alpha: 1.0 },
						{ angle: 50, stops: ['#44ff99', '#eedd44', '#ff66bb', '#aa66ff', '#5577ee'], alpha: 0.6 },
						{ angle: 90, stops: ['#38ee8a', '#d0c030', '#e050a0', '#8850ee', '#4a60dd'], alpha: 0.35 },
					],
				};
			case 128:
				return {
					sweeps: [
						{ angle: 140, stops: ['#4466dd', '#33ee88', '#9955ee', '#ee55aa', '#ddcc33'], alpha: 1.0 },
						{ angle: 30, stops: ['#5577ee', '#44ff99', '#aa66ff', '#ff66bb', '#eedd44'], alpha: 0.6 },
						{ angle: 80, stops: ['#4a60dd', '#38ee8a', '#8850ee', '#e050a0', '#d0c030'], alpha: 0.35 },
					],
				};
			case 256:
				return {
					sweeps: [
						{ angle: 135, stops: ['#33ee88', '#ddcc33', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 1.0 },
						{ angle: 45, stops: ['#44ff99', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5577ee'], alpha: 0.55 },
						{ angle: 90, stops: ['#38ee8a', '#d0c030', '#d04040', '#e050a0', '#8850ee', '#4a60dd'], alpha: 0.35 },
					],
				};
			case 512:
				return {
					sweeps: [
						{ angle: 130, stops: ['#dd4444', '#eedd44', '#44ff99', '#4466dd', '#9955ee', '#ee55aa'], alpha: 1.0 },
						{ angle: 40, stops: ['#ee5555', '#ffee55', '#55ffaa', '#5577ee', '#aa66ff', '#ff66bb'], alpha: 0.55 },
						{ angle: 85, stops: ['#d04040', '#d4d030', '#48ff98', '#4a60dd', '#8850ee', '#e050a0'], alpha: 0.35 },
					],
				};
			case 1024:
				return {
					sweeps: [
						{ angle: 140, stops: ['#44ff88', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5588ff'], alpha: 1.0 },
						{ angle: 35, stops: ['#55ffaa', '#eedd44', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 0.55 },
						{ angle: 90, stops: ['#33ee77', '#ddcc33', '#cc3333', '#dd4499', '#8844dd', '#3355cc'], alpha: 0.35 },
					],
				};
			default:
				return {
					sweeps: [
						{ angle: 140, stops: ['#44ff88', '#eedd44', '#ee5555', '#ff66bb', '#aa66ff', '#5588ff'], alpha: 1.0 },
						{ angle: 35, stops: ['#55ffaa', '#eedd44', '#dd4444', '#ee55aa', '#9955ee', '#4466dd'], alpha: 0.55 },
						{ angle: 90, stops: ['#33ee77', '#ddcc33', '#cc3333', '#dd4499', '#8844dd', '#3355cc'], alpha: 0.35 },
					],
				};
		}
	}

	// ────────────────────────────────────────────────────────
	// Cached texture builders
	// ────────────────────────────────────────────────────────
	const textureCache = new Map<string, PIXI.Texture>();

	function gradientEndpoints(angle: number, cw: number, ch: number) {
		const rad = (angle * Math.PI) / 180;
		const dx = Math.cos(rad);
		const dy = Math.sin(rad);
		const proj = Math.abs(dx * cw * 0.5) + Math.abs(dy * ch * 0.5);
		return {
			x0: cw / 2 - dx * proj,
			y0: ch / 2 - dy * proj,
			x1: cw / 2 + dx * proj,
			y1: ch / 2 + dy * proj,
		};
	}

	/** Aurora colour texture (2× cell size for drift headroom) */
	function buildAuroraTexture(cellW: number, cellH: number, mult: number): PIXI.Texture {
		const key = `aurora_${mult}_${Math.round(cellW)}_${Math.round(cellH)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const tier = getAuroraTier(mult);
		const cw = Math.round(cellW * 2);
		const ch = Math.round(cellH * 2);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		for (const sweep of tier.sweeps) {
			const ep = gradientEndpoints(sweep.angle, cw, ch);
			const grad = ctx.createLinearGradient(ep.x0, ep.y0, ep.x1, ep.y1);
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

	/** Top-down lighting overlay: lighter at top, darker at bottom */
	function buildLightingTexture(cellW: number, cellH: number): PIXI.Texture {
		const key = `light_${Math.round(cellW)}_${Math.round(cellH)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW);
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Top highlight: soft white fade from top
		const topGrad = ctx.createLinearGradient(0, 0, 0, ch);
		topGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
		topGrad.addColorStop(0.35, 'rgba(255,255,255,0.03)');
		topGrad.addColorStop(0.5, 'rgba(0,0,0,0.0)');
		topGrad.addColorStop(0.75, 'rgba(0,0,0,0.04)');
		topGrad.addColorStop(1, 'rgba(0,0,0,0.10)');
		ctx.fillStyle = topGrad;
		ctx.fillRect(0, 0, cw, ch);

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	// ────────────────────────────────────────────────────────
	// Draw functions
	// ────────────────────────────────────────────────────────

	/** Drop shadow — subtle, offset down 2px */
	const drawShadow = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2 + 2, w, h, cr);
		g.fill({ color: 0x000000 });
	};

	/** Cell body — dark slate fill */
	const drawBody = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.fill({ color: BODY_COLOR });
	};

	/** Thin border stroke */
	const drawBorder = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.stroke({ color: BORDER_COLOR, width: BORDER_WIDTH, alignment: 0.5 });
	};

	/** Mask for aurora + lighting overlays */
	const drawMask = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.fill({ color: 0xffffff });
	};

	// ────────────────────────────────────────────────────────
	// Shimmer sweep
	// ────────────────────────────────────────────────────────
	const shimmerProgress = $derived(props.shimmer ?? -0.2);
	const shimmerVisible = $derived(shimmerProgress > -0.15 && shimmerProgress < 1.15);

	const drawShimmer = (g: PIXI.Graphics) => {
		if (!shimmerVisible) return;
		const bandW = w * 0.18;
		const cx = (shimmerProgress - 0.1) * (w + bandW) - bandW / 2 - w / 2;
		const skew = h * 0.25;
		g.moveTo(cx, -h / 2);
		g.lineTo(cx + bandW, -h / 2);
		g.lineTo(cx + bandW - skew, h / 2);
		g.lineTo(cx - skew, h / 2);
		g.closePath();
		g.fill({ color: 0xffffff });
	};

	const shimmerAlpha = $derived.by(() => {
		const p = shimmerProgress;
		if (p < 0 || p > 1) return 0;
		const d = (p - 0.5) / 0.4;
		return 0.35 * Math.max(0, 1 - d * d);
	});

	// ────────────────────────────────────────────────────────
	// Aurora drift animation
	// ────────────────────────────────────────────────────────
	let panX = $state(0);
	let panY = $state(0);
	let raf = 0;

	onMount(() => {
		const t0 = performance.now();
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
	// Derived textures
	// ────────────────────────────────────────────────────────
	const auroraTexture = $derived(
		w > 0 && h > 0 ? buildAuroraTexture(w, h, props.multiplier) : PIXI.Texture.EMPTY,
	);
	const lightingTexture = $derived(
		w > 0 && h > 0 ? buildLightingTexture(w, h) : PIXI.Texture.EMPTY,
	);

	// Aurora sprite positioning (2× for drift headroom)
	const auroraSpriteX = $derived(-w / 2 + panX - w / 4);
	const auroraSpriteY = $derived(-h / 2 + panY - h / 4);
</script>

<!-- Drop shadow -->
<Graphics draw={drawShadow} alpha={0.15} />

<!-- Dark cell body -->
<Graphics draw={drawBody} />

<!-- Aurora + lighting overlays, masked to cell shape -->
<Container>
	<Graphics draw={drawMask} isMask />

	<!-- Aurora colour tint — low opacity for base, higher for vibrant tiers -->
	<BaseSprite
		texture={auroraTexture}
		x={auroraSpriteX}
		y={auroraSpriteY}
		width={w * 2}
		height={h * 2}
		alpha={auroraAlpha}
	/>

	<!-- Top-down lighting gradient (lighter top, darker bottom) -->
	<BaseSprite
		texture={lightingTexture}
		x={-w / 2}
		y={-h / 2}
		width={w}
		height={h}
	/>

	<!-- Shimmer sweep -->
	{#if shimmerVisible}
		<Graphics draw={drawShimmer} alpha={shimmerAlpha} />
	{/if}
</Container>

<!-- Thin border on top of everything -->
<Graphics draw={drawBorder} alpha={0.50} />
