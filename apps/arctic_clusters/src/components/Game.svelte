<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM, Container, Sprite } from 'pixi-svelte';
	import { UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';
	import ModalBuyBonus from './ModalBuyBonus.svelte';

	import { stateMeta } from 'state-shared';
	import { getContext } from '../game/context';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import Snowflakes from './Snowflakes.svelte';
	import AuroraParticles from './AuroraParticles.svelte';
	import Constellations from './Constellations.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import GlobalMultiplier from './GlobalMultiplier.svelte';
	import MultiplierFlyOut from './MultiplierFlyOut.svelte';
	import WinOverlay from './WinOverlay.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';
	// import I18nTest from './I18nTest.svelte';
	import PlayBar from './PlayBar.svelte';
	import MobileControls from './MobileControls.svelte';
	import GameInfoModal from './GameInfoModal.svelte';
	import WildCounter from './WildCounter.svelte';

	const context = getContext();

	// ── Register arctic_clusters multiplier bet modes ──
	const MULTIPLIER_MODES = [
		{ key: 'M2X', label: '2x', cost: 2.9 },
		{ key: 'M4X', label: '4x', cost: 5.8 },
		{ key: 'M8X', label: '8x', cost: 11.2 },
		{ key: 'M16X', label: '16x', cost: 23.0 },
		{ key: 'M32X', label: '32x', cost: 46.2 },
		{ key: 'M64X', label: '64x', cost: 90.6 },
		{ key: 'M128X', label: '128x', cost: 181.8 },
		{ key: 'M256X', label: '256x', cost: 354.5 },
		{ key: 'M512X', label: '512x', cost: 665.1 },
		{ key: 'M1024X', label: '1024x', cost: 1110.8 },
	] as const;

	for (const m of MULTIPLIER_MODES) {
		stateMeta.betModeMeta[m.key] = {
			mode: m.key,
			costMultiplier: m.cost,
			type: 'activate',
			parent: '',
			children: '',
			assets: { icon: '', dialogImage: '', dialogVolatility: '', volatility: '', button: '' },
			text: {
				title: `${m.label.toUpperCase()} MULTIPLIER`,
				dialog: `Every cell starts with a ${m.label} multiplier for ${m.cost}x the player bet amount.`,
				description: `Every cell starts with a ${m.label} multiplier.`,
				button: 'ACTIVATE',
				betAmountLabel: `${m.label.toUpperCase()} MULTIPLIER`,
				tickerIdle: `${m.label.toUpperCase()} MULTIPLIER ACTIVE`,
				tickerSpin: 'GOOD LUCK',
			},
		};
	}

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	let showBuyBonus = $state(false);
	let showGameInfo = $state(false);

	// Portrait/mobile detection — use HTML controls instead of PIXI PlayBar
	const useMobileControls = $derived(
		['portrait', 'tablet'].includes(context.stateLayoutDerived.layoutType())
	);

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			showBuyBonus = true;
		},
		gameInfoOpen: () => {
			showGameInfo = true;
		},
	});
</script>

<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

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
		<Constellations />
		<BoardFrame />
		<Board />
		<Anticipations />
		<GlobalMultiplier />
		<TumbleBoard />
		<MultiplierFlyOut />
		<ClusterWinAmounts />
		<AuroraParticles layer="foreground" />
		{#if !useMobileControls}
			<PlayBar />
		{/if}

		<Container x={20}>
			<UiGameName name="ARCTIC CLUSTERS" />
		</Container>
		<Sprite
			key="studioLogo"
			anchor={{ x: 1, y: 0 }}
			x={context.stateLayoutDerived.canvasSizes().width - 20}
			y={6}
			height={REM * 2.5}
			width={REM * 2.5}
		/>
		<WinOverlay />
		<FreeSpinIntro />
		{#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
			<FreeSpinCounter />
		{/if}
		<FreeSpinOutro />
		<Transition />

		<!-- <I18nTest /> -->
	{/if}
</App>

<Modals>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>

<ModalBuyBonus show={showBuyBonus} onclose={() => (showBuyBonus = false)} />
<GameInfoModal show={showGameInfo} onclose={() => (showGameInfo = false)} />
<WildCounter />

{#if useMobileControls}
	<MobileControls hidden={showGameInfo || showBuyBonus} />
{/if}

<svelte:head>
	<style>
		html, body { overflow: hidden !important; height: 100%; width: 100%; margin: 0; padding: 0; }
	</style>
</svelte:head>
