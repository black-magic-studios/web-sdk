<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const SPINE_SCALE = { width: 0.6, height: 0.6 };
	
	// ============================================================
	// Frame calculations for 1400x1400 square image (reel_frame_1400.png)
	// Target appearance: 1100×820 safe area with ~940×740 inner grid
	// ============================================================
	// 
	// Target aspect ratio: 1100/820 = 1.34 (wider than tall)
	// Current board = 560×560 (7×7 grid at 80px symbols)
	// 
	// To make square frame appear as 1100×820:
	// - Scale width more than height
	// Frame calculations for 1400x1400 square frame (uniform scaling, no distortion)
	// Current board = 560px (7×7 grid at 80px symbols)
	// Adjust FRAME_SCALE to fit symbols inside frame hole
	const FRAME_SCALE = 1.50; // Slightly smaller frame
	
	// Offset frame relative to symbols (positive Y = frame moves down = symbols appear higher)
	const X_OFFSET = 0;
	const Y_OFFSET = 20; // Move frame down so symbols sit higher in the hole

	type AnimationName = 'reelhouse_glow_start' | 'reelhouse_glow_idle' | 'reelhouse_glow_exit';

	let animationName = $state<AnimationName | undefined>(undefined);
	let loop = $state(false);

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => {
			animationName = 'reelhouse_glow_start';
			loop = false;
		},
		boardFrameGlowHide: () => {
			if (animationName) animationName = 'reelhouse_glow_exit';
		},
	});
</script>

<!-- DISABLED: Purple flashing glow effect during bonus mode
     Uncomment to restore
{#if animationName}
	<SpineProvider
		zIndex={-1}
		key="reelhouse"
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y}
		width={context.stateGameDerived.boardLayout().width * SPINE_SCALE.width}
		height={context.stateGameDerived.boardLayout().height * SPINE_SCALE.height}
	>
		<SpineTrack
			trackIndex={0}
			{animationName}
			{loop}
			listener={{
				complete: (entry) => {
					if (entry.animation) {
						if (entry.animation.name === 'reelhouse_glow_start') {
							animationName = 'reelhouse_glow_idle';
							loop = true;
						}

						if (entry.animation.name === 'reelhouse_glow_exit') {
							animationName = undefined;
							loop = false;
						}
					}
				},
			}}
		/>
	</SpineProvider>
{/if}
-->

<Sprite
	key="reelFrameEdge"
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x + X_OFFSET}
	y={context.stateGameDerived.boardLayout().y + Y_OFFSET}
	width={context.stateGameDerived.boardLayout().width * FRAME_SCALE}
	height={context.stateGameDerived.boardLayout().width * FRAME_SCALE}
/>
