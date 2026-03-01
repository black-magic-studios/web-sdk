<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM, Container, Sprite } from 'pixi-svelte';
	import { UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';
	import ModalBuyBonus from './ModalBuyBonus.svelte';

	import { stateMeta, stateConfig } from 'state-shared';
	import { getContext } from '../game/context';
	import config from '../game/config';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import Snowflakes from './Snowflakes.svelte';
	import AuroraParticles from './AuroraParticles.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import MultiplierFlyOut from './MultiplierFlyOut.svelte';
	import WinOverlay from './WinOverlay.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import AuroraSpinAnnounce from './AuroraSpinAnnounce.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';
	// import I18nTest from './I18nTest.svelte';
	import PlayBar from './PlayBar.svelte';
	import MobileControls from './MobileControls.svelte';
	import GameInfoModal from './GameInfoModal.svelte';
	import ConstellationWildMeter from './ConstellationWildMeter.svelte';
	import ReplayOverlay from './ReplayOverlay.svelte';
	import StudioIntro from './StudioIntro.svelte';

	import { stateUrlDerived } from 'state-shared';

	const context = getContext();

	// ── Register arctic_clusters multiplier bet modes from RGS config ──
	// The RGS sends betModes in the authenticate response (stored in stateConfig.betModes).
	// Fall back to the local config for dev mode when RGS is not connected.
	const MULTIPLIER_KEYS = ['M2X', 'M4X', 'M8X', 'M16X', 'M32X', 'M64X', 'M128X', 'M256X', 'M512X', 'M1024X'] as const;

	const getCost = (key: string): number => {
		// Prefer RGS-provided config, fall back to local config
		if (stateConfig.betModes?.[key]?.cost != null) return stateConfig.betModes[key].cost;
		if (config.betModes?.[key as keyof typeof config.betModes]?.cost != null) {
			return (config.betModes as any)[key].cost;
		}
		return 1;
	};

	for (const key of MULTIPLIER_KEYS) {
		const label = key.replace('M', '').replace('X', 'x');
		const cost = getCost(key);
		stateMeta.betModeMeta[key] = {
			mode: key,
			costMultiplier: cost,
			type: 'activate',
			parent: '',
			children: '',
			assets: { icon: '', dialogImage: '', dialogVolatility: '', volatility: '', button: '' },
			text: {
				title: `${label} Grid`,
				dialog: `Every Cell on the Grid starts with a ${label} multiplier for ${cost}x the player play amount.`,
				description: `Every Cell on the Grid starts with a ${label} multiplier.`,
				button: 'ACTIVATE',
				betAmountLabel: `${label} GRID`,
				tickerIdle: `${label} GRID ACTIVE`,
				tickerSpin: 'GOOD LUCK',
			},
		};
	}

	// Register ante mode
	const anteCost = getCost('ante');
	stateMeta.betModeMeta['ANTE'] = {
		mode: 'ANTE',
		costMultiplier: anteCost,
		type: 'activate',
		parent: '',
		children: '',
		assets: { icon: '', dialogImage: '', dialogVolatility: '', volatility: '', button: '' },
		text: {
			title: 'Extra Chance',
			dialog: `1 Bonus symbol guaranteed on the last reel each spin for ${anteCost}x the player play amount.`,
			description: '1 Bonus symbol guaranteed on the last reel each spin.',
			button: 'ACTIVATE',
			betAmountLabel: 'EXTRA CHANCE',
			tickerIdle: 'EXTRA CHANCE ACTIVE',
			tickerSpin: 'GOOD LUCK',
		},
	};

	// Register bonus buy mode
	const bonusCost = getCost('bonus');
	stateMeta.betModeMeta['BONUS'] = {
		mode: 'BONUS',
		costMultiplier: bonusCost,
		type: 'buy',
		parent: '',
		children: '',
		assets: { icon: '', dialogImage: '', dialogVolatility: '', volatility: '', button: '' },
		text: {
			title: 'Buy Bonus',
			dialog: `Buy into a Bonus round for ${bonusCost}x the player play amount.`,
			description: 'Instantly trigger a Bonus round.',
			button: 'BUY',
			betAmountLabel: 'BUY BONUS',
			tickerIdle: '',
			tickerSpin: 'GOOD LUCK',
		},
	};

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	let showStudioIntro = $state(true);
	let showBuyBonus = $state(false);
	let showGameInfo = $state(false);

	// ── Replay mode state ──
	let replayState = $state<'ready' | 'playing' | 'done'>(
		stateUrlDerived.replay() ? 'ready' : 'playing'
	);

	function startReplay() {
		replayState = 'playing';
		context.eventEmitter.broadcast({ type: 'resumeBet' });
	}

	function restartReplay() {
		window.location.reload();
	}

	// Scale UI elements (game name + logo) relative to canvas width.
	// Reference width 1280px → scale 1.0.  Clamped so it never gets tiny or huge.
	const canvasWidth = $derived(context.stateLayoutDerived.canvasSizes().width);
	const uiScale = $derived(Math.max(0.45, Math.min(1.5, canvasWidth / 1280)));

	// Portrait/mobile detection — use HTML controls instead of PIXI PlayBar
	const useMobileControls = $derived(
		['portrait', 'tablet'].includes(context.stateLayoutDerived.layoutType())
	);

	let shaking = $state(false);
	let shakeClass = $state('');

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			showBuyBonus = true;
		},
		gameInfoOpen: () => {
			showGameInfo = true;
		},
		screenShake: ({ intensity }) => {
			shaking = false;
			shakeClass = `shake-${intensity}`;
			requestAnimationFrame(() => { shaking = true; });
		},
	});

	// Watch xstate transitions — when replay returns to idle, mark as done
	let replayWasPlaying = false;
	$effect(() => {
		const state = context.stateXstate.value;
		if (stateUrlDerived.replay() && replayState === 'playing') {
			if (state === 'resumeBet') {
				replayWasPlaying = true;
			} else if (state === 'idle' && replayWasPlaying) {
				replayState = 'done';
				replayWasPlaying = false;
			}
		}
	});
