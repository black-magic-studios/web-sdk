<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { Sprite, getContextApp } from 'pixi-svelte';

	import { getContext } from '../../game/context';
	import { getMaskDimensions, FRAME_X_OFFSET, FRAME_Y_OFFSET } from '../../game/uiLayout';

	const context = getContext();
	const contextApp = getContextApp();

	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const maskDims = $derived(getMaskDimensions(boardLayout));

	type Rect = { x: number; y: number; width: number; height: number };
	let windowRect = $state<Rect | null>(null);

	const frameTexture = $derived(
		(contextApp.stateApp.loadedAssets?.reelFrameEdge || PIXI.Texture.EMPTY) as PIXI.Texture,
	);

	const getSource = (
		texture: PIXI.Texture,
	): HTMLImageElement | HTMLCanvasElement | ImageBitmap | null => {
		const source = (texture as any)?.source?.resource?.source;
		const baseSource = (texture as any)?.baseTexture?.resource?.source;
		const isImageBitmap =
			typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap;
		const isBaseImageBitmap =
			typeof ImageBitmap !== 'undefined' && baseSource instanceof ImageBitmap;
		if (
			source &&
			(source instanceof HTMLImageElement ||
				source instanceof HTMLCanvasElement ||
				isImageBitmap)
		)
			return source;
		if (
			baseSource &&
			(baseSource instanceof HTMLImageElement ||
				baseSource instanceof HTMLCanvasElement ||
				isBaseImageBitmap)
		)
			return baseSource;
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

		const sampleRadius = 4;
		let sumAlpha = 0;
		let sampleCount = 0;
		for (let y = centerY - sampleRadius; y <= centerY + sampleRadius; y += 1) {
			for (let x = centerX - sampleRadius; x <= centerX + sampleRadius; x += 1) {
				if (x < 0 || y < 0 || x >= width || y >= height) continue;
				sumAlpha += alphaAt(x, y);
				sampleCount += 1;
			}
		}
		const avgAlpha = sampleCount > 0 ? sumAlpha / sampleCount : 255;
		if (avgAlpha > threshold) {
			return { x: 0, y: 0, width, height };
		}

		const isTransparent = (x: number, y: number) => alphaAt(x, y) <= threshold;

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

	$effect(() => {
		if (frameTexture === PIXI.Texture.EMPTY) return;
		const source = getSource(frameTexture);
		if (!source) return;
		windowRect = computeWindowRect(source);
	});

	const frameTextureWidth = $derived(frameTexture.width || maskDims.width);
	const frameTextureHeight = $derived(frameTexture.height || maskDims.height);
	const rect = $derived(windowRect ?? { x: 0, y: 0, width: frameTextureWidth, height: frameTextureHeight });

	const scaleX = $derived(maskDims.width / rect.width);
	const scaleY = $derived(maskDims.height / rect.height);

	const frameWidth = $derived(frameTextureWidth * scaleX);
	const frameHeight = $derived(frameTextureHeight * scaleY);

	const textureCenterX = $derived(frameTextureWidth * 0.5);
	const textureCenterY = $derived(frameTextureHeight * 0.5);
	const windowCenterX = $derived(rect.x + rect.width * 0.5);
	const windowCenterY = $derived(rect.y + rect.height * 0.5);
	const offsetX = $derived((windowCenterX - textureCenterX) * scaleX);
	const offsetY = $derived((windowCenterY - textureCenterY) * scaleY);

	const frameX = $derived(boardLayout.x + FRAME_X_OFFSET - offsetX);
	const frameY = $derived(boardLayout.y + FRAME_Y_OFFSET - offsetY);
</script>

<Sprite
	key="reelFrameEdge"
	anchor={0.5}
	x={frameX}
	y={frameY}
	width={frameWidth}
	height={frameHeight}
/>
