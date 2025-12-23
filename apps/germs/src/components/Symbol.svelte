<script lang="ts">
	import SymbolSpine from './SymbolSpine.svelte';
	import SymbolSprite from './SymbolSprite.svelte';
	import { getSymbolInfo } from '../game/utils';
	import type { SymbolState, RawSymbol } from '../game/types';
	import { getContext } from '../game/context';
	import { BitmapText } from 'pixi-svelte';

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
	const symbolInfo = $derived(getSymbolInfo({ rawSymbol: props.rawSymbol, state: props.state }));
	const isSprite = $derived(symbolInfo.type === 'sprite');
    
    // EXTRACT DENSITY (Defaults to 1 if your backend doesn't send it yet)
    // You might need to add 'density' to your RawSymbol type definition later
    const density = $derived(props.rawSymbol.density || 1); 
</script>

{#if isSprite}
    <SymbolSprite 
        {symbolInfo} 
        x={props.x} 
        y={props.y} 
        density={density} 
        oncomplete={props.oncomplete} 
    />
{:else}
    <SymbolSpine
		loop={props.loop}
		{symbolInfo}
		x={props.x}
		y={props.y}
		showWinFrame={props.state === 'win' && !['S', 'M'].includes(props.rawSymbol.name)}
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

{#if props.rawSymbol.multiplier}
	<BitmapText
		anchor={0.5}
		x={props.x}
		y={props.y}
		text={`${props.rawSymbol.multiplier}X`}
		style={{
			fontFamily: 'gold',
			fontSize: 50,
		}}
	/>
{/if}

{#if density > 1}
    <BitmapText
		anchor={0.5}
		x={(props.x || 0) + 40} 
		y={(props.y || 0) - 40}
		text={`x${density}`}
		style={{
			fontFamily: 'gold', // Using your existing font
			fontSize: 30,
            align: 'right'
		}}
	/>
{/if}