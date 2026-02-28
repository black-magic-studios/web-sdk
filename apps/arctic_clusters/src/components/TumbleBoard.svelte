<script lang="ts" module>
	import type { RawSymbol, Position } from '../game/types';

	type AddingBoard = RawSymbol[][];
	type ExplodingPositions = Position[];

	export type EmitterEventTumbleBoard =
		| { type: 'tumbleBoardShow' }
		| { type: 'tumbleBoardHide' }
		| { type: 'tumbleBoardInit'; addingBoard: AddingBoard }
		| { type: 'tumbleBoardReset' }
		| { type: 'tumbleBoardExplode'; explodingPositions: ExplodingPositions }
		| { type: 'tumbleBoardVanish'; explodingPositions: ExplodingPositions }
		| { type: 'tumbleBoardVanishAll'; explodingPositions: ExplodingPositions }
		| { type: 'tumbleBoardRemoveExploded' }
		| { type: 'tumbleBoardSlideDown' };
</script>

<script lang="ts">
	import _ from 'lodash';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { BoardContext } from 'components-shared';
	import { Container, SpriteSheet } from 'pixi-svelte';
	import { waitForResolve } from 'utils-shared/wait';
	import { stateBetDerived } from 'state-shared';

	import BoardContainer from './BoardContainer.svelte';
	import TumbleBoardBase from './TumbleBoardBase.svelte';
	import { getSymbolXDynamic, getSymbolY, getSymbolYDynamic } from '../game/utils';
	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT } from '../game/constants';

	// Glow-to-white vanish config
	const GLOW_ASSET_MAP: Record<string, string> = {
		H1: 'glowH1', H2: 'glowH2', H3: 'glowH3', H4: 'glowH4',
		L1: 'glowL1', L2: 'glowL2', L3: 'glowL3', L4: 'glowL4',
	};
	const GLOW_FALLBACK_KEY = 'glowGeneric';

	// Per-symbol size ratios — glow must scale to match the symbol's display size
	const SYMBOL_GLOW_SCALE: Record<string, number> = {
		H1: 1.1, H2: 1.5, H3: 1.6, H4: 1.2,
	};
	const POOF_ANIMATION_NAME = 'poof';
	const POOF_ANIMATION_SPEED = 1.0;
	const POOF_FRAME_COUNT = 16;
	const POOF_FRAME_HEIGHT = 320;
	const POOF_SIZE_RATIO = 1.2;
	const POOF_DURATION_MS = (POOF_FRAME_COUNT / POOF_ANIMATION_SPEED) * (1000 / 60);
	// Delay factor per unit of Euclidean distance from board center.
	// Using distance (not sorted index) so vanish and explosion align per-cell.
	const POOF_STAGGER_PER_DIST = 50;

	// Explosion spritesheet config — plays at the moment each cell vanishes
	const EXPLOSION_ASSET_KEY = 'snowPuff';
	const EXPLOSION_ANIMATION_NAME = 'explosion';
	const EXPLOSION_ANIMATION_SPEED = 1.3333;
	const EXPLOSION_FRAME_COUNT = 40;
	const EXPLOSION_FRAME_HEIGHT = 440;
	const EXPLOSION_SIZE_RATIO = 1.5;
	const EXPLOSION_DURATION_MS = (EXPLOSION_FRAME_COUNT / EXPLOSION_ANIMATION_SPEED) * (1000 / 60);

	const context = getContext();

	let show = $state(false);

	// Glow animation state: cellKey → { asset key, symbol size ratio }
	let poofingCells = $state<Map<string, { assetKey: string; sizeRatio: number }>>(new Map());
	// Explosion animation state: cellKey → true
	let explodingCells = $state<Set<string>>(new Set());
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const poofScale = $derived((symbolHeight * POOF_SIZE_RATIO) / POOF_FRAME_HEIGHT);
	const explosionScale = $derived((symbolHeight * EXPLOSION_SIZE_RATIO) / EXPLOSION_FRAME_HEIGHT);

	// Speed-scaled animation speeds for SpriteSheet components
	const poofAnimSpeed = $derived(POOF_ANIMATION_SPEED * stateBetDerived.timeScale());
	const explosionAnimSpeed = $derived(EXPLOSION_ANIMATION_SPEED * stateBetDerived.timeScale());
	const hasPoofs = $derived(poofingCells.size > 0);
	const hasExplosions = $derived(explodingCells.size > 0);

	// Constrained backOut easing - limits overshoot to stay within cell boundary
	// Standard backOut overshoots by ~10% which can cross into adjacent cells
	// This version caps the overshoot to 10% of cell height
	const constrainedBackOut = (t: number): number => {
		const result = backOut(t);
		// backOut can return values > 1 (overshoot). Cap at 1.1 to limit overshoot to 10% of travel distance
		// Since symbols travel 1 cell height, this keeps overshoot within ~10% of cell height
		const maxOvershoot = 1.05; // Allow only 5% overshoot to be safe
		return Math.min(result, maxOvershoot);
	};

	const createTumbleSymbol = ({ initY, rawSymbol }: { initY: number; rawSymbol: RawSymbol }) => {
		const symbolY = new Tween(initY);
		const oncomplete = () => {};

		const tumbleSymbol = $state({
			symbolY,
			symbolScale: 1,
			rawSymbol,
			symbolState: 'static' as const,
			oncomplete,
		});

		return tumbleSymbol;
	};

	const initTumbleBoardAdding = ({ addingBoard }: { addingBoard: AddingBoard }) => {
		return context.stateGameDerived.boardRaw().map((_, reelIndex) => {
			const addingReel = addingBoard[reelIndex] ?? [];

			const tumbleReelAdding = addingReel.map((rawSymbol, symbolIndex) => {
				const initY = getSymbolY(symbolIndex - 1 - addingReel.length);
				return createTumbleSymbol({ initY, rawSymbol });
			});

			return tumbleReelAdding;
		});
	};

	const initTumbleBoardBase = () => {
		return context.stateGameDerived.boardRaw().map((rawSymbolReel, reelIndex) => {
			const tumbleReelBase = rawSymbolReel.map((rawSymbol, symbolIndex) => {
				const initY = getSymbolY(symbolIndex - 1);
				return createTumbleSymbol({ initY, rawSymbol });
			});

			return tumbleReelBase;
		});
	};

	context.eventEmitter.subscribeOnMount({
		tumbleBoardShow: () => {
			show = true;
		},
		tumbleBoardHide: () => {
			show = false;
		},
		tumbleBoardInit: ({ addingBoard }) => {
			context.stateGame.tumbleBoardAdding = initTumbleBoardAdding({ addingBoard });
			context.stateGame.tumbleBoardBase = initTumbleBoardBase();
		},
		tumbleBoardReset: () => {
			context.stateGame.tumbleBoardAdding = [];
			context.stateGame.tumbleBoardBase = [];
			poofingCells = new Map();
			explodingCells = new Set();
		},
		tumbleBoardExplode: async ({ explodingPositions }) => {
			// Small delay to ensure any previous spriteSheet animations are cleared
			await new Promise(resolve => setTimeout(resolve, 50 / stateBetDerived.timeScale()));

			// Stagger explosions from outermost to innermost.
			// Sort by Euclidean distance from center (descending) so every
			// position gets a unique delay — no two cells fire at the same time.
			const CENTER_REEL = 3;
			const CENTER_ROW = 3;
			const CELL_STAGGER_MS = 50;
			
			const sorted = [...explodingPositions]
				.map((pos) => ({
					...pos,
					dist: Math.sqrt((pos.reel - CENTER_REEL) ** 2 + (pos.row - CENTER_ROW) ** 2),
				}))
				.sort((a, b) => b.dist - a.dist); // outermost first
			
			const getPromises = () =>
				sorted.map(async (position, sortedIndex) => {
					await new Promise(resolve => setTimeout(resolve, sortedIndex * CELL_STAGGER_MS / stateBetDerived.timeScale()));
					const tumbleSymbol = context.stateGame.tumbleBoardBase[position.reel][position.row];
					tumbleSymbol.symbolState = 'explosion';
					await waitForResolve((resolve) => (tumbleSymbol.oncomplete = resolve));
				});

			await Promise.all(getPromises());
		},
		tumbleBoardVanish: async ({ explodingPositions }) => {
			if (explodingPositions.length === 0) return;

			// Euclidean distance from board center — creates a consistent
			// directional wave that always feels intentional.
			const CENTER_REEL = 3;
			const CENTER_ROW = 3;
			const CELL_STAGGER_MS = 100;

			const sorted = [...explodingPositions]
				.map((pos) => ({
					...pos,
					dist: Math.sqrt((pos.reel - CENTER_REEL) ** 2 + (pos.row - CENTER_ROW) ** 2),
				}))
				.sort((a, b) => b.dist - a.dist);

			const promises = sorted.map(async (pos, sortedIndex) => {
				const ts = stateBetDerived.timeScale();
				const staggerDelay = sortedIndex * CELL_STAGGER_MS / ts;

				// Stagger start
				if (staggerDelay > 0) {
					await new Promise((r) => setTimeout(r, staggerDelay));
				}

				const tumbleSymbol = context.stateGame.tumbleBoardBase[pos.reel]?.[pos.row];
				if (!tumbleSymbol) return;

				const symbolName = tumbleSymbol.rawSymbol?.name ?? '??';
				const key = `${pos.reel},${pos.row}`;
				const assetKey = GLOW_ASSET_MAP[symbolName] ?? GLOW_FALLBACK_KEY;
				const sizeRatio = SYMBOL_GLOW_SCALE[symbolName] ?? 1;

				// Start glow overlay — symbol stays visible underneath
				const nextMap = new Map(poofingCells);
				nextMap.set(key, { assetKey, sizeRatio });
				poofingCells = nextMap;

				// Wait for full glow animation (symbol stays visible)
				await new Promise((r) => setTimeout(r, POOF_DURATION_MS / ts));

				// Register per-cell vanish callback — fires from TumbleSymbol's $effect
				// after Svelte commits the DOM change, so it's fully event-driven.
				tumbleSymbol.onvanish = () => {
					context.eventEmitter.broadcast({ type: 'soundOnce', name: 'win_explosion', forcePlay: true });
					tumbleSymbol.onvanish = undefined;
				};

				// Hide symbol + start explosion sprite
				tumbleSymbol.symbolState = 'vanished';
				explodingCells = new Set([...explodingCells, key]);

				// Cleanup glow sprite
				const next = new Map(poofingCells);
				next.delete(key);
				poofingCells = next;

				// Wait for explosion to finish
				await new Promise((r) => setTimeout(r, EXPLOSION_DURATION_MS / ts));

				// Cleanup explosion sprite
				const nextExploding = new Set(explodingCells);
				nextExploding.delete(key);
				explodingCells = nextExploding;
			});

			await Promise.all(promises);
		},
		tumbleBoardVanishAll: ({ explodingPositions }) => {
			// Instantly hide all winning symbols at once
			for (const pos of explodingPositions) {
				const tumbleSymbol = context.stateGame.tumbleBoardBase[pos.reel]?.[pos.row];
				if (tumbleSymbol) {
					tumbleSymbol.symbolState = 'vanished';
				}
			}
		},
		tumbleBoardRemoveExploded: () => {
			context.stateGame.tumbleBoardBase.forEach((tumbleReel, reelIndex) => {
				context.stateGame.tumbleBoardBase[reelIndex] = tumbleReel.filter(
					(tumbleSymbol) => tumbleSymbol.symbolState !== 'explosion'
					&& tumbleSymbol.symbolState !== 'vanished',
				);
			});
		},
		tumbleBoardSlideDown: async () => {
			const getPromises = () =>
				_.flatten(
					context.stateGameDerived.tumbleBoardCombined().map((tumbleReel, reelIndex) => {
						return tumbleReel.map(async (tumbleSymbol, symbolIndex) => {
							const targetY = getSymbolY(symbolIndex - 1); // Refer to initTumbleBoardBase
							const startY = tumbleSymbol.symbolY.current;
							if (targetY !== startY) {
								const bounceDuration = 200 / stateBetDerived.timeScale();
								await tumbleSymbol.symbolY.set(targetY, {
									duration: bounceDuration,
									easing: constrainedBackOut,
								});

								if (symbolIndex > 0 && symbolIndex < tumbleReel.length - 1) {

									tumbleSymbol.symbolState = 'land';
									context.stateGameDerived.onSymbolLand({ rawSymbol: tumbleSymbol.rawSymbol });
									await waitForResolve((resolve) => {
										tumbleSymbol.oncomplete = () => {
											tumbleSymbol.symbolState = 'static';
											resolve();
										};
									});
								}
							}
						});
					}),
				);

			await Promise.all(getPromises());
		},
	});
