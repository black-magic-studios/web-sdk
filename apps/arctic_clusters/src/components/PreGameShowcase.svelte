<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Container, Sprite, Text, Graphics, BitmapText } from 'pixi-svelte';
	import { Circle } from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { OnPressFullScreen } from 'components-layout';

	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import MultiplierLabel from './MultiplierLabel.svelte';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';
	import { GRID_COLS, GRID_ROWS, FONT_FAMILY, FONT_FAMILY_HI } from '../game/constants';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());
	const isStacked = $derived(context.stateLayoutDerived.isStacked());

	const CELL_GAP_RATIO = 0.96;
	const cellWidth = $derived(symbolWidth * CELL_GAP_RATIO);
	const cellHeight = $derived(symbolHeight * CELL_GAP_RATIO);

	// ══════════════════════════════════════════════════════
	// SCREEN CAROUSEL — auto-switch between 2 screens
	// ══════════════════════════════════════════════════════
	const SCREEN_COUNT = 2;
	const FIRST_PAGE_MS = 6000;   // brief glimpse of screen 1
	const SWITCH_INTERVAL_MS = 8000;
	let activeScreen = $state(0);
	let timer: ReturnType<typeof setTimeout | typeof setInterval> | undefined;

	function startLoop() {
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			activeScreen = (activeScreen + 1) % SCREEN_COUNT;
		}, SWITCH_INTERVAL_MS);
	}

	onMount(() => {
		// Show screen 1 briefly, then flip to screen 2 and start the normal loop
		timer = setTimeout(() => {
			activeScreen = 1;
			startLoop();
		}, FIRST_PAGE_MS);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	function setScreen(index: number) {
		activeScreen = index;
		startLoop();
	}

	// ══════════════════════════════════════════════════════
	// SCREEN 1 — Full multiplier showcase
	// ══════════════════════════════════════════════════════
	const SHOWCASE_GRID: number[][] = [
		[2,    4,    2,    8,    2,    4,    2],
		[4,    8,   16,   32,   16,    8,    4],
		[2,   16,   64,  128,   64,   16,    2],
		[8,   32,  128, 1024,  128,   32,    8],
		[2,   16,   64,  128,   64,   16,    2],
		[4,    8,   16,   32,   16,    8,    4],
		[2,    4,    2,    8,    2,    4,    2],
	];

	// ══════════════════════════════════════════════════════
	// SCREEN 2 — Sparse multipliers + aurora cells + wilds
	// 0 = empty cell, negative = aurora indicator cell,
	// positive = multiplier, 'W' positions marked separately
	// ══════════════════════════════════════════════════════
	const BONUS_GRID: number[][] = [
		[ 0,  0,  0,  2,  0,  0,  0],
		[ 0,  0,  4,  0,  0,  0,  0],
		[ 0,  0,  0,  0,  8,  0,  0],
		[ 0,  2,  0,  0,  0, 16,  0],
		[ 0,  0,  0,  4,  0,  0,  0],
		[ 0,  0,  0,  0,  0,  0,  0],
		[ 0,  0,  2,  0,  0,  0,  0],
	];

	// Aurora indicator cell positions (purple glowing star cells) — 7 cells
	const AURORA_POSITIONS = [
		{ reel: 1, row: 0 }, { reel: 5, row: 1 },
		{ reel: 0, row: 3 }, { reel: 4, row: 4 },
		{ reel: 6, row: 2 }, { reel: 2, row: 5 },
		{ reel: 3, row: 6 },
	];

	// Wild symbol positions
	const WILD_POSITIONS = [
		{ reel: 3, row: 2 },
		{ reel: 1, row: 5 },
	];

	// ── Shared helpers ──
	function getMultiGridAssetKey(mult: number): string {
		switch (mult) {
			case 2:    return 'multiGrid2x';
			case 4:    return 'multiGrid4x';
			case 8:    return 'multiGrid8x';
			case 16:   return 'multiGrid16x';
			case 32:   return 'multiGrid32x';
			case 64:   return 'multiGrid64x';
			case 128:  return 'multiGrid128x';
			case 256:  return 'multiGrid256x';
			case 512:  return 'multiGrid512x';
			default:   return 'multiGrid1024x';
		}
	}

	function getLabelColor(mult: number): number {
		switch (mult) {
			case 2:    return 0xff88bb;
			case 4:    return 0xff99aa;
			case 8:    return 0xffcc66;
			case 16:   return 0x55ddbb;
			case 32:   return 0xffcc55;
			case 64:   return 0x88aaff;
			case 128:  return 0xff8877;
			case 256:  return 0x66ddee;
			case 512:  return 0xffaa66;
			case 1024: return 0xff88cc;
			default:   return 0x66ddee;
		}
	}

	function getHighlightAlpha(mult: number): number {
		if (mult <= 2) return 0.15;
		if (mult <= 8) return 0.20;
		if (mult <= 32) return 0.25;
		if (mult <= 128) return 0.30;
		return 0.35;
	}

	// Flatten grids for rendering
	const showcasePositions = SHOWCASE_GRID.flatMap((row, rowIndex) =>
		row.map((mult, colIndex) => ({ col: colIndex, row: rowIndex, mult }))
	);

	const bonusMultPositions = BONUS_GRID.flatMap((row, rowIndex) =>
		row.map((mult, colIndex) => ({ col: colIndex, row: rowIndex, mult }))
	).filter((p) => p.mult > 0);

	// ── Aurora star drawing helper ──
	function drawStarPath(g: any, w: number, h: number, outerFrac: number, innerFrac: number) {
		const outerRx = (w / 2) * outerFrac;
		const outerRy = (h / 2) * outerFrac;
		const innerRx = (w / 2) * innerFrac;
		const innerRy = (h / 2) * innerFrac;
		const points = 8;
		const step = Math.PI / points;
		for (let i = 0; i < points * 2; i++) {
			const angle = i * step - Math.PI / 2;
			const isOuter = i % 2 === 0;
			const rx = isOuter ? outerRx : innerRx;
			const ry = isOuter ? outerRy : innerRy;
			const x = Math.cos(angle) * rx;
			const y = Math.sin(angle) * ry;
			if (i === 0) g.moveTo(x, y);
			else g.lineTo(x, y);
		}
		g.closePath();
	}

	// ── Wild meter constants ──
	const WILD_METER_NODES = 49;
	const meterSize = $derived(isStacked ? boardLayout.width * 0.4 : boardLayout.width * 0.28);
	const meterX = $derived(
		isStacked
			? boardLayout.width / 2
			: boardLayout.width + meterSize * 0.65
	);
	const meterY = $derived(
		isStacked
			? -meterSize * 0.65
			: boardLayout.height * 0.35
	);

	// Build star geometry for the wild meter
	function buildMeterVerts(size: number) {
		const cx = size * 0.5, cy = size * 0.5;
		const outerR = size * 0.46, notchR = size * 0.18, midR = size * 0.30;
		const tips: { x: number; y: number }[] = [];
		const notches: { x: number; y: number }[] = [];
		const mids: { x: number; y: number }[] = [];
		for (let i = 0; i < 8; i++) {
			const tipA = -Math.PI / 2 + i * (Math.PI / 4);
			const notchA = tipA + Math.PI / 8;
			tips.push({ x: cx + outerR * Math.cos(tipA), y: cy + outerR * Math.sin(tipA) });
			notches.push({ x: cx + notchR * Math.cos(notchA), y: cy + notchR * Math.sin(notchA) });
			mids.push({ x: cx + midR * Math.cos(tipA), y: cy + midR * Math.sin(tipA) });
		}
		const center = { x: cx, y: cy };
		type Seg = { from: { x: number; y: number }; to: { x: number; y: number } };
		const segs: Seg[] = [];
		for (let i = 0; i < 8; i++) {
			segs.push({ from: tips[i], to: notches[i] });
			segs.push({ from: notches[i], to: tips[(i + 1) % 8] });
		}
		for (let i = 0; i < 8; i++) segs.push({ from: tips[i], to: mids[i] });
		for (let i = 0; i < 8; i++) segs.push({ from: mids[i], to: mids[(i + 1) % 8] });
		for (let i = 0; i < 8; i++) {
			segs.push({ from: notches[i], to: mids[i] });
			segs.push({ from: notches[i], to: mids[(i + 1) % 8] });
		}
		segs.push({ from: center, to: center });

		const verts = [
			...tips, ...notches, ...mids, center,
		];
		return { segs, verts };
	}

	const cachedMeter = $derived(buildMeterVerts(meterSize));

	// ── Pagination dots position ──
	const dotY = $derived(boardLayout.height + 30);
	const dotSpacing = 22;

	// ── Text positions ──
	const textX = $derived(boardLayout.width / 2);
	const textY = $derived(boardLayout.height + 55);

	// Rules text positioned below the wild meter on the right side
	const rulesX = $derived(meterX + meterSize * 0.5);
	const rulesY = $derived(meterY + meterSize + 15);

	// Aurora description positioned above the wild meter
	const auroraDescX = $derived(meterX + meterSize * 0.5);
	const auroraDescY = $derived(meterY - 20);
	const auroraCellPreviewSize = $derived(Math.min(cellWidth, cellHeight));

	// Font size scales with board
	const baseFontSize = $derived(Math.max(16, Math.min(38, boardLayout.width * 0.035)));
	const rulesFontSize = $derived(Math.max(11, Math.min(18, boardLayout.width * 0.022)));

	// BitmapFont native size — render at this size and scale container for sharpness
	const FONT_NATIVE = 140;
	const rulesScale = $derived(rulesFontSize / FONT_NATIVE);
	const baseScale = $derived(baseFontSize / FONT_NATIVE);
	const meterTitleScale = $derived(Math.max(12, meterSize * 0.11) / FONT_NATIVE);
	const nativeLineHeight = $derived((rulesFontSize + 6) / rulesScale);

	// Aurora cell description lines (above meter)
	const AURORA_DESC_LINES = [
		'AURORA CELLS IN A WINNING',
		'CLUSTER SPAWN 1-3 WILDS',
		'AT RANDOM POSITIONS.',
	];

	// Constellation meter description lines (below meter)
	const METER_DESC_LINES = [
		'WILDS IN WINNING CLUSTERS',
		'ARE COLLECTED IN THE',
		'CONSTELLATION METER DURING',
		'FREE SPINS FOR A',
		'FINAL AURORA SPIN.',
	];
</script>

<!-- ════════════════════════════════════════════════════════ -->
<!-- SCREEN 1 — Multiplier Showcase                          -->
<!-- ════════════════════════════════════════════════════════ -->
{#if activeScreen === 0}
	<BoardContainer zIndex={5}>
		{#each showcasePositions as { col, row, mult }}
			<Container
				x={getSymbolXDynamic(col, symbolWidth)}
				y={getSymbolYDynamic(row, symbolHeight)}
				zIndex={-2}
			>
				<Sprite
					key={getMultiGridAssetKey(mult)}
					anchor={0.5}
					width={cellWidth}
					height={cellHeight}
					tint={0xffffff}
				/>
				<MultiplierLabel
					multiplier={mult}
					{symbolSize}
					{cellWidth}
					{cellHeight}
					gradientColors={[getLabelColor(mult)]}
					highlightAlpha={getHighlightAlpha(mult)}
					shadowAlpha={0.35}
					highlightBoost={0}
					labelScale={0.88}
				/>
			</Container>
		{/each}
	</BoardContainer>

	<!-- "WIN UP TO 25,000 X BET" -->
	<BoardContainer zIndex={20}>
		<Container x={textX} y={textY} scale={baseScale}>
			<BitmapText
				text="WIN UP TO 25,000 X BET"
				style={{
					fontFamily: FONT_FAMILY,
					fontSize: FONT_NATIVE,
					letterSpacing: 2,
				}}
				tint={0x55ffcc}
				anchor={{ x: 0.5, y: 0 }}
			/>
		</Container>
	</BoardContainer>
{/if}

<!-- ════════════════════════════════════════════════════════ -->
<!-- SCREEN 2 — Bonus Wilds Board + Wild Meter               -->
<!-- ════════════════════════════════════════════════════════ -->
{#if activeScreen === 1}
	<BoardContainer zIndex={5}>
		<!-- Sparse multiplier cells -->
		{#each bonusMultPositions as { col, row, mult }}
			<Container
				x={getSymbolXDynamic(col, symbolWidth)}
				y={getSymbolYDynamic(row, symbolHeight)}
				zIndex={-2}
			>
				<Sprite
					key={getMultiGridAssetKey(mult)}
					anchor={0.5}
					width={cellWidth}
					height={cellHeight}
					tint={0xffffff}
				/>
				<MultiplierLabel
					multiplier={mult}
					{symbolSize}
					{cellWidth}
					{cellHeight}
					gradientColors={[getLabelColor(mult)]}
					highlightAlpha={getHighlightAlpha(mult)}
					shadowAlpha={0.35}
					highlightBoost={0}
					labelScale={0.88}
				/>
			</Container>
		{/each}

		<!-- Aurora indicator cells (purple glowing star shapes) -->
		{#each AURORA_POSITIONS as pos}
			<Container
				x={getSymbolXDynamic(pos.reel, symbolWidth)}
				y={getSymbolYDynamic(pos.row, symbolHeight)}
				alpha={0.85}
				zIndex={-1}
			>
				<Graphics
					draw={(g) => {
						const cw = cellWidth;
						const ch = cellHeight;
						// Outer glow
						drawStarPath(g, cw, ch, 0.95, 0.42);
						g.fill({ color: 0xb44dff, alpha: 0.25 });
						// Inner fill
						drawStarPath(g, cw * 0.85, ch * 0.85, 0.92, 0.40);
						g.fill({ color: 0xb44dff, alpha: 0.35 });
						// Border
						drawStarPath(g, cw * 0.95, ch * 0.95, 0.92, 0.40);
						g.stroke({ color: 0xaa44ee, width: 2.5, alignment: 1, alpha: 0.7 });
						// Center diamond
						const dx = cw * 0.08;
						const dy = ch * 0.08;
						g.moveTo(0, -dy);
						g.lineTo(dx, 0);
						g.lineTo(0, dy);
						g.lineTo(-dx, 0);
						g.closePath();
						g.fill({ color: 0xd4aaff, alpha: 0.7 });
					}}
				/>
			</Container>
		{/each}

		<!-- Wild symbols -->
		{#each WILD_POSITIONS as pos}
			<Container
				x={getSymbolXDynamic(pos.reel, symbolWidth)}
				y={getSymbolYDynamic(pos.row, symbolHeight)}
				zIndex={2}
			>
				<Sprite
					key="W"
					anchor={0.5}
					width={cellWidth}
					height={cellHeight}
				/>
			</Container>
		{/each}
	</BoardContainer>

	<!-- Aurora cell description — above the wild meter -->
	<BoardContainer zIndex={20}>
		<!-- Aurora cell icon (same size as board cells) -->
		<Container x={auroraDescX} y={auroraDescY - auroraCellPreviewSize * 0.5 - (AURORA_DESC_LINES.length) * (rulesFontSize + 6) - 12}>
			<Graphics
				draw={(g) => {
					const s = auroraCellPreviewSize;
					drawStarPath(g, s, s, 0.95, 0.42);
					g.fill({ color: 0xb44dff, alpha: 0.25 });
					drawStarPath(g, s * 0.85, s * 0.85, 0.92, 0.40);
					g.fill({ color: 0xb44dff, alpha: 0.35 });
					drawStarPath(g, s * 0.95, s * 0.95, 0.92, 0.40);
					g.stroke({ color: 0xaa44ee, width: 2.5, alignment: 1, alpha: 0.7 });
					const dx = s * 0.08;
					const dy = s * 0.08;
					g.moveTo(0, -dy);
					g.lineTo(dx, 0);
					g.lineTo(0, dy);
					g.lineTo(-dx, 0);
					g.closePath();
					g.fill({ color: 0xd4aaff, alpha: 0.7 });
				}}
			/>
		</Container>
		<!-- Aurora description text -->
		{#each AURORA_DESC_LINES as line, i}
			<Container
				x={auroraDescX}
				y={auroraDescY - (AURORA_DESC_LINES.length - 1 - i) * (rulesFontSize + 6) - 8}
				scale={rulesScale}
			>
				<BitmapText
					text={line}
					style={{
						fontFamily: FONT_FAMILY,
						fontSize: FONT_NATIVE,
						letterSpacing: 1,
					}}
					tint={0xd4aaff}
					anchor={{ x: 0.5, y: 1 }}
				/>
			</Container>
		{/each}
	</BoardContainer>

	<!-- Wild meter (fully lit constellation) — right side of board -->
	<BoardContainer zIndex={6}>
		<Container x={meterX} y={meterY}>
			<!-- Meter title -->
			<Container x={meterSize * 0.5} y={-10} scale={meterTitleScale}>
				<BitmapText
					anchor={{ x: 0.5, y: 1 }}
					text="WILDS: 49"
					style={{
						fontFamily: FONT_FAMILY,
						fontSize: FONT_NATIVE,
					}}
					tint={0xc8e0ff}
				/>
			</Container>
			<!-- Meter star — all 49 nodes lit -->
			<Container blendMode={'add'}>
				<Graphics
					draw={(g) => {
						const { segs, verts } = cachedMeter;
						// Ghost topology
						for (const s of segs) {
							g.moveTo(s.from.x, s.from.y);
							g.lineTo(s.to.x, s.to.y);
						}
						g.stroke({ color: 0x334466, width: 0.5, alpha: 0.12 });
						// Glow lines
						for (const s of segs) {
							g.moveTo(s.from.x, s.from.y);
							g.lineTo(s.to.x, s.to.y);
						}
						g.stroke({ color: 0x66ccff, width: 5, alpha: 0.18 });
						// Core lines
						for (const s of segs) {
							g.moveTo(s.from.x, s.from.y);
							g.lineTo(s.to.x, s.to.y);
						}
						g.stroke({ color: 0xffffff, width: 1.5, alpha: 0.7 });
						// Star nodes
						for (const v of verts) {
							g.circle(v.x, v.y, 6);
							g.fill({ color: 0x88ccff, alpha: 0.08 });
							g.circle(v.x, v.y, 4);
							g.fill({ color: 0x88ccff, alpha: 0.14 });
							g.circle(v.x, v.y, 2);
							g.fill({ color: 0xffffff, alpha: 0.65 });
							g.circle(v.x, v.y, 1);
							g.fill({ color: 0xffffff, alpha: 0.9 });
						}
						// Center glow
						const cx = meterSize * 0.5, cy = meterSize * 0.5;
						g.circle(cx, cy, meterSize * 0.08);
						g.fill({ color: 0x66ccff, alpha: 0.10 });
						g.circle(cx, cy, meterSize * 0.05);
						g.fill({ color: 0x88ccff, alpha: 0.20 });
						g.circle(cx, cy, meterSize * 0.025);
						g.fill({ color: 0xffffff, alpha: 0.85 });
					}}
				/>
			</Container>
		</Container>
	</BoardContainer>

	<!-- Constellation meter rules — below the wild meter on the right side -->
	<BoardContainer zIndex={20}>
		{#each METER_DESC_LINES as line, i}
			<Container
				x={rulesX}
				y={rulesY + i * (rulesFontSize + 6)}
				scale={rulesScale}
			>
				<BitmapText
					text={line}
					style={{
						fontFamily: FONT_FAMILY,
						fontSize: FONT_NATIVE,
						letterSpacing: 1,
					}}
					tint={0xc8e0ff}
					anchor={{ x: 0.5, y: 0 }}
				/>
			</Container>
		{/each}
	</BoardContainer>
{/if}

<!-- ════════════════════════════════════════════════════════ -->
<!-- PAGINATION DOTS (always visible)                        -->
<!-- ════════════════════════════════════════════════════════ -->
<BoardContainer zIndex={25}>
	{#each Array(SCREEN_COUNT) as _, i}
		<Container
			x={textX + (i - (SCREEN_COUNT - 1) / 2) * dotSpacing}
			y={dotY}
			eventMode="static"
			cursor="pointer"
			hitArea={new Circle(0, 0, 14)}
			onpointertap={() => setScreen(i)}
		>
			<Graphics
				draw={(g) => {
					g.circle(0, 0, i === activeScreen ? 6 : 4);
					g.fill({
						color: i === activeScreen ? 0x55ffcc : 0xffffff,
						alpha: i === activeScreen ? 1.0 : 0.35,
					});
				}}
			/>
		</Container>
	{/each}
</BoardContainer>

<OnHotkey hotkey="Space" onpress={() => props.onpress()} />
<OnPressFullScreen onpress={() => props.onpress()} />
