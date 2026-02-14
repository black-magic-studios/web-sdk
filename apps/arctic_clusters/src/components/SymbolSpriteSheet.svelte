<script lang="ts">
	import { SpriteSheet } from 'pixi-svelte';

	import { getSymbolInfo } from '../game/utils';
	import { getContext } from '../game/context';

	type Props = {
		symbolInfo: ReturnType<typeof getSymbolInfo>;
		x?: number;
		y?: number;
		oncomplete?: () => void;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());

	// Animation settings - use symbolInfo values or defaults
	const DEFAULT_ANIMATION_SPEED = 1;
	const animationSpeed = $derived(props.symbolInfo.animationSpeed ?? DEFAULT_ANIMATION_SPEED);
	const DEFAULT_ANIMATION_SIZE = 512;
	const animationSize = $derived(props.symbolInfo.frameHeight ?? DEFAULT_ANIMATION_SIZE);
	const scale = $derived((symbolHeight * props.symbolInfo.sizeRatios.height) / animationSize);

	// Calculate duration for oncomplete callback based on frame count and animation speed
	// At 60fps, each frame takes (1/60) seconds. With animationSpeed, it's (1/60)/speed per frame
	const DEFAULT_FRAME_COUNT = 192;
	const frameCount = $derived(props.symbolInfo.frameCount ?? DEFAULT_FRAME_COUNT);
	const animationDurationMs = $derived((frameCount / animationSpeed) * (1000 / 60));

	let play = $state(true);
	let lastAssetKey = $state(props.symbolInfo.assetKey);

	// Reset play when animation changes (e.g., H1 win spriteSheet -> explosion spriteSheet)
	$effect(() => {
		if (props.symbolInfo.assetKey !== lastAssetKey) {
			console.log('[SymbolSpriteSheet] Asset changed, resetting play:', lastAssetKey, '->', props.symbolInfo.assetKey);
			lastAssetKey = props.symbolInfo.assetKey;
			play = true;
		}
	});

	// Debug logging
	$effect(() => {
		console.log('[SymbolSpriteSheet] Rendering:', {
			assetKey: props.symbolInfo.assetKey,
			animationName: props.symbolInfo.animationName,
			frameCount,
			animationSpeed,
			animationDurationMs,
			play,
			scale,
			x: props.x,
			y: props.y,
		});
	});

	$effect(() => {
		if (play && props.oncomplete) {
			const timeout = setTimeout(() => {
				console.log('[SymbolSpriteSheet] Animation complete:', props.symbolInfo.assetKey);
				play = false;
				props.oncomplete?.();
			}, animationDurationMs);

			return () => clearTimeout(timeout);
		}
	});
</script>

<SpriteSheet
	key={props.symbolInfo.assetKey}
	animationName={props.symbolInfo.animationName}
	x={props.x}
	y={props.y}
	anchor={0.5}
	{scale}
	{animationSpeed}
	loop={false}
	{play}
/>
