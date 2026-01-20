<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, REM, Container } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../../game/context';
	import EnableSound from '../../components/EnableSound.svelte';
	import EnableGameActor from '../../components/EnableGameActor.svelte';
	import ResumeBet from '../../components/ResumeBet.svelte';
	import Sound from '../../components/Sound.svelte';
	import Background from '../../components/Background.svelte';
	import LoadingScreen from '../../components/LoadingScreen.svelte';
	import BoardFrame from '../../components/BoardFrame.svelte';
	import MultiplierGrid from '../../components/MultiplierGrid.svelte';
	import Anticipations from '../../components/Anticipations.svelte';
	import ClusterWinAmounts from '../../components/ClusterWinAmounts.svelte';
	import TumbleWinAmount from '../../components/TumbleWinAmount.svelte';
	import GlobalMultiplier from '../../components/GlobalMultiplier.svelte';
	import Win from '../../components/Win.svelte';
	import FreeSpinIntro from '../../components/FreeSpinIntro.svelte';
	import FreeSpinCounter from '../../components/FreeSpinCounter.svelte';
	import FreeSpinOutro from '../../components/FreeSpinOutro.svelte';
	import Transition from '../../components/Transition.svelte';
	import I18nTest from '../../components/I18nTest.svelte';
	import PlayBar from '../../components/PlayBar.svelte';

	// Story-only variants
	import Board from './BoardWithSpriteMask.svelte';
	import TumbleBoard from './TumbleBoardWithSpriteMask.svelte';

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
		<Sound />

		<!-- Symbols layer (includes reel_mask behind symbols) -->
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

		<!-- Reel frame (uses overridden reelFrameEdge asset) -->
		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<Win />
		<FreeSpinIntro />
		<FreeSpinCounter />
		<FreeSpinOutro />
		<Transition />
		<I18nTest />

		<!-- Play bar/button stays on top -->
		<PlayBar />

		<Container x={REM} y={REM} zIndex={9999}>
			<UiGameName />
			<GameVersion />
		</Container>

		<Modals />
	{/if}
</App>
