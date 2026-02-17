<script lang="ts">
	import { Rectangle, Sprite, getContextApp } from 'pixi-svelte';
	import * as PIXI from 'pixi.js';

	import { getContext } from '../game/context';

	const context = getContext();
	const contextApp = getContextApp();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// Get the background texture
	const backgroundTexture = $derived(
		(contextApp.stateApp.loadedAssets?.background || PIXI.Texture.EMPTY) as PIXI.Texture,
	);

	// Cover scaling — always fills screen, no black bars.
	// Anchor y=0.35 preserves the sky when cropping on narrow viewports.
	const backgroundScale = $derived(() => {
		const texWidth = backgroundTexture.width || 1;
		const texHeight = backgroundTexture.height || 1;
		
		const scaleX = canvas.width / texWidth;
		const scaleY = canvas.height / texHeight;
		
		return Math.max(scaleX, scaleY);
	});
</script>

<!-- Black background fallback -->
<Rectangle {...canvas} backgroundColor={0x000000} zIndex={-3} />

<!-- Background image with cover scaling -->
{#if backgroundTexture !== PIXI.Texture.EMPTY}
	<Sprite
		texture={backgroundTexture}
		key="background"
		x={canvas.width / 2}
		y={canvas.height / 2}
		anchor={0.5}
		scale={backgroundScale()}
		zIndex={-2}
	/>
{/if}

