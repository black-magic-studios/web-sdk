<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics, BaseSprite } from 'pixi-svelte';

	type Props = {
		width: number;
		height: number;
		multiplier: number;
		/** Aurora tint intensity (0–1, driven by vibrance anim). Default 0.30 */
		alpha?: number;
		/** Tier colour (hex). Used for border tint. Default 0x2266aa */
		tierColor?: number;
		/** Shimmer sweep progress: <0 or >1 = hidden, 0–1 = position */
		shimmer?: number;
		/** Hue-travel sweep progress 0→1 during pop animation. Default 0 (idle) */
		hueSweep?: number;
		/** Deterministic seed for per-cell variation (reel*7+row). Default 0 */
		seed?: number;
	};

	const props: Props = $props();

	// ────────────────────────────────────────────────────────
	// Constants
	// ────────────────────────────────────────────────────────
	const CR_RATIO = 0.10;
	const BODY_TOP = 0x1e3044;     // lighter dark slate
	const BODY_BOTTOM = 0x0f1a28;  // deeper dark
	const BORDER_COLOR = 0x44607a;
	const BORDER_WIDTH = 1.5;
	const DRIFT_PX = 6;
	const DRIFT_SPEED = 0.0007;
	const CAVITY_INSET = 4;        // inner shadow depth px
	const RIDGE_WIDTH = 1.2;       // bright inner ridge

	// ────────────────────────────────────────────────────────
	// Derived & per-cell variation
	// ────────────────────────────────────────────────────────
	const w = $derived(props.width);
	const h = $derived(props.height);
	const cr = $derived(Math.round(w * CR_RATIO));
	const auroraAlpha = $derived(props.alpha ?? 0.30);
	const hueSweep = $derived(props.hueSweep ?? 0);

	// Deterministic per-cell variation from seed
	const cellSeed = $derived(props.seed ?? 0);
	const pseudoRand = $derived.by(() => {
		// Simple hash: fract(sin(seed*12.9898)*43758.5453)
		const s = cellSeed;
		return (x: number) => {
			const v = Math.sin((s + x) * 12.9898 + (s * 0.3 + x * 0.7) * 78.233) * 43758.5453;
			return v - Math.floor(v);
		};
	});
	const ribbonAngleOffset = $derived((pseudoRand(1) - 0.5) * 16);  // ±8°
	const highlightOffsetX = $derived((pseudoRand(2) - 0.5) * 4);    // ±2px
	const highlightOffsetY = $derived((pseudoRand(3) - 0.5) * 4);
	const phaseOffset = $derived(pseudoRand(4) * Math.PI * 2);
	const noisePhase = $derived(pseudoRand(5) * 100);

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
	// Texture cache (shared across all instances)
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

	// ── Layer 1: Base body gradient texture (dark→mid, top-left lit) ──
	function buildBodyGradientTexture(cellW: number, cellH: number): PIXI.Texture {
		const key = `body_grad_${Math.round(cellW)}_${Math.round(cellH)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW);
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Diagonal gradient: top-left lighter → bottom-right darker
		const grad = ctx.createLinearGradient(0, 0, cw, ch);
		grad.addColorStop(0, '#253d55');    // lighter slate
		grad.addColorStop(0.35, '#1a2e42'); // mid
		grad.addColorStop(0.7, '#132235');  // darker
		grad.addColorStop(1, '#0d1820');    // deepest
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, cw, ch);

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	// ── Layer 2: Aurora ribbon texture (curved multi-stop, 2× for drift) ──
	function buildAuroraTexture(cellW: number, cellH: number, mult: number, angleOffset: number): PIXI.Texture {
		const key = `aurora_${mult}_${Math.round(cellW)}_${Math.round(cellH)}_${Math.round(angleOffset)}`;
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
			const ep = gradientEndpoints(sweep.angle + angleOffset, cw, ch);
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

	// ── Layer 3: Value-breakup noise texture (low-contrast, large scale) ──
	function buildNoiseTexture(cellW: number, cellH: number, noiseSeed: number): PIXI.Texture {
		const seedKey = Math.round(noiseSeed * 10);
		const key = `noise_${Math.round(cellW)}_${Math.round(cellH)}_${seedKey}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW);
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Simple 2D value noise at large scale — vary brightness ±15%
		const SCALE = 0.04; // large blobs
		const imgData = ctx.createImageData(cw, ch);
		for (let y = 0; y < ch; y++) {
			for (let x = 0; x < cw; x++) {
				const nx = x * SCALE + noiseSeed;
				const ny = y * SCALE + noiseSeed * 0.7;
				// Cheap pseudo-noise: layered sine waves
				const v = 0.5
					+ 0.20 * Math.sin(nx * 1.7 + ny * 2.3)
					+ 0.15 * Math.sin(nx * 3.1 - ny * 1.9 + 2.5)
					+ 0.10 * Math.sin(nx * 0.8 + ny * 4.1 + 5.0);
				// Map to brightness multiplier: 0.70 → 1.15
				const brightness = Math.round(255 * Math.max(0, Math.min(1, v)));
				const idx = (y * cw + x) * 4;
				imgData.data[idx] = brightness;
				imgData.data[idx + 1] = brightness;
				imgData.data[idx + 2] = brightness;
				imgData.data[idx + 3] = 255;
			}
		}
		ctx.putImageData(imgData, 0, 0);

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	// ── Layer 4: Specular structure (rim highlight + soft shadow) ──
	function buildSpecularTexture(cellW: number, cellH: number, hlOx: number, hlOy: number): PIXI.Texture {
		const key = `spec_${Math.round(cellW)}_${Math.round(cellH)}_${Math.round(hlOx)}_${Math.round(hlOy)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW);
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Top-left rim highlight (radial from top-left corner + offset)
		const hlX = cw * 0.15 + hlOx;
		const hlY = ch * 0.15 + hlOy;
		const hlR = Math.max(cw, ch) * 0.9;
		const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
		hlGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
		hlGrad.addColorStop(0.15, 'rgba(255,255,255,0.12)');
		hlGrad.addColorStop(0.30, 'rgba(255,255,255,0.04)');
		hlGrad.addColorStop(0.50, 'rgba(0,0,0,0.0)');
		hlGrad.addColorStop(0.75, 'rgba(0,0,0,0.06)');
		hlGrad.addColorStop(1.0, 'rgba(0,0,0,0.14)');
		ctx.fillStyle = hlGrad;
		ctx.fillRect(0, 0, cw, ch);

		// Central bright streak zone (horizontal ellipse, slight offset)
		const streakX = cw * 0.45;
		const streakY = ch * 0.38;
		const streakRx = cw * 0.35;
		const streakRy = ch * 0.15;
		ctx.save();
		ctx.translate(streakX, streakY);
		ctx.scale(streakRx / streakRy, 1);
		const streakGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, streakRy);
		streakGrad.addColorStop(0, 'rgba(255,255,255,0.10)');
		streakGrad.addColorStop(0.6, 'rgba(255,255,255,0.03)');
		streakGrad.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = streakGrad;
		ctx.fillRect(-streakRy * 2, -streakRy, streakRy * 4, streakRy * 2);
		ctx.restore();

		// Dark pocket bottom-right
		const dpX = cw * 0.75;
		const dpY = ch * 0.72;
		const dpR = cw * 0.35;
		const dpGrad = ctx.createRadialGradient(dpX, dpY, 0, dpX, dpY, dpR);
		dpGrad.addColorStop(0, 'rgba(0,0,0,0.12)');
		dpGrad.addColorStop(0.5, 'rgba(0,0,0,0.06)');
		dpGrad.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = dpGrad;
		ctx.fillRect(0, 0, cw, ch);

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	// ── Inner cavity shading texture: edge darkening + bright inner ridge ──
	function buildCavityTexture(cellW: number, cellH: number, inset: number, cornerR: number): PIXI.Texture {
		const key = `cavity_${Math.round(cellW)}_${Math.round(cellH)}_${inset}_${cornerR}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW);
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		// Inner shadow: darken inward from all edges
		// Top edge shadow
		const topSh = ctx.createLinearGradient(0, 0, 0, inset * 1.5);
		topSh.addColorStop(0, 'rgba(0,0,0,0.20)');
		topSh.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = topSh;
		ctx.fillRect(0, 0, cw, inset * 1.5);

		// Bottom edge shadow
		const botSh = ctx.createLinearGradient(0, ch, 0, ch - inset * 1.5);
		botSh.addColorStop(0, 'rgba(0,0,0,0.16)');
		botSh.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = botSh;
		ctx.fillRect(0, ch - inset * 1.5, cw, inset * 1.5);

		// Left edge shadow
		const leftSh = ctx.createLinearGradient(0, 0, inset * 1.5, 0);
		leftSh.addColorStop(0, 'rgba(0,0,0,0.14)');
		leftSh.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = leftSh;
		ctx.fillRect(0, 0, inset * 1.5, ch);

		// Right edge shadow
		const rightSh = ctx.createLinearGradient(cw, 0, cw - inset * 1.5, 0);
		rightSh.addColorStop(0, 'rgba(0,0,0,0.14)');
		rightSh.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = rightSh;
		ctx.fillRect(cw - inset * 1.5, 0, inset * 1.5, ch);

		// Bright inner ridge on top-left (thin white line just inside border)
		ctx.save();
		ctx.beginPath();
		const rw = RIDGE_WIDTH;
		const inR = cornerR - 1;
		// Inner rounded rect path
		ctx.roundRect(inset * 0.5, inset * 0.5, cw - inset, ch - inset, Math.max(1, inR));
		ctx.strokeStyle = 'rgba(255,255,255,0.18)';
		ctx.lineWidth = rw;
		ctx.stroke();
		ctx.restore();

		// Second ridge: highlight only top + left (brighter)
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(inset * 0.8 + inR, inset * 0.6);
		ctx.lineTo(cw * 0.7, inset * 0.6);
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = rw * 0.7;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(inset * 0.6, inset * 0.8 + inR);
		ctx.lineTo(inset * 0.6, ch * 0.6);
		ctx.stroke();
		ctx.restore();

		const texture = PIXI.Texture.from(canvas);
		textureCache.set(key, texture);
		return texture;
	}

	// ── Hue-travel sweep texture: cyan→green→violet band ──
	function buildHueSweepTexture(cellW: number, cellH: number): PIXI.Texture {
		const key = `hue_sweep_${Math.round(cellW)}_${Math.round(cellH)}`;
		const cached = textureCache.get(key);
		if (cached) return cached;

		const cw = Math.round(cellW * 3); // 3× width for sweep travel
		const ch = Math.round(cellH);
		const canvas = document.createElement('canvas');
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext('2d')!;

		const grad = ctx.createLinearGradient(0, 0, cw, 0);
		grad.addColorStop(0, 'rgba(0,0,0,0)');
		grad.addColorStop(0.10, 'rgba(0,255,255,0)');
		grad.addColorStop(0.20, 'rgba(0,255,255,0.5)');
		grad.addColorStop(0.30, 'rgba(40,255,140,0.6)');
		grad.addColorStop(0.45, 'rgba(80,255,80,0.55)');
		grad.addColorStop(0.55, 'rgba(140,120,255,0.5)');
		grad.addColorStop(0.70, 'rgba(180,80,255,0.4)');
		grad.addColorStop(0.80, 'rgba(160,40,220,0.2)');
		grad.addColorStop(0.90, 'rgba(0,0,0,0)');
		grad.addColorStop(1.0, 'rgba(0,0,0,0)');
		ctx.fillStyle = grad;
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

	/** Cell body fill (used as backdrop before gradient texture) */
	const drawBody = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.fill({ color: BODY_BOTTOM });
	};

	/** Border with tier-tinted glow */
	const drawBorder = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.stroke({ color: BORDER_COLOR, width: BORDER_WIDTH, alignment: 0.5 });
	};

	/** Outer glow stroke — tier-coloured, very subtle */
	const drawGlow = (g: PIXI.Graphics) => {
		g.roundRect(-w / 2 - 0.5, -h / 2 - 0.5, w + 1, h + 1, cr + 1);
		g.stroke({ color: props.tierColor ?? 0x2266aa, width: 1.5, alignment: 1 });
	};

	/** Mask for all inner overlays */
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
		const bandW = w * 0.22;
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
		return 0.40 * Math.max(0, 1 - d * d);
	});

	// ────────────────────────────────────────────────────────
	// Aurora drift animation
	// ────────────────────────────────────────────────────────
	let panX = $state(0);
	let panY = $state(0);
	let raf = 0;

	onMount(() => {
		const t0 = performance.now();
		const phase = phaseOffset;
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
	const bodyGradTexture = $derived(
		w > 0 && h > 0 ? buildBodyGradientTexture(w, h) : PIXI.Texture.EMPTY,
	);
	const auroraTexture = $derived(
		w > 0 && h > 0 ? buildAuroraTexture(w, h, props.multiplier, ribbonAngleOffset) : PIXI.Texture.EMPTY,
	);
	const noiseTexture = $derived(
		w > 0 && h > 0 ? buildNoiseTexture(w, h, noisePhase) : PIXI.Texture.EMPTY,
	);
	const specularTexture = $derived(
		w > 0 && h > 0 ? buildSpecularTexture(w, h, highlightOffsetX, highlightOffsetY) : PIXI.Texture.EMPTY,
	);
	const cavityTexture = $derived(
		w > 0 && h > 0 ? buildCavityTexture(w, h, CAVITY_INSET, cr) : PIXI.Texture.EMPTY,
	);
	const hueSweepTexture = $derived(
		w > 0 && h > 0 ? buildHueSweepTexture(w, h) : PIXI.Texture.EMPTY,
	);

	// Aurora sprite positioning (2× for drift headroom)
	const auroraSpriteX = $derived(-w / 2 + panX - w / 4);
	const auroraSpriteY = $derived(-h / 2 + panY - h / 4);

	// Hue sweep X position (travels 3× cell width during animation)
	const hueSweepX = $derived(-w / 2 - w + hueSweep * w * 3);
	const hueSweepAlpha = $derived.by(() => {
		if (hueSweep <= 0 || hueSweep >= 1) return 0;
		// Peak at 0.35, fade at edges
		const d = (hueSweep - 0.35) / 0.35;
		return 0.5 * Math.max(0, 1 - d * d);
	});

	// Aurora alpha: dimmer at rest, vibrant during pop.
	// auroraAlpha at idle ≈ 0.18, during pop vibrance pushes it to ~0.40.
	// effectiveAuroraAlpha maps that to a visible range:
	//   idle: ~0.18 → 0.18   |   pop: ~0.40 → 0.55
	const effectiveAuroraAlpha = $derived(Math.min(0.65, auroraAlpha * 1.2));

	// Border glow alpha: very subtle at rest, brighter during pop
	const glowAlpha = $derived(0.04 + auroraAlpha * 0.18);
</script>

<!-- Drop shadow -->
<Graphics draw={drawShadow} alpha={0.18} />

<!-- Dark cell body (solid base) -->
<Graphics draw={drawBody} />

<!-- All layered content, masked to cell rounded rect -->
<Container>
	<Graphics draw={drawMask} isMask />

	<!-- Layer 1: Body gradient (dark→mid, lit from top-left) -->
	<BaseSprite
		texture={bodyGradTexture}
		x={-w / 2}
		y={-h / 2}
		width={w}
		height={h}
	/>

	<!-- Layer 2: Aurora ribbon overlay (Screen-like blend via additive alpha) -->
	<BaseSprite
		texture={auroraTexture}
		x={auroraSpriteX}
		y={auroraSpriteY}
		width={w * 2}
		height={h * 2}
		alpha={effectiveAuroraAlpha}
	/>

	<!-- Layer 3: Value-breakup noise (Multiply-like via low alpha overlay) -->
	<BaseSprite
		texture={noiseTexture}
		x={-w / 2}
		y={-h / 2}
		width={w}
		height={h}
		alpha={0.12}
	/>

	<!-- Layer 4: Specular structure (highlight + streak + dark pocket) -->
	<BaseSprite
		texture={specularTexture}
		x={-w / 2}
		y={-h / 2}
		width={w}
		height={h}
	/>

	<!-- Inner cavity: edge shadow + bright inner ridge -->
	<BaseSprite
		texture={cavityTexture}
		x={-w / 2}
		y={-h / 2}
		width={w}
		height={h}
	/>

	<!-- Hue-travel sweep (cyan→green→violet, during pop animation) -->
	{#if hueSweepAlpha > 0}
		<BaseSprite
			texture={hueSweepTexture}
			x={hueSweepX}
			y={-h / 2}
			width={w * 3}
			height={h}
			alpha={hueSweepAlpha}
		/>
	{/if}

	<!-- Shimmer sweep -->
	{#if shimmerVisible}
		<Graphics draw={drawShimmer} alpha={shimmerAlpha} />
	{/if}
</Container>

<!-- Outer glow (tier coloured, subtle) -->
<Graphics draw={drawGlow} alpha={glowAlpha} />

<!-- Thin border on top -->
<Graphics draw={drawBorder} alpha={0.55} />
