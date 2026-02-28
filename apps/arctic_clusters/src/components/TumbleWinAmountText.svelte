<script lang="ts">
	import { Tween } from 'svelte/motion';

	import { SpineProvider, SpineTrack, SpineSlot } from 'pixi-svelte';
	import { ResponsiveBitmapText } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import { SYMBOL_HEIGHT, FONT_FAMILY } from '../game/constants';

	type Props = {
		width: number;
		amount: number;
		animate: boolean;
		oncomplete: () => void;
	};

	type AnimationName = 'idle' | 'explosion';

	const props: Props = $props();
	const amount = new Tween(0);
	const animationName = $derived<AnimationName>(props.animate ? 'explosion' : 'idle');

	const normalUpdate = async () => {
		await amount.set(props.amount);
		props.oncomplete();
	};

	$effect(() => {
		// Track props.amount explicitly so this effect re-runs whenever the
		// amount changes — not only when animationName changes.
		const _target = props.amount;
		if (animationName === 'idle') normalUpdate();
	});
</script>

<SpineProvider key="tumble_win" width={props.width}>
	<SpineTrack
		trackIndex={0}
		{animationName}
		listener={{
			complete: () => {
				if (animationName === 'explosion') props.oncomplete();
			},
			event: (_, event) => {
				if (event.data?.name === 'update_text') {
					amount.set(props.amount);
				}
			},
		}}
	/>
	<SpineSlot slotName="slot_win">
		<ResponsiveBitmapText
			anchor={0.5}
			style={{
				fontFamily: FONT_FAMILY,
				fontSize: 0.65 * SYMBOL_HEIGHT,
			}}
			text={bookEventAmountToCurrencyString(amount.current)}
			maxWidth={props.width}
			tint={0x33ee88}
		/>
	</SpineSlot>
	<!-- <SpineSlot slotName="slot_win_add">
		<ResponsiveBitmapText
			alpha={alphaAmount}
			text={$formatAmount({ amount: $getRealWin($countUpAmount), numberingSystem: 'latn'})}
			maxWidth={width}
		/>
	</SpineSlot> -->
</SpineProvider>
