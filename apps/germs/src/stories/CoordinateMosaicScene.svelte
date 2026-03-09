<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		textureSrcs?: string[];
		maxGerms?: number;
		cellSize?: number;
	}

	const {
		textureSrcs = [
			'/germ_0.png', '/germ_1.png', '/germ_2.png', '/germ_3.png',
			'/germ_4.png', '/germ_5.png', '/germ_6.png', '/germ_7.png',
		],
		maxGerms = 4096,
		cellSize = 256,
	}: Props = $props();

	// ── Configuration ─────────────────────────────────────
	// Internal coordinate space is always 256; cellSize controls display size
	const COORD_SIZE = 256;
	const SPLIT_INTERVAL_MS = 2000;
	const ALPHA_CUTOFF = 30;

	// Blend ramp: count at which mosaic blend begins and ends
	const BLEND_START = 32;   // below this: pure grid
	const BLEND_END = 256;    // at and above this: pure mosaic

	// Animation
	const LERP_RATE = 0.08;
	const SCALE_LERP = 0.1;
	const TINT_LERP = 0.07;
	const WOBBLE_SPEED = 0.015;
	const WOBBLE_AMP_MAX = 4; // wobble fades as blend increases

	// ── Types ─────────────────────────────────────────────
	type PixelCoord = { x: number; y: number; r: number; g: number; b: number };

	// ── State ─────────────────────────────────────────────
	let wrap: HTMLDivElement;
	let app: PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>;
	let germContainer: PIXI.Container;
	let countText: PIXI.Text;
	let tickerFn: ((ticker: PIXI.Ticker) => void) | null = null;
	let intervalId: ReturnType<typeof setInterval> | undefined;
	let alive = true;

	// Object pool — pre-allocated at maxGerms
	let pool: PIXI.Sprite[] = [];
	let activeCount = 0;

	// Per-germ parallel arrays
	let pTargetX: Float64Array;
	let pTargetY: Float64Array;
	let pGridX: Float64Array;   // grid position
	let pGridY: Float64Array;   // grid position
	let pMosaicX: Float64Array; // mosaic blueprint position
	let pMosaicY: Float64Array; // mosaic blueprint position
	let pTargetScale: Float64Array;
	let pTintR: Float64Array;
	let pTintG: Float64Array;
	let pTintB: Float64Array;
	let pTargetTintR: Float64Array;
	let pTargetTintG: Float64Array;
	let pTargetTintB: Float64Array;
	let pWobblePhase: Float64Array;

	let mosaicBlend = 0; // 0 = pure grid, 1 = pure mosaic
	let textureIndex = 0;
	let splitPhase: 'idle' | 'squeeze' | 'expand' = 'idle';
	const SQUEEZE_TARGET_SCALE = 0.008;
	const SQUEEZE_DONE_THRESHOLD = 0.015;

	let textures: PIXI.Texture[] = [];
	// Full-resolution pixel data per texture (all opaque pixels, scanned once)
	let fullPixelData: PixelCoord[][] = [];

	// ── Pixel data extraction (full resolution, cached) ──
	function extractAllPixels(
		texture: PIXI.Texture,
		renderer: PIXI.Renderer,
	): PixelCoord[] {
		const rt = PIXI.RenderTexture.create({
			width: COORD_SIZE,
			height: COORD_SIZE,
			resolution: 1,
		});

		const sprite = new PIXI.Sprite(texture);
		sprite.width = COORD_SIZE;
		sprite.height = COORD_SIZE;
		const container = new PIXI.Container();
		container.addChild(sprite);
		renderer.render({ container, target: rt });

		const canvas = renderer.extract.canvas(rt) as HTMLCanvasElement;
		const ctx = canvas.getContext('2d')!;
		const imageData = ctx.getImageData(0, 0, COORD_SIZE, COORD_SIZE);
		const pixels = imageData.data;

		const coords: PixelCoord[] = [];
		for (let y = 0; y < COORD_SIZE; y++) {
			for (let x = 0; x < COORD_SIZE; x++) {
				const idx = (y * COORD_SIZE + x) * 4;
				if (pixels[idx + 3] >= ALPHA_CUTOFF) {
					coords.push({
						x,
						y,
						r: pixels[idx],
						g: pixels[idx + 1],
						b: pixels[idx + 2],
					});
				}
			}
		}

		sprite.destroy();
		container.destroy();
		rt.destroy(true);

		return coords;
	}

	// Sample exactly N coordinates with good spatial distribution
	function sampleBlueprint(allPixels: PixelCoord[], count: number): PixelCoord[] {
		if (allPixels.length <= count) return allPixels;
		const step = allPixels.length / count;
		const result: PixelCoord[] = [];
		for (let i = 0; i < count; i++) {
			result.push(allPixels[Math.floor(i * step)]);
		}
		return result;
	}

	// ── Scale helpers ─────────────────────────────────────
	function swarmScale(count: number): number {
		if (count <= 1) return 0.5;
		if (count <= 2) return 0.4;
		if (count <= 4) return 0.3;
		if (count <= 8) return 0.22;
		if (count <= 16) return 0.16;
		if (count <= 32) return 0.12;
		if (count <= 64) return 0.08;
		if (count <= 128) return 0.055;
		return 0.04;
	}

	function mosaicScale(count: number): number {
		return Math.max(0.012, 0.08 * Math.sqrt(256 / count));
	}

	/** How much to blend toward mosaic (0 = grid, 1 = mosaic) */
	function blendForCount(count: number): number {
		if (count <= BLEND_START) return 0;
		if (count >= BLEND_END) return 1;
		return (Math.log2(count) - Math.log2(BLEND_START)) /
		       (Math.log2(BLEND_END) - Math.log2(BLEND_START));
	}

	function randomAngle(): number {
		return Math.random() * Math.PI * 2;
	}

	function updateCount() {
		if (countText) countText.text = `${activeCount}`;
	}

	/** Power-of-2 friendly grid */
	function gridDims(count: number): { cols: number; rows: number } {
		if (count <= 1) return { cols: 1, rows: 1 };
		const log = Math.log2(count);
		const cols = Math.pow(2, Math.ceil(log / 2));
		const rows = count / cols;
		return { cols, rows };
	}

	/** Compute blended targets for all active germs */
	function assignBlendedTargets(count: number) {
		const blend = blendForCount(count);
		mosaicBlend = blend;

		// Always compute grid positions
		const { cols, rows } = gridDims(count);
		const cellW = COORD_SIZE / cols;
		const cellH = COORD_SIZE / rows;
		for (let i = 0; i < count; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			pGridX[i] = cellW * (col + 0.5);
			pGridY[i] = cellH * (row + 0.5);
		}

		// Compute mosaic blueprint positions if blend > 0
		const targetTexIdx = (textureIndex + 1) % textures.length;
		const allPixels = fullPixelData[targetTexIdx];
		const sampled = sampleBlueprint(allPixels, count);
		for (let i = 0; i < count; i++) {
			const px = sampled[i % sampled.length];
			pMosaicX[i] = px.x;
			pMosaicY[i] = px.y;
			// Tint: lerp from white toward blueprint color based on blend
			pTargetTintR[i] = 255 + (px.r - 255) * blend;
			pTargetTintG[i] = 255 + (px.g - 255) * blend;
			pTargetTintB[i] = 255 + (px.b - 255) * blend;
		}

		// Blend target positions and scale
		const gridScale = swarmScale(count);
		const mosScale = mosaicScale(count);
		for (let i = 0; i < count; i++) {
			pTargetX[i] = pGridX[i] + (pMosaicX[i] - pGridX[i]) * blend;
			pTargetY[i] = pGridY[i] + (pMosaicY[i] - pGridY[i]) * blend;
			pTargetScale[i] = gridScale + (mosScale - gridScale) * blend;
		}
	}

	// ── Squeeze-swap animation ───────────────────────────
	function startSqueeze() {
		if (activeCount >= maxGerms || splitPhase !== 'idle') return;
		splitPhase = 'squeeze';
		// Set all active sprites to shrink to tiny
		for (let i = 0; i < activeCount; i++) {
			pTargetScale[i] = SQUEEZE_TARGET_SCALE;
		}
	}

	function completeMitosis() {
		const prevCount = activeCount;
		textureIndex = (textureIndex + 1) % textures.length;
		const newTexture = textures[textureIndex];

		// Swap all existing sprites to new texture (invisible at tiny scale)
		for (let i = 0; i < prevCount; i++) {
			pool[i].texture = newTexture;
		}

		// Activate new sprites from pool — spawn at parent position
		for (let i = 0; i < prevCount && activeCount < maxGerms; i++) {
			const parent = pool[i];
			const idx = activeCount;
			const sprite = pool[idx];
			sprite.texture = newTexture;
			sprite.x = parent.x;
			sprite.y = parent.y;
			sprite.scale.set(SQUEEZE_TARGET_SCALE);
			sprite.alpha = 1;
			sprite.visible = true;
			sprite.tint = 0xffffff;
			sprite.rotation = (Math.random() - 0.5) * 0.5;

			pWobblePhase[idx] = Math.random() * Math.PI * 2;
			pTintR[idx] = 255;
			pTintG[idx] = 255;
			pTintB[idx] = 255;
			pTargetTintR[idx] = 255;
			pTargetTintG[idx] = 255;
			pTargetTintB[idx] = 255;

			activeCount++;
		}

		// Compute blended grid↔mosaic targets for all germs (expand phase)
		assignBlendedTargets(activeCount);
		splitPhase = 'expand';

		updateCount();
	}

	// ── Ticker ───────────────────────────────────────────
	function tick(dt: number) {
		// Detect squeeze completion: all active sprites small enough
		if (splitPhase === 'squeeze') {
			let allSmall = true;
			for (let i = 0; i < activeCount; i++) {
				if (pool[i].scale.x > SQUEEZE_DONE_THRESHOLD) {
					allSmall = false;
					break;
				}
			}
			if (allSmall) {
				completeMitosis();
			}
		}

		// Detect expand completion: settle back to idle
		if (splitPhase === 'expand') {
			let settled = true;
			for (let i = 0; i < activeCount; i++) {
				if (Math.abs(pool[i].scale.x - pTargetScale[i]) > 0.005) {
					settled = false;
					break;
				}
			}
			if (settled) {
				splitPhase = 'idle';
			}
		}

		const wobbleAmp = WOBBLE_AMP_MAX * (1 - mosaicBlend);

		for (let i = 0; i < activeCount; i++) {
			const g = pool[i];

			// Wobble (fades out as blend increases toward mosaic)
			pWobblePhase[i] += WOBBLE_SPEED;
			const wobbleX = Math.sin(pWobblePhase[i] * 1.3) * wobbleAmp;
			const wobbleY = Math.cos(pWobblePhase[i] * 0.9) * wobbleAmp;

			// Lerp toward blended target + wobble
			g.x += (pTargetX[i] + wobbleX - g.x) * LERP_RATE;
			g.y += (pTargetY[i] + wobbleY - g.y) * LERP_RATE;

			// Rotation: wobble at low blend, settle to 0 at high blend
			if (mosaicBlend > 0.8) {
				g.rotation += (0 - g.rotation) * 0.04;
			} else {
				g.rotation += Math.sin(pWobblePhase[i] * 0.7) * 0.003;
			}

			// Lerp scale
			const ts = pTargetScale[i];
			g.scale.x += (ts - g.scale.x) * SCALE_LERP;
			g.scale.y += (ts - g.scale.y) * SCALE_LERP;

			// Lerp tint per channel
			pTintR[i] += (pTargetTintR[i] - pTintR[i]) * TINT_LERP;
			pTintG[i] += (pTargetTintG[i] - pTintG[i]) * TINT_LERP;
			pTintB[i] += (pTargetTintB[i] - pTintB[i]) * TINT_LERP;

			const r = Math.round(pTintR[i]) & 0xff;
			const gv = Math.round(pTintG[i]) & 0xff;
			const b = Math.round(pTintB[i]) & 0xff;
			g.tint = (r << 16) | (gv << 8) | b;
		}
	}

	// ── Lifecycle ─────────────────────────────────────────
	onMount(async () => {
		app = new PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>();

		await app.init({
			width: cellSize,
			height: cellSize,
			backgroundAlpha: 0,
			antialias: true,
			resolution: Math.min(window.devicePixelRatio ?? 1, 2),
			autoDensity: true,
		});

		wrap.appendChild(app.canvas);
		const renderer = app.renderer;

		// Load textures
		textures = [];
		for (const src of textureSrcs) {
			textures.push(await PIXI.Assets.load(src));
		}

		// Extract full-resolution pixel data for each texture (once, cached)
		fullPixelData = textures.map((tex) => extractAllPixels(tex, renderer));

		// Allocate parallel arrays at max capacity
		pTargetX = new Float64Array(maxGerms);
		pTargetY = new Float64Array(maxGerms);
		pGridX = new Float64Array(maxGerms);
		pGridY = new Float64Array(maxGerms);
		pMosaicX = new Float64Array(maxGerms);
		pMosaicY = new Float64Array(maxGerms);
		pTargetScale = new Float64Array(maxGerms).fill(0.5);
		pTintR = new Float64Array(maxGerms).fill(255);
		pTintG = new Float64Array(maxGerms).fill(255);
		pTintB = new Float64Array(maxGerms).fill(255);
		pTargetTintR = new Float64Array(maxGerms).fill(255);
		pTargetTintG = new Float64Array(maxGerms).fill(255);
		pTargetTintB = new Float64Array(maxGerms).fill(255);

		pWobblePhase = new Float64Array(maxGerms);
		for (let i = 0; i < maxGerms; i++) {
			pWobblePhase[i] = Math.random() * Math.PI * 2;
		}

		// Container — scale from COORD_SIZE coordinate space to display cellSize
		germContainer = new PIXI.Container();
		const displayScale = cellSize / COORD_SIZE;
		germContainer.scale.set(displayScale);
		app.stage.addChild(germContainer);

		// Pre-allocate full object pool (strict pooling — no new/destroy at runtime)
		const initialTexture = textures[0];
		pool = [];
		for (let i = 0; i < maxGerms; i++) {
			const sprite = new PIXI.Sprite(initialTexture);
			sprite.anchor.set(0.5);
			sprite.visible = false;
			sprite.alpha = 0;
			germContainer.addChild(sprite);
			pool.push(sprite);
		}

		// Count label
		countText = new PIXI.Text({
			text: '1',
			style: {
				fontFamily: 'monospace',
				fontSize: 14,
				fill: 0xffffff,
				stroke: { color: 0x000000, width: 3 },
			},
		});
		countText.anchor.set(1, 0);
		countText.x = cellSize - 6;
		countText.y = 4;
		app.stage.addChild(countText);

		// Activate first germ
		const first = pool[0];
		first.x = COORD_SIZE / 2;
		first.y = COORD_SIZE / 2;
		first.scale.set(swarmScale(1));
		first.alpha = 1;
		first.visible = true;
		first.tint = 0xffffff;
		pTargetX[0] = COORD_SIZE / 2;
		pTargetY[0] = COORD_SIZE / 2;
		pTargetScale[0] = swarmScale(1);
		pWobblePhase[0] = Math.random() * Math.PI * 2;
		activeCount = 1;
		updateCount();

		// Ticker
		tickerFn = (ticker: PIXI.Ticker) => tick(ticker.deltaTime);
		app.ticker.add(tickerFn);

		// Auto-split on interval
		intervalId = setInterval(() => {
			if (activeCount >= maxGerms) {
				clearInterval(intervalId);
				intervalId = undefined;
				return;
			}
			startSqueeze();
		}, SPLIT_INTERVAL_MS);
	});

	onDestroy(() => {
		alive = false;
		if (intervalId) clearInterval(intervalId);
		if (tickerFn && app?.ticker) app.ticker.remove(tickerFn);
		if (app) app.destroy(true);
		pool = [];
		activeCount = 0;
	});
</script>

<div
	bind:this={wrap}
	style="width:{cellSize}px;height:{cellSize}px;border:1px solid #333;border-radius:8px;overflow:hidden;background:#111;"
></div>
