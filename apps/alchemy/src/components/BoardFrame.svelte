<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { getMaskDimensions, FRAME_X_OFFSET, FRAME_Y_OFFSET } from '../game/uiLayout';

	const context = getContext();
	const SPINE_SCALE = { width: 0.6, height: 0.6 };

	// ============================================================
	// Frame scales to match the mask dimensions exactly
	// The mask (916x742 aspect ratio) is the source of truth
	// ============================================================

	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const maskDims = $derived(getMaskDimensions(boardLayout));

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
	x={boardLayout.x + FRAME_X_OFFSET}
	y={boardLayout.y + FRAME_Y_OFFSET}
	width={maskDims.width}
	height={maskDims.height}
/>
