<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { MASK_WIDTH, MASK_HEIGHT } from '../../game/constants';
	import { getContext } from '../../game/context';

	const context = getContext();

	// Must match the scale applied by `BoardContainer`.
	// We keep this story-only to avoid changing production components.
	const GRID_SCALE = 0.96;

	// Dimensions of the reel frame texture (reelframe_overlay_1024x832.png)
	const FRAME_TEX = { width: 1024, height: 832 };
	// Inner mask area dimensions (must match reel_mask.png: 916x742)
	const INNER_MASK = { width: 916, height: 742 };

	const frame = $derived(() => {
		const layout = context.stateGameDerived.boardLayout();

		// Scale frame so its inner area (916x742) matches the mask dimensions
		const scaleX = MASK_WIDTH / INNER_MASK.width;
		const scaleY = MASK_HEIGHT / INNER_MASK.height;
		// Use uniform scale to maintain aspect ratio
		const scale = Math.max(scaleX, scaleY);

		// Frame is centered on the board center
		const x = layout.x;
		const y = layout.y;

		return {
			x,
			y,
			width: FRAME_TEX.width * scale * GRID_SCALE,
			height: FRAME_TEX.height * scale * GRID_SCALE,
		};
	});
</script>

<!--
	Story-only frame placement that aligns to the mask rect used by symbols.
	Note: we render directly in MainContainer space, but apply the same transform as BoardContainer.
-->
<Sprite key="reelFrameEdge" anchor={0.5} {...frame} />
