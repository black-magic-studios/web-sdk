<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as PIXI from 'pixi.js';
	// Import prepare plugin so renderer.prepare.upload() is available
	import 'pixi.js/prepare';

	import { getContextApp } from '../context.svelte';
	import { getProcessed } from '../assetLoad';
	import type { LoadedAssets, RawAsset } from '../types';

	type Props = { children: Snippet };

	const props: Props = $props();
	const context = getContextApp();

	let preLoaded = $state(false);

	const assetNameList = $derived(
		context.stateApp.assets
			? Object.keys(context.stateApp.assets).filter(
					(key) => Boolean(context.stateApp.assets?.[key].preload) === false,
				)
			: [],
	);

	const preAssetNameList = $derived(
		context.stateApp.assets
			? Object.keys(context.stateApp.assets).filter(
					(key) => context.stateApp.assets?.[key].preload === true,
				)
			: [],
	);

	let counter = 0;

	const onProgress = (value: number) => {
		if (preLoaded && value === 1) {
			counter = counter + 1;
			const ratio = counter / assetNameList.length;
			context.stateApp.loadingProgress = ratio * 100;
		}
	};

	/**
	 * Pre-upload all spritesheet textures to the GPU so the first render frame
	 * doesn't stall while transferring large atlas images to VRAM.
	 *
	 * Each glow spritesheet is ~6 MB and the explosion atlas is ~30 MB.
	 * Without this step the GPU upload is deferred to the first draw call,
	 * causing a visible stutter when glow/explosion animations start.
	 */
	const preUploadTextures = async (assets: LoadedAssets) => {
		const renderer = context.stateApp.pixiApplication?.renderer;
		if (!renderer?.prepare) return;

		// Collect unique TextureSources from all loaded spritesheet arrays
		const seen = new Set<PIXI.TextureSource>();
		const sources: PIXI.TextureSource[] = [];

		for (const value of Object.values(assets)) {
			if (Array.isArray(value) && value.length > 0 && value[0] instanceof PIXI.Texture) {
				for (const tex of value as PIXI.Texture[]) {
					const src = tex.source;
					if (src && !seen.has(src)) {
						seen.add(src);
						sources.push(src);
					}
				}
			}
		}

		if (sources.length > 0) {
			await renderer.prepare.upload(sources);
		}
	};

	const loadAssets = async (nameList: string[]) => {
		const loadedAssetsArray = await Promise.all(
			nameList.map(async (key) => {
				try {
					const { type, src } = context.stateApp.assets![key];
					const loadSrc =
						type === 'spine' ? Object.values(src).filter((item) => typeof item === 'string') : src;
					const rawAsset = await PIXI.Assets.load<RawAsset>(loadSrc, onProgress);
					const processed = getProcessed({ key, rawAsset, type, src });
					return processed;
				} catch (error) {
					console.error(error);
				}
			}),
		);

		return loadedAssetsArray.reduce(
			(acc, cur) => ({
				...acc,
				...cur,
			}),
			{} as LoadedAssets,
		);
	};

	$effect(() => {
		if (!preLoaded) {
			(async () => {
				if (preAssetNameList.length > 0) {
					const preLoadedAssets = await loadAssets(preAssetNameList);
					if (preLoadedAssets) context.stateApp.loadedAssets = preLoadedAssets;
				}
				preLoaded = true;
			})();
		}
	});

	$effect(() => {
		if (!context.stateApp.loaded && preLoaded) {
			(async () => {
				if (assetNameList.length > 0) {
					const postLoadedAssets = await loadAssets(assetNameList);
					if (postLoadedAssets) {
						const allAssets = {
							...context.stateApp.loadedAssets,
							...postLoadedAssets,
						};
						context.stateApp.loadedAssets = allAssets;

						// Pre-upload all spritesheet textures to GPU during loading
						// to avoid stutter on first animation render
						await preUploadTextures(allAssets);
					}
				}
				context.stateApp.loaded = true;
			})();
		}
	});
</script>

{#if preLoaded}
	{@render props.children()}
{/if}
