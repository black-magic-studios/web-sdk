<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';
	import { FRAME_X_OFFSET, FRAME_Y_OFFSET } from '../game/uiLayout';

	const context = getContext();
	const SPINE_SCALE = { width: 0.6, height: 0.6 };

	// ============================================================
	// Frame aligns to the mask and is perfectly centered
	// Reel frame: 1024x832, Inner mask area: 916x742
	// ============================================================

	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// Dimensions of the reel frame texture (reelframe_overlay_1024x832.png)
	const FRAME_TEX = { width: 1024, height: 832 };
	// Inner mask area dimensions (must match reel_mask.png: 916x742)
	const INNER_MASK = { width: 916, height: 742 };

	// Calculate scale to make the inner mask area match the board/mask dimensions
	const frame = $derived(() => {
		// Scale frame so its inner area (916x742) matches the mask dimensions
		const scaleX = MASK_WIDTH / INNER_MASK.width;
		const scaleY = MASK_HEIGHT / INNER_MASK.height;
		// Use uniform scale to maintain aspect ratio
		const scale = Math.max(scaleX, scaleY);

		// Frame is centered on the board center
		const x = boardLayout.x + FRAME_X_OFFSET;
		const y = boardLayout.y + FRAME_Y_OFFSET;

		return {
			x,
			y,
			width: FRAME_TEX.width * scale,
			height: FRAME_TEX.height * scale,
		};
	});

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
	x={frame.x}
	y={frame.y}
	width={frame.width}
	height={frame.height}
/>
