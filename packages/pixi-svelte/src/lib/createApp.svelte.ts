import * as PIXI from 'pixi.js';

import type { LoadedAssets, Assets } from './types';

// Store loadedAssets outside of reactive state to prevent Svelte proxying
let _loadedAssets: LoadedAssets = {};

export function createApp({ assets }: { assets: Assets }) {
	// Track if assets have been loaded (for reactivity trigger only)
	let loadedAssetsVersion = $state(0);

	const reset = () => {
		stateApp.loaded = false;
		stateApp.loadingProgress = 0;
		_loadedAssets = {};
		loadedAssetsVersion = 0;
		stateApp.pixiApplication = undefined as PIXI.Application | undefined;
	};

	const stateApp = $state({
		reset,
		assets,
		loaded: false,
		loadingProgress: 0,
		// Getter/setter - loadedAssets stored outside reactive system
		get loadedAssets() {
			// Read version to create dependency for reactivity
			void loadedAssetsVersion;
			return _loadedAssets;
		},
		set loadedAssets(value: LoadedAssets) {
			_loadedAssets = value;
			// Bump version to trigger reactive updates
			loadedAssetsVersion++;
		},
		pixiApplication: undefined as PIXI.Application | undefined,
	});

	return {
		stateApp,
	};
}

export type App = ReturnType<typeof createApp>;
