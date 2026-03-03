<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { Sprite, SpineProvider, SpineTrack, getContextApp } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const contextApp = getContextApp();
	const SPINE_SCALE = { width: 0.6, height: 0.6 };

	// ============================================================
	// Frame dynamically fits around the board/mask
	// Auto-detects the transparent inner window from the texture
	// ============================================================

	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// Get the frame texture dynamically
	const frameTexture = $derived(
		(contextApp.stateApp.loadedAssets?.reelFrameEdge || PIXI.Texture.EMPTY) as PIXI.Texture,
	);

	// Get actual texture dimensions
	const texWidth = $derived(frameTexture.width || 1);
	const texHeight = $derived(frameTexture.height || 1);

	// Auto-detect the transparent inner window from the frame texture
	type Rect = { x: number; y: number; width: number; height: number };
	let windowRect = $state<Rect | null>(null);

	const getSource = (
		texture: PIXI.Texture,
	): HTMLImageElement | HTMLCanvasElement | ImageBitmap | null => {
		// PIXI v8 paths
		const v8Source = (texture as any)?.source?.resource?.source;
		const v8Resource = (texture as any)?.source?.resource;
		const v8UploadSource = (texture as any)?.source?.uploadMethodId === 'image' 
			? (texture as any)?.source?.resource 
			: null;
		
		const candidates = [v8Source, v8Resource, v8UploadSource];
		
		for (const candidate of candidates) {
			if (!candidate) continue;
			if (candidate instanceof HTMLImageElement) return candidate;
			if (candidate instanceof HTMLCanvasElement) return candidate;
			if (typeof ImageBitmap !== 'undefined' && candidate instanceof ImageBitmap) return candidate;
		}
		return null;
	};

	const computeWindowRect = (source: HTMLImageElement | HTMLCanvasElement | ImageBitmap): Rect => {
		const width = source.width;
		const height = source.height;
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx2d = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx2d) return { x: 0, y: 0, width, height };
		ctx2d.drawImage(source, 0, 0, width, height);
		const data = ctx2d.getImageData(0, 0, width, height).data;

		const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3];
		const threshold = 32;
		const centerX = Math.floor(width / 2);
		const centerY = Math.floor(height / 2);

		// Check if center is transparent (has a cutout)
		const sampleRadius = 4;
		let sumAlpha = 0;
		let sampleCount = 0;
		for (let sy = centerY - sampleRadius; sy <= centerY + sampleRadius; sy += 1) {
			for (let sx = centerX - sampleRadius; sx <= centerX + sampleRadius; sx += 1) {
				if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
				sumAlpha += alphaAt(sx, sy);
				sampleCount += 1;
			}
		}
		const avgAlpha = sampleCount > 0 ? sumAlpha / sampleCount : 255;
		if (avgAlpha > threshold) {
			// No transparent center - use full texture
			return { x: 0, y: 0, width, height };
		}

		const isTransparent = (x: number, y: number) => alphaAt(x, y) <= threshold;

		// Find edges of transparent window by scanning from center
		let left = 0;
		for (let x = centerX; x >= 0; x -= 1) {
			if (!isTransparent(x, centerY)) {
				left = x + 1;
				break;
			}
		}

		let right = width - 1;
		for (let x = centerX; x < width; x += 1) {
			if (!isTransparent(x, centerY)) {
				right = x - 1;
				break;
			}
		}

		let top = 0;
		for (let y = centerY; y >= 0; y -= 1) {
			if (!isTransparent(centerX, y)) {
				top = y + 1;
				break;
			}
		}

		let bottom = height - 1;
		for (let y = centerY; y < height; y += 1) {
			if (!isTransparent(centerX, y)) {
				bottom = y - 1;
				break;
			}
		}

		return {
			x: left,
			y: top,
			width: Math.max(1, right - left + 1),
			height: Math.max(1, bottom - top + 1),
		};
	};

	// Compute window rect when texture loads
	$effect(() => {
		if (frameTexture === PIXI.Texture.EMPTY) return;
		const source = getSource(frameTexture);
		if (!source) {
			return;
		}
		const detected = computeWindowRect(source);
		windowRect = detected;
	});

	// Fallback inner window dimensions for arctic_clusters_square_reel_frame_2048.png
	// Measured: inner window at (62, 69) with size 1920x1899
	const FALLBACK_RECT = { x: 62, y: 69, width: 1920, height: 1899 };

	// Use detected window or fallback to known frame dimensions
	const rect = $derived(windowRect ?? FALLBACK_RECT);

	// Calculate frame dimensions to wrap around the board dynamically
	const frame = $derived(() => {
		// Scale frame so its INNER cutout matches the board/symbol area
		const scaleX = boardLayout.width / rect.width;
		const scaleY = boardLayout.height / rect.height;

		// Final frame size (outer dimensions after scaling)
		const targetWidth = texWidth * scaleX;
		const targetHeight = texHeight * scaleY;

		// Compute offset to center the inner cutout on the board center
		const texCenterX = texWidth / 2;
		const texCenterY = texHeight / 2;
		const innerCenterX = rect.x + rect.width / 2;
		const innerCenterY = rect.y + rect.height / 2;
		const offsetX = (innerCenterX - texCenterX) * scaleX;
		const offsetY = (innerCenterY - texCenterY) * scaleY;

		// Position frame so its inner cutout is centered on the board
		const x = boardLayout.x - offsetX;
		const y = boardLayout.y - offsetY;

		return {
			x,
			y,
			width: targetWidth,
			height: targetHeight,
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

<!-- Arctic Clusters Reel Frame around the symbols -->
<Sprite
	key="reelFrameEdge"
	anchor={0.5}
	x={frame().x}
	y={frame().y}
	width={frame().width}
	height={frame().height}
	zIndex={1}
/>
