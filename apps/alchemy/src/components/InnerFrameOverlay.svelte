<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';

	const boardRect = {
		x: 0,
		y: 0,
		width: MASK_WIDTH,
		height: MASK_HEIGHT,
	};
</script>

<!-- Inner frame lines aligned exactly to the mask edges -->
<Sprite
	key="frame_edge.png"
	anchor={0}
	x={boardRect.x}
	y={boardRect.y}
	width={boardRect.width}
	height={boardRect.height}
/>
