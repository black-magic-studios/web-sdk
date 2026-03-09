<script lang="ts">
	import * as PIXI from 'pixi.js';
	import gsap from 'gsap';
	import { onMount, onDestroy } from 'svelte';

	// ── Props ──────────────────────────────────────────────
	interface Props {
		cellSize?: number;
		/** Commands pushed by the parent to drive this cell */
		commands?: CellCommand[];
	}

	export interface CellCommand {
		type: 'swap';
		/** URL of the incoming texture (e.g. '/germs_test.png') */
		textureSrc: string;
		/** How many germs the incoming symbol starts with (carries over from prior splits) */
		startCount: number;
	}

	const { cellSize = 256, commands = [] }: Props = $props();

	// ── Constants ──────────────────────────────────────────
	const INITIAL_SCALE = 0.65;
	const SCALE_FACTOR = 0.7;
	const PADDING = 12;
	const JITTER = 3;

	// Tier thresholds
	const TIER1_MAX = 128;
	const TIER2_MAX = 256;
	const POOL_SIZE = 280; // slightly above TIER2_MAX

	// ── State ──────────────────────────────────────────────
	let wrap: HTMLDivElement;
	let app: PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>;
	let germContainer: PIXI.Container;
	let tileContainer: PIXI.Container;

	// Sprite pool
	let pool: PIXI.Sprite[] = [];
	let active: PIXI.Sprite[] = [];
	let generation = 0;
	let splitting = false;
	let currentTexture: PIXI.Texture;

	// Tier 3 state
	let bakedTexture: PIXI.RenderTexture | null = null;
	let tiles: PIXI.Sprite[] = [];
	let logicalCount = 0;
	let inTier3 = false;

	// Loaded textures cache
	const textureCache: Record<string, PIXI.Texture> = {};

	// ── Helpers ────────────────────────────────────────────
	function scaleForGen(gen: number): number {
		return INITIAL_SCALE * Math.pow(SCALE_FACTOR, gen);
	}

	function genFromCount(count: number): number {
		return Math.round(Math.log2(count));
	}

	/** Hex-staggered grid with jitter */
	function computePositions(count: number, size: number): { x: number; y: number }[] {
		if (count === 1) return [{ x: size / 2, y: size / 2 }];

		const cols = Math.ceil(Math.sqrt(count));
		const rows = Math.ceil(count / cols);
		const usable = size - PADDING * 2;
		const cellW = usable / cols;
		const cellH = usable / rows;

		const positions: { x: number; y: number }[] = [];
		for (let i = 0; i < count; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			// Hex stagger: offset odd rows by half a cell
			const stagger = row % 2 === 1 ? cellW * 0.5 : 0;
			positions.push({
				x: PADDING + cellW * (col + 0.5) + stagger + (Math.random() - 0.5) * JITTER,
				y: PADDING + cellH * (row + 0.5) + (Math.random() - 0.5) * JITTER,
			});
		}
		return positions;
	}

	// ── Pool operations ────────────────────────────────────
	function initPool(texture: PIXI.Texture) {
		for (let i = 0; i < POOL_SIZE; i++) {
			const s = new PIXI.Sprite(texture);
			s.anchor.set(0.5);
			s.visible = false;
			s.rotation = (Math.random() - 0.5) * 0.5; // ±15°
			germContainer.addChild(s);
			pool.push(s);
		}
	}

	function acquire(x: number, y: number, gen: number): PIXI.Sprite {
		let sprite = pool.pop();
		if (!sprite) {
			// Fallback: create new if pool exhausted
			sprite = new PIXI.Sprite(currentTexture);
			sprite.anchor.set(0.5);
			germContainer.addChild(sprite);
		}
		sprite.texture = currentTexture;
		sprite.x = x;
		sprite.y = y;
		const s = scaleForGen(gen);
		sprite.scale.set(s);
		sprite.visible = true;
		sprite.rotation = (Math.random() - 0.5) * 0.5;
		sprite.tint = 0xffffff;
		active.push(sprite);
		return sprite;
	}

	function release(sprite: PIXI.Sprite) {
		const idx = active.indexOf(sprite);
		if (idx !== -1) active.splice(idx, 1);
		sprite.visible = false;
		gsap.killTweensOf(sprite);
		gsap.killTweensOf(sprite.scale);
		pool.push(sprite);
	}

	function releaseAll() {
		while (active.length > 0) {
			const s = active.pop()!;
			s.visible = false;
			gsap.killTweensOf(s);
			gsap.killTweensOf(s.scale);
			pool.push(s);
		}
	}

	// ── Tier 3: Bake & Tile ────────────────────────────────
	function bake() {
		// Snapshot current germContainer into a texture
		bakedTexture = app.renderer.generateTexture({
			target: germContainer,
			resolution: 2,
		});

		// Release all individual sprites
		releaseAll();
		germContainer.visible = false;

		// Create first tile
		inTier3 = true;
		logicalCount = TIER2_MAX;
		const tile = new PIXI.Sprite(bakedTexture);
		tile.anchor.set(0.5);
		tile.x = cellSize / 2;
		tile.y = cellSize / 2;
		tile.scale.set(1);
		tileContainer.addChild(tile);
		tiles.push(tile);
	}

	function splitTiles() {
		const currentTiles = [...tiles];
		tiles = [];
		logicalCount *= 2;

		const tileCount = currentTiles.length * 2;
		const positions = computePositions(tileCount, cellSize);
		// Scale each tile so they all fit
		const cols = Math.ceil(Math.sqrt(tileCount));
		const tileScale = 1 / cols;

		let newIdx = 0;
		for (const oldTile of currentTiles) {
			// Pulse the old tile
			gsap.to(oldTile.scale, {
				x: oldTile.scale.x * 1.1,
				y: oldTile.scale.y * 1.1,
				duration: 0.15,
				yoyo: true,
				repeat: 1,
			});

			// Create two tiles from each
			for (let j = 0; j < 2; j++) {
				const pos = positions[newIdx];
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
					x: tileScale,
					y: tileScale,
					duration: 0.4,
					ease: 'back.out(1.4)',
					delay: 0.3,
				});

				newIdx++;
			}
		}

		// Remove old tiles after animation
		gsap.delayedCall(0.3, () => {
			for (const t of currentTiles) {
				tileContainer.removeChild(t);
				t.destroy();
			}
		});
	}

	// ── Settle to grid ─────────────────────────────────────
	function settleToGrid(duration = 0.6) {
		const positions = computePositions(active.length, cellSize);
		for (let i = 0; i < active.length; i++) {
			gsap.to(active[i], {
				x: positions[i].x,
				y: positions[i].y,
				duration,
				ease: 'power2.out',
			});
		}
	}

	// ── Tier 1: Full mitosis ───────────────────────────────
	function tier1Split() {
		if (splitting) return;
		splitting = true;

		const current = [...active];
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
					release(germ);
					acquire(x, y, nextGen);
					acquire(x, y, nextGen);

					completed++;
					if (completed === current.length) {
						generation = nextGen;
						splitting = false;
						settleToGrid();
					}
				},
			});
		}
	}

	// ── Tier 2: Colony pulse ───────────────────────────────
	function tier2Split() {
		if (splitting) return;
		splitting = true;

		const nextGen = generation + 1;
		const nextScale = scaleForGen(nextGen);

		// Flash all active
		for (const germ of active) {
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
				// Spawn doubles
				const current = [...active];
				for (const germ of current) {
					const child = acquire(germ.x, germ.y, nextGen);
					child.scale.set(0);
					gsap.to(child.scale, {
						x: nextScale,
						y: nextScale,
						duration: 0.3,
						ease: 'back.out(1.4)',
					});
				}
				// Shrink originals
				for (const germ of current) {
					gsap.to(germ.scale, {
						x: nextScale,
						y: nextScale,
						duration: 0.3,
					});
				}

				generation = nextGen;
				splitting = false;

				gsap.delayedCall(0.35, () => settleToGrid(0.4));
			},
		});
	}

	// ── Unified split dispatcher ───────────────────────────
	function doSplit() {
		if (splitting) return;

		if (inTier3) {
			splitTiles();
			return;
		}

		const nextCount = active.length * 2;

		if (nextCount > TIER2_MAX) {
			// Transition: do one last tier2 split, then bake
			tier2Split();
			gsap.delayedCall(1.0, () => bake());
			return;
		}

		if (active.length < TIER1_MAX) {
			tier1Split();
		} else {
			tier2Split();
		}
	}

	// ── Swap: clear cell and place new texture ─────────────
	async function handleSwap(cmd: CellCommand) {
		// Load texture if not cached
		if (!textureCache[cmd.textureSrc]) {
			textureCache[cmd.textureSrc] = await PIXI.Assets.load(cmd.textureSrc);
		}
		currentTexture = textureCache[cmd.textureSrc];

		// Clean up tier 3 state if active
		if (inTier3) {
			for (const t of tiles) {
				tileContainer.removeChild(t);
				t.destroy();
			}
			tiles = [];
			if (bakedTexture) {
				bakedTexture.destroy(true);
				bakedTexture = null;
			}
			inTier3 = false;
			germContainer.visible = true;
		}

		// Release all active sprites
		releaseAll();
		generation = genFromCount(cmd.startCount);

		// Place startCount germs
		const positions = computePositions(cmd.startCount, cellSize);
		for (const pos of positions) {
			acquire(pos.x, pos.y, generation);
		}
	}

	// ── Command queue processing ───────────────────────────
	let commandIdx = 0;
	let commandInterval: ReturnType<typeof setInterval> | undefined;

	function processNextCommand() {
		if (commandIdx >= commands.length) {
			// Loop the command sequence
			commandIdx = 0;
		}
		const cmd = commands[commandIdx++];
		handleSwap(cmd);
	}

	// ── Lifecycle ──────────────────────────────────────────
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

		germContainer = new PIXI.Container();
		tileContainer = new PIXI.Container();
		app.stage.addChild(germContainer);
		app.stage.addChild(tileContainer);

		// Preload all textures from commands
		const srcs = [...new Set(commands.map((c) => c.textureSrc))];
		for (const src of srcs) {
			textureCache[src] = await PIXI.Assets.load(src);
		}
		currentTexture = textureCache[srcs[0]];

		// Init sprite pool
		initPool(currentTexture);

		// Start: place first command
		if (commands.length > 0) {
			await handleSwap(commands[0]);
			commandIdx = 1;
		}

		// Drive the demo: alternate between split and swap
		let step = 0;
		commandInterval = setInterval(() => {
			step++;
			if (step % 2 === 1) {
				// Odd steps: split current germs
				doSplit();
			} else {
				// Even steps: swap to next symbol (comes in with 2)
				processNextCommand();
			}
		}, 2000);
	});

	onDestroy(() => {
		if (commandInterval) clearInterval(commandInterval);
		gsap.killTweensOf('*');
		if (bakedTexture) bakedTexture.destroy(true);
		if (app) app.destroy(true);
		pool = [];
		active = [];
		tiles = [];
	});
</script>

<div
	bind:this={wrap}
	style="width:{cellSize}px;height:{cellSize}px;border:1px solid #444;border-radius:6px;overflow:hidden;background:rgba(0,0,0,0.3);"
></div>
