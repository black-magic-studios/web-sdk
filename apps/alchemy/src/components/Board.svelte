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
			const getPromises = () =>
				symbolPositions.map(async (position) => {
					const reelSymbol = context.stateGame.board[position.reel].reelState.symbols[position.row];
					reelSymbol.symbolState = 'win';
					await waitForResolve((resolve) => (reelSymbol.oncomplete = resolve));
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
			<BoardBase />
		</BoardContainer>
	</BoardContext>

	<BoardContext animate={true}>
		<BoardContainer zIndex={10}>
			<BoardBase />
		</BoardContainer>
	</BoardContext>
{:else}
	<!-- Keep board space reserved during tumble - MultiplierGrid state persists via context -->
	<BoardContext animate={false}>
		<BoardContainer zIndex={0}>
			<ReelMaskSprite inBoardSpace />
			<CellGrid inBoardSpace />
			<MultiplierGrid inBoardSpace />
		</BoardContainer>
	</BoardContext>
{/if}
