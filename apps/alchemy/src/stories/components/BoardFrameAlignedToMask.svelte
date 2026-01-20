<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { SYMBOL_SIZE } from '../../game/constants';
	import { getContext } from '../../game/context';

	const context = getContext();

	// Must match the scale applied by `BoardContainer`.
	// We keep this story-only to avoid changing production components.
	const GRID_SCALE = 0.96;

	// Dimensions of the reel frame texture (cursed_clusters_reel_frame.png)
	const FRAME_TEX = { width: 2748, height: 2369 };

	// Optional padding (in board local units) if you want the frame to sit slightly outside the mask.
	const PAD = { x: 0, y: 0 };

	const maskRect = $derived({
		x: -SYMBOL_SIZE,
		y: -SYMBOL_SIZE * 0.5,
		width: context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * 2,
		height: context.stateGameDerived.boardLayout().height + SYMBOL_SIZE,
	});

	const frame = $derived(() => {
		const layout = context.stateGameDerived.boardLayout();
		const pivot = layout.pivot;
		const targetWidth = maskRect.width + PAD.x * 2;
		const targetHeight = maskRect.height + PAD.y * 2;

		// Uniform scaling (no distortion): cover the target rect.
		const scale = Math.max(targetWidth / FRAME_TEX.width, targetHeight / FRAME_TEX.height);

		const localCenterX = maskRect.x + maskRect.width / 2;
		const localCenterY = maskRect.y + maskRect.height / 2;

		// Transform from BoardContainer-local coords to MainContainer coords.
		// BoardContainer applies: position=(layout.x,layout.y), pivot=layout.pivot, scale=GRID_SCALE
		const x = layout.x + (localCenterX - pivot.x) * GRID_SCALE;
		const y = layout.y + (localCenterY - pivot.y) * GRID_SCALE;

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
