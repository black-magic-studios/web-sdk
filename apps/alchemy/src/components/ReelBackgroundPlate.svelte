<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();

	// Use dynamic dimensions (cached via $derived)
	const maskWidth = $derived(context.stateGameDerived.maskWidth());
	const maskHeight = $derived(context.stateGameDerived.maskHeight());
</script>

<!-- Reel background plate sprite, extends beyond grid bounds to fill frame's visible area -->
<Sprite
	key="reelBackgroundPlate"
	anchor={0}
	x={0}
	y={0}
	width={maskWidth}
	height={maskHeight}
/>
