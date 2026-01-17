<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	const context = getContext();
</script>

<!-- Reel background plate sprite, extends beyond grid bounds to fill frame's visible area -->
<Sprite
	key="reelBackgroundPlate"
	anchor={0}
	x={-SYMBOL_SIZE}
	y={-SYMBOL_SIZE * 0.5}
	width={context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * 2}
	height={context.stateGameDerived.boardLayout().height + SYMBOL_SIZE}
/>
