<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { BaseSprite, Container, Circle, Graphics, Text } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import type * as PIXI from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { stateBet, stateBetDerived, stateModal, stateConfig, stateUrlDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	// ============================================================
	// FREE SPIN STATE
	// ============================================================
	let inFreeSpins = $state(false);
	let fsCurrent = $state(0);
	let fsTotal = $state(0);

	// Per-spin win (from tumbleWinAmount events)
	let spinWin = $state(0);
	const spinWinTween = new Tween(0);
	$effect(() => { spinWinTween.set(spinWin); });
	const spinWinText = $derived(bookEventAmountToCurrencyString(spinWinTween.current));
	const showSpinWin = $derived(spinWin > 0);

	// Total win during free spins (from stateBet)
	const totalWinTween = new Tween(0);
	$effect(() => { totalWinTween.set(stateBet.winBookEventAmount); });
	const totalWinText = $derived(bookEventAmountToCurrencyString(totalWinTween.current));

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (inFreeSpins = true),
		freeSpinCounterHide: () => { inFreeSpins = false; spinWin = 0; },
		freeSpinCounterUpdate: (ev) => {
			if (ev.current !== undefined) fsCurrent = ev.current;
			if (ev.total !== undefined) fsTotal = ev.total;
		},
		tumbleWinAmountUpdate: (ev) => { spinWin = ev.amount; },
		tumbleWinAmountReset: () => { spinWin = 0; },
		tumbleWinAmountHide: () => { spinWin = 0; },
	});

	// ============================================================
	// BALANCE / WIN / SPIN STATE (with tweened animations)
	// ============================================================
	const balanceTween = new Tween(stateBet.balanceAmount);
	const winTween = new Tween(stateBet.winBookEventAmount);

	$effect(() => { balanceTween.set(stateBet.balanceAmount); });
	$effect(() => { winTween.set(stateBet.winBookEventAmount); });

	const balanceText = $derived(numberToCurrencyString(balanceTween.current));
	const winText = $derived(bookEventAmountToCurrencyString(winTween.current));
	const spinText = $derived(numberToCurrencyString(stateBetDerived.betCost()));

	// Social mode text overrides
	const isSocial = $derived(stateUrlDerived.social());
	const betLabel = $derived(isSocial ? 'SPIN' : 'BET');

	// WIN section only visible when there's an actual win (hides when win resets to 0 at spin start)
	const showWin = $derived(stateBet.winBookEventAmount > 0);

	// Texture state — default / hover / pressed for each button
	let playTexture = $state<Texture>(Texture.EMPTY);
	let playHoverTexture = $state<Texture>(Texture.EMPTY);
	let playPressedTexture = $state<Texture>(Texture.EMPTY);

	let autoTexture = $state<Texture>(Texture.EMPTY);
	let autoHoverTexture = $state<Texture>(Texture.EMPTY);
	let autoPressedTexture = $state<Texture>(Texture.EMPTY);

	let fastPlayTexture = $state<Texture>(Texture.EMPTY);
	let fastPlayHoverTexture = $state<Texture>(Texture.EMPTY);
	let fastPlayPressedTexture = $state<Texture>(Texture.EMPTY);

	let buyTexture = $state<Texture>(Texture.EMPTY);
	let buyHoverTexture = $state<Texture>(Texture.EMPTY);
	let buyPressedTexture = $state<Texture>(Texture.EMPTY);

	let assetsLoaded = $state(false);

	// Hover/pressed state tracking
	let spinHovered = $state(false);
	let spinPressed = $state(false);
	let autoHovered = $state(false);
	let autoPressed = $state(false);
	let fastHovered = $state(false);
	let fastPressed = $state(false);
	let buyHovered = $state(false);
	let buyPressed = $state(false);
	let arrowUpHovered = $state(false);
	let arrowDownHovered = $state(false);


	// Hamburger menu
	let hamburgerOpen = $state(false);
	let hamburgerHovered = $state(false);

	// Derived active textures based on hover/pressed state
	const activePlayTexture = $derived(
		spinPressed ? playPressedTexture : spinHovered ? playHoverTexture : playTexture
	);
	const activeAutoTexture = $derived(
		autoPressed ? autoPressedTexture : autoHovered ? autoHoverTexture : autoTexture
	);
	const activeFastTexture = $derived(
		fastPressed ? fastPlayPressedTexture : fastHovered ? fastPlayHoverTexture : fastPlayTexture
	);
	const activeBuyTexture = $derived(
		buyPressed ? buyPressedTexture : buyHovered ? buyHoverTexture : buyTexture
	);

	// ============================================================
	// CONFIGURATION
	// ============================================================
	const BAR_HEIGHT_RATIO = 0.12; // Bar height as ratio of board height — much thicker
	const PLAYBAR_MARGIN_RATIO = 0.048; // Margin below board — clears the frame's bottom border

	// Button sizing
	const SPIN_BUTTON_SCALE = 1.3; // Spin button size relative to bar height
	const SMALL_BUTTON_SCALE = 0.55; // Small buttons relative to bar height
	const BUY_BUTTON_SCALE = 1.17; // Buy button = 90% of spin button (SPIN_BUTTON_SCALE * 0.9)
	const BUTTON_GAP = 0.015; // Gap between buttons as ratio of bar width

	// Info bar text styling
	const LABEL_COLOR = 0x88ccff; // Icy blue for labels
	const VALUE_COLOR = 0xffffff; // White for values
	const WIN_COLOR = 0x00ffcc; // Cyan-green for win value
	const SPIN_LABEL_COLOR = 0x88ccff;
	const ARROW_COLOR = 0x88ccff;
	const ARROW_HOVER_COLOR = 0xccffff;

	// ============================================================
	// DERIVED LAYOUT
	// ============================================================
	const BAR_WIDTH_MULTIPLIER = 1.25; // Bar is 25% wider than the reel frame
	const barWidth = $derived(boardLayout.width * BAR_WIDTH_MULTIPLIER);
	const barHeight = $derived(boardLayout.height * BAR_HEIGHT_RATIO);
	const barRadius = $derived(barHeight * 0.18);

	// Position below board (centered on board)
	const containerX = $derived(boardLayout.width / 2);
	const margin = $derived(boardLayout.height * PLAYBAR_MARGIN_RATIO);
	const containerY = $derived(boardLayout.height + (barHeight / 2) + margin);

	// Button sizes
	const spinButtonSize = $derived(barHeight * SPIN_BUTTON_SCALE);
	const smallButtonSize = $derived(barHeight * SMALL_BUTTON_SCALE);
	const buyButtonSize = $derived(barHeight * BUY_BUTTON_SCALE);
	const buttonGap = $derived(barWidth * BUTTON_GAP);

	// Font sizes — generous for clarity
	const labelFontSize = $derived(Math.round(Math.max(12, barHeight * 0.2)));
	const valueFontSize = $derived(Math.round(Math.max(14, barHeight * 0.256)));

	// Vertical positions for label/value text — tighter to center
	const labelY = $derived(-barHeight * 0.08);
	const valueY = $derived(-barHeight * 0.01);

	// Text resolution — render at 2x to prevent glyph artifacts (e.g. dot at top)
	const TEXT_RESOLUTION = 2;

	// Arrow font size — scales with label text
	const arrowFontSize = $derived(Math.round(Math.max(10, labelFontSize * 1.1)));

	// ── Layout: everything INSIDE the bar ─────────────────────
	// NORMAL:     | BALANCE | WIN | SPIN [▲▼] | [SPIN_BTN] [AUTO] [FAST] |
	// FREE SPINS: | BALANCE | SPIN | TOTAL WIN | FREE SPINS [count] | [FAST] |

	// Info section widths
	const infoSectionWidth = $derived(barWidth * 0.2);

	// Right side buttons — positioned from right edge inward
	const rightPad = $derived(barWidth * 0.02);

	// Normal mode button positions
	const fastPlayX = $derived(barWidth / 2 - rightPad - smallButtonSize / 2);
	const autoplayX = $derived(fastPlayX - smallButtonSize - buttonGap);
	const spinButtonX = $derived(autoplayX - smallButtonSize / 2 - buttonGap - spinButtonSize / 2);

	// Free spins mode: only turbo button at far right
	const fsTurboX = $derived(barWidth / 2 - rightPad - smallButtonSize / 2);

	// Buy button — OUTSIDE the bar, to the left
	const buyButtonX = $derived(-barWidth / 2 - buttonGap - buyButtonSize / 2);

	// Hamburger button — INSIDE bar at far left
	const HAMBURGER_SCALE = 0.6;
	const hamburgerSize = $derived(barHeight * HAMBURGER_SCALE);
	const leftPad = $derived(barWidth * 0.025);
	const hamburgerX = $derived(-barWidth / 2 + leftPad + hamburgerSize / 2);

	// ── Normal mode: 3 info sections ──
	const infoLeftEdge = $derived(hamburgerX + hamburgerSize / 2 + buttonGap);
	const infoRightEdge = $derived(spinButtonX - spinButtonSize / 2 - buttonGap);
	const infoZoneWidth = $derived(infoRightEdge - infoLeftEdge);

	// Three equal sections within the info zone
	const sectionWidth = $derived(infoZoneWidth / 3);
	const balanceSectionX = $derived(infoLeftEdge + sectionWidth / 2);
	const winSectionX = $derived(infoLeftEdge + sectionWidth + sectionWidth / 2);
	const spinSectionX = $derived(infoLeftEdge + sectionWidth * 2 + sectionWidth / 2);

	// ── Free spins mode: 3 info sections (BALANCE | SPIN | TOTAL WIN + FREE SPINS) ──
	const fsInfoRightEdge = $derived(fsTurboX - smallButtonSize / 2 - buttonGap);
	const fsInfoZoneWidth = $derived(fsInfoRightEdge - infoLeftEdge);
	const fsSectionWidth = $derived(fsInfoZoneWidth / 3);
	const fsBalanceSectionX = $derived(infoLeftEdge + fsSectionWidth / 2);
	const fsSpinSectionX = $derived(infoLeftEdge + fsSectionWidth + fsSectionWidth / 2);
	const fsCombinedSectionX = $derived(infoLeftEdge + fsSectionWidth * 2 + fsSectionWidth / 2);

	// Vertical positions for combined TOTAL WIN + FREE SPINS section
	const fsCombinedLabelFontSize = $derived(Math.round(Math.max(9, barHeight * 0.13)));
	const fsCombinedValueFontSize = $derived(Math.round(Math.max(10, barHeight * 0.16)));
	// Top box: TOTAL WIN  (upper half of bar)
	const fsTopBoxTop = $derived(-barHeight * 0.46);
	const fsTopBoxH = $derived(barHeight * 0.42);
	const fsTopLabelY = $derived(fsTopBoxTop + fsTopBoxH * 0.28);
	const fsTopValueY = $derived(fsTopBoxTop + fsTopBoxH * 0.72);
	// Bottom box: FREE SPINS (lower half of bar)
	const fsBotBoxTop = $derived(barHeight * 0.04);
	const fsBotBoxH = $derived(barHeight * 0.42);
	const fsBottomLabelY = $derived(fsBotBoxTop + fsBotBoxH * 0.28);
	const fsBottomValueY = $derived(fsBotBoxTop + fsBotBoxH * 0.72);

	// Free spins remaining (countdown)
	const fsRemaining = $derived(Math.max(0, fsTotal - fsCurrent));

	// Border around TOTAL WIN box
	const drawTotalWinBorder = $derived((g: PIXI.Graphics) => {
		const bw = fsSectionWidth * 0.88;
		const br = 4;
		g.roundRect(-bw / 2, fsTopBoxTop, bw, fsTopBoxH, br);
		g.stroke({ color: 0x88ccff, width: 1.5, alpha: 0.4 });
	});

	// Border around FREE SPINS box
	const drawFreeSpinsBorder = $derived((g: PIXI.Graphics) => {
		const bw = fsSectionWidth * 0.88;
		const br = 4;
		g.roundRect(-bw / 2, fsBotBoxTop, bw, fsBotBoxH, br);
		g.stroke({ color: 0x88ccff, width: 1.5, alpha: 0.4 });
	});

	// Arrow X position — centered between SPIN text center and right edge of SPIN section
	// The SPIN text+value sits at x=0 within the section. Arrows sit between text and right edge.
	const arrowLocalX = $derived(sectionWidth * 0.35);

	// Bet disabled state
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	const betIdle = $derived(context.stateXstateDerived.isIdle());

	// Arrow disabled states  
	const smallest = $derived(stateConfig.betAmountOptions[0]);
	const biggest = $derived(stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]);
	const decreaseDisabled = $derived(!betIdle || stateBet.betAmount <= smallest);
	const increaseDisabled = $derived(!betIdle || stateBet.betAmount >= biggest);

	// ============================================================
	// DRAW FUNCTIONS
	// ============================================================
	const drawBar = $derived((g: PIXI.Graphics) => {
		g.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, barRadius);
		g.fill({ color: 0x000000, alpha: 0.65 });
	});

	// Divider lines between sections (normal mode)
	const drawDividers = $derived((g: PIXI.Graphics) => {
		const dividerH = barHeight * 0.5;
		const y1 = -dividerH / 2;
		const y2 = dividerH / 2;

		if (inFreeSpins) {
			// 3-section free spins mode: 2 dividers between sections + 1 before turbo
			for (let i = 1; i <= 2; i++) {
				const dx = infoLeftEdge + fsSectionWidth * i;
				g.moveTo(dx, y1);
				g.lineTo(dx, y2);
				g.stroke({ color: 0x444466, width: 1, alpha: 0.6 });
			}
			// Divider before turbo button
			const d3x = fsInfoRightEdge;
			g.moveTo(d3x, y1);
			g.lineTo(d3x, y2);
			g.stroke({ color: 0x444466, width: 1, alpha: 0.6 });
		} else {
			// Between BALANCE and WIN
			const d1x = infoLeftEdge + sectionWidth;
			g.moveTo(d1x, y1);
			g.lineTo(d1x, y2);
			g.stroke({ color: 0x444466, width: 1, alpha: 0.6 });

			// Between WIN and SPIN
			const d2x = infoLeftEdge + sectionWidth * 2;
			g.moveTo(d2x, y1);
			g.lineTo(d2x, y2);
			g.stroke({ color: 0x444466, width: 1, alpha: 0.6 });

			// Between SPIN section and spin button area
			const d3x = infoRightEdge;
			g.moveTo(d3x, y1);
			g.lineTo(d3x, y2);
			g.stroke({ color: 0x444466, width: 1, alpha: 0.6 });
		}
	});

	// Arrow colors derived from hover state
	const arrowUpColor = $derived(arrowUpHovered && !increaseDisabled ? ARROW_HOVER_COLOR : ARROW_COLOR);
	const arrowDownColor = $derived(arrowDownHovered && !decreaseDisabled ? ARROW_HOVER_COLOR : ARROW_COLOR);
	const arrowUpAlpha = $derived(increaseDisabled ? 0.3 : 1);
	const arrowDownAlpha = $derived(decreaseDisabled ? 0.3 : 1);
	const arrowHitSize = $derived(arrowFontSize * 2);

	// ============================================================
	// ASSET LOADING
	// ============================================================
	onMount(async () => {
		try {
			const [
				play, playHover, playPressed,
				auto, autoHover, autoPressed,
				fastPlay, fastPlayHover, fastPlayPressed,
				buy, buyHover, buyPressed,
			] = await Promise.all([
				Assets.load('/assets/sprites/buttons/play_button.png'),
				Assets.load('/assets/sprites/buttons/play_button_hover.png'),
				Assets.load('/assets/sprites/buttons/play_button_pressed.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_autoplay.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_autoplay_hover.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_autoplay_pressed.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_fast_play.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_fast_play_hover.png'),
				Assets.load('/assets/sprites/buttons/arctic_clusters_fast_play_pressed.png'),
				Assets.load('/assets/sprites/buttons/black_magic_studios_buy_button.png'),
				Assets.load('/assets/sprites/buttons/black_magic_studios_buy_button_hover.png'),
				Assets.load('/assets/sprites/buttons/black_magic_studios_buy_button_pressed.png'),
			]);

			playTexture = play;
			playHoverTexture = playHover;
			playPressedTexture = playPressed;

			autoTexture = auto;
			autoHoverTexture = autoHover;
			autoPressedTexture = autoPressed;

			fastPlayTexture = fastPlay;
			fastPlayHoverTexture = fastPlayHover;
			fastPlayPressedTexture = fastPlayPressed;

			buyTexture = buy;
			buyHoverTexture = buyHover;
			buyPressedTexture = buyPressed;

			assetsLoaded = true;
		} catch (error) {
			console.error('Failed to load PlayBar assets:', error);
		}
	});

	// ============================================================
	// BUTTON HANDLERS
	// ============================================================
	const handleSpin = () => {
		context.eventEmitter.broadcast({ type: 'bet' });
	};

	const handleAutoPlay = () => {
		context.eventEmitter.broadcast({ type: 'autoSpinOpen' });
	};

	const handleFastPlay = () => {
		context.eventEmitter.broadcast({ type: 'turboToggle' });
	};

	const handleBuyBonus = () => {
		context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
	};



	const handleBetMenu = () => {
		if (betIdle) {
			context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
			stateModal.modal = { name: 'betAmountMenu' };
		}
	};

	const handleBetIncrease = () => {
		if (!betIdle) return;
		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);
		stateBetDerived.setBetAmount(nextBigger || biggest);
	};

	const handleBetDecrease = () => {
		if (!betIdle) return;
		const nextSmaller = [...stateConfig.betAmountOptions]
			.sort((a, b) => b - a)
			.find((option) => option < stateBet.betAmount);
		stateBetDerived.setBetAmount(nextSmaller || smallest);
	};
