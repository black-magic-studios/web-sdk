<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridShow' }
		| { type: 'multiplierGridHide' }
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridClear' };
</script>

<script lang="ts">
	import { BitmapText, Container, Sprite } from 'pixi-svelte';
	// import { BitmapText, Container, SpineProvider, SpineTrack } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';

	type Props = {
		/** Render inside an existing BoardContainer (board-local coordinates). */
		inBoardSpace?: boolean;
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

	let show = $state(false);
	let grid = $state(DEFAULT_GRID);

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());

	// Square frame - size based on symbol dimensions with slight padding
	const WIN_FRAME_SIZE = $derived(symbolSize * 1.3);
	const WIN_FRAME_WIDTH = $derived(WIN_FRAME_SIZE);
	const WIN_FRAME_HEIGHT = $derived(WIN_FRAME_SIZE);

	context.eventEmitter.subscribeOnMount({
		multiplierGridShow: () => (show = true),
		multiplierGridHide: () => (show = false),
		multiplierGridUpdate: (emitterEvent) => (grid = emitterEvent.grid),
		multiplierGridClear: () => (grid = DEFAULT_GRID),
	});
</script>

{#snippet content()}
	{#if show}
		{#each grid as reel, reelIndex}
			{#each reel as multiplier, rowIndex}
				{#if multiplier > 1}
					<Container
						x={getSymbolXDynamic(reelIndex, symbolWidth)}
						y={getSymbolYDynamic(rowIndex, symbolHeight)}
					>
						<Sprite key="winFrame" anchor={0.5} width={WIN_FRAME_WIDTH} height={WIN_FRAME_HEIGHT} />
						<BitmapText
							x={-symbolWidth * 0.05}
							anchor={{
								x: 0.5,
								y: 0.5,
							}}
							text={`${multiplier} X`}
							style={{
								fontFamily: 'gold',
								fontSize: symbolSize * 0.5,
								letterSpacing: -5,
							}}
						/>
					</Container>
				{/if}
			{/each}
		{/each}
	{/if}
{/snippet}

{#if props.inBoardSpace}
	{@render content()}
{:else}
	<BoardContainer zIndex={100}>
		{@render content()}
	</BoardContainer>
{/if}
