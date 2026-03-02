<script lang="ts" module>
	export type EmitterEventGlobalMultiplier =
		| { type: 'globalMultiplierShow' }
		| { type: 'globalMultiplierHide' }
		| { type: 'globalMultiplierUpdate'; multiplier: number };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';

	import {
		BitmapText,
		Container,
		Graphics,
	} from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { stateBetDerived } from 'state-shared';
	import { waitForTimeout } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT, SYMBOL_SIZE } from '../game/constants';

	const PANEL_WIDTH = SYMBOL_SIZE * 0.641;
	const PANEL_HEIGHT = SYMBOL_SIZE * 0.45;
	const context = getContext();
	const scale = $derived(context.stateLayoutDerived.isStacked() ? 1.28 : 1);
	const desktopPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.3,
		y: -SYMBOL_HEIGHT * 0.47,
	});
	const portraitPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.5,
		y: -SYMBOL_HEIGHT * 0.55,
	});
	const position = $derived(
		context.stateLayoutDerived.isStacked() ? portraitPosition : desktopPosition,
	);

	let show = $state(false);
	let multiplier = $state(1);
	let previousMultiplier = new Tween(1);
	let animating = $state(false);

	context.eventEmitter.subscribeOnMount({
		globalMultiplierShow: () => (show = true),
		globalMultiplierHide: () => (show = false),
		globalMultiplierUpdate: async (emitterEvent) => {
			if (emitterEvent.multiplier === 1 && multiplier !== 1) {
				animating = true;
				await waitForTimeout(300 / stateBetDerived.timeScale());
				context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_reset' });
				previousMultiplier.set(emitterEvent.multiplier);
				multiplier = emitterEvent.multiplier;
				await waitForTimeout(300 / stateBetDerived.timeScale());
				animating = false;
			} else if (emitterEvent.multiplier > multiplier) {
				animating = true;
				multiplier = emitterEvent.multiplier;
				previousMultiplier.set(multiplier, { duration: 0 });
				await waitForTimeout(400 / stateBetDerived.timeScale());
				animating = false;
			} else {
				multiplier = emitterEvent.multiplier;
				previousMultiplier.set(multiplier, { duration: 0 });
			}
		},
	});

	// Draw a rounded panel background
	const drawPanel = (g: import('pixi.js').Graphics) => {
		g.roundRect(-PANEL_WIDTH / 2, -PANEL_HEIGHT / 2, PANEL_WIDTH, PANEL_HEIGHT, 8);
		g.fill({ color: 0x0a1428, alpha: 0.85 });
		g.stroke({ color: 0x4488cc, width: 1.5, alpha: 0.6 });
	};
</script>

<FadeContainer {show}>
	<BoardContainer>
		<Container {...position} {scale}>
			<Graphics draw={drawPanel} />
			<BitmapText
				anchor={0.5}
				text={`${multiplier}×`}
				style={{
					fontFamily: 'multiplier',
					fontSize: SYMBOL_SIZE * 4,
				}}
			/>
		</Container>
	</BoardContainer>
</FadeContainer>
