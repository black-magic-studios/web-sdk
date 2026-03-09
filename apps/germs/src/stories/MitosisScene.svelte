<script lang="ts">
	import * as PIXI from 'pixi.js';
	import gsap from 'gsap';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		textureSrcs?: string[];
	}

	const { textureSrcs = ['/germs_test.png'] }: Props = $props();

	const CANVAS_SIZE = 256;
	const INITIAL_SCALE = 0.7;
	const SCALE_FACTOR = 0.72;
	const MAX_GERMS = 4096;
	const SPLIT_INTERVAL_MS = 2000;

	// Tier thresholds
	const TIER1_MAX = 128;  // Full individual wobble+split
	const TIER2_MAX = 512;  // Colony pulse — simpler pop-in doubles
	// > TIER2_MAX → Tier 3: bake into render texture, tile-split

	let generation = 0;
	let logicalCount = 0;

	let wrap: HTMLDivElement;
	let app: PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>;
	let intervalId: ReturnType<typeof setInterval> | undefined;

	let germs: PIXI.Sprite[] = [];
	let splitting = false;

	// Tier 3 state
	let germContainer: PIXI.Container;
	let tileContainer: PIXI.Container;
	let bakedTexture: PIXI.RenderTexture | null = null;
	let tiles: PIXI.Sprite[] = [];
	let inTier3 = false;

	// Count label
	let countText: PIXI.Text;

	function scaleForGeneration(gen: number): number {
		return INITIAL_SCALE * Math.pow(SCALE_FACTOR, gen);
	}

	/** Power-of-2 friendly grid: always fills perfectly for counts that are powers of 2 */
	function gridDims(count: number): { cols: number; rows: number } {
		if (count <= 1) return { cols: 1, rows: 1 };
		const log = Math.log2(count);
		const cols = Math.pow(2, Math.ceil(log / 2));
		const rows = count / cols;
		return { cols, rows };
	}

	function computeGridPositions(count: number, size: number): { x: number; y: number }[] {
		if (count === 1) return [{ x: size / 2, y: size / 2 }];

		const { cols, rows } = gridDims(count);
		const cellW = size / cols;
		const cellH = size / rows;

		const positions: { x: number; y: number }[] = [];
		for (let i = 0; i < count; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			positions.push({
				x: cellW * (col + 0.5),
				y: cellH * (row + 0.5),
			});
		}
		return positions;
	}

	function spawnGerm(
		texture: PIXI.Texture,
		x: number,
		y: number,
		gen: number,
	): PIXI.Sprite {
		const sprite = new PIXI.Sprite(texture);
		sprite.anchor.set(0.5);
		sprite.x = x;
		sprite.y = y;
		const s = scaleForGeneration(gen);
		sprite.scale.set(s);
		germContainer.addChild(sprite);
		germs.push(sprite);
		return sprite;
	}

	function releaseGerm(sprite: PIXI.Sprite) {
		const idx = germs.indexOf(sprite);
		if (idx !== -1) germs.splice(idx, 1);
		gsap.killTweensOf(sprite);
		gsap.killTweensOf(sprite.scale);
		germContainer.removeChild(sprite);
		sprite.destroy();
	}

	function updateCount() {
		const count = inTier3 ? logicalCount : germs.length;
		if (countText) countText.text = `${count}`;
	}

	function settleToGrid(duration = 0.6) {
		const positions = computeGridPositions(germs.length, CANVAS_SIZE);
		for (let i = 0; i < germs.length; i++) {
			gsap.to(germs[i], {
				x: positions[i].x,
				y: positions[i].y,
				duration,
				ease: 'power2.out',
			});
		}
	}

	// ── Tier 1: Full wobble+split (≤128) ──────────────────
	function tier1Split(texture: PIXI.Texture) {
		if (splitting) return;
		splitting = true;

		// Retexture ALL existing sprites to the new texture
		for (const g of germs) g.texture = texture;

		const current = [...germs];
		let completed = 0;
		const nextGen = generation + 1;

		for (const germ of current) {
			const bx = germ.scale.x;
			const by = germ.scale.y;

			gsap.to(germ.scale, {
				x: bx * 1.5,
				y: by * 0.5,
				duration: 0.2,
				yoyo: true,
				repeat: 1,
				onComplete: () => {
					const { x, y } = germ;
					releaseGerm(germ);
					spawnGerm(texture, x, y, nextGen);
					spawnGerm(texture, x, y, nextGen);

					completed++;
					if (completed === current.length) {
						generation = nextGen;
						splitting = false;
						updateCount();
						settleToGrid();
					}
				},
			});
		}
	}

	// ── Tier 2: Colony pulse (129–512) ────────────────────
	function tier2Split(texture: PIXI.Texture) {
		if (splitting) return;
		splitting = true;

		const nextGen = generation + 1;
		const nextScale = scaleForGeneration(nextGen);

		// Retexture ALL existing sprites to the new texture
		for (const germ of germs) {
			germ.texture = texture;
			germ.tint = 0xffffcc;
			gsap.delayedCall(0.15, () => { germ.tint = 0xffffff; });
		}

		// Pulse the container
		gsap.to(germContainer.scale, {
			x: 1.05,
			y: 1.05,
			duration: 0.15,
			yoyo: true,
			repeat: 1,
			onComplete: () => {
				const current = [...germs];
				// Spawn a child for each existing germ
				for (const germ of current) {
					const child = spawnGerm(texture, germ.x, germ.y, nextGen);
					child.scale.set(0);
					gsap.to(child.scale, {
						x: nextScale,
						y: nextScale,
						duration: 0.3,
						ease: 'back.out(1.4)',
					});
				}
				// Shrink originals to new gen size
				for (const germ of current) {
					gsap.to(germ.scale, {
						x: nextScale,
						y: nextScale,
						duration: 0.3,
					});
				}

				generation = nextGen;
				splitting = false;
				updateCount();
				gsap.delayedCall(0.35, () => settleToGrid(0.4));
			},
		});
	}

	// ── Tier 3: Bake + tile-split (>512) ──────────────────
	function bake() {
		bakedTexture = app.renderer.generateTexture({
			target: germContainer,
			resolution: 2,
		});

		// Remove all individual sprites
		while (germs.length > 0) {
			const s = germs.pop()!;
			gsap.killTweensOf(s);
			gsap.killTweensOf(s.scale);
			germContainer.removeChild(s);
			s.destroy();
		}
		germContainer.visible = false;

		inTier3 = true;
		logicalCount = TIER2_MAX;

		const tile = new PIXI.Sprite(bakedTexture);
		tile.anchor.set(0.5);
		tile.x = CANVAS_SIZE / 2;
		tile.y = CANVAS_SIZE / 2;
		// Scale to fill the full canvas
		tile.scale.x = CANVAS_SIZE / bakedTexture.width;
		tile.scale.y = CANVAS_SIZE / bakedTexture.height;
		tileContainer.addChild(tile);
		tiles.push(tile);
		updateCount();
	}

	/** Compute tight edge-to-edge grid positions for tiles */
	function computeTileGrid(count: number): { x: number; y: number; scaleX: number; scaleY: number }[] {
		const { cols, rows } = gridDims(count);
		const cellW = CANVAS_SIZE / cols;
		const cellH = CANVAS_SIZE / rows;
		const texW = bakedTexture!.width;
		const texH = bakedTexture!.height;
		const sx = cellW / texW;
		const sy = cellH / texH;

		const out: { x: number; y: number; scaleX: number; scaleY: number }[] = [];
		for (let i = 0; i < count; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			out.push({
				x: cellW * (col + 0.5),
				y: cellH * (row + 0.5),
				scaleX: sx,
				scaleY: sy,
			});
		}
		return out;
	}

	function splitTiles() {
		if (splitting) return;
		splitting = true;

		const currentTiles = [...tiles];
		tiles = [];
		logicalCount *= 2;

		const tileCount = currentTiles.length * 2;
		const grid = computeTileGrid(tileCount);

		let newIdx = 0;
		for (const oldTile of currentTiles) {
			// Pulse old tile
			gsap.to(oldTile.scale, {
				x: oldTile.scale.x * 1.1,
				y: oldTile.scale.y * 1.1,
				duration: 0.15,
				yoyo: true,
				repeat: 1,
			});

			for (let j = 0; j < 2; j++) {
				const pos = grid[newIdx];
				const t = new PIXI.Sprite(bakedTexture!);
				t.anchor.set(0.5);
				t.x = oldTile.x;
				t.y = oldTile.y;
				t.scale.set(0);
				tileContainer.addChild(t);
				tiles.push(t);

				gsap.to(t, {
					x: pos.x,
					y: pos.y,
					duration: 0.5,
					ease: 'power2.out',
					delay: 0.3,
				});
				gsap.to(t.scale, {
					x: pos.scaleX,
					y: pos.scaleY,
					duration: 0.4,
					ease: 'back.out(1.4)',
					delay: 0.3,
				});
				newIdx++;
			}
		}

		// Remove old tiles after animation starts
		gsap.delayedCall(0.3, () => {
			for (const t of currentTiles) {
				tileContainer.removeChild(t);
				t.destroy();
			}
			splitting = false;
			updateCount();
		});
	}

	// ── Unified dispatcher ────────────────────────────────
	function doSplit(texture: PIXI.Texture) {
		if (splitting) return;

		if (inTier3) {
			splitTiles();
			return;
		}

		const nextCount = germs.length * 2;

		if (nextCount > TIER2_MAX) {
			// Last tier-2 split, then bake for tier 3
			tier2Split(texture);
			gsap.delayedCall(1.0, () => bake());
			return;
		}

		if (germs.length <= TIER1_MAX) {
			tier1Split(texture);
		} else {
			tier2Split(texture);
		}
	}

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

		const textures: PIXI.Texture[] = [];
		for (const src of textureSrcs) {
			textures.push(await PIXI.Assets.load(src));
		}
		let textureIndex = 0;

		germContainer = new PIXI.Container();
		tileContainer = new PIXI.Container();
		app.stage.addChild(germContainer);
		app.stage.addChild(tileContainer);

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
		countText.x = CANVAS_SIZE - 6;
		countText.y = 6;
		app.stage.addChild(countText);

		// First germ
		spawnGerm(textures[0], CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0);
		updateCount();

		// Split every interval until max
		intervalId = setInterval(() => {
			const count = inTier3 ? logicalCount : germs.length;
			if (count >= MAX_GERMS) {
				clearInterval(intervalId);
				intervalId = undefined;
				return;
			}
			textureIndex = (textureIndex + 1) % textures.length;
			doSplit(textures[textureIndex]);
		}, SPLIT_INTERVAL_MS);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		gsap.killTweensOf('*');
		if (bakedTexture) bakedTexture.destroy(true);
		if (app) app.destroy(true);
		germs = [];
		tiles = [];
	});
</script>

<div
	bind:this={wrap}
	style="width:{CANVAS_SIZE}px;height:{CANVAS_SIZE}px;border:1px solid #333;border-radius:8px;overflow:hidden;"
></div>