</script>

<div class="game-root" class:shake-light={shaking && shakeClass === 'shake-light'} class:shake-medium={shaking && shakeClass === 'shake-medium'} class:shake-heavy={shaking && shakeClass === 'shake-heavy'} onanimationend={() => (shaking = false)}>
<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

	{#if showStudioIntro}
		<StudioIntro ondone={() => (showStudioIntro = false)} />
	{/if}

	{#if context.stateLayout.showLoadingScreen}
		<LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
	{:else}
		<ResumeBet />
		<!--
			The reason why <Sound /> is rendered after clicking the loading screen:
			"Autoplay with sound is allowed if: The user has interacted with the domain (click, tap, etc.)."
			Ref: https://developer.chrome.com/blog/autoplay
		-->
		<Sound />

		<Snowflakes />
		<AuroraParticles layer="background" />
		<BoardFrame />
		<Board />
		<Anticipations />
		<TumbleBoard />
		<MultiplierFlyOut />
		<ClusterWinAmounts />
		<AuroraParticles layer="foreground" />
		<ConstellationWildMeter />
		{#if !useMobileControls}
			<PlayBar />
		{/if}

		<Container x={20} scale={uiScale} y={4}>
			<UiGameName name="ARCTIC CLUSTERS" />
		</Container>
		<Sprite
			key="studioLogo"
			anchor={{ x: 1, y: 0 }}
			x={context.stateLayoutDerived.canvasSizes().width - 20}
			y={6}
			height={Math.round(REM * 2 * uiScale)}
			width={Math.round(REM * 2 * (2808 / 589) * uiScale)}
		/>
		<WinOverlay />
		<TumbleWinAmount />
		<AuroraSpinAnnounce />
		<Transition />

		<!-- <I18nTest /> -->
	{/if}
</App>

<FreeSpinIntro />
<FreeSpinOutro />

<ReplayOverlay {replayState} onplay={startReplay} onplayagain={restartReplay} />

<Modals>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>

<ModalBuyBonus show={showBuyBonus} onclose={() => (showBuyBonus = false)} />
<GameInfoModal show={showGameInfo} onclose={() => (showGameInfo = false)} />

{#if useMobileControls}
	<MobileControls hidden={showGameInfo || showBuyBonus} />
{/if}
</div>

<svelte:head>
	<style>
		html, body { overflow: hidden !important; height: 100%; width: 100%; margin: 0; padding: 0; }
	</style>
</svelte:head>

<style>
	.game-root {
		width: 100%;
		height: 100%;
	}

	.shake-light {
		animation: screenShakeLight 0.2s ease-out;
	}

	.shake-medium {
		animation: screenShakeMedium 0.35s ease-out;
	}

	.shake-heavy {
		animation: screenShakeHeavy 0.5s ease-out;
	}

	@keyframes screenShakeLight {
		0%   { transform: translate(0, 0); }
		25%  { transform: translate(-1px, 0.5px); }
		50%  { transform: translate(1px, -0.5px); }
		75%  { transform: translate(-0.5px, 0.5px); }
		100% { transform: translate(0, 0); }
	}

	@keyframes screenShakeMedium {
		0%   { transform: translate(0, 0); }
		15%  { transform: translate(-3px, 2px); }
		30%  { transform: translate(3px, -3px); }
		45%  { transform: translate(-2px, 3px); }
		60%  { transform: translate(2px, -1px); }
		75%  { transform: translate(-1px, 1px); }
		100% { transform: translate(0, 0); }
	}

	@keyframes screenShakeHeavy {
		0%   { transform: translate(0, 0); }
		8%   { transform: translate(-8px, 5px); }
		16%  { transform: translate(7px, -8px); }
		24%  { transform: translate(-6px, 7px); }
		32%  { transform: translate(8px, -4px); }
		40%  { transform: translate(-5px, 6px); }
		50%  { transform: translate(6px, -3px); }
		60%  { transform: translate(-4px, 4px); }
		70%  { transform: translate(3px, -2px); }
		80%  { transform: translate(-2px, 2px); }
		90%  { transform: translate(1px, -1px); }
		100% { transform: translate(0, 0); }
	}
</style>
