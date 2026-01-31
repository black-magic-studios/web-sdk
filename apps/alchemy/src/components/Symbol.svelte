<script lang="ts">
	import { Sprite } from 'pixi-svelte';
	// import { SpineProvider, SpineTrack } from 'pixi-svelte';

	import SymbolSpine from './SymbolSpine.svelte';
	import SymbolSprite from './SymbolSprite.svelte';
	import SymbolSpriteSheet from './SymbolSpriteSheet.svelte';
	import type { SymbolState, RawSymbol } from '../game/types';
	import { getSymbolInfo } from '../game/utils';
	import { getContext } from '../game/context';

	type Props = {
		x?: number;
		y?: number;
		state: SymbolState;
		rawSymbol: RawSymbol;
		oncomplete?: () => void;
		loop?: boolean;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolInfo = $derived(getSymbolInfo({ rawSymbol: props.rawSymbol, state: props.state }));
	const isSprite = $derived(symbolInfo.type === 'sprite');
	const isSpriteSheet = $derived(symbolInfo.type === 'spriteSheet');
	const showWinFrame = $derived(
		['win', 'postWinStatic', 'explosion'].includes(props.state) &&
			!['S'].includes(props.rawSymbol.name),
	);

	// Debug logging for H1 symbol
	$effect(() => {
		if (props.rawSymbol.name === 'H1') {
			console.log('[Symbol] H1 state changed:', {
				state: props.state,
				symbolInfoType: symbolInfo.type,
				symbolInfoAssetKey: symbolInfo.assetKey,
				isSprite,
				isSpriteSheet,
			});
		}
	});

	const WIN_FRAME_HEIGHT = symbolHeight * 1.3;
	// win_frame.png is 618x512; preserve aspect ratio.
	const WIN_FRAME_WIDTH = WIN_FRAME_HEIGHT * (618 / 512);
</script>

{#if isSprite}
	<SymbolSprite {symbolInfo} x={props.x} y={props.y} oncomplete={props.oncomplete} />
{:else if isSpriteSheet}
	{#key `${symbolInfo.assetKey}-${props.state}`}
		<SymbolSpriteSheet {symbolInfo} x={props.x} y={props.y} oncomplete={props.oncomplete} />
	{/key}
{:else}
	<SymbolSpine
		loop={props.loop}
		{symbolInfo}
		x={props.x}
		y={props.y}
		listener={{
			complete: props.oncomplete,
			event: (_, event) => {
				if (event.data?.name === 'wildExplode') {
					context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_wild_explode' });
				}
			},
		}}
	/>
{/if}

{#if showWinFrame}
	<!--
	<SpineProvider x={props.x} y={props.y} key="anticipation" width={SYMBOL_SIZE * 0.19}>
		<SpineTrack trackIndex={0} animationName={'payframe'} loop />
	</SpineProvider>
	-->
	<Sprite
		key="winFrame"
		x={props.x}
		y={props.y}
		anchor={0.5}
		width={WIN_FRAME_WIDTH}
		height={WIN_FRAME_HEIGHT}
	/>
{/if}
