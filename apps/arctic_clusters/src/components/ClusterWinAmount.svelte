<script lang="ts" module>
	export type RawWin = {
		win: number;
		mult: number;
		result: number;
		reel: number; // 0 | 1 | 2 | 3 | 4 | 5;
		row: number; // 1 | 2 | 3 | 4 | 5; // excluding the off top row and the off bottom row
	};
	export type Win = RawWin & { oncomplete: () => void };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';

	import { BitmapText } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';
	import { SECOND } from 'constants-shared/time';
	import { FadeContainer } from 'components-pixi';
	import { waitForTimeout } from 'utils-shared/wait';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';
	import { getContext } from '../game/context';
	import { FONT_FAMILY } from '../game/constants';

	type Props = { win: Win };

	const props: Props = $props();
	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived((symbolWidth + symbolHeight) / 2);
	const y = new Tween(0);
	const scale = new Tween(1);
	let show = $state(true);

	let showMultiplier = $state(props.win.mult > 1);

	// update showMultiplier
	onMount(async () => {
		await waitForTimeout(SECOND / stateBetDerived.timeScale());
		showMultiplier = false;
	});

	// update scale
	onMount(async () => {
		if (showMultiplier) {
			await waitForTimeout(SECOND);
			context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_combine_a' });
			await scale.set(0.1, { duration: 200 / stateBetDerived.timeScale() });
			await scale.set(1, { duration: 200 / stateBetDerived.timeScale() });
		}
	});

	// update y
	onMount(async () => {
		await y.set(-symbolHeight, { duration: (SECOND * 0.8) / stateBetDerived.timeScale() });
		show = false;
	});
</script>

<FadeContainer
	{show}
	oncomplete={() => {
		if (!show) props.win.oncomplete();
	}}
>
	{@const textContent = showMultiplier
		? `${bookEventAmountToCurrencyString(props.win.win)} X ${props.win.mult}`
		: bookEventAmountToCurrencyString(props.win.result)}
	{@const textX = getSymbolXDynamic(props.win.reel, symbolWidth)}
	{@const textY = getSymbolYDynamic(props.win.row - 1, symbolHeight) + y.current}
	{@const fs = symbolSize * 0.5}
	{@const textStyle = { fontFamily: FONT_FAMILY, fontSize: fs }}
	{@const sc = scale.current}
	{@const ex = Math.max(1, Math.round(fs * 0.03))}

	<!-- Shadow/outline layer -->
	<BitmapText
		x={textX + ex * 1.5}
		y={textY + ex * 2}
		scale={sc}
		text={textContent}
		anchor={0.5}
		style={textStyle}
		tint={0xbbaa55}
	/>

	<!-- Main text (bright green) -->
	<BitmapText
		x={textX}
		y={textY}
		scale={sc}
		text={textContent}
		anchor={0.5}
		style={textStyle}
		tint={0x33ee88}
	/>
</FadeContainer>
