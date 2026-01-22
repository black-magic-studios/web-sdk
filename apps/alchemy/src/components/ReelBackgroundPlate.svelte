<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';
</script>

<!-- Reel background plate sprite, extends beyond grid bounds to fill frame's visible area -->
<Sprite
	key="reelBackgroundPlate"
	anchor={0}
	x={0}
	y={0}
	width={MASK_WIDTH}
	height={MASK_HEIGHT}
/>