</script>

{#if show}
	<BoardContext animate={false}>
		<BoardContainer zIndex={0}>
			<TumbleBoardBase />
		</BoardContainer>
	</BoardContext>

	<BoardContext animate={true}>
		<BoardContainer zIndex={10}>
			<TumbleBoardBase />
		</BoardContainer>
	</BoardContext>

	<!-- Glow overlay in its own high-zIndex layer so it renders ABOVE symbols -->
	{#if hasPoofs}
		<BoardContainer zIndex={20}>
			{#each [...poofingCells] as [cellKey, cellData] (cellKey)}
				{@const [reelStr, rowStr] = cellKey.split(',')}
				{@const reel = parseInt(reelStr)}
				{@const row = parseInt(rowStr)}
				<Container
					x={getSymbolXDynamic(reel, symbolWidth)}
					y={getSymbolYDynamic(row - 1, symbolHeight)}
				>
					<!-- Main glow — scaled to match symbol's display sizeRatio -->
					<SpriteSheet
						key={cellData.assetKey}
						animationName={POOF_ANIMATION_NAME}
						anchor={0.5}
						scale={poofScale * cellData.sizeRatio}
						animationSpeed={poofAnimSpeed}
						loop={false}
						play={true}
					/>
				</Container>
			{/each}
		</BoardContainer>
	{/if}

	<!-- Explosion sprites — fire at the exact moment each cell vanishes -->
	{#if hasExplosions}
		<BoardContainer zIndex={15}>
			{#each [...explodingCells] as cellKey (cellKey)}
				{@const [reelStr, rowStr] = cellKey.split(',')}
				{@const reel = parseInt(reelStr)}
				{@const row = parseInt(rowStr)}
				<Container
					x={getSymbolXDynamic(reel, symbolWidth)}
					y={getSymbolYDynamic(row - 1, symbolHeight)}
				>
					<SpriteSheet
						key={EXPLOSION_ASSET_KEY}
						animationName={EXPLOSION_ANIMATION_NAME}
						anchor={0.5}
						scale={explosionScale}
						animationSpeed={explosionAnimSpeed}
						loop={false}
						play={true}
					/>
				</Container>
			{/each}
		</BoardContainer>
	{/if}
{/if}
