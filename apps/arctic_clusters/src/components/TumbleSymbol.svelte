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
	// symbolScale is a plain $state number animated via RAF — already reactive
	const currentScale = $derived(props.tumbleSymbol.symbolScale);
	// Map internal states to valid SymbolState for rendering
	const isHidden = $derived(props.tumbleSymbol.symbolState === 'vanished');

	// Fire the onvanish callback when this symbol transitions to 'vanished'.
	// $effect runs after Svelte commits DOM changes, so the visual disappear
	// has already happened by the time the callback executes — making it
	// truly event-driven rather than timer-based.
	$effect(() => {
		if (isHidden) {
			props.tumbleSymbol.onvanish?.();
		}
	});

	const symbolInfo = $derived(
		isHidden
			? null
			: getSymbolInfo({
					rawSymbol: props.tumbleSymbol.rawSymbol,
					state: props.tumbleSymbol.symbolState,
				}),
	);
</script>

{#if !isHidden && symbolInfo}
	<SymbolWrap
		x={getSymbolXDynamic(props.reelIndex, symbolWidth)}
		y={scaledY}
		scale={currentScale}
		animating={symbolInfo.type === 'spine' || symbolInfo.type === 'spriteSheet' || currentScale !== 1}
	>
		<Symbol
			state={props.tumbleSymbol.symbolState}
			rawSymbol={props.tumbleSymbol.rawSymbol}
			oncomplete={props.tumbleSymbol.oncomplete}
		/>
	</SymbolWrap>
{/if}
