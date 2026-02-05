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
		| { type: 'tumbleBoardRemoveExploded' }
		| { type: 'tumbleBoardSlideDown' };
</script>

<script lang="ts">
	import _ from 'lodash';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { BoardContext } from 'components-shared';
	import { waitForResolve } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import TumbleBoardBase from './TumbleBoardBase.svelte';
	import { getSymbolY } from '../game/utils';
	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT } from '../game/constants';

	const context = getContext();

	let show = $state(false);

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
		},
		tumbleBoardExplode: async ({ explodingPositions }) => {
			console.log('[TumbleBoard] tumbleBoardExplode called with positions:', explodingPositions);
			
			// Small delay to ensure any previous spriteSheet animations are cleared
			await new Promise(resolve => setTimeout(resolve, 50));
			
			const getPromises = () =>
				explodingPositions.map(async (position) => {
					const tumbleSymbol = context.stateGame.tumbleBoardBase[position.reel][position.row];
					console.log('[TumbleBoard] Setting symbol to explosion:', tumbleSymbol.rawSymbol.name, 'at', position);
					tumbleSymbol.symbolState = 'explosion';
					await waitForResolve((resolve) => (tumbleSymbol.oncomplete = resolve));
					console.log('[TumbleBoard] Explosion complete for:', tumbleSymbol.rawSymbol.name);
				});

			await Promise.all(getPromises());
			console.log('[TumbleBoard] All explosions complete');
		},
		tumbleBoardRemoveExploded: () => {
			context.stateGame.tumbleBoardBase.forEach((tumbleReel, reelIndex) => {
				context.stateGame.tumbleBoardBase[reelIndex] = tumbleReel.filter(
					(tumbleSymbol) => tumbleSymbol.symbolState !== 'explosion',
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
{/if}
