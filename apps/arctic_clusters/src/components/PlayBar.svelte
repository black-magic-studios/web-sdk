<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { BaseSprite, Container, Circle, Graphics, Text } from 'pixi-svelte';
	import { Assets, Texture } from 'pixi.js';
	import type * as PIXI from 'pixi.js';
	import { OnHotkey } from 'components-shared';
	import { stateBet, stateBetDerived, stateMeta, stateModal, stateConfig, stateUrlDerived, stateI18nDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import AutoplayMenu from './AutoplayMenu.svelte';
	import BetMenu from './BetMenu.svelte';

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

	// Track currency so we can skip animation on currency switch
	let prevCurrencyPB = stateBet.currency;
	$effect(() => {
		const instant = stateBet.currency !== prevCurrencyPB;
		prevCurrencyPB = stateBet.currency;
		balanceTween.set(stateBet.balanceAmount, { duration: instant ? 0 : undefined });
	});
	$effect(() => {
		const instant = stateBet.currency !== prevCurrencyPB;
		winTween.set(stateBet.winBookEventAmount, { duration: instant ? 0 : undefined });
	});

	const balanceText = $derived(numberToCurrencyString(balanceTween.current));
	const winText = $derived(bookEventAmountToCurrencyString(winTween.current));
	const spinText = $derived(numberToCurrencyString(stateBetDerived.betCost()));
	const baseBetText = $derived(numberToCurrencyString(stateBet.betAmount));

	// Whether a cost-multiplier mode is active (ANTE, M2X, etc.) — shows base bet below total cost
	const hasActiveCostMode = $derived(stateBetDerived.betCost() !== stateBet.betAmount);

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
	const autoSpinsRemaining = $derived(stateBet.autoSpinsCounter);
	const autoSpinsText = $derived(
		autoSpinsRemaining === Infinity ? '∞' : autoSpinsRemaining > 0 ? String(autoSpinsRemaining) : ''
	);
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

	// Bonus play bar assets (free spins)
	let bonusBarTexture = $state<Texture>(Texture.EMPTY);
	let bonusMenuTexture = $state<Texture>(Texture.EMPTY);
	let bonusTurboTexture = $state<Texture>(Texture.EMPTY);
	let bonusSpinTexture = $state<Texture>(Texture.EMPTY);
	let bonusTotalWinTexture = $state<Texture>(Texture.EMPTY);
	let bonusFreeSpinsTexture = $state<Texture>(Texture.EMPTY);

	let assetsLoaded = $state(false);
	let bonusAssetsLoaded = $state(false);

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

	// Bet menu (inline, matching autoplay style)
	let betMenuOpen = $state(false);

	// Derived active textures based on hover/pressed state
	const activePlayTexture = $derived(
		disabled ? playTexture : spinPressed ? playPressedTexture : spinHovered ? playHoverTexture : playTexture
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

	// Increase/Decrease arrow textures (always rest texture when disabled)
	const activeIncreaseTexture = $derived(
		increaseDisabled ? increaseTexture : incPressed ? increasePressedTexture : incHovered ? increaseHoverTexture : increaseTexture
	);
	const activeDecreaseTexture = $derived(
		decreaseDisabled ? decreaseTexture : decPressed ? decreasePressedTexture : decHovered ? decreaseHoverTexture : decreaseTexture
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
	const barWidth = $derived(Math.round(boardLayout.width * BAR_WIDTH_MULTIPLIER));
	const barHeight = $derived(Math.round(boardLayout.height * BAR_HEIGHT_RATIO));
	const barRadius = $derived(Math.round(barHeight * 0.18));

	// Position below board (centered on board) — rounded to integer pixels to prevent sub-pixel blur
	const containerX = $derived(Math.round(boardLayout.width / 2));
	const margin = $derived(boardLayout.height * PLAYBAR_MARGIN_RATIO);
	const containerY = $derived(Math.round(boardLayout.height + (barHeight / 2) + margin));

	// Button sizes
	const spinButtonSize = $derived(barHeight * SPIN_BUTTON_SCALE);
	const smallButtonSize = $derived(barHeight * SMALL_BUTTON_SCALE);
	const arrowButtonSize = $derived(barHeight * ARROW_BUTTON_SCALE);
	const buyButtonSize = $derived(barHeight * BUY_BUTTON_SCALE);
	const buttonGap = $derived(barWidth * BUTTON_GAP);

	// Font sizes — scale with bar, lower minimum for tiny viewports
	const labelFontSize = $derived(Math.round(Math.max(6, barHeight * 0.2)));
	const valueFontSize = $derived(Math.round(Math.max(7, barHeight * 0.256)));

	/**
	 * Dynamically compute a font size that fits within the given maxWidth.
	 * Uses an approximate character width ratio (0.6 for Arial bold).
	 * Returns the default fontSize if the text fits, otherwise scales down.
	 */
	const dynamicFontSize = (text: string, defaultSize: number, maxWidth: number): number => {
		const charWidthRatio = 0.62; // approximate width-to-height ratio for Arial bold
		const estimatedWidth = text.length * defaultSize * charWidthRatio;
		if (estimatedWidth <= maxWidth) return defaultSize;
		const scaled = Math.floor((maxWidth / (text.length * charWidthRatio)));
		return Math.max(5, scaled); // never go below 5px (supports tiny viewports like 400×225)
	};

	// Dynamic label font sizes (also scale down for tiny viewports)
	const balanceLabelFontSize = $derived(dynamicFontSize('BALANCE', labelFontSize, sectionWidth * 0.92));
	const winLabelFontSize = $derived(dynamicFontSize('WIN', labelFontSize, sectionWidth * 0.92));
	const betLabelFontSize = $derived(dynamicFontSize(betLabel, labelFontSize, sectionWidth * 0.92));
	const fsBalanceLabelFontSize = $derived(dynamicFontSize('BALANCE', labelFontSize, fsSectionWidth * 0.92));
	const fsWinLabelFontSize = $derived(dynamicFontSize('WIN', labelFontSize, fsSectionWidth * 0.92));
	const fsBetLabelFontSize = $derived(dynamicFontSize(betLabel, labelFontSize, fsSectionWidth * 0.92));

	// Dynamic value font sizes that shrink for long currency strings
	const balanceValueFontSize = $derived(dynamicFontSize(balanceText, valueFontSize, sectionWidth * 0.92));
	const winValueFontSize = $derived(dynamicFontSize(winText, valueFontSize, sectionWidth * 0.92));
	const spinValueFontSize = $derived(dynamicFontSize(spinText, valueFontSize, sectionWidth * 0.92));

	// Free spins mode dynamic font sizes (4 narrower sections)
	const fsBalanceValueFontSize = $derived(dynamicFontSize(balanceText, valueFontSize, fsSectionWidth * 0.92));
	const fsWinValueFontSize = $derived(dynamicFontSize(spinWinText, valueFontSize, fsSectionWidth * 0.92));
	const fsSpinValueFontSize = $derived(dynamicFontSize(spinText, valueFontSize, fsSectionWidth * 0.92));

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

	// Deactivate mode button — shown between spin and autoplay, at top edge of bar
	const DEACTIVATE_BTN_SCALE = 0.38;
	const deactivateBtnSize = $derived(barHeight * DEACTIVATE_BTN_SCALE);
	const deactivateBtnX = $derived(spinButtonX + spinButtonSize / 2 + buttonGap + smallButtonSize * 0.3);
	const deactivateBtnY = $derived(-spinButtonSize / 2 - deactivateBtnSize * 0.15);

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

	// ── Free spins mode: 4 info sections (BALANCE | WIN | SPIN | FREE SPINS + TOTAL WIN) ──
	const fsInfoRightEdge = $derived(fsTurboX - smallButtonSize / 2 - buttonGap);
	const fsInfoZoneWidth = $derived(fsInfoRightEdge - infoLeftEdge);
	const fsSectionWidth = $derived(fsInfoZoneWidth / 4);
	const fsBalanceSectionX = $derived(infoLeftEdge + fsSectionWidth / 2);
	const fsWinSectionX = $derived(infoLeftEdge + fsSectionWidth + fsSectionWidth / 2);
	const fsSpinSectionX = $derived(infoLeftEdge + fsSectionWidth * 2 + fsSectionWidth / 2);
	const fsCombinedSectionX = $derived(infoLeftEdge + fsSectionWidth * 3 + fsSectionWidth / 2);

	// Free spins remaining (countdown)
	const fsRemaining = $derived(Math.max(0, fsTotal - fsCurrent));

	// Scale factors — horizontal from bar width (1750px source), vertical from bar height (140px source)
	const bonusSF  = $derived(barWidth  / 1750); // horizontal scale for widths
	const bonusVSF = $derived(barHeight / 140);  // vertical scale for heights — ensures boxes always extend

	// Combined section: Total Win (257×87) stacked on Free Spins (257×66), centered on bar.
	// Using barHeight/140 for heights so the stack (153px source) always exceeds barHeight (140px source)
	// → extends ~9px scaled outside on each side, exactly matching the reference image.
	const fsTWH = $derived(87 * bonusVSF);   // Total Win box height on screen
	const fsFSH = $derived(66 * bonusVSF);   // Free Spins box height on screen
	const fsTWW = $derived(257 * bonusVSF);  // box width — scale uniformly by bonusVSF to maintain aspect ratio
	const fsFSW = $derived(257 * bonusVSF);
	// Stack: FREE SPINS (66px) on TOP, TOTAL WIN (87px) on BOTTOM
	const fsStackTop = $derived(-(fsFSH + fsTWH) / 2); // top of stack, bar-centered at y=0
	// Sprite center Y for each box (Free Spins on top, Total Win on bottom)
	const fsTopBoxCenterY  = $derived(Math.round(fsStackTop + fsFSH / 2));           // Free Spins center
	const fsBotBoxCenterY  = $derived(Math.round(fsStackTop + fsFSH + fsTWH / 2));  // Total Win center
	// Text Y positions inside each box
	const fsTopLabelY    = $derived(Math.round(fsStackTop + fsFSH * 0.28));          // Free Spins label
	const fsTopValueY    = $derived(Math.round(fsStackTop + fsFSH * 0.70));          // Free Spins value
	const fsBottomLabelY = $derived(Math.round(fsStackTop + fsFSH + fsTWH * 0.28)); // Total Win label
	const fsBottomValueY = $derived(Math.round(fsStackTop + fsFSH + fsTWH * 0.70)); // Total Win value
	// Font sizes relative to box heights
	const fsCombinedLabelFontSize = $derived(Math.round(Math.max(10, fsFSH * 0.32)));
	const fsCombinedValueFontSize = $derived(Math.round(Math.max(12, fsFSH * 0.45)));

	// Bet disabled state — bypass balance check in replay mode
	// Inline the computation so Svelte 5 tracks all reactive dependencies directly
	const disabled = $derived.by(() => {
		const mode = stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toUpperCase()]
			?? stateMeta.betModeMeta?.[stateBet.activeBetModeKey.toLowerCase()];
		const costMult = mode?.type === 'activate' ? (mode.costMultiplier ?? 1) : 1;
		const cost = stateBet.betAmount * costMult;
		const available = cost > 0 && cost <= stateBet.balanceAmount;
		return !available && !stateUrlDerived.replay();
	});
	const betIdle = $derived(context.stateXstateDerived.isIdle());

	// Arrow disabled states — only grey out when at bet limits, NOT during spin  
	// (handlers independently check betIdle to prevent changes during play)
	const smallest = $derived(stateConfig.betAmountOptions[0]);
	const biggest = $derived(stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]);
	const decreaseDisabled = $derived(stateBet.betAmount <= smallest);
	const increaseDisabled = $derived(stateBet.betAmount >= biggest);

	// ============================================================
	// DRAW FUNCTIONS
	// ============================================================

		// Normal bar background (same in both modes)
	const drawBar = $derived((g: PIXI.Graphics) => {
		g.roundRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight, barRadius);
		g.fill({ color: 0x000000, alpha: 0.65 });
	});

	// Divider lines between sections
	const drawDividers = $derived((g: PIXI.Graphics) => {
		const dividerH = barHeight * 0.5;
		const y1 = -dividerH / 2;
		const y2 = dividerH / 2;

		if (inFreeSpins) {
			// 4-section free spins mode: 3 dividers between sections + 1 before turbo
			for (let i = 1; i <= 3; i++) {
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
		const B = './assets/sprites/buttons_new';
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

			// Load bonus play bar assets independently so main bar is never blocked
			const BB = './assets/sprites/buttons_new/bonus_play_bar';
			const [bBar, bMenu, bTurbo, bSpin, bTotalWin, bFreeSpins] = await Promise.all([
				Assets.load(`${BB}/play_bar_bonus_0011_Play_Bar.png`),
				Assets.load(`${BB}/play_bar_bonus_0005_Menu.png`),
				Assets.load(`${BB}/play_bar_bonus_0002_turbo.png`),
				Assets.load(`${BB}/play_bar_bonus_0005_Spin.png`),
				Assets.load(`${BB}/play_bar_bonus_0007_Total-Win.png`),
				Assets.load(`${BB}/play_bar_bonus_0008_Free-Spins.png`),
			]);
			bonusBarTexture = bBar;
			bonusMenuTexture = bMenu;
			bonusTurboTexture = bTurbo;
			bonusSpinTexture = bSpin;
			bonusTotalWinTexture = bTotalWin;
			bonusFreeSpinsTexture = bFreeSpins;
			bonusAssetsLoaded = true;
		} catch (error) {
			console.error('Failed to load PlayBar assets:', error);
		}
	});

	// ============================================================
	// BUTTON HANDLERS
	// ============================================================
	const handleSpin = () => {
		if (stateUrlDerived.replay()) return;
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		context.eventEmitter.broadcast({ type: 'bet' });
	};

	const handleAutoPlay = () => {
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		if (stateBetDerived.hasAutoBetCounter()) {
			// Stop autoplay if running
			stateBet.autoSpinsCounter = 0;
		} else {
			// Open inline autoplay popup
			autoplayMenuOpen = !autoplayMenuOpen;
		}
	};

	const handleSpeedToggle = () => {
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		// Cycle: 0 (normal) → 1 (turbo) → 2 (super turbo) → 0 (normal)
		const next = ((speedMode + 1) % 3) as SpeedMode;
		stateBetDerived.updateSpeedMode(next, { persistent: true });
	};

	const handleBuyBonus = () => {
		context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
	};





	const handleBetMenu = () => {
		if (betIdle) {
			context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
			betMenuOpen = !betMenuOpen;
		}
	};

	const handleDeactivateMode = () => {
		if (!betIdle) return;
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		stateBet.activeBetModeKey = 'BASE';
	};

	const handleBetIncrease = () => {
		if (!betIdle) return;
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_1' });
		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);
		stateBetDerived.setBetAmount(nextBigger || biggest);
	};

	const handleBetDecrease = () => {
		if (!betIdle) return;
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_2' });
		const nextSmaller = [...stateConfig.betAmountOptions]
			.sort((a, b) => b - a)
			.find((option) => option < stateBet.betAmount);
		stateBetDerived.setBetAmount(nextSmaller || smallest);
	};
