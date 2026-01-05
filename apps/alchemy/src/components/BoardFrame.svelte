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
	
	// Frame calculations for 2048x1706 image
	// Board is 560x560, we need frame to be slightly larger (about 700px)
	// 700 / 560 = 1.25, but frame ratio is 2048/1706 = 1.2
	const NEW_FRAME_SCALE = 1.25; // Scale relative to board width
	const FRAME_ASPECT = 1.0; // Tighter width (was 2048/1706 = 1.2)
	
	// Offset to center symbols in frame (adjust if content area isn't centered in image)
	const X_OFFSET = 0; // Positive moves frame right
	const Y_OFFSET = -20; // Negative moves frame up (symbols appear lower in frame)

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

<Sprite
	key="reelFrameEdge"
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x + X_OFFSET}
	y={context.stateGameDerived.boardLayout().y + Y_OFFSET}
	width={context.stateGameDerived.boardLayout().width * FRAME_ASPECT * NEW_FRAME_SCALE}
	height={context.stateGameDerived.boardLayout().width * NEW_FRAME_SCALE}
/>
