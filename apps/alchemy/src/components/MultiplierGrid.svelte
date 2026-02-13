<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridExplode'; grid: number[][] }
		| { type: 'multiplierGridReveal'; grid: number[][] }
		| { type: 'multiplierGridClear' };
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut, cubicOut, cubicInOut } from 'svelte/easing';
	import { Container, SpriteSheet } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import AuroraCellBackground from './AuroraCellBackground.svelte';
	import MultiplierLabel from './MultiplierLabel.svelte';
	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';

	type Props = {
		/** Render inside an existing BoardContainer (board-local coordinates). */
		inBoardSpace?: boolean;
		/** Whether this is the persistent instance (for debugging) */
		persistent?: boolean;
	};

	const props: Props = $props();

	const context = getContext();
	const DEFAULT_GRID = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	];

	// Instance ID for tracking mount/unmount
	const instanceId = Math.random().toString(36).slice(2, 8);

	// Use GLOBAL state from context - survives component remounts!
	const grid = $derived(context.stateGame.multiplierGrid);

	// Lifecycle logging
	onMount(() => {
		console.log(`[MultiplierGrid:${instanceId}] 🟢 MOUNTED at ${Date.now()}, inBoardSpace=${props.inBoardSpace}, persistent=${props.persistent}`);
	});

	onDestroy(() => {
		console.log(`[MultiplierGrid:${instanceId}] 🔴 DESTROYED at ${Date.now()}, inBoardSpace=${props.inBoardSpace}, persistent=${props.persistent}`);
	});

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());

	// ── Colour / luminance utilities ──────────────────────
	function hexToRgb(hex: number): [number, number, number] {
		return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];
	}

	function relativeLuminance(r: number, g: number, b: number): number {
		return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
	}

	/** Brighten a hex colour toward white until its luminance ≥ target. */
	function brightenTint(hex: number, targetLuma: number): number {
		let [r, g, b] = hexToRgb(hex);
		const luma = relativeLuminance(r, g, b);
		if (luma >= targetLuma) return hex;
		const t = Math.min(1, (targetLuma - luma) / (1 - luma + 0.001));
		r = Math.round(r + (255 - r) * t);
		g = Math.round(g + (255 - g) * t);
		b = Math.round(b + (255 - b) * t);
		return (r << 16) | (g << 8) | b;
	}

	// ── Tier info: representative colour + estimated cell luminance ──
	// cellLuma is the approximate perceived luminance of the aurora
	// background as rendered on-screen (average of first sweep × 0.5 alpha
	// against a dark game background).
	type TierInfo = { color: number; cellLuma: number };

	function getTierInfo(mult: number): TierInfo {
		// Colors are the dominant (first-stop) of each aurora tier.
		// cellLuma ≈ mean Rec.709 luminance of sweep 1 stops × 0.5.
		switch (mult) {
			case 2:    return { color: 0x22cc55, cellLuma: 0.34 };
			case 4:    return { color: 0x22dd77, cellLuma: 0.34 };
			case 8:    return { color: 0x4466dd, cellLuma: 0.25 };
			case 16:   return { color: 0x9955ee, cellLuma: 0.24 };
			case 32:   return { color: 0x9955ee, cellLuma: 0.26 };
			case 64:   return { color: 0xddcc33, cellLuma: 0.28 };
			case 128:  return { color: 0x4466dd, cellLuma: 0.22 };
			case 256:  return { color: 0xdd4444, cellLuma: 0.24 };
			case 512:  return { color: 0xdd4444, cellLuma: 0.22 };
			case 1024: return { color: 0x44ff88, cellLuma: 0.26 };
			default:   return { color: 0x44ff88, cellLuma: 0.26 };
		}
	}

	// ── Relational brightness lock ───────────────────────────
	// Use the full saturated tier colour as the face tint.
	// The cell background already supplies the ambient hue;
	// the text must be visibly brighter than the cell at all
	// times.  We brighten the tier colour toward white just
	// enough to exceed  cellLuma + 0.15 , clamped [0.55, 0.80].
	// This preserves hue & saturation while guaranteeing contrast.
	function getMultiplierTint(mult: number): number {
		const { color: tierColor, cellLuma } = getTierInfo(mult);
		const targetLuma = Math.max(0.55, Math.min(0.80, cellLuma + 0.15));
		return brightenTint(tierColor, targetLuma);
	}

	/** Highlight layer opacity by tier — higher tiers get glossier.
	 *  Low tiers are subtler (0.55), high tiers more reflective (0.90). */
	function getHighlightAlpha(mult: number): number {
		if (mult <= 2) return 0.55;
		if (mult <= 8) return 0.6;
		if (mult <= 32) return 0.7;
		if (mult <= 128) return 0.8;
		return 0.9;
	}

	/** Idle drop-shadow alpha per tier. Higher tiers cast slightly more. */
	function getIdleShadowAlpha(mult: number): number {
		if (mult <= 4) return 0.35;
		if (mult <= 32) return 0.40;
		return 0.45;
	}

	// Cell size - match CellGrid sizing (0.96 gap ratio)
	const CELL_GAP_RATIO = 0.96;
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);

	// Check if grid has any multipliers > 1
	const hasMultipliers = $derived(grid.some((reel) => reel.some((m) => m > 1)));

	// ────────────────────────────────────────────────────────
	// Per-cell multi-prop entrance animation
	//
	// Each cell stores a compound animation state:
	//   scale   – size pop (0→1 on appear, pulse on upgrade)
	//   yOffset – pixel bounce (slight upward kick)
	//   alpha   – opacity fade-in
	//
	// All three are Tween stores, staggered by Euclidean
	// distance from grid center.
	// ────────────────────────────────────────────────────────

	// ── Resting label scale ─────────────────────────────────
	// Text is smaller at rest and pops larger during animation.
	// "vibrance" (0–1) drives aurora alpha + highlight boost so
	// bigger scale = more vivid.
	const LABEL_REST_SCALE = 0.88;

	type CellAnimState = {
		scale: Tween<number>;
		yOffset: Tween<number>;
		alpha: Tween<number>;
		shadowAlpha: Tween<number>;
		highlightBoost: Tween<number>;
		labelScale: Tween<number>;
		vibrance: Tween<number>;
		/** Shimmer sweep progress: 0 = off-screen left, 1 = off-screen right */
		shimmer: Tween<number>;
	};

	function makeCellAnim(initialScale = 0, initialAlpha = 0, idleShadow = 0.35): CellAnimState {
		return {
			scale: new Tween(initialScale),
			yOffset: new Tween(initialScale === 0 ? -8 : 0),
			alpha: new Tween(initialAlpha),
			shadowAlpha: new Tween(initialScale === 0 ? 0 : idleShadow),
			highlightBoost: new Tween(0),
			labelScale: new Tween(LABEL_REST_SCALE),
			vibrance: new Tween(0),
			shimmer: new Tween(-0.2),
		};
	}

	// Stagger constants — Euclidean distance from center, outermost pops first.
	const CENTER_REEL = 3;
	const CENTER_ROW = 3;
	const MAX_DIST = Math.sqrt(CENTER_REEL ** 2 + CENTER_ROW ** 2); // ~4.24
	const DIST_STAGGER_MS = 60;
	const MICRO_STAGGER_MS = 12;
	const BASE_OFFSET_MS = 0;
	const POP_DURATION_MS = 250;

	// Map of "reel,row" → CellAnimState — stored in stateGame to survive remounts
	const cellScales = $derived(context.stateGame.multiplierCellScales as Map<string, CellAnimState>);

	function getCellKey(reel: number, row: number) {
		return `${reel},${row}`;
	}

	type CellAnimSnapshot = {
		scale: number;
		yOffset: number;
		alpha: number;
		shadowAlpha: number;
		highlightBoost: number;
		labelScale: number;
		vibrance: number;
		shimmer: number;
	};

	function getCellAnim(reel: number, row: number): CellAnimSnapshot {
		const state = cellScales.get(getCellKey(reel, row));
		if (!state) return { scale: 1, yOffset: 0, alpha: 1, shadowAlpha: 0.35, highlightBoost: 0, labelScale: LABEL_REST_SCALE, vibrance: 0, shimmer: -0.2 };
		return {
			scale: state.scale.current,
			yOffset: state.yOffset.current,
			alpha: state.alpha.current,
			shadowAlpha: state.shadowAlpha.current,
			highlightBoost: state.highlightBoost.current,
			labelScale: state.labelScale.current,
			vibrance: state.vibrance.current,
			shimmer: state.shimmer.current,
		};
	}

	/** Animate a cell appearing with depth cues + label scale pop + vibrance. */
	async function animateCellAppear(anim: CellAnimState, idleShadow: number) {
		// Phase A: expand + fade in + label grows + vibrance spikes (100ms)
		anim.alpha.set(1, { duration: 100, easing: cubicOut });
		anim.yOffset.set(0, { duration: 200, easing: cubicOut });
		anim.shadowAlpha.set(0.55, { duration: 100, easing: cubicOut });
		anim.highlightBoost.set(0.20, { duration: 100, easing: cubicOut });
		anim.labelScale.set(1.06, { duration: 100, easing: cubicOut });
		anim.vibrance.set(1, { duration: 100, easing: cubicOut });
		// Shimmer sweeps left→right during expand
		anim.shimmer.set(-0.2, { duration: 0 });
		anim.shimmer.set(1.2, { duration: 350, easing: cubicOut });
		await anim.scale.set(1.12, { duration: 100, easing: cubicOut });
		// Phase B: settle to idle (180ms)
		anim.shadowAlpha.set(idleShadow, { duration: 180, easing: cubicInOut });
		anim.highlightBoost.set(0, { duration: 180, easing: cubicInOut });
		anim.labelScale.set(LABEL_REST_SCALE, { duration: 200, easing: cubicInOut });
		anim.vibrance.set(0, { duration: 200, easing: cubicInOut });
		await anim.scale.set(1, { duration: 150, easing: cubicInOut });
	}

	/** Animate a cell upgrading with punch + label pop + vibrance. */
	async function animateCellUpgrade(anim: CellAnimState, idleShadow: number) {
		// Phase A: expand + kick up + label grows + vibrance spikes (80ms)
		anim.yOffset.set(-5, { duration: 80, easing: cubicOut });
		anim.shadowAlpha.set(0.60, { duration: 80, easing: cubicOut });
		anim.highlightBoost.set(0.25, { duration: 80, easing: cubicOut });
		anim.labelScale.set(1.10, { duration: 80, easing: cubicOut });
		anim.vibrance.set(1, { duration: 80, easing: cubicOut });
		// Shimmer sweeps left→right during upgrade
		anim.shimmer.set(-0.2, { duration: 0 });
		anim.shimmer.set(1.2, { duration: 300, easing: cubicOut });
		await anim.scale.set(1.22, { duration: 80, easing: cubicOut });
		// Phase B: slight undershoot (80ms)
		anim.yOffset.set(0, { duration: 160, easing: cubicInOut });
		await anim.scale.set(0.97, { duration: 80 });
		// Phase C: settle (120ms)
		anim.shadowAlpha.set(idleShadow, { duration: 120, easing: cubicInOut });
		anim.highlightBoost.set(0, { duration: 120, easing: cubicInOut });
		anim.labelScale.set(LABEL_REST_SCALE, { duration: 150, easing: cubicInOut });
		anim.vibrance.set(0, { duration: 150, easing: cubicInOut });
		await anim.scale.set(1, { duration: 100, easing: cubicInOut });
	}

	/** Animate newly-appearing cells with staggered multi-prop entrance.
	 *  Used by the normal multiplierGridUpdate path (non-explosion). */
	function animateNewCells(newGrid: number[][]) {
		const previousGrid = context.stateGame.multiplierPreviousGrid;
		const nextScales = new Map(cellScales);

		for (let reel = 0; reel < newGrid.length; reel++) {
			for (let row = 0; row < newGrid[reel].length; row++) {
				const key = getCellKey(reel, row);
				const newVal = newGrid[reel][row];
				const prevVal = previousGrid[reel]?.[row] ?? 0;

				if (newVal > 1 && prevVal <= 1) {
					// Newly appearing cell
					const idle = getIdleShadowAlpha(newVal);
					const anim = makeCellAnim(0, 0, idle);
					nextScales.set(key, anim);
					const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
					const microOffset = ((reel + row) % 4) * MICRO_STAGGER_MS;
					const delay = ((MAX_DIST - dist) * DIST_STAGGER_MS) + microOffset + BASE_OFFSET_MS;
					setTimeout(() => animateCellAppear(anim, idle), delay);
				} else if (newVal > 1 && prevVal > 1 && newVal !== prevVal) {
					// Multiplier upgraded
					const existing = nextScales.get(key);
					if (existing) {
						const idle = getIdleShadowAlpha(newVal);
						const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
						const microOffset = ((reel + row) % 4) * MICRO_STAGGER_MS;
						const delay = ((MAX_DIST - dist) * DIST_STAGGER_MS) + microOffset + BASE_OFFSET_MS;
						setTimeout(() => animateCellUpgrade(existing, idle), delay);
					}
				} else if (newVal <= 1) {
					nextScales.delete(key);
				}
			}
		}

		context.stateGame.multiplierCellScales = nextScales;
		context.stateGame.multiplierPreviousGrid = newGrid.map((r) => [...r]);
	}

	// ────────────────────────────────────────────────────────
	// Explosion animation at multiplier-upgrading cells
	// Star explosion plays BEFORE the multiplier value appears/updates,
	// triggered by the multiplierGridExplodeUpdate event.
	// ────────────────────────────────────────────────────────

	// Explosion spritesheet config (matches constants.ts explosion)
	const EXPLOSION_ASSET_KEY = 'snowPuff';
	const EXPLOSION_ANIMATION_NAME = 'explosion';
	const EXPLOSION_ANIMATION_SPEED = 1.3333;
	const EXPLOSION_FRAME_COUNT = 40;
	const EXPLOSION_FRAME_HEIGHT = 440;
	const EXPLOSION_SIZE_RATIO = 1.5;
	const EXPLOSION_DURATION_MS = (EXPLOSION_FRAME_COUNT / EXPLOSION_ANIMATION_SPEED) * (1000 / 60);
	const EXPLOSION_STAGGER_MS = 150;

	// Set of cell keys currently playing explosion animation — stored in stateGame
	const explodingCells = $derived(context.stateGame.multiplierExplodingCells);

	// Scale for explosion spritesheet (fit to symbol height × 1.5)
	const explosionScale = $derived((symbolHeight * EXPLOSION_SIZE_RATIO) / EXPLOSION_FRAME_HEIGHT);
	const hasExplosions = $derived(context.stateGame.multiplierExplodingCells.size > 0);

	context.eventEmitter.subscribeOnMount({
		multiplierGridExplode: async (emitterEvent) => {
			const newGrid = emitterEvent.grid;
			const previousGrid = context.stateGame.multiplierPreviousGrid;

			// Find cells that are NEW or UPGRADED
			const upgradingCells: { reel: number; row: number; dist: number; isNew: boolean }[] = [];
			for (let reel = 0; reel < newGrid.length; reel++) {
				for (let row = 0; row < newGrid[reel].length; row++) {
					const newVal = newGrid[reel][row];
					const prevVal = previousGrid[reel]?.[row] ?? 0;
					if (newVal > 1 && (prevVal <= 1 || newVal !== prevVal)) {
						const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
						upgradingCells.push({ reel, row, dist, isNew: prevVal <= 1 });
					}
				}
			}

			if (upgradingCells.length === 0) return;

			console.log(`[MultiplierGrid:${instanceId}] 💥 EXPLODE: ${upgradingCells.length} cells`);

			// Sort outermost first
			upgradingCells.sort((a, b) => b.dist - a.dist);

			// Play staggered explosions
			const explosionPromises = upgradingCells.map((cell, sortedIndex) => {
				return new Promise<void>((resolve) => {
					const delay = sortedIndex * EXPLOSION_STAGGER_MS;
					setTimeout(() => {
						const key = getCellKey(cell.reel, cell.row);
						context.stateGame.multiplierExplodingCells = new Set([...context.stateGame.multiplierExplodingCells, key]);

						// Remove this explosion sprite after its animation finishes
						setTimeout(() => {
							const nextExploding = new Set(context.stateGame.multiplierExplodingCells);
							nextExploding.delete(key);
							context.stateGame.multiplierExplodingCells = nextExploding;
							resolve();
						}, EXPLOSION_DURATION_MS);
					}, delay);
				});
			});

			await Promise.all(explosionPromises);
			console.log(`[MultiplierGrid:${instanceId}] 💥 All explosions complete`);
		},
		multiplierGridReveal: async (emitterEvent) => {
			const newGrid = emitterEvent.grid;
			const previousGrid = context.stateGame.multiplierPreviousGrid;

			// Find cells that are NEW or UPGRADED
			const upgradingCells: { reel: number; row: number; dist: number; isNew: boolean }[] = [];
			for (let reel = 0; reel < newGrid.length; reel++) {
				for (let row = 0; row < newGrid[reel].length; row++) {
					const newVal = newGrid[reel][row];
					const prevVal = previousGrid[reel]?.[row] ?? 0;
					if (newVal > 1 && (prevVal <= 1 || newVal !== prevVal)) {
						const dist = Math.sqrt((reel - CENTER_REEL) ** 2 + (row - CENTER_ROW) ** 2);
						upgradingCells.push({ reel, row, dist, isNew: prevVal <= 1 });
					}
				}
			}

			if (upgradingCells.length === 0) {
				// No upgrades — just apply grid directly
				animateNewCells(newGrid);
				context.stateGame.multiplierGrid = newGrid;
				return;
			}

			console.log(`[MultiplierGrid:${instanceId}] ✨ REVEAL: ${upgradingCells.length} cells`);

			// Sort outermost first
			upgradingCells.sort((a, b) => b.dist - a.dist);

			// Stagger cell reveals
			const revealPromises = upgradingCells.map((cell, sortedIndex) => {
				return new Promise<void>((resolve) => {
					const delay = sortedIndex * DIST_STAGGER_MS;
					setTimeout(async () => {
						const key = getCellKey(cell.reel, cell.row);

						// Update the grid value for this cell
						context.stateGame.multiplierGrid[cell.reel][cell.row] = newGrid[cell.reel][cell.row];
						context.stateGame.multiplierGrid = context.stateGame.multiplierGrid.map((r: number[]) => [...r]);

						// Create / animate compound cell state
						const newMult = newGrid[cell.reel][cell.row];
						const idle = getIdleShadowAlpha(newMult);
						if (cell.isNew) {
							const anim = makeCellAnim(0, 0, idle);
							const next = new Map(context.stateGame.multiplierCellScales);
							next.set(key, anim);
							context.stateGame.multiplierCellScales = next;
							await animateCellAppear(anim, idle);
						} else {
							const existing = context.stateGame.multiplierCellScales.get(key) as CellAnimState | undefined;
							if (existing) {
								await animateCellUpgrade(existing, idle);
							}
						}

						// Update previousGrid for this specific cell
						context.stateGame.multiplierPreviousGrid[cell.reel][cell.row] = newGrid[cell.reel][cell.row];
						resolve();
					}, delay);
				});
			});

			await Promise.all(revealPromises);
			console.log(`[MultiplierGrid:${instanceId}] ✨ All reveals complete`);
		},
		multiplierGridUpdate: (emitterEvent) => {
			const multiplierCount = emitterEvent.grid.flat().filter(m => m > 1).length;
			console.log(`[MultiplierGrid:${instanceId}] 📥 UPDATE at ${Date.now()}`, {
				multiplierCount,
				grid: JSON.stringify(emitterEvent.grid),
			});
			// Kick off per-cell staggered pop-in animations
			animateNewCells(emitterEvent.grid);
			// Update GLOBAL state - persists across component remounts
			context.stateGame.multiplierGrid = emitterEvent.grid;
		},
		multiplierGridClear: () => {
			console.log(`[MultiplierGrid:${instanceId}] 🧹 CLEAR at ${Date.now()}`);
			console.trace('[MultiplierGrid] Clear call stack:');
			// Reset animation state
			context.stateGame.multiplierCellScales = new Map();
			context.stateGame.multiplierPreviousGrid = DEFAULT_GRID.map((r) => [...r]);
			context.stateGame.multiplierExplodingCells = new Set();
			// Update GLOBAL state
			context.stateGame.multiplierGrid = DEFAULT_GRID;
		},
	});

	// Track hasMultipliers changes
	let prevHasMultipliers = false;
	$effect(() => {
		if (hasMultipliers !== prevHasMultipliers) {
			console.log(`[MultiplierGrid:${instanceId}] 👁️ VISIBILITY changed at ${Date.now()}:`, {
				from: prevHasMultipliers,
				to: hasMultipliers,
				cellWidth,
				cellHeight,
			});
			prevHasMultipliers = hasMultipliers;
		}
	});
