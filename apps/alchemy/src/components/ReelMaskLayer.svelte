<script lang="ts">
	import { Rectangle } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';

	const context = getContext();

	const maskWidth = $derived(context.stateGameDerived.maskWidth());
	const maskHeight = $derived(context.stateGameDerived.maskHeight());
</script>

<BoardContainer>
	<Rectangle x={0} y={0} width={maskWidth} height={maskHeight} backgroundColor={0x000000} alpha={0.35} />
</BoardContainer>
