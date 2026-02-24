<script lang="ts" module>
	import type { RawSymbol, Position } from '../game/types';

	export type EmitterEventBoard =
		| { type: 'boardSettle'; board: RawSymbol[][] }
		| { type: 'boardShow' }
		| { type: 'boardHide' }
		| {
				type: 'boardWithAnimateSymbols';
				symbolPositions: Position[];
		  };
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';
	import { BoardContext } from 'components-shared';
	import { stateBetDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import BoardBase from './BoardBase.svelte';
	import ReelMaskSprite from './ReelMaskSprite.svelte';
	import CellGrid from './CellGrid.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import AuroraCellIndicator from './AuroraCellIndicator.svelte';
	import WildPlacementEffect from './WildPlacementEffect.svelte';

	const context = getContext();

	let show = $state(true);

	// Track show state changes
	$effect(() => {
		console.log(`[Board] 👁️ show state changed at ${Date.now()}:`, show);
	});

	context.eventEmitter.subscribeOnMount({
		stopButtonClick: () => context.stateGameDerived.enhancedBoard.stop(),
		boardSettle: ({ board }) => context.stateGameDerived.enhancedBoard.settle(board),
		boardShow: () => {
			console.log(`[Board] 📥 boardShow event at ${Date.now()}`);
			show = true;
		},
		boardHide: () => {
			console.log(`[Board] 📥 boardHide event at ${Date.now()}`);
			show = false;
		},
		boardWithAnimateSymbols: async ({ symbolPositions }) => {
			const skipWin = stateBetDerived.skipWinAnimation();
			const WIN_SCALE_DURATION_MS = skipWin ? 150 : 600;
			const SAFETY_TIMEOUT_MS = skipWin ? 500 : 3000;
			const getPromises = () =>
				symbolPositions.map(async (position) => {
					const reelSymbol = context.stateGame.board[position.reel].reelState.symbols[position.row];
					const prevState = reelSymbol.symbolState;
					if (reelSymbol.rawSymbol.name === 'H4') {
						console.log(`%c[H4 DEBUG] ❄️ Setting H4 to WIN state at [reel=${position.reel}][row=${position.row}] prevState=${prevState}`, 'color: cyan; font-weight: bold');
						console.log(`[H4 DEBUG] ❄️ H4 rawSymbol:`, JSON.parse(JSON.stringify(reelSymbol.rawSymbol)));
						console.trace('[H4 DEBUG] ❄️ Stack trace for H4 win trigger');
					}
					// In super turbo, skip the spritesheet/spine animation — just flash the glow
					if (skipWin) {
						reelSymbol.symbolState = 'win';
						await new Promise((r) => setTimeout(r, WIN_SCALE_DURATION_MS));
						reelSymbol.symbolState = 'postWinStatic';
						return;
					}
					reelSymbol.symbolState = 'win';
					const t0 = performance.now();
					// Wait for oncomplete with safety timeout to prevent freeze on static sprites
					await Promise.race([
						waitForResolve((resolve) => (reelSymbol.oncomplete = resolve)),
						new Promise<void>((resolve) => setTimeout(() => {
							console.warn(`[boardWithAnimateSymbols] ⚠️ oncomplete timeout for [${position.reel}][${position.row}] symbol=${reelSymbol.rawSymbol.name} prevState=${prevState}`);
							resolve();
						}, SAFETY_TIMEOUT_MS)),
					]);
					// Ensure minimum win duration so the scale animation can play
					const remaining = WIN_SCALE_DURATION_MS - (performance.now() - t0);
					if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
					if (reelSymbol.rawSymbol.name === 'H4') {
						console.log(`%c[H4 DEBUG] ❄️ H4 win animation DONE at [reel=${position.reel}][row=${position.row}] elapsed=${(performance.now() - t0).toFixed(0)}ms`, 'color: cyan');
					}
					reelSymbol.symbolState = 'postWinStatic';
				});

			await Promise.all(getPromises());
		},
	});

	context.stateGameDerived.enhancedBoard.readyToSpinEffect();
</script>

{#if show}
	<BoardContext animate={false}>
		<BoardContainer zIndex={0}>
			<ReelMaskSprite inBoardSpace />
			<CellGrid inBoardSpace />
			<MultiplierGrid inBoardSpace />
			<AuroraCellIndicator inBoardSpace />
			<WildPlacementEffect />
			<BoardBase />
		</BoardContainer>
	</BoardContext>

	<BoardContext animate={true}>
		<BoardContainer zIndex={10}>
			<BoardBase />
		</BoardContainer>
	</BoardContext>
{:else}
	<!-- When Board is hidden (during tumble), keep multiplier grid behind symbols -->
	<BoardContext animate={false}>
		<BoardContainer zIndex={0}>
			<ReelMaskSprite inBoardSpace />
			<CellGrid inBoardSpace />
			<MultiplierGrid inBoardSpace />
			<AuroraCellIndicator inBoardSpace />
			<WildPlacementEffect />
		</BoardContainer>
	</BoardContext>
{/if}