</script>

<BoardContainer zIndex={20}>
	<Container x={containerX} y={containerY}>

		<!-- DARK BAR BACKGROUND -->
		<Graphics draw={drawBar} zIndex={0} />

		<!-- DIVIDER LINES -->
		<Graphics draw={drawDividers} zIndex={1} />

		<!-- HAMBURGER MENU BUTTON (inside bar, far left) -->
		<Container x={hamburgerX} y={0} zIndex={3}>
			<Graphics
				draw={(g: PIXI.Graphics) => {
					const r = hamburgerSize / 2;
					g.circle(0, 0, r);
					g.fill({ color: hamburgerOpen ? 0x2a5580 : hamburgerHovered ? 0x2a4a6a : 0x1e3550, alpha: 0.95 });
					g.circle(0, 0, r);
					g.stroke({ color: 0x88ccff, width: 1.5, alpha: hamburgerHovered || hamburgerOpen ? 0.8 : 0.4 });
					/* draw 3 horizontal lines (☰) */
					const lineW = hamburgerSize * 0.45;
					const lineH = Math.max(1.5, hamburgerSize * 0.06);
					const gap = hamburgerSize * 0.16;
					for (let i = -1; i <= 1; i++) {
						g.roundRect(-lineW / 2, i * gap - lineH / 2, lineW, lineH, lineH / 2);
						g.fill({ color: 0xc8e8ff, alpha: 0.95 });
					}
				}}
				eventMode="static"
				cursor="pointer"
				onpointerover={() => { hamburgerHovered = true; }}
				onpointerout={() => { hamburgerHovered = false; }}
				onpointerdown={() => {}}
				onpointerup={() => { hamburgerOpen = !hamburgerOpen; }}
			/>
		</Container>

		{#if inFreeSpins}
			<!-- ═══════════════ FREE SPINS MODE ═══════════════ -->

			<!-- BALANCE SECTION -->
			<Container x={fsBalanceSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text="BALANCE"
					style={{ fontFamily: 'Arial', fontSize: labelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={balanceText}
					style={{ fontFamily: 'Arial', fontSize: valueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
			</Container>

			<!-- SPIN (BET) SECTION — no arrows during free spins -->
			<Container x={fsSpinSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text={betLabel}
					style={{ fontFamily: 'Arial', fontSize: labelFontSize, fill: SPIN_LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={spinText}
					style={{ fontFamily: 'Arial', fontSize: valueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
			</Container>

			<!-- COMBINED: TOTAL WIN (top) + FREE SPINS (bottom) -->
			<Container x={fsCombinedSectionX} y={0} zIndex={2}>
				<!-- Individual borders -->
				<Graphics draw={drawTotalWinBorder} />
				<Graphics draw={drawFreeSpinsBorder} />
				<!-- TOTAL WIN row -->
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsTopLabelY}
					resolution={TEXT_RESOLUTION}
					text="TOTAL WIN"
					style={{ fontFamily: 'Arial', fontSize: fsCombinedLabelFontSize, fill: 0x00e6cc, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsTopValueY}
					resolution={TEXT_RESOLUTION}
					text={totalWinText}
					style={{ fontFamily: 'Arial', fontSize: fsCombinedValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
				<!-- FREE SPINS row -->
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsBottomLabelY}
					resolution={TEXT_RESOLUTION}
					text="FREE SPINS"
					style={{ fontFamily: 'Arial', fontSize: fsCombinedLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsBottomValueY}
					resolution={TEXT_RESOLUTION}
					text={`${fsRemaining}`}
					style={{ fontFamily: 'Arial', fontSize: fsCombinedValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
			</Container>

			<!-- TURBO BUTTON (only button during free spins) -->
			{#if assetsLoaded}
				<Container x={fsTurboX} y={0} zIndex={3}>
					<Circle
						diameter={smallButtonSize}
						anchor={0.5}
						alpha={0}
						backgroundColor={0xffffff}
						eventMode="static"
						cursor="pointer"
						onpointerover={() => { fastHovered = true; }}
						onpointerout={() => { fastHovered = false; fastPressed = false; }}
						onpointerdown={() => { fastPressed = true; }}
						onpointerup={() => { fastPressed = false; handleFastPlay(); }}
					/>
					<BaseSprite
						texture={activeFastTexture}
						width={smallButtonSize}
						height={smallButtonSize}
						anchor={0.5}
					/>
				</Container>
			{/if}

		{:else}
			<!-- ═══════════════ NORMAL MODE ═══════════════ -->

			<!-- BALANCE SECTION -->
			<Container x={balanceSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text="BALANCE"
					style={{ fontFamily: 'Arial', fontSize: labelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={balanceText}
					style={{ fontFamily: 'Arial', fontSize: valueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
			</Container>

			<!-- WIN SECTION (only visible when there's a win) -->
			{#if showWin}
			<Container x={winSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text="WIN"
					style={{ fontFamily: 'Arial', fontSize: labelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={winText}
					style={{ fontFamily: 'Arial', fontSize: valueFontSize, fill: WIN_COLOR, fontWeight: 'bold' }}
				/>
			</Container>
			{/if}

			<!-- SPIN (BET) SECTION with integrated arrows -->
			<Container x={spinSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text={betLabel}
					style={{ fontFamily: 'Arial', fontSize: labelFontSize, fill: SPIN_LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={spinText}
					style={{ fontFamily: 'Arial', fontSize: valueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
				<!-- Invisible hit area for bet menu (tap value to open full menu) -->
				<Graphics
					draw={(g: PIXI.Graphics) => {
						g.rect(-infoSectionWidth / 3, -barHeight / 2, infoSectionWidth * 0.66, barHeight);
						g.fill({ color: 0xffffff, alpha: 0.001 });
					}}
					eventMode="static"
					cursor="pointer"
					onpointerup={handleBetMenu}
				/>

			<!-- INCREASE ARROW ▲ (top-right of SPIN section) -->
			<Text
				x={arrowLocalX}
				y={labelY}
				anchor={{ x: 0.5, y: 1 }}
				resolution={TEXT_RESOLUTION}
				text="▲"
				alpha={arrowUpAlpha}
				style={{ fontFamily: 'Arial', fontSize: arrowFontSize, fill: arrowUpColor, fontWeight: 'bold' }}
				eventMode="static"
				cursor={increaseDisabled ? 'not-allowed' : 'pointer'}
				onpointerover={() => { arrowUpHovered = true; }}
				onpointerout={() => { arrowUpHovered = false; }}
				onpointerup={() => { if (!increaseDisabled) handleBetIncrease(); }}
			/>

			<!-- DECREASE ARROW ▼ (bottom-right of SPIN section) -->
			<Text
				x={arrowLocalX}
				y={valueY}
				anchor={{ x: 0.5, y: 0 }}
				resolution={TEXT_RESOLUTION}
				text="▼"
				alpha={arrowDownAlpha}
				style={{ fontFamily: 'Arial', fontSize: arrowFontSize, fill: arrowDownColor, fontWeight: 'bold' }}
				eventMode="static"
				cursor={decreaseDisabled ? 'not-allowed' : 'pointer'}
				onpointerover={() => { arrowDownHovered = true; }}
				onpointerout={() => { arrowDownHovered = false; }}
				onpointerup={() => { if (!decreaseDisabled) handleBetDecrease(); }}
			/>
		</Container>

		{#if assetsLoaded}
			<!-- SPIN BUTTON -->
			<Container x={spinButtonX} y={0} zIndex={3}>
				<OnHotkey hotkey="Space" {disabled} onpress={handleSpin} />
				<Circle
					diameter={spinButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor={disabled ? 'not-allowed' : 'pointer'}
					onpointerover={() => { spinHovered = true; }}
					onpointerout={() => { spinHovered = false; spinPressed = false; }}
					onpointerdown={() => { spinPressed = true; }}
					onpointerup={() => { spinPressed = false; if (!disabled) handleSpin(); }}
				/>
				<BaseSprite
					texture={activePlayTexture}
					width={spinButtonSize}
					height={spinButtonSize}
					anchor={0.5}
					{...(disabled ? { tint: 0xaaaaaa } : {})}
				/>
			</Container>

			<!-- AUTOPLAY BUTTON (right of spin) -->
			<Container x={autoplayX} y={0} zIndex={3}>
				<Circle
					diameter={smallButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerover={() => { autoHovered = true; }}
					onpointerout={() => { autoHovered = false; autoPressed = false; }}
					onpointerdown={() => { autoPressed = true; }}
					onpointerup={() => { autoPressed = false; handleAutoPlay(); }}
				/>
				<BaseSprite
					texture={activeAutoTexture}
					width={smallButtonSize}
					height={smallButtonSize}
					anchor={0.5}
				/>
			</Container>

			<!-- FAST PLAY BUTTON (right of autoplay) -->
			<Container x={fastPlayX} y={0} zIndex={3}>
				<Circle
					diameter={smallButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerover={() => { fastHovered = true; }}
					onpointerout={() => { fastHovered = false; fastPressed = false; }}
					onpointerdown={() => { fastPressed = true; }}
					onpointerup={() => { fastPressed = false; handleFastPlay(); }}
				/>
				<BaseSprite
					texture={activeFastTexture}
					width={smallButtonSize}
					height={smallButtonSize}
					anchor={0.5}
				/>
			</Container>

			<!-- BUY BONUS BUTTON (outside bar, to the left) -->
			<Container x={buyButtonX} y={0} zIndex={3}>
				<Circle
					diameter={buyButtonSize}
					anchor={0.5}
					alpha={0}
					backgroundColor={0xffffff}
					eventMode="static"
					cursor="pointer"
					onpointerover={() => { buyHovered = true; }}
					onpointerout={() => { buyHovered = false; buyPressed = false; }}
					onpointerdown={() => { buyPressed = true; }}
					onpointerup={() => { buyPressed = false; handleBuyBonus(); }}
				/>
				<BaseSprite
					texture={activeBuyTexture}
					width={buyButtonSize}
					height={buyButtonSize}
					anchor={0.5}
				/>
			</Container>
		{/if}
		{/if}

	</Container>
</BoardContainer>

<HamburgerMenu show={hamburgerOpen} onclose={() => { hamburgerOpen = false; }} />
