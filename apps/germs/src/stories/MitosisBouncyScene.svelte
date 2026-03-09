<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		textureSrcs?: string[];
	}

	const { textureSrcs = ['/germs_test.png'] }: Props = $props();

	// ── Configuration ─────────────────────────────────────
	const CELL_SIZE = 216;
	const MAX_GERMS = 4096;
	const SPLIT_INTERVAL_MS = 2000;
	const MOSAIC_THRESHOLD = 32;

	// Object pool size — enough for max visible sprites
	const POOL_SIZE = MAX_GERMS;

	// Physics constants (Free Swarm phase)
	const SWARM_FRICTION = 0.95;
	const BOUNCE_DAMPING = 0.8;
	const EXPLODE_SPEED_MIN = 80;
	const EXPLODE_SPEED_MAX = 180;
	const IDLE_NUDGE = 0.4;
	const CRAWL_SPEED = 0.3;

	// Mosaic lerp speed
	const MORPH_LERP = 0.15;

	// Blueprint scan settings
	const SCAN_STEP = 2; // pixel step when scanning alpha
	const ALPHA_CUTOFF = 128; // min alpha to count as opaque

	// ── State ─────────────────────────────────────────────
	let wrap: HTMLDivElement;
	let app: PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>;
	let intervalId: ReturnType<typeof setInterval> | undefined;
	let germContainer: PIXI.Container;
	let countText: PIXI.Text;
	let tickerFn: ((ticker: PIXI.Ticker) => void) | null = null;

	// Object pool
	let pool: PIXI.Sprite[] = [];
	let activeCount = 0;

	// Per-germ parallel arrays
	let germVx: number[] = [];
	let germVy: number[] = [];
	let germTargetX: number[] = [];
	let germTargetY: number[] = [];
	let germTargetScale: number[] = [];
	let germAlphaTarget: number[] = [];

	// Phase tracking
	type Phase = 'swarm' | 'mosaic';
	let phase: Phase = 'swarm';

	// Blueprint cache: texture src → coordinate list
	const blueprintCache = new Map<PIXI.Texture, { x: number; y: number }[]>();

	let logicalCount = 1;
	let generation = 0;

	// ── Helpers ───────────────────────────────────────────
	function randomAngle(): number {
		return Math.random() * Math.PI * 2;
	}

	function randomSpeed(): number {
		return EXPLODE_SPEED_MIN + Math.random() * (EXPLODE_SPEED_MAX - EXPLODE_SPEED_MIN);
	}

	function updateCount() {
		if (countText) countText.text = `${logicalCount}`;
	}

	function scaleForCount(count: number): number {
		// Scale down as count grows so germs fit within the cell
		if (count <= 1) return 0.7;
		if (count <= 4) return 0.55;
		if (count <= 16) return 0.35;
		if (count <= 64) return 0.2;
		if (count <= 256) return 0.12;
		if (count <= 1024) return 0.07;
		return 0.04;
	}

	// ── Blueprint: scan alpha coordinates from a texture ──
	function scanBlueprint(texture: PIXI.Texture): { x: number; y: number }[] {
		const cached = blueprintCache.get(texture);
		if (cached) return cached;

		// Render the texture into a temporary canvas to read pixels
		const w = texture.width;
		const h = texture.height;
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d')!;

		// Draw the PIXI texture source onto the 2D canvas
		const source = texture.source;
		const resource = source.resource;
		if (resource instanceof HTMLImageElement || resource instanceof HTMLCanvasElement) {
			ctx.drawImage(resource, 0, 0, w, h);
		} else {
			// Fallback: create image from URL if available
			return generateFallbackBlueprint();
		}

		const imageData = ctx.getImageData(0, 0, w, h);
		const pixels = imageData.data;
		const coords: { x: number; y: number }[] = [];

		for (let py = 0; py < h; py += SCAN_STEP) {
			for (let px = 0; px < w; px += SCAN_STEP) {
				const idx = (py * w + px) * 4;
				if (pixels[idx + 3] >= ALPHA_CUTOFF) {
					// Map texture coords → cell coords
					coords.push({
						x: (px / w) * CELL_SIZE,
						y: (py / h) * CELL_SIZE,
					});
				}
			}
		}

		blueprintCache.set(texture, coords);
		return coords;
	}

	function generateFallbackBlueprint(): { x: number; y: number }[] {
		// Uniform grid as fallback if texture can't be read
		const coords: { x: number; y: number }[] = [];
		const step = 4;
		for (let y = step; y < CELL_SIZE; y += step) {
			for (let x = step; x < CELL_SIZE; x += step) {
				coords.push({ x, y });
			}
		}
		return coords;
	}

	// ── Assign mosaic targets from a blueprint ───────────
	function assignMosaicTargets(texture: PIXI.Texture, count: number) {
		const blueprint = scanBlueprint(texture);
		const s = scaleForCount(count);

		for (let i = 0; i < count && i < activeCount; i++) {
			// Distribute germs across blueprint coordinates
			const bp = blueprint[i % blueprint.length];
			germTargetX[i] = bp.x;
			germTargetY[i] = bp.y;
			germTargetScale[i] = s;
			germAlphaTarget[i] = 1;
			// Kill physics velocity so lerp takes over
			germVx[i] = 0;
			germVy[i] = 0;
		}
	}

	// ── Activate a pooled sprite ─────────────────────────
	function activateGerm(
		texture: PIXI.Texture,
		x: number,
		y: number,
		scale: number,
		vx = 0,
		vy = 0,
	): number {
		const idx = activeCount;
		const sprite = pool[idx];
		sprite.texture = texture;
		sprite.x = x;
		sprite.y = y;
		sprite.scale.set(scale);
		sprite.alpha = 1;
		sprite.rotation = (Math.random() - 0.5) * 0.6;
		sprite.visible = true;

		germVx[idx] = vx;
		germVy[idx] = vy;
		germTargetX[idx] = x;
		germTargetY[idx] = y;
		germTargetScale[idx] = scale;
		germAlphaTarget[idx] = 1;

		activeCount++;
		return idx;
	}

	// ── Hide a pooled sprite (return to pool) ────────────
	function deactivateGerm(idx: number) {
		// Swap with last active to keep active germs contiguous
		const last = activeCount - 1;
		if (idx < last) {
			const sprite = pool[idx];
			const lastSprite = pool[last];

			// Swap sprites in pool
			pool[idx] = lastSprite;
			pool[last] = sprite;

			// Swap parallel arrays
			germVx[idx] = germVx[last];
			germVy[idx] = germVy[last];
			germTargetX[idx] = germTargetX[last];
			germTargetY[idx] = germTargetY[last];
			germTargetScale[idx] = germTargetScale[last];
			germAlphaTarget[idx] = germAlphaTarget[last];
		}

		pool[last].visible = false;
		pool[last].alpha = 0;
		activeCount--;
	}

	// ── Ticker: handles both phases ──────────────────────
	function tick(dt: number) {
		const dtNorm = dt / 60; // normalize to ~1.0 at 60fps

		if (phase === 'swarm') {
			// Free Swarm: physics bouncing
			for (let i = 0; i < activeCount; i++) {
				const g = pool[i];
				let vx = germVx[i];
				let vy = germVy[i];

				// Friction
				vx *= SWARM_FRICTION;
				vy *= SWARM_FRICTION;

				// Idle nudge
				const speed = Math.sqrt(vx * vx + vy * vy);
				if (speed < CRAWL_SPEED) {
					vx += (Math.random() - 0.5) * IDLE_NUDGE;
					vy += (Math.random() - 0.5) * IDLE_NUDGE;
				}

				g.x += vx * dtNorm;
				g.y += vy * dtNorm;

				// Bounce off cell edges
				const hw = g.width / 2;
				const hh = g.height / 2;
				if (g.x - hw < 0) { g.x = hw; vx = Math.abs(vx) * BOUNCE_DAMPING; }
				else if (g.x + hw > CELL_SIZE) { g.x = CELL_SIZE - hw; vx = -Math.abs(vx) * BOUNCE_DAMPING; }
				if (g.y - hh < 0) { g.y = hh; vy = Math.abs(vy) * BOUNCE_DAMPING; }
				else if (g.y + hh > CELL_SIZE) { g.y = CELL_SIZE - hh; vy = -Math.abs(vy) * BOUNCE_DAMPING; }

				germVx[i] = vx;
				germVy[i] = vy;

				g.rotation += (vx > 0 ? 1 : -1) * 0.02 * dtNorm;

				// Lerp alpha toward target
				g.alpha += (germAlphaTarget[i] - g.alpha) * 0.2;

				// Lerp scale toward target
				const ts = germTargetScale[i];
				g.scale.x += (ts - g.scale.x) * 0.15;
				g.scale.y += (ts - g.scale.y) * 0.15;
			}
		} else {
			// Hive Mind Mosaic: lerp toward target positions
			for (let i = 0; i < activeCount; i++) {
				const g = pool[i];
				const tx = germTargetX[i];
				const ty = germTargetY[i];
				const ts = germTargetScale[i];

				g.x += (tx - g.x) * MORPH_LERP;
				g.y += (ty - g.y) * MORPH_LERP;

				// Lerp scale
				g.scale.x += (ts - g.scale.x) * MORPH_LERP;
				g.scale.y += (ts - g.scale.y) * MORPH_LERP;

				// Lerp alpha
				g.alpha += (germAlphaTarget[i] - g.alpha) * 0.2;

				// Gentle rotation settle toward 0
				g.rotation += (0 - g.rotation) * 0.05;
			}
		}
	}

	// ── Trigger Mitosis ──────────────────────────────────
	function triggerMitosis(newTexture: PIXI.Texture) {
		const prevCount = activeCount;
		const newCount = prevCount * 2;
		const willCrossMosaic = newCount >= MOSAIC_THRESHOLD;
		const newScale = scaleForCount(newCount);

		// Update existing germs' texture via pool swap (no destroy)
		for (let i = 0; i < prevCount; i++) {
			pool[i].texture = newTexture;
		}

		// Spawn new germs from the pool (doubles)
		for (let i = 0; i < prevCount; i++) {
			if (activeCount >= POOL_SIZE) break;
			const parent = pool[i];
			const angle = randomAngle();
			const speed = willCrossMosaic ? 0 : randomSpeed();

			activateGerm(
				newTexture,
				parent.x, parent.y,
				parent.scale.x,
				Math.cos(angle) * speed,
				Math.sin(angle) * speed,
			);
		}

		generation++;
		logicalCount = newCount;
		updateCount();

		if (willCrossMosaic) {
			// Switch to mosaic phase
			phase = 'mosaic';
			assignMosaicTargets(newTexture, activeCount);
		} else {
			// Stay in swarm — give existing germs a burst too
			phase = 'swarm';
			for (let i = 0; i < prevCount; i++) {
				const angle = randomAngle();
				const speed = randomSpeed() * 0.5;
				germVx[i] += Math.cos(angle) * speed;
				germVy[i] += Math.sin(angle) * speed;
			}
			// Update scale targets for all
			for (let i = 0; i < activeCount; i++) {
				germTargetScale[i] = newScale;
			}
		}
	}

	// ── Lifecycle ─────────────────────────────────────────
	onMount(async () => {
		app = new PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>();

		await app.init({
			width: CELL_SIZE,
			height: CELL_SIZE,
			backgroundAlpha: 0,
			antialias: true,
			resolution: Math.min(window.devicePixelRatio ?? 1, 2),
			autoDensity: true,
		});

		wrap.appendChild(app.canvas);

		// Load textures
		const textures: PIXI.Texture[] = [];
		for (const src of textureSrcs) {
			textures.push(await PIXI.Assets.load(src));
		}
		let textureIndex = 0;

		// Create container
		germContainer = new PIXI.Container();
		app.stage.addChild(germContainer);

		// Pre-allocate object pool
		const initialTexture = textures[0];
		pool = [];
		germVx = new Array(POOL_SIZE).fill(0);
		germVy = new Array(POOL_SIZE).fill(0);
		germTargetX = new Array(POOL_SIZE).fill(0);
		germTargetY = new Array(POOL_SIZE).fill(0);
		germTargetScale = new Array(POOL_SIZE).fill(0.7);
		germAlphaTarget = new Array(POOL_SIZE).fill(1);

		for (let i = 0; i < POOL_SIZE; i++) {
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
				fontSize: 16,
				fill: 0xffffff,
				stroke: { color: 0x000000, width: 3 },
			},
		});
		countText.anchor.set(1, 0);
		countText.x = CELL_SIZE - 6;
		countText.y = 6;
		app.stage.addChild(countText);

		// Activate first germ
		const angle = randomAngle();
		activateGerm(
			initialTexture,
			CELL_SIZE / 2, CELL_SIZE / 2,
			scaleForCount(1),
			Math.cos(angle) * 30,
			Math.sin(angle) * 30,
		);
		updateCount();

		// Ticker — always running
		tickerFn = (ticker: PIXI.Ticker) => tick(ticker.deltaTime);
		app.ticker.add(tickerFn);

		// Auto-split on interval
		intervalId = setInterval(() => {
			if (logicalCount >= MAX_GERMS) {
				clearInterval(intervalId);
				intervalId = undefined;
				return;
			}
			textureIndex = (textureIndex + 1) % textures.length;
			triggerMitosis(textures[textureIndex]);
		}, SPLIT_INTERVAL_MS);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		if (tickerFn && app?.ticker) app.ticker.remove(tickerFn);
		if (app) app.destroy(true);
		pool = [];
		activeCount = 0;
	});
</script>

<div
	bind:this={wrap}
	style="width:{CELL_SIZE}px;height:{CELL_SIZE}px;border:1px solid #333;border-radius:8px;overflow:hidden;"
></div>