</script>

<BoardContainer zIndex={20}>
	<Container x={containerX} y={containerY}>

		<!-- BAR BACKGROUND (same appearance in both modes) -->
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
				texture={inFreeSpins && bonusAssetsLoaded ? bonusMenuTexture : activeMenuTexture}
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
					style={{ fontFamily: 'Arial', fontSize: fsBalanceLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={balanceText}
					style={{ fontFamily: 'Arial', fontSize: fsBalanceValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
			</Container>

			<!-- WIN SECTION (per-spin win, between balance and bet) -->
			<Container x={fsWinSectionX} y={0} zIndex={2}>
				{#if showSpinWin}
					<Text
						anchor={{ x: 0.5, y: 1 }}
						y={labelY}
						resolution={TEXT_RESOLUTION}
						text="WIN"
						style={{ fontFamily: 'Arial', fontSize: fsWinLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
					/>
					<Text
						anchor={{ x: 0.5, y: 0 }}
						y={valueY}
						resolution={TEXT_RESOLUTION}
						text={spinWinText}
						style={{ fontFamily: 'Arial', fontSize: fsWinValueFontSize, fill: WIN_COLOR, fontWeight: 'bold' }}
					/>
				{/if}
			</Container>

			<!-- SPIN (BET) SECTION — PNG background (298×101 at 1750×140 source) -->
			<Container x={fsSpinSectionX} y={0} zIndex={2}>
				{#if bonusAssetsLoaded}
					<BaseSprite
						texture={bonusSpinTexture}
						width={Math.round(298 * bonusVSF)}
						height={Math.round(101 * bonusVSF)}
						anchor={0.5}
						zIndex={0}
					/>
				{/if}
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={labelY}
					resolution={TEXT_RESOLUTION}
					text={betLabel}
					style={{ fontFamily: 'Arial', fontSize: fsBetLabelFontSize, fill: SPIN_LABEL_COLOR, fontWeight: 'bold' }}
					zIndex={1}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={spinText}
					style={{ fontFamily: 'Arial', fontSize: fsSpinValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
					zIndex={1}
				/>
			</Container>

			<!-- COMBINED: FREE SPINS (top) + TOTAL WIN (bottom) -->
			<Container x={fsCombinedSectionX} y={0} zIndex={2}>
				<!-- PNG section panels as backgrounds -->
				{#if bonusAssetsLoaded}
					<!-- FREE SPINS box on top -->
					<BaseSprite
						texture={bonusFreeSpinsTexture}
						width={Math.round(fsFSW)}
						height={Math.round(fsFSH)}
						anchor={0.5}
						y={fsTopBoxCenterY}
						zIndex={0}
					/>
					<!-- TOTAL WIN box on bottom -->
					<BaseSprite
						texture={bonusTotalWinTexture}
						width={Math.round(fsTWW)}
						height={Math.round(fsTWH)}
						anchor={0.5}
						y={fsBotBoxCenterY}
						zIndex={0}
					/>
				{/if}
				<!-- FREE SPINS row (top box) -->
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsTopLabelY}
					resolution={TEXT_RESOLUTION}
					text="FREE SPINS"
					style={{ fontFamily: 'Arial', fontSize: fsCombinedLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
					zIndex={1}
				/>
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsTopValueY}
					resolution={TEXT_RESOLUTION}
					text={`${fsRemaining}`}
					style={{ fontFamily: 'Arial', fontSize: fsCombinedValueFontSize, fill: 0x00e6cc, fontWeight: 'bold' }}
					zIndex={1}
				/>
				<!-- TOTAL WIN row (bottom box) -->
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsBottomLabelY}
					resolution={TEXT_RESOLUTION}
					text="TOTAL WIN"
					style={{ fontFamily: 'Arial', fontSize: fsCombinedLabelFontSize, fill: 0x00e6cc, fontWeight: 'bold' }}
					zIndex={1}
				/>
				<Text
					anchor={{ x: 0.5, y: 0.5 }}
					y={fsBottomValueY}
					resolution={TEXT_RESOLUTION}
					text={totalWinText}
					style={{ fontFamily: 'Arial', fontSize: fsCombinedValueFontSize, fill: WIN_COLOR, fontWeight: 'bold' }}
					zIndex={1}
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
					style={{ fontFamily: 'Arial', fontSize: balanceLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={balanceText}
					style={{ fontFamily: 'Arial', fontSize: balanceValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
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
					style={{ fontFamily: 'Arial', fontSize: winLabelFontSize, fill: LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={valueY}
					resolution={TEXT_RESOLUTION}
					text={winText}
					style={{ fontFamily: 'Arial', fontSize: winValueFontSize, fill: WIN_COLOR, fontWeight: 'bold' }}
				/>
			</Container>
			{/if}

			<!-- SPIN (BET) SECTION with increase/decrease sprite buttons -->
			<Container x={spinSectionX} y={0} zIndex={2}>
				<Text
					anchor={{ x: 0.5, y: 1 }}
					y={hasActiveCostMode ? labelY - Math.round(barHeight * 0.08) : labelY}
					resolution={TEXT_RESOLUTION}
					text={betLabel}
					style={{ fontFamily: 'Arial', fontSize: betLabelFontSize, fill: SPIN_LABEL_COLOR, fontWeight: 'bold' }}
				/>
				<Text
					anchor={{ x: 0.5, y: 0 }}
					y={hasActiveCostMode ? valueY - Math.round(barHeight * 0.08) : valueY}
					resolution={TEXT_RESOLUTION}
					text={spinText}
					style={{ fontFamily: 'Arial', fontSize: spinValueFontSize, fill: VALUE_COLOR, fontWeight: 'bold' }}
				/>
				{#if hasActiveCostMode}
					<Text
						anchor={{ x: 0.5, y: 0 }}
						y={valueY + Math.round(barHeight * 0.18)}
						resolution={TEXT_RESOLUTION}
						text={baseBetText}
						style={{ fontFamily: 'Arial', fontSize: Math.round(labelFontSize * 0.85), fill: 0x88aabb, fontWeight: 'bold' }}
					/>
				{/if}
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
					onpointerdown={() => { if (!increaseDisabled) incPressed = true; }}
					onpointerup={() => { incPressed = false; if (!increaseDisabled) handleBetIncrease(); }}
				/>
				<BaseSprite
					texture={activeIncreaseTexture}
					width={arrowButtonSize}
					height={arrowButtonSize * (42 / 56)}
					anchor={0.5}
					alpha={increaseDisabled ? 0.3 : 1}
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
					onpointerdown={() => { if (!decreaseDisabled) decPressed = true; }}
					onpointerup={() => { decPressed = false; if (!decreaseDisabled) handleBetDecrease(); }}
				/>
				<BaseSprite
					texture={activeDecreaseTexture}
					width={arrowButtonSize}
					height={arrowButtonSize * (42 / 56)}
					anchor={0.5}
					alpha={decreaseDisabled ? 0.3 : 1}
				/>
			</Container>

			<!-- DEACTIVATE MODE BUTTON (above spin, only visible when a cost mode is active) -->
			{#if hasActiveCostMode && betIdle}
				<Container x={deactivateBtnX} y={deactivateBtnY} zIndex={4}>
					<Graphics
						draw={(g: PIXI.Graphics) => {
							g.roundRect(-deactivateBtnSize * 1.5, -deactivateBtnSize / 2, deactivateBtnSize * 3, deactivateBtnSize, deactivateBtnSize * 0.25);
							g.fill({ color: 0xcc4444, alpha: 0.85 });
							g.roundRect(-deactivateBtnSize * 1.5, -deactivateBtnSize / 2, deactivateBtnSize * 3, deactivateBtnSize, deactivateBtnSize * 0.25);
							g.stroke({ color: 0xff6666, width: 1.5, alpha: 0.6 });
						}}
						eventMode="static"
						cursor="pointer"
						onpointerup={handleDeactivateMode}
					/>
					<Text
						anchor={{ x: 0.5, y: 0.5 }}
						resolution={TEXT_RESOLUTION}
						text="DEACTIVATE"
						style={{
							fontFamily: 'Arial',
							fontSize: Math.round(Math.max(8, deactivateBtnSize * 0.42)),
							fill: 0xffffff,
							fontWeight: 'bold',
							letterSpacing: 0.5,
						}}
					/>
				</Container>
			{/if}

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
					onpointerdown={() => { if (!disabled) spinPressed = true; }}
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
				{#if isAutoplaying && autoSpinsText}
					<Text
						anchor={{ x: 0.5, y: 0.5 }}
						y={smallButtonSize * 0.52}
						resolution={TEXT_RESOLUTION}
						text={autoSpinsText}
						style={{
							fontFamily: 'Arial',
							fontSize: Math.round(Math.max(10, smallButtonSize * 0.3)),
							fill: 0x00ffcc,
							fontWeight: 'bold',
							stroke: { color: 0x000000, width: 3 },
						}}
					/>
				{/if}
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
<BetMenu show={betMenuOpen} onclose={() => { betMenuOpen = false; }} />
