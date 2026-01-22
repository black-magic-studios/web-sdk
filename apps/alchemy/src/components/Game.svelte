<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM, Container, Graphics } from 'pixi-svelte';
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
	import OuterFrameSprite from './OuterFrameSprite.svelte';
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
	import ReelMaskSprite from './ReelMaskSprite.svelte';
	import { MASK_WIDTH, MASK_HEIGHT } from '../game/constants';

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const mainLayout = $derived(context.stateLayoutDerived.mainLayout());
	
	// Calculate scale to fit the board within the main container with padding
	// Leave space for UI elements (playbar at bottom, etc.)
	const UI_PADDING = { top: 40, bottom: 120, left: 40, right: 40 };
	const availableWidth = $derived(mainLayout.width - UI_PADDING.left - UI_PADDING.right);
	const availableHeight = $derived(mainLayout.height - UI_PADDING.top - UI_PADDING.bottom);
	
	// Scale to fit available space while maintaining aspect ratio
	const boardScaleX = $derived(availableWidth / MASK_WIDTH);
	const boardScaleY = $derived(availableHeight / MASK_HEIGHT);
	const boardScale = $derived(Math.min(boardScaleX, boardScaleY));
	
	const boardRect = $derived({ x: 0, y: 0, width: MASK_WIDTH, height: MASK_HEIGHT });
	const boardRoot = $derived({
		// Center horizontally, but account for top padding to shift down slightly
		x: mainLayout.width * 0.5 - boardRect.width * boardScale * 0.5,
		y: UI_PADDING.top + (availableHeight - boardRect.height * boardScale) * 0.5,
		scale: boardScale,
	});

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

		<!--
			Scene layout (single coordinate space)
			- sceneRoot
				- boardRoot (positioned once, scaled once)
					- maskGfx (Graphics rectangle, invisible)
					- reelsContainer (symbols clipped by mask)
					- outerFrameSprite
					- playBarContainer
		-->
		<MainContainer>
			<Container key="sceneRoot">
				<Container key="boardRoot" x={boardRoot.x} y={boardRoot.y} scale={boardRoot.scale}>
					<Container key="reelsContainer">
							<ReelMaskSprite isMask inBoardSpace />

						<Board />
						<Anticipations />
						<TumbleWinAmount />
						<GlobalMultiplier />
						<MultiplierGrid />
						<TumbleBoard />
						<ClusterWinAmounts />
					</Container>

					<OuterFrameSprite />
					<PlayBar />
				</Container>
			</Container>
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
