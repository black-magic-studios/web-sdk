<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy } from 'svelte';

	// ── Configuration ─────────────────────────────────────
	const CANVAS_SIZE = 256;
	const GERM_COUNT = 256;
	const GERM_SIZE = 16;
	const SHAPE_SIZE = 200;
	const SHAPE_OFFSET = (CANVAS_SIZE - SHAPE_SIZE) / 2; // center shapes

	// Lerp / physics
	const FORMATION_LERP = 0.08;
	const SWARM_FRICTION = 0.96;
	const BOUNCE_DAMPING = 0.75;
	const IDLE_DRIFT = 0.3;
	const TUMBLE_DURATION_MS = 600; // container zoom duration
	const PHASE_DELAY_MS = 3000; // time before switching shapes

	// Container zoom during tumble
	const ZOOM_OUT_SCALE = 0.8;
	const ZOOM_LERP = 0.06;

	// ── Types ─────────────────────────────────────────────
	type Coord = { x: number; y: number };
	type Phase = 'scatter' | 'forming' | 'tumble';

	// ── State ─────────────────────────────────────────────
	let wrap: HTMLDivElement;
	let app: PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>;
	let germContainer: PIXI.Container;
	let countText: PIXI.Text;
	let tickerFn: ((ticker: PIXI.Ticker) => void) | null = null;
	let phaseTimer: ReturnType<typeof setTimeout> | undefined;
	let cycling = true;

	// Object pool — all sprites pre-allocated
	const pool: PIXI.Sprite[] = [];

	// Per-germ parallel arrays
	const germVx = new Float64Array(GERM_COUNT);
	const germVy = new Float64Array(GERM_COUNT);
	const germTargetX = new Float64Array(GERM_COUNT);
	const germTargetY = new Float64Array(GERM_COUNT);

	let phase: Phase = 'scatter';
	let containerScaleTarget = 1;

	// Blueprints
	let starBlueprint: Coord[] = [];
	let triangleBlueprint: Coord[] = [];
	let currentShapeIndex = 0; // 0 = star, 1 = triangle

	// ── Helpers ───────────────────────────────────────────
	function randomRange(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}

	// ── Create the tiny germ texture (16x16 green circle) ─
	function createGermTexture(renderer: PIXI.Renderer): PIXI.Texture {
		const g = new PIXI.Graphics();
		g.circle(GERM_SIZE / 2, GERM_SIZE / 2, GERM_SIZE / 2);
		g.fill({ color: 0x44dd44, alpha: 1 });
		const texture = renderer.generateTexture(g);
		g.destroy();
		return texture;
	}

	// ── Draw macro shapes off-screen and extract blueprints ─
	function drawStar(cx: number, cy: number, outerR: number, innerR: number, points: number): PIXI.Graphics {
		const g = new PIXI.Graphics();
		const step = Math.PI / points;
		g.moveTo(cx + outerR, cy);
		for (let i = 1; i < points * 2; i++) {
			const r = i % 2 === 0 ? outerR : innerR;
			const angle = i * step - Math.PI / 2;
			g.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
		}
		g.closePath();
		g.fill({ color: 0xffffff, alpha: 1 });
		return g;
	}

	function drawTriangle(cx: number, cy: number, size: number): PIXI.Graphics {
		const g = new PIXI.Graphics();
		const h = (size * Math.sqrt(3)) / 2;
		g.moveTo(cx, cy - h * 0.6);
		g.lineTo(cx - size / 2, cy + h * 0.4);
		g.lineTo(cx + size / 2, cy + h * 0.4);
		g.closePath();
		g.fill({ color: 0xffffff, alpha: 1 });
		return g;
	}

	// ── Pixel Data Extraction — the Blueprint Builder ────
	function extractBlueprint(
		graphics: PIXI.Graphics,
		renderer: PIXI.Renderer,
		targetCount: number,
	): Coord[] {
		// Render the graphics into a texture, then extract pixels
		const rt = PIXI.RenderTexture.create({
			width: CANVAS_SIZE,
			height: CANVAS_SIZE,
			resolution: 1,
		});
		renderer.render({ container: graphics, target: rt });

		// Use extract to get pixel data
		const canvas = renderer.extract.canvas(rt) as HTMLCanvasElement;
		const ctx = canvas.getContext('2d')!;
		const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		const pixels = imageData.data;

		// Collect all non-transparent pixel coordinates
		const allCoords: Coord[] = [];
		for (let y = 0; y < CANVAS_SIZE; y++) {
			for (let x = 0; x < CANVAS_SIZE; x++) {
				const idx = (y * CANVAS_SIZE + x) * 4;
				if (pixels[idx + 3] > 10) {
					allCoords.push({ x, y });
				}
			}
		}

		// Clean up
		rt.destroy(true);

		// Sample down to targetCount coordinates
		if (allCoords.length <= targetCount) return allCoords;

		const sampled: Coord[] = [];
		const step = allCoords.length / targetCount;
		for (let i = 0; i < targetCount; i++) {
			sampled.push(allCoords[Math.floor(i * step)]);
		}
		return sampled;
	}

	// ── Assign blueprint targets to all germs ────────────
	function assignTargets(blueprint: Coord[]) {
		for (let i = 0; i < GERM_COUNT; i++) {
			const coord = blueprint[i % blueprint.length];
			germTargetX[i] = coord.x;
			germTargetY[i] = coord.y;
		}
	}

	// ── Give all germs random scatter velocities ─────────
	function scatterGerms() {
		for (let i = 0; i < GERM_COUNT; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = randomRange(40, 120);
			germVx[i] = Math.cos(angle) * speed;
			germVy[i] = Math.sin(angle) * speed;
		}
	}

	// ── Phase transitions ────────────────────────────────
	function startFormation(blueprint: Coord[]) {
		phase = 'forming';
		assignTargets(blueprint);
		updateLabel();

		// After PHASE_DELAY_MS, tumble to the other shape
		phaseTimer = setTimeout(() => {
			if (!cycling) return;
			startTumble();
		}, PHASE_DELAY_MS);
	}

	function startTumble() {
		phase = 'tumble';
		containerScaleTarget = ZOOM_OUT_SCALE;

		// Switch shape
		currentShapeIndex = (currentShapeIndex + 1) % 2;
		const nextBlueprint = currentShapeIndex === 0 ? starBlueprint : triangleBlueprint;
		assignTargets(nextBlueprint);
		updateLabel();

		// Zoom back in after tumble duration
		setTimeout(() => {
			containerScaleTarget = 1;
			phase = 'forming';

			// Schedule next tumble
			phaseTimer = setTimeout(() => {
				if (!cycling) return;
				startTumble();
			}, PHASE_DELAY_MS);
		}, TUMBLE_DURATION_MS);
	}

	function updateLabel() {
		if (!countText) return;
		const shapeName = currentShapeIndex === 0 ? 'Star' : 'Triangle';
		countText.text = `${GERM_COUNT} → ${shapeName}`;
	}

	// ── Ticker ───────────────────────────────────────────
	function tick(dt: number) {
		const dtNorm = dt / 60;

		if (phase === 'scatter') {
			// Free-float with bouncing
			for (let i = 0; i < GERM_COUNT; i++) {
				const g = pool[i];
				let vx = germVx[i];
				let vy = germVy[i];

				vx *= SWARM_FRICTION;
				vy *= SWARM_FRICTION;

				const speed = Math.sqrt(vx * vx + vy * vy);
				if (speed < 0.5) {
					vx += (Math.random() - 0.5) * IDLE_DRIFT;
					vy += (Math.random() - 0.5) * IDLE_DRIFT;
				}

				g.x += vx * dtNorm;
				g.y += vy * dtNorm;

				// Bounce off cell edges
				const hw = g.width / 2;
				const hh = g.height / 2;
				if (g.x - hw < 0) { g.x = hw; vx = Math.abs(vx) * BOUNCE_DAMPING; }
				else if (g.x + hw > CANVAS_SIZE) { g.x = CANVAS_SIZE - hw; vx = -Math.abs(vx) * BOUNCE_DAMPING; }
				if (g.y - hh < 0) { g.y = hh; vy = Math.abs(vy) * BOUNCE_DAMPING; }
				else if (g.y + hh > CANVAS_SIZE) { g.y = CANVAS_SIZE - hh; vy = -Math.abs(vy) * BOUNCE_DAMPING; }

				germVx[i] = vx;
				germVy[i] = vy;

				g.rotation += (vx > 0 ? 1 : -1) * 0.02 * dtNorm;
			}
		} else {
			// Forming or tumble — lerp toward targets
			const lerp = phase === 'tumble' ? FORMATION_LERP * 1.8 : FORMATION_LERP;

			for (let i = 0; i < GERM_COUNT; i++) {
				const g = pool[i];
				g.x += (germTargetX[i] - g.x) * lerp;
				g.y += (germTargetY[i] - g.y) * lerp;

				// Gentle rotation settle
				g.rotation += (0 - g.rotation) * 0.04;
			}
		}

		// Container scale lerp (zoom effect during tumble)
		const cs = germContainer.scale.x;
		const diff = containerScaleTarget - cs;
		if (Math.abs(diff) > 0.001) {
			const newScale = cs + diff * ZOOM_LERP;
			germContainer.scale.set(newScale);
			// Keep container centered while scaling
			germContainer.x = (CANVAS_SIZE * (1 - newScale)) / 2;
			germContainer.y = (CANVAS_SIZE * (1 - newScale)) / 2;
		}
	}

	// ── Lifecycle ─────────────────────────────────────────
	onMount(async () => {
		app = new PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>();

		await app.init({
			width: CANVAS_SIZE,
			height: CANVAS_SIZE,
			backgroundAlpha: 0,
			antialias: true,
			resolution: Math.min(window.devicePixelRatio ?? 1, 2),
			autoDensity: true,
		});

		wrap.appendChild(app.canvas);

		const renderer = app.renderer;

		// Create the tiny germ texture
		const germTexture = createGermTexture(renderer);

		// Draw macro shapes and extract blueprints
		const starCenter = CANVAS_SIZE / 2;
		const starGfx = drawStar(starCenter, starCenter, SHAPE_SIZE / 2, SHAPE_SIZE / 4.5, 5);
		const triGfx = drawTriangle(starCenter, starCenter, SHAPE_SIZE);

		starBlueprint = extractBlueprint(starGfx, renderer, GERM_COUNT);
		triangleBlueprint = extractBlueprint(triGfx, renderer, GERM_COUNT);

		starGfx.destroy();
		triGfx.destroy();

		// Container for all germs
		germContainer = new PIXI.Container();
		app.stage.addChild(germContainer);

		// Pre-allocate the full object pool — strict pooling, no new/destroy during runtime
		for (let i = 0; i < GERM_COUNT; i++) {
			const sprite = new PIXI.Sprite(germTexture);
			sprite.anchor.set(0.5);
			sprite.x = randomRange(20, CANVAS_SIZE - 20);
			sprite.y = randomRange(20, CANVAS_SIZE - 20);
			sprite.scale.set(0.5);
			sprite.alpha = 0.9;
			germContainer.addChild(sprite);
			pool.push(sprite);
		}

		// Label
		countText = new PIXI.Text({
			text: `${GERM_COUNT} → scatter`,
			style: {
				fontFamily: 'monospace',
				fontSize: 12,
				fill: 0xffffff,
				stroke: { color: 0x000000, width: 3 },
			},
		});
		countText.anchor.set(0.5, 0);
		countText.x = CANVAS_SIZE / 2;
		countText.y = 4;
		app.stage.addChild(countText);

		// Start with scatter phase
		phase = 'scatter';
		scatterGerms();

		// After 1.5s of scatter, begin first formation (Star)
		phaseTimer = setTimeout(() => {
			currentShapeIndex = 0;
			startFormation(starBlueprint);
		}, 1500);

		// Ticker — always running
		tickerFn = (ticker: PIXI.Ticker) => tick(ticker.deltaTime);
		app.ticker.add(tickerFn);
	});

	onDestroy(() => {
		cycling = false;
		if (phaseTimer) clearTimeout(phaseTimer);
		if (tickerFn && app?.ticker) app.ticker.remove(tickerFn);
		if (app) app.destroy(true);
	});
</script>

<div
	bind:this={wrap}
	style="width:{CANVAS_SIZE}px;height:{CANVAS_SIZE}px;border:1px solid #333;border-radius:8px;overflow:hidden;background:#111;"
></div>
