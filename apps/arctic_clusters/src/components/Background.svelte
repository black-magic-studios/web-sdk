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

	// Calculate cover scale (like CSS object-fit: cover)
	// This ensures the image fills the screen without warping
	const coverScale = $derived(() => {
		const texWidth = backgroundTexture.width || 1;
		const texHeight = backgroundTexture.height || 1;
		
		const scaleX = canvas.width / texWidth;
		const scaleY = canvas.height / texHeight;
		
		// Use MAX to ensure full coverage (no black bars)
		return Math.max(scaleX, scaleY);
	});
</script>

<!-- Black background fallback -->
<Rectangle {...canvas} backgroundColor={0x000000} zIndex={-3} />

<!-- Background image with cover scaling -->
{#if backgroundTexture !== PIXI.Texture.EMPTY}
	<Sprite
		key="background"
		x={canvas.width / 2}
		y={canvas.height / 2}
		anchor={0.5}
		scale={coverScale()}
		zIndex={-2}
	/>
{/if}

