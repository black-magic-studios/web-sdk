<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { BaseSprite, Container, Circle, Graphics, Text } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import type * as PIXI from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { stateBet, stateBetDerived, stateModal, stateConfig, stateUrlDerived, stateI18nDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import AutoplayMenu from './AutoplayMenu.svelte';

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
		freeSpinCounterShow: () => { inFreeSpins = true; stateBet.lastSpinHadBonus = true; },
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

	// Social mode text overrides — uses sweeps_en language file when social=true
	const betLabel = $derived(stateI18nDerived.translate('BET'));

	// WIN section only visible when there's an actual win (hides when win resets to 0 at spin start)
	const showWin = $derived(stateBet.winBookEventAmount > 0);

	// ============================================================
	// SPEED MODE: normal (0) → turbo (1) → super turbo (2) → back to normal
	// ============================================================
	type SpeedMode = 0 | 1 | 2;
	const speedMode = $derived(stateBet.speedMode as SpeedMode);


	// ============================================================
	// AUTOPLAY SPINNING ANIMATION
	// ============================================================
	const isAutoplaying = $derived(stateBetDerived.hasAutoBetCounter());
	let autoplayFrame = $state(0);
	const AUTOPLAY_SPIN_FRAMES = 8;
	const AUTOPLAY_SPIN_INTERVAL = 80; // ms per frame

	let autoplayAnimInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (isAutoplaying) {
			autoplayFrame = 0;
			autoplayAnimInterval = setInterval(() => {
				autoplayFrame = (autoplayFrame + 1) % AUTOPLAY_SPIN_FRAMES;
			}, AUTOPLAY_SPIN_INTERVAL);
		} else {
			if (autoplayAnimInterval) {
				clearInterval(autoplayAnimInterval);
				autoplayAnimInterval = null;
			}
			autoplayFrame = 0;
		}
		return () => {
			if (autoplayAnimInterval) clearInterval(autoplayAnimInterval);
		};
	});

	// ============================================================
	// TEXTURE STATE — new button assets
	// ============================================================
	// Play button
	let playTexture = $state<Texture>(Texture.EMPTY);
	let playHoverTexture = $state<Texture>(Texture.EMPTY);
	let playPressedTexture = $state<Texture>(Texture.EMPTY);

	// Autoplay: base, hover, pressed + spinning frames
	let autoTexture = $state<Texture>(Texture.EMPTY);
	let autoHoverTexture = $state<Texture>(Texture.EMPTY);
	let autoPressedTexture = $state<Texture>(Texture.EMPTY);
	let autoSpinningTextures = $state<Texture[]>([]);

	// Turbo: 3 speed modes — single sprite per mode (no hover/pressed variants)
	let turboNormalTexture = $state<Texture>(Texture.EMPTY);
	let turboTurboTexture = $state<Texture>(Texture.EMPTY);
	let turboSuperTexture = $state<Texture>(Texture.EMPTY);

	// Increase / Decrease arrows
	let increaseTexture = $state<Texture>(Texture.EMPTY);
	let increaseHoverTexture = $state<Texture>(Texture.EMPTY);
	let increasePressedTexture = $state<Texture>(Texture.EMPTY);
	let decreaseTexture = $state<Texture>(Texture.EMPTY);
	let decreaseHoverTexture = $state<Texture>(Texture.EMPTY);
	let decreasePressedTexture = $state<Texture>(Texture.EMPTY);

	// Buy button
	let buyTexture = $state<Texture>(Texture.EMPTY);
	let buyHoverTexture = $state<Texture>(Texture.EMPTY);
	let buyPressedTexture = $state<Texture>(Texture.EMPTY);

	// Menu button (replaces old Graphics-drawn hamburger)
	let menuTexture = $state<Texture>(Texture.EMPTY);
	let menuHoverTexture = $state<Texture>(Texture.EMPTY);
	let menuPressedTexture = $state<Texture>(Texture.EMPTY);

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
	let incHovered = $state(false);
	let incPressed = $state(false);
	let decHovered = $state(false);
	let decPressed = $state(false);
	let menuHovered = $state(false);
	let menuPressed = $state(false);

	// Hamburger menu
	let hamburgerOpen = $state(false);

	// Autoplay menu
	let autoplayMenuOpen = $state(false);

	// Derived active textures based on hover/pressed state
	const activePlayTexture = $derived(
		spinPressed ? playPressedTexture : spinHovered ? playHoverTexture : playTexture
	);

	// Autoplay: if autoplaying, show spinning frame; otherwise hover/pressed logic
	const activeAutoTexture = $derived(
		isAutoplaying
			? (autoSpinningTextures[autoplayFrame] ?? autoTexture)
			: autoPressed ? autoPressedTexture : autoHovered ? autoHoverTexture : autoTexture
	);

	// Turbo: pick texture by speed mode
	const activeTurboTexture = $derived.by(() => {
		if (speedMode === 2) return turboSuperTexture;
		if (speedMode === 1) return turboTurboTexture;
		return turboNormalTexture;
	});

	// Increase/Decrease arrow textures
	const activeIncreaseTexture = $derived(
		incPressed ? increasePressedTexture : incHovered ? increaseHoverTexture : increaseTexture
	);
	const activeDecreaseTexture = $derived(
		decPressed ? decreasePressedTexture : decHovered ? decreaseHoverTexture : decreaseTexture
	);

	const activeBuyTexture = $derived(
		buyPressed ? buyPressedTexture : buyHovered ? buyHoverTexture : buyTexture
	);

	const activeMenuTexture = $derived(
		menuPressed ? menuPressedTexture : menuHovered ? menuHoverTexture : menuTexture
	);

	// ============================================================
	// CONFIGURATION
	// ============================================================
	const BAR_HEIGHT_RATIO = 0.12; // Bar height as ratio of board height — much thicker
	const PLAYBAR_MARGIN_RATIO = 0.048; // Margin below board — clears the frame's bottom border

	// Button sizing
	const SPIN_BUTTON_SCALE = 1.3; // Spin button size relative to bar height
	const SMALL_BUTTON_SCALE = 0.55; // Small buttons relative to bar height
	const ARROW_BUTTON_SCALE = 0.38; // Increase/decrease arrow buttons relative to bar height
	const BUY_BUTTON_SCALE = 1.17; // Buy button = 90% of spin button (SPIN_BUTTON_SCALE * 0.9)
	const BUTTON_GAP = 0.015; // Gap between buttons as ratio of bar width

	// Info bar text styling
	const LABEL_COLOR = 0x88ccff; // Icy blue for labels
	const VALUE_COLOR = 0xffffff; // White for values
	const WIN_COLOR = 0x00ffcc; // Cyan-green for win value
	const SPIN_LABEL_COLOR = 0x88ccff;

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
	const arrowButtonSize = $derived(barHeight * ARROW_BUTTON_SCALE);
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

	// Increase/Decrease arrow button positions (between SPIN section and spin button)
	const arrowGap = $derived(arrowButtonSize * 0.1);
	const increaseX = $derived(spinButtonX - spinButtonSize / 2 - buttonGap - arrowButtonSize / 2);
	const decreaseX = $derived(increaseX);
	const increaseY = $derived(-arrowButtonSize / 2 - arrowGap / 2);
	const decreaseY = $derived(arrowButtonSize / 2 + arrowGap / 2);

	// Free spins mode: only turbo button at far right
	const fsTurboX = $derived(barWidth / 2 - rightPad - smallButtonSize / 2);

	// Buy button — OUTSIDE the bar, to the left
	const buyButtonX = $derived(-barWidth / 2 - buttonGap - buyButtonSize / 2);

	// Menu button — INSIDE bar at far left
	const LEFT_BUTTON_SCALE = 0.55;
	const leftBtnSize = $derived(barHeight * LEFT_BUTTON_SCALE);
	const leftPad = $derived(barWidth * 0.025);
	const menuBtnX = $derived(-barWidth / 2 + leftPad + leftBtnSize / 2);

	// ── Normal mode: 3 info sections ──
	const infoLeftEdge = $derived(menuBtnX + leftBtnSize / 2 + buttonGap);
	const infoRightEdge = $derived(increaseX - arrowButtonSize / 2 - buttonGap);
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

	// ============================================================
	// ASSET LOADING
	// ============================================================
	onMount(async () => {
		const B = '/assets/sprites/buttons_new';
		try {
			const [
				play, playHover, playPressed,
				auto, autoHover, autoPressed,
				// Turbo: 3 mode sprites (single sprite per mode)
				tNormal, tTurbo, tSuper,
				// Increase / Decrease
				inc, incHover, incPressed,
				dec, decHover, decPressed,
				// Buy
				buy, buyHover, buyPressed,
				// Menu
				menu, menuHov, menuPrs,
				// Autoplay spinning frames
				...spinningFrames
			] = await Promise.all([
				Assets.load(`${B}/play_button.png`),
				Assets.load(`${B}/play_button_hover.png`),
				Assets.load(`${B}/play_button_pressed.png`),
				Assets.load(`${B}/autoplay_base.png`),
				Assets.load(`${B}/autoplay_hover.png`),
				Assets.load(`${B}/autoplay_pressed.png`),
				Assets.load(`${B}/play_bar_0002_turbo_normal.png`),
				Assets.load(`${B}/play_bar_0002_turbo_turbo.png`),
				Assets.load(`${B}/play_bar_0002_turbo_super_turbo.png`),
				Assets.load(`${B}/increase_base.png`),
				Assets.load(`${B}/increase_hover.png`),
				Assets.load(`${B}/increase_pressed.png`),
				Assets.load(`${B}/decrease_base.png`),
				Assets.load(`${B}/decrease_hover.png`),
				Assets.load(`${B}/decrease_pressed.png`),
				Assets.load(`${B}/black_magic_studios_buy_button.png`),
				Assets.load(`${B}/black_magic_studios_buy_button_hover.png`),
				Assets.load(`${B}/black_magic_studios_buy_button_pressed.png`),
				Assets.load(`${B}/menu_base.png`),
				Assets.load(`${B}/menu_hover.png`),
				Assets.load(`${B}/menu_pressed.png`),
				// 8 spinning animation frames
				...Array.from({ length: 8 }, (_, i) =>
					Assets.load(`${B}/autoplay_spinning_${String(i).padStart(2, '0')}.png`)
				),
			]);

			playTexture = play;
			playHoverTexture = playHover;
			playPressedTexture = playPressed;

			autoTexture = auto;
			autoHoverTexture = autoHover;
			autoPressedTexture = autoPressed;
			autoSpinningTextures = spinningFrames;

			turboNormalTexture = tNormal;
			turboTurboTexture = tTurbo;
			turboSuperTexture = tSuper;

			increaseTexture = inc;
			increaseHoverTexture = incHover;
			increasePressedTexture = incPressed;
			decreaseTexture = dec;
			decreaseHoverTexture = decHover;
			decreasePressedTexture = decPressed;

			buyTexture = buy;
			buyHoverTexture = buyHover;
			buyPressedTexture = buyPressed;

			menuTexture = menu;
			menuHoverTexture = menuHov;
			menuPressedTexture = menuPrs;

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
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		if (stateBetDerived.hasAutoBetCounter()) {
			// Stop autoplay if running
			stateBet.autoSpinsCounter = 0;
		} else {
			// Open inline autoplay popup
			autoplayMenuOpen = !autoplayMenuOpen;
		}
	};

	const handleSpeedToggle = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		// Cycle: 0 (normal) → 1 (turbo) → 2 (super turbo) → 0 (normal)
		const next = ((speedMode + 1) % 3) as SpeedMode;
		stateBetDerived.updateSpeedMode(next, { persistent: true });
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

		<!-- MENU BUTTON (inside bar, far left) -->
		{#if assetsLoaded}
		<Container x={menuBtnX} y={0} zIndex={3}>
			<Graphics
				draw={(g: PIXI.Graphics) => {
					g.rect(-leftBtnSize / 2, -leftBtnSize / 2, leftBtnSize, leftBtnSize);
					g.fill({ color: 0xffffff, alpha: 0.001 });
				}}
				eventMode="static"
				cursor="pointer"
				onpointerover={() => { menuHovered = true; }}
				onpointerout={() => { menuHovered = false; menuPressed = false; }}
				onpointerdown={() => { menuPressed = true; }}
				onpointerup={() => { menuPressed = false; hamburgerOpen = !hamburgerOpen; }}
			/>
			<BaseSprite
				texture={activeMenuTexture}
				width={leftBtnSize}
				height={leftBtnSize * (90 / 100)}
				anchor={0.5}
			/>
		</Container>


		{/if}

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
						onpointerup={() => { fastPressed = false; handleSpeedToggle(); }}
					/>
					<BaseSprite
						texture={activeTurboTexture}
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

			<!-- SPIN (BET) SECTION with increase/decrease sprite buttons -->
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
		</Container>

		{#if assetsLoaded}
			<!-- INCREASE BUTTON (sprite, above decrease) -->
			<Container x={increaseX} y={increaseY} zIndex={3}>
				<Graphics
					draw={(g: PIXI.Graphics) => {
						g.rect(-arrowButtonSize / 2, -arrowButtonSize / 2, arrowButtonSize, arrowButtonSize);
						g.fill({ color: 0xffffff, alpha: 0.001 });
					}}
					eventMode="static"
					cursor={increaseDisabled ? 'not-allowed' : 'pointer'}
					onpointerover={() => { incHovered = true; }}
					onpointerout={() => { incHovered = false; incPressed = false; }}
					onpointerdown={() => { incPressed = true; }}
					onpointerup={() => { incPressed = false; if (!increaseDisabled) handleBetIncrease(); }}
				/>
				<BaseSprite
					texture={activeIncreaseTexture}
					width={arrowButtonSize}
					height={arrowButtonSize * (42 / 56)}
					anchor={0.5}
					{...(increaseDisabled ? { alpha: 0.3 } : {})}
				/>
			</Container>

			<!-- DECREASE BUTTON (sprite, below increase) -->
			<Container x={decreaseX} y={decreaseY} zIndex={3}>
				<Graphics
					draw={(g: PIXI.Graphics) => {
						g.rect(-arrowButtonSize / 2, -arrowButtonSize / 2, arrowButtonSize, arrowButtonSize);
						g.fill({ color: 0xffffff, alpha: 0.001 });
					}}
					eventMode="static"
					cursor={decreaseDisabled ? 'not-allowed' : 'pointer'}
					onpointerover={() => { decHovered = true; }}
					onpointerout={() => { decHovered = false; decPressed = false; }}
					onpointerdown={() => { decPressed = true; }}
					onpointerup={() => { decPressed = false; if (!decreaseDisabled) handleBetDecrease(); }}
				/>
				<BaseSprite
					texture={activeDecreaseTexture}
					width={arrowButtonSize}
					height={arrowButtonSize * (42 / 56)}
					anchor={0.5}
					{...(decreaseDisabled ? { alpha: 0.3 } : {})}
				/>
			</Container>

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

			<!-- TURBO / SPEED BUTTON (right of autoplay) -->
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
					onpointerup={() => { fastPressed = false; handleSpeedToggle(); }}
				/>
				<BaseSprite
					texture={activeTurboTexture}
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
<AutoplayMenu show={autoplayMenuOpen} onclose={() => { autoplayMenuOpen = false; }} />
