<script lang="ts">
	import { Rectangle, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());
</script>

<Rectangle {...canvas} backgroundColor={0x000000} zIndex={-3} />

<Sprite
	key="castleBackground"
	x={canvas.width / 2}
	y={canvas.height / 2}
	anchor={0.5}
	zIndex={-2}
/>

