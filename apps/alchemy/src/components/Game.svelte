<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM, Container } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import GlobalMultiplier from './GlobalMultiplier.svelte';
	import Win from './Win.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';
	import I18nTest from './I18nTest.svelte';
	import PlayBar from './PlayBar.svelte';

	const context = getContext();

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			stateModal.modal = { name: 'buyBonusConfirm' };
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

		<!-- Layer order (bottom → top):
			1. Background scene (rendered above)
			2. Reel background plate (inside Board, behind symbols)
			3. Symbols (Board)
			4. Symbol FX (Anticipations)
			5. Multipliers (MultiplierGrid)
			6. Win FX (TumbleWinAmount, GlobalMultiplier, TumbleBoard, ClusterWinAmounts)
			7. Reel frame (BoardFrame)
		-->

		<!-- Symbols layer (includes reel background plate as first child) -->
		<MainContainer>
			<Board />
			<Anticipations />
			<TumbleWinAmount />
			<GlobalMultiplier />
		</MainContainer>

		<!-- Multipliers layer -->
		<MainContainer>
			<MultiplierGrid />
		</MainContainer>

		<!-- Win FX layer -->
		<MainContainer>
			<TumbleBoard />
			<ClusterWinAmounts />
		</MainContainer>

		<!-- Reel frame - on top of everything -->
		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<!-- Custom UI: PlayBar and minimal Header -->
		<MainContainer>
			<PlayBar />
		</MainContainer>

		<Container x={20}>
			<UiGameName name="MULTIDROP" />
		</Container>
		<Container x={context.stateLayoutDerived.canvasSizes().width - 20}>
			<Text
				anchor={{ x: 1, y: 0 }}
				text="ADD YOUR LOGO"
				style={{
					fontFamily: 'proxima-nova',
					fontSize: REM * 1.5,
					fontWeight: '600',
					lineHeight: REM * 2,
					fill: 0xffffff,
				}}
			/>
		</Container>
		<!-- <Win /> -->
		<FreeSpinIntro />
		{#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
			<FreeSpinCounter />
		{/if}
		<FreeSpinOutro />
		<Transition />

		<I18nTest />
	{/if}
</App>

<Modals>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>
