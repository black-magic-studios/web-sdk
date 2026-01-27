<script lang="ts">
	import Symbol from './Symbol.svelte';
	import SymbolWrap from './SymbolWrap.svelte';
	import { getSymbolInfo, getSymbolXDynamic } from '../game/utils';
	import type { ReelSymbol } from '../game/stateGame.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT } from '../game/constants';

	type Props = {
		reelIndex: number;
		reelSymbol: ReelSymbol;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const scaledY = $derived(
		(props.reelSymbol.symbolY.current / SYMBOL_HEIGHT) * symbolHeight,
	);
	const symbolInfo = $derived(
		getSymbolInfo({ rawSymbol: props.reelSymbol.rawSymbol, state: props.reelSymbol.symbolState }),
	);
</script>

<SymbolWrap
	x={getSymbolXDynamic(props.reelIndex, symbolWidth)}
	y={scaledY}
	animating={symbolInfo.type === 'spine' &&
		(props.reelSymbol.symbolState === 'land' || props.reelSymbol.symbolState === 'win')}
>
	<Symbol
		state={props.reelSymbol.symbolState}
		rawSymbol={props.reelSymbol.rawSymbol}
		oncomplete={() => {
			if (props.reelSymbol.symbolState === 'win') props.reelSymbol.oncomplete();
			if (props.reelSymbol.symbolState === 'land') props.reelSymbol.symbolState = 'static';
		}}
	/>
</SymbolWrap>