</script>

{#snippet content()}
	{#if (hasMultipliers || hasExplosions) && cellWidth > 0 && cellHeight > 0}
		{#each grid as reel, reelIndex}
			{#each reel as multiplier, rowIndex}
				{#if multiplier > 1}
					{@const anim = getCellAnim(reelIndex, rowIndex)}
					{#if anim.scale > 0}
						<Container
							x={getSymbolXDynamic(reelIndex, symbolWidth)}
							y={getSymbolYDynamic(rowIndex, symbolHeight) + anim.yOffset}
							scale={anim.scale}
							alpha={anim.alpha * 0.97}
						>
								<AuroraCellBackground
								width={cellWidth}
								height={cellHeight}
								multiplier={multiplier}
								alpha={0.18 + anim.vibrance * 0.22}
								tierColor={getTierInfo(multiplier).color}
								shimmer={anim.shimmer}
							/>
							<MultiplierLabel
								{multiplier}
								{symbolSize}
								{cellWidth}
								{cellHeight}
								tint={getMultiplierTint(multiplier)}
								highlightAlpha={getHighlightAlpha(multiplier)}
								shadowAlpha={anim.shadowAlpha}
								highlightBoost={anim.highlightBoost}
								labelScale={anim.labelScale}
							/>
						</Container>
					{/if}
				{/if}
			{/each}
		{/each}

		<!-- Explosion spritesheets at upgrading cells -->
		{#each [...explodingCells] as cellKey (cellKey)}
			{@const [reelStr, rowStr] = cellKey.split(',')}
			{@const reel = parseInt(reelStr)}
			{@const row = parseInt(rowStr)}
			<Container
				x={getSymbolXDynamic(reel, symbolWidth)}
				y={getSymbolYDynamic(row, symbolHeight)}
				zIndex={20}
			>
				<SpriteSheet
					key={EXPLOSION_ASSET_KEY}
					animationName={EXPLOSION_ANIMATION_NAME}
					anchor={0.5}
					scale={explosionScale}
					animationSpeed={EXPLOSION_ANIMATION_SPEED}
					loop={false}
					play={true}
				/>
			</Container>
		{/each}
	{/if}
{/snippet}

{#if props.inBoardSpace}
	{@render content()}
{:else}
	<BoardContainer zIndex={5}>
		{@render content()}
	</BoardContainer>
{/if}