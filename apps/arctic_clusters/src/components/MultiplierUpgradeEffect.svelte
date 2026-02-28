<script lang="ts" module>
	import * as PIXI from 'pixi.js';
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { getContextParent } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { 
		generateUpgradePopTextures, 
		MultiplierUpgradePopPool,
		type UpgradePopTextures 
	} from '../effects';

	type Props = {
		multiplier: number;
		prevMultiplier: number;
		cellSize: number;
	};

	const props: Props = $props();
	const context = getContext();
	const parentContext = getContextParent();

	// Aurora glow colors for each multiplier tier
	const MULTIPLIER_COLORS: Record<number, number> = {
		2: 0x2ccbff,     // Cyan
		4: 0x5b4dff,     // Indigo
		8: 0xc24cff,     // Violet
		16: 0xff4fa8,    // Fuchsia
		32: 0xff6b6b,    // Coral
		64: 0xffd36b,    // Amber
		128: 0xdfff6b,   // Neon-lime
		256: 0x66ffd8,   // Mint
		512: 0x6be5ff,   // Electric blue
		1024: 0xb8a7ff,  // Ultraviolet
	};

	function getMultiplierColor(multiplier: number): number {
		return MULTIPLIER_COLORS[multiplier] ?? 0xffffff;
	}

	// Lazy singleton pattern for effect pool
	// Initialized on first use, shared across all instances
	let sharedPool: MultiplierUpgradePopPool | null = null;
	let sharedTextures: UpgradePopTextures | null = null;

	function getOrCreatePool(): MultiplierUpgradePopPool | null {
		if (sharedPool) return sharedPool;

		const app = context.stateApp.pixiApplication;
		if (!app?.renderer) {
			return null;
		}

		// Generate textures once
		if (!sharedTextures) {
			sharedTextures = generateUpgradePopTextures(app.renderer);
		}

		// Create pool
		sharedPool = new MultiplierUpgradePopPool(sharedTextures);

		return sharedPool;
	}

	onMount(() => {
		// Check if this is an upgrade (multiplier increased, both > 1)
		if (
			props.multiplier > props.prevMultiplier && 
			props.prevMultiplier > 1
		) {
			const pool = getOrCreatePool();
			if (pool && parentContext?.parent) {
				pool.playUpgradePop(
					parentContext.parent,
					getMultiplierColor(props.prevMultiplier),
					getMultiplierColor(props.multiplier),
					() => {
						// Badge color update happens via Svelte reactivity
					},
					props.cellSize
				);
			}
		}
	});
</script>

<!-- This is a renderless component - just plays the effect on mount -->
