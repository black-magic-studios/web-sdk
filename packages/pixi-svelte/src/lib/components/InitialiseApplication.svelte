<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import { devicePixelRatio } from 'svelte/reactivity/window';

	import { getContextApp } from '../context.svelte';
	import { preloadFont } from '../utils.svelte';

	type Props = { children: Snippet; typekitId?: string | null };

	const props: Props = $props();
	const context = getContextApp();

	let wrap: HTMLDivElement;
	let initialised = $state(false);

	const initialiseApplication = async () => {
		PIXI.Assets.reset();

		// Enable mipmaps globally for better downscaling quality
		PIXI.TextureSource.defaultOptions.autoGenerateMipmaps = true;
		PIXI.TextureSource.defaultOptions.scaleMode = 'linear';

		await preloadFont({ typekitId: props.typekitId });
		context.stateApp.pixiApplication = new PIXI.Application<PIXI.Renderer<HTMLCanvasElement>>();

		// Check WebGPU support before attempting to use it
		const webGPUSupported = await (async () => {
			try {
				if (!navigator.gpu) return false;
				const adapter = await navigator.gpu.requestAdapter();
				return !!adapter;
			} catch {
				return false;
			}
		})();

		await context.stateApp.pixiApplication.init({
			autoDensity: true,
			backgroundAlpha: 0,
			hello: false,
			multiView: false,
			// WebGPU has stricter antialias requirements - disable if using WebGPU
			antialias: !webGPUSupported,
			clearBeforeRender: true,
			// Prefer WebGPU but fall back to WebGL if not supported
			preference: webGPUSupported ? 'webgpu' : 'webgl',
			// Only set powerPreference for WebGL — Chrome logs a warning when
			// this option is passed to WebGPU's requestAdapter() on Windows.
			...(webGPUSupported ? {} : { powerPreference: 'high-performance' }),
			// Cap resolution to avoid exceeding GPU texture limits with WebGPU
			resolution: Math.min(devicePixelRatio.current ?? 1, 2),
			resizeTo: window,
		});

		// Renderer info logged only in dev mode
		if (import.meta.env?.DEV) console.log(`PixiJS renderer: ${webGPUSupported ? 'WebGPU' : 'WebGL'} (antialias: ${!webGPUSupported})`);

		wrap.appendChild(context.stateApp.pixiApplication.canvas);

		// to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
		context.stateApp.pixiApplication.renderer.events.autoPreventDefault = false;
		context.stateApp.pixiApplication.renderer.canvas.style.touchAction = 'auto';
	};

	onMount(async () => {
		try {
			if (!initialised) await initialiseApplication();
			initialised = true;
		} catch (error) {
			console.error(error);
		}
	});

	onDestroy(() => {
		if (context.stateApp.pixiApplication) {
			context.stateApp.pixiApplication.destroy();
		}
	});
</script>

<div bind:this={wrap}>
	{#if initialised}
		{@render props.children()}
	{/if}
</div>
