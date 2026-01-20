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
	import { SYMBOL_SIZE } from '../game/constants';

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

	const WIN_FRAME_HEIGHT = SYMBOL_SIZE * 1.3;
	// win_frame.png is 618x512; preserve aspect ratio.
	const WIN_FRAME_WIDTH = WIN_FRAME_HEIGHT * (618 / 512);

	context.eventEmitter.subscribeOnMount({
		multiplierGridShow: () => (show = true),
		multiplierGridHide: () => (show = false),
		multiplierGridUpdate: (emitterEvent) => (grid = emitterEvent.grid),
		multiplierGridClear: () => (grid = DEFAULT_GRID),
	});
</script>

<BoardContainer>
	{#if show}
		{#each grid as reel, reelIndex}
			{#each reel as multiplier, rowIndex}
				{#if multiplier > 1}
					<Container x={(reelIndex + 0.5) * SYMBOL_SIZE} y={(rowIndex + 0.5) * SYMBOL_SIZE}>
						<!--
						<SpineProvider key="anticipation" width={SYMBOL_SIZE * 0.19}>
							<SpineTrack trackIndex={0} animationName={'payframe'} loop />
						</SpineProvider>
						-->
						<Sprite key="winFrame" anchor={0.5} width={WIN_FRAME_WIDTH} height={WIN_FRAME_HEIGHT} />
						<BitmapText
							x={-SYMBOL_SIZE * 0.05}
							anchor={{
								x: 0.5,
								y: 0.5,
							}}
							text={`${multiplier} X`}
							style={{
								fontFamily: 'gold',
								fontSize: SYMBOL_SIZE * 0.5,
								letterSpacing: -5,
							}}
						/>
					</Container>
				{/if}
			{/each}
		{/each}
	{/if}
</BoardContainer>
