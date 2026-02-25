<script lang="ts">
	import { SpineProvider, SpineTrack } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import type { Reel } from '../game/stateGame.svelte';
	import { SYMBOL_WIDTH, SYMBOL_SIZE } from '../game/constants';

	type Props = {
		reel: Reel;
		oncomplete: () => void;
		visible?: boolean;
	};

	const props: Props = $props();
	const context = getContext();

	type AnimationName = 'anticipation_intro' | 'anticipation_loop' | 'anticipation_out';

	let animationName = $state<AnimationName>('anticipation_intro');

	$effect(() => {
		if (props.reel.reelState.motion === 'stopped') {
			if (props.visible === false) {
				// Not showing visual — clean up immediately
				props.oncomplete();
			} else {
				animationName = 'anticipation_out';
			}
		}
	});
</script>

{#if props.visible !== false}
<SpineProvider
	key="anticipation"
	width={SYMBOL_SIZE * 0.56}
	height={SYMBOL_SIZE * 3.7}
	x={context.stateGameDerived.boardLayout().x -
		context.stateGameDerived.boardLayout().width * 0.5 +
		(props.reel.reelIndex + 0.5) * SYMBOL_WIDTH}
	y={context.stateGameDerived.boardLayout().y - SYMBOL_SIZE * 0.06}
>
	<SpineTrack
		trackIndex={0}
		{animationName}
		loop={animationName === 'anticipation_loop'}
		timeScale={stateBetDerived.timeScale()}
		listener={{
			complete: () => {
				if (animationName === 'anticipation_intro') {
					animationName = 'anticipation_loop';
				}

				if (animationName === 'anticipation_out') {
					props.oncomplete();
				}
			},
		}}
	/>
</SpineProvider>
{/if}
