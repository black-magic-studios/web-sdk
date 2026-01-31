<script lang="ts">
	import Symbol from './Symbol.svelte';
	import SymbolWrap from './SymbolWrap.svelte';
	import { getSymbolXDynamic, getSymbolInfo } from '../game/utils';
	import type { TumbleSymbol } from '../game/stateGame.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT } from '../game/constants';

	type Props = {
		reelIndex: number;
		tumbleSymbol: TumbleSymbol;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const scaledY = $derived(
		(props.tumbleSymbol.symbolY.current / SYMBOL_HEIGHT) * symbolHeight,
	);
	const symbolInfo = $derived(
		getSymbolInfo({
			rawSymbol: props.tumbleSymbol.rawSymbol,
			state: props.tumbleSymbol.symbolState,
		}),
	);
</script>

<SymbolWrap
	x={getSymbolXDynamic(props.reelIndex, symbolWidth)}
	y={scaledY}
	animating={symbolInfo.type === 'spine' || symbolInfo.type === 'spriteSheet'}
>
	<Symbol
		state={props.tumbleSymbol.symbolState}
		rawSymbol={props.tumbleSymbol.rawSymbol}
		oncomplete={props.tumbleSymbol.oncomplete}
	/>
</SymbolWrap>
