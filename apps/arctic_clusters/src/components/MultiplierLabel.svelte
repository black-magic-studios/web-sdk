<script lang="ts">
	import { BitmapText, Container } from 'pixi-svelte';
	import type { Sizes } from 'pixi-svelte';

	type Props = {
		multiplier: number;
		symbolSize: number;
		cellWidth: number;
		cellHeight: number;
		tint: number;
		/** Highlight layer opacity (0–1). Higher = glossier. Default 0.7 */
		highlightAlpha?: number;
		/** Drop-shadow alpha behind text. Animated during pop. Default 0.35 */
		shadowAlpha?: number;
		/** Extra highlight alpha added during pop peak. Default 0 */
		highlightBoost?: number;
		/** Text container scale multiplier (rest ~0.88, peak ~1.06). Default 1 */
		labelScale?: number;
	};

	const props: Props = $props();

	// ── Font sizes ───────────────────────────────────────
	const numberFontSize = $derived(props.symbolSize * 0.52);
	const xFontSize = $derived(numberFontSize * 0.7);
	const gap = $derived(props.symbolSize * 0.06);

	// ── Measured sizes from BitmapText onresize ──────────
	let numberWidth = $state(0);
	let numberHeight = $state(0);
	let xWidth = $state(0);
	let xHeight = $state(0);

	function onNumberResize(sizes: Sizes) {
		numberWidth = sizes.width;
		numberHeight = sizes.height;
	}

	function onXResize(sizes: Sizes) {
		xWidth = sizes.width;
		xHeight = sizes.height;
	}

	// ── Layout computation ───────────────────────────────
	const totalWidth = $derived(numberWidth + gap + xWidth);
	const tallest = $derived(Math.max(numberHeight, xHeight));

	// Safe bounds padding
	const pad = $derived(props.symbolSize * 0.08);
	const maxWidth = $derived(props.cellWidth - pad);
	const maxHeight = $derived(props.cellHeight - pad);

	// Scale down if group exceeds safe area
	const scaleFactor = $derived(
		totalWidth > 0 && tallest > 0
			? Math.min(1, maxWidth / totalWidth, maxHeight / tallest)
			: 1
	);

	// Positions: center the group at (0, 0)
	const startX = $derived(-totalWidth / 2);
	const numberX = $derived(startX);
	const xX = $derived(startX + numberWidth + gap);

	// Vertical: center each element independently, nudge x down 2px
	const numberY = $derived(-numberHeight / 2);
	const xY = $derived(-xHeight / 2 + 2);

	// Highlight alpha — default 0.7, override per tier for glossiness
	const hlAlpha = $derived(Math.min(1, (props.highlightAlpha ?? 0.7) + (props.highlightBoost ?? 0)));

	// Shadow
	const shadowAlpha = $derived(props.shadowAlpha ?? 0.35);
	const SHADOW_OFFSET_Y = 2;
	const SHADOW_TINT = 0x111118;
</script>

<!-- Multiplier label group container -->
<Container scale={scaleFactor * (props.labelScale ?? 1)}>
	<!-- Shadow: number (rendered first, behind everything) -->
	<BitmapText
		x={numberX}
		y={numberY + SHADOW_OFFSET_Y}
		text={`${props.multiplier}`}
		style={{
			fontFamily: 'multiplier',
			fontSize: numberFontSize,
			letterSpacing: 0,
		}}
		tint={SHADOW_TINT}
		alpha={shadowAlpha}
		onresize={() => {}}
	/>
	<!-- Shadow: x -->
	<BitmapText
		x={xX}
		y={xY + SHADOW_OFFSET_Y}
		text="x"
		style={{
			fontFamily: 'multiplier',
			fontSize: xFontSize,
			letterSpacing: 0,
		}}
		tint={SHADOW_TINT}
		alpha={shadowAlpha}
		onresize={() => {}}
	/>

	<!-- Number: tinted base -->
	<BitmapText
		x={numberX}
		y={numberY}
		text={`${props.multiplier}`}
		style={{
			fontFamily: 'multiplier',
			fontSize: numberFontSize,
			letterSpacing: 0,
		}}
		tint={props.tint}
		onresize={onNumberResize}
	/>
	<!-- Number: highlight (not tinted, alpha varies by tier) -->
	<BitmapText
		x={numberX}
		y={numberY}
		text={`${props.multiplier}`}
		style={{
			fontFamily: 'multiplier_hi',
			fontSize: numberFontSize,
			letterSpacing: 0,
		}}
		alpha={hlAlpha}
		onresize={() => {}}
	/>

	<!-- x: tinted base -->
	<BitmapText
		x={xX}
		y={xY}
		text="x"
		style={{
			fontFamily: 'multiplier',
			fontSize: xFontSize,
			letterSpacing: 0,
		}}
		tint={props.tint}
		onresize={onXResize}
	/>
	<!-- x: highlight (not tinted, alpha varies by tier) -->
	<BitmapText
		x={xX}
		y={xY}
		text="x"
		style={{
			fontFamily: 'multiplier_hi',
			fontSize: xFontSize,
			letterSpacing: 0,
		}}
		alpha={hlAlpha}
		onresize={() => {}}
	/>
</Container>
