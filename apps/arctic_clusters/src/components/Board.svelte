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

	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import BoardBase from './BoardBase.svelte';
	import ReelMaskSprite from './ReelMaskSprite.svelte';
	import CellGrid from './CellGrid.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import AuroraCellIndicator from './AuroraCellIndicator.svelte';

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
			const WIN_SCALE_DURATION_MS = 600;
			const getPromises = () =>
				symbolPositions.map(async (position) => {
					const reelSymbol = context.stateGame.board[position.reel].reelState.symbols[position.row];
					reelSymbol.symbolState = 'win';
					const t0 = performance.now();
					await waitForResolve((resolve) => (reelSymbol.oncomplete = resolve));
					// Ensure minimum win duration so the scale animation can play
					const remaining = WIN_SCALE_DURATION_MS - (performance.now() - t0);
					if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
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
			<AuroraCellIndicator inBoardSpace />
			<MultiplierGrid inBoardSpace />
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
			<AuroraCellIndicator inBoardSpace />
			<MultiplierGrid inBoardSpace />
		</BoardContainer>
	</BoardContext>
{/if}
