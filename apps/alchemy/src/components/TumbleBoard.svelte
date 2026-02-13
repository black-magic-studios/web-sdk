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
	const POOF_ANIMATION_NAME = 'poof';
	const POOF_ANIMATION_SPEED = 1.0;
	const POOF_FRAME_COUNT = 16;
	const POOF_FRAME_HEIGHT = 320;
	const POOF_SIZE_RATIO = 1.2;
	const POOF_DURATION_MS = (POOF_FRAME_COUNT / POOF_ANIMATION_SPEED) * (1000 / 60);
	const POOF_STAGGER_MS = 30;

	const context = getContext();

	let show = $state(false);

	// Glow animation state: cellKey → asset key
	let poofingCells = $state<Map<string, string>>(new Map());
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const poofScale = $derived((symbolHeight * POOF_SIZE_RATIO) / POOF_FRAME_HEIGHT);
	const hasPoofs = $derived(poofingCells.size > 0);

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
		console.log('[TumbleBoard] 🎰 initTumbleBoardAdding - New symbols dropping in from above');
		return context.stateGameDerived.boardRaw().map((_, reelIndex) => {
			const addingReel = addingBoard[reelIndex] ?? [];

			const tumbleReelAdding = addingReel.map((rawSymbol, symbolIndex) => {
				const initY = getSymbolY(symbolIndex - 1 - addingReel.length);
				console.log(`[TumbleBoard]   Reel ${reelIndex}, Adding symbol ${symbolIndex}: ${rawSymbol.name} starts at Y=${initY.toFixed(1)} (symbolIndex=${symbolIndex}, reelLength=${addingReel.length})`);
				return createTumbleSymbol({ initY, rawSymbol });
			});

			return tumbleReelAdding;
		});
	};

	const initTumbleBoardBase = () => {
		console.log('[TumbleBoard] 🎰 initTumbleBoardBase - Existing symbols on board');
		return context.stateGameDerived.boardRaw().map((rawSymbolReel, reelIndex) => {
			const tumbleReelBase = rawSymbolReel.map((rawSymbol, symbolIndex) => {
				const initY = getSymbolY(symbolIndex - 1);
				console.log(`[TumbleBoard]   Reel ${reelIndex}, Base symbol ${symbolIndex}: ${rawSymbol.name} at Y=${initY.toFixed(1)}`);
				return createTumbleSymbol({ initY, rawSymbol });
			});

			return tumbleReelBase;
		});
	};

	context.eventEmitter.subscribeOnMount({
		tumbleBoardShow: () => {
			console.log('[TumbleBoard] 👁️ tumbleBoardShow');
			show = true;
		},
		tumbleBoardHide: () => {
			console.log('[TumbleBoard] 👁️ tumbleBoardHide');
			show = false;
		},
		tumbleBoardInit: ({ addingBoard }) => {
			console.log('[TumbleBoard] 🚀 tumbleBoardInit - Starting tumble sequence');
			console.log('[TumbleBoard]   Board dimensions:', context.stateGameDerived.boardLayout().width, 'x', context.stateGameDerived.boardLayout().height);
			console.log('[TumbleBoard]   SYMBOL_HEIGHT constant:', SYMBOL_HEIGHT);
			console.log('[TumbleBoard]   Visible Y range: 0 to', context.stateGameDerived.boardLayout().height);
			context.stateGame.tumbleBoardAdding = initTumbleBoardAdding({ addingBoard });
			context.stateGame.tumbleBoardBase = initTumbleBoardBase();
		},
		tumbleBoardReset: () => {
			console.log('[TumbleBoard] 🔄 tumbleBoardReset');
			context.stateGame.tumbleBoardAdding = [];
			context.stateGame.tumbleBoardBase = [];
			poofingCells = new Map();
		},
		tumbleBoardExplode: async ({ explodingPositions }) => {
			console.log('[TumbleBoard] tumbleBoardExplode called with positions:', explodingPositions);
			
			// Small delay to ensure any previous spriteSheet animations are cleared
			await new Promise(resolve => setTimeout(resolve, 50));

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
					await new Promise(resolve => setTimeout(resolve, sortedIndex * CELL_STAGGER_MS));
					const tumbleSymbol = context.stateGame.tumbleBoardBase[position.reel][position.row];
					console.log('[TumbleBoard] Setting symbol to explosion:', tumbleSymbol.rawSymbol.name, 'at', position, 'index', sortedIndex);
					tumbleSymbol.symbolState = 'explosion';
					await waitForResolve((resolve) => (tumbleSymbol.oncomplete = resolve));
					console.log('[TumbleBoard] Explosion complete for:', tumbleSymbol.rawSymbol.name);
				});

			await Promise.all(getPromises());
			console.log('[TumbleBoard] All explosions complete');
		},
		tumbleBoardVanish: async ({ explodingPositions }) => {
			console.log(`[TumbleBoard] tumbleBoardVanish START - ${explodingPositions.length} symbols`);

			if (explodingPositions.length === 0) return;

			// Sort outermost first for stagger
			const CENTER_REEL = 3;
			const CENTER_ROW = 3;
			const sorted = [...explodingPositions]
				.map((pos) => ({
					...pos,
					dist: Math.sqrt((pos.reel - CENTER_REEL) ** 2 + (pos.row - CENTER_ROW) ** 2),
				}))
				.sort((a, b) => b.dist - a.dist);

			const promises = sorted.map(async (pos, sortedIndex) => {
				const staggerDelay = sortedIndex * POOF_STAGGER_MS;

				// Stagger start
				if (sortedIndex > 0) {
					await new Promise((r) => setTimeout(r, staggerDelay));
				}

				const tumbleSymbol = context.stateGame.tumbleBoardBase[pos.reel]?.[pos.row];
				if (!tumbleSymbol) return;

				const symbolName = tumbleSymbol.rawSymbol?.name ?? '??';
				const key = `${pos.reel},${pos.row}`;
				const assetKey = GLOW_ASSET_MAP[symbolName] ?? GLOW_FALLBACK_KEY;

				// Start glow overlay — symbol stays visible underneath
				const nextMap = new Map(poofingCells);
				nextMap.set(key, assetKey);
				poofingCells = nextMap;

				// Wait for full glow animation (symbol stays visible)
				await new Promise((r) => setTimeout(r, POOF_DURATION_MS));

				// Cleanup glow sprite
				const next = new Map(poofingCells);
				next.delete(key);
				poofingCells = next;
			});

			await Promise.all(promises);
			console.log(`[TumbleBoard] tumbleBoardVanish ALL DONE`);
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
			console.log('[TumbleBoard] ⬇️ tumbleBoardSlideDown - Animating symbols to final positions');
			const getPromises = () =>
				_.flatten(
					context.stateGameDerived.tumbleBoardCombined().map((tumbleReel, reelIndex) => {
						return tumbleReel.map(async (tumbleSymbol, symbolIndex) => {
							const targetY = getSymbolY(symbolIndex - 1); // Refer to initTumbleBoardBase
							const startY = tumbleSymbol.symbolY.current;
							if (targetY !== startY) {
								console.log(`[TumbleBoard]   Reel ${reelIndex}, Symbol ${symbolIndex}: ${tumbleSymbol.rawSymbol.name} sliding from Y=${startY.toFixed(1)} → Y=${targetY.toFixed(1)} (distance: ${(targetY - startY).toFixed(1)})`);
								const bounceDuration = 200;

								await tumbleSymbol.symbolY.set(targetY, {
									duration: bounceDuration,
									easing: constrainedBackOut,
								});

								if (symbolIndex > 0 && symbolIndex < tumbleReel.length - 1) {
									console.log(`[TumbleBoard]   Symbol ${tumbleSymbol.rawSymbol.name} landed at Y=${targetY.toFixed(1)}`);
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
			console.log('[TumbleBoard] ✅ tumbleBoardSlideDown complete');
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
			{#each [...poofingCells] as [cellKey, assetKey] (cellKey)}
				{@const [reelStr, rowStr] = cellKey.split(',')}
				{@const reel = parseInt(reelStr)}
				{@const row = parseInt(rowStr)}
				<Container
					x={getSymbolXDynamic(reel, symbolWidth)}
					y={getSymbolYDynamic(row - 1, symbolHeight)}
				>
					<SpriteSheet
						key={assetKey}
						animationName={POOF_ANIMATION_NAME}
						anchor={0.5}
						scale={poofScale}
						animationSpeed={POOF_ANIMATION_SPEED}
						loop={false}
						play={true}
					/>
				</Container>
			{/each}
		</BoardContainer>
	{/if}
{/if}
