<script lang="ts">
	import { SpriteSheet } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import { getSymbolInfo } from '../game/utils';
	import { getContext } from '../game/context';

	type Props = {
		symbolInfo: ReturnType<typeof getSymbolInfo>;
		x?: number;
		y?: number;
		oncomplete?: () => void;
		loop?: boolean;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());

	// Animation settings - use symbolInfo values or defaults, scaled by speed mode
	const DEFAULT_ANIMATION_SPEED = 1;
	const baseAnimSpeed = $derived(props.symbolInfo.animationSpeed ?? DEFAULT_ANIMATION_SPEED);
	const animationSpeed = $derived(baseAnimSpeed * stateBetDerived.timeScale());
	const DEFAULT_ANIMATION_SIZE = 512;
	const animationSize = $derived(props.symbolInfo.frameHeight ?? DEFAULT_ANIMATION_SIZE);
	// Use explicit width/height (like SymbolSprite) instead of uniform scale
	// so the spritesheet matches the static sprite positioning exactly
	const width = $derived((symbolWidth * props.symbolInfo.sizeRatios.width));
	const height = $derived((symbolHeight * props.symbolInfo.sizeRatios.height));

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
			lastAssetKey = props.symbolInfo.assetKey;
			play = true;
		}
	});

	$effect(() => {
		if (play && props.oncomplete) {
			const timeout = setTimeout(() => {
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
	{width}
	{height}
	{animationSpeed}
	loop={props.loop ?? false}
	{play}
/>
