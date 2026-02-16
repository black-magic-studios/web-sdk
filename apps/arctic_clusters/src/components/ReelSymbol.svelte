<script lang="ts">
	import { untrack } from 'svelte';
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

	// ── Win scale animation ──────────────────────────────
	// Driven by an $effect that watches symbolState only.
	// Uses untrack to avoid winScale writes re-triggering the effect.
	let winScale = $state(1);
	const isAnimatingWin = $derived(winScale !== 1);

	$effect(() => {
		const state = props.reelSymbol.symbolState;
		const anim = { rafId: 0, cancelled: false };

		untrack(() => {
			if (state === 'win') {
				runWinScale(anim);
			} else {
				winScale = 1;
			}
		});

		return () => {
			anim.cancelled = true;
			cancelAnimationFrame(anim.rafId);
			untrack(() => {
				winScale = 1;
			});
		};
	});

	function runWinScale(anim: { rafId: number; cancelled: boolean }) {
		const startTime = performance.now();
		const keyframes = [
			{ t: 0, s: 1 },
			{ t: 150, s: 1.18 },
			{ t: 350, s: 1.18 },
			{ t: 500, s: 0.97 },
			{ t: 600, s: 1.0 },
		];

		function tick() {
			if (anim.cancelled) return;
			const elapsed = performance.now() - startTime;
			if (elapsed >= 600) {
				winScale = 1;
				return;
			}
			for (let i = 0; i < keyframes.length - 1; i++) {
				const a = keyframes[i], b = keyframes[i + 1];
				if (elapsed >= a.t && elapsed <= b.t) {
					const frac = (elapsed - a.t) / (b.t - a.t);
					const smooth = frac * frac * (3 - 2 * frac);
					winScale = a.s + (b.s - a.s) * smooth;
					break;
				}
			}
			anim.rafId = requestAnimationFrame(tick);
		}
		anim.rafId = requestAnimationFrame(tick);
	}

	// Stable function reference — avoids SymbolSprite $effect re-triggering
	// on every winScale frame.
	function handleComplete() {
		if (props.reelSymbol.symbolState === 'win') props.reelSymbol.oncomplete();
		if (props.reelSymbol.symbolState === 'land') props.reelSymbol.symbolState = 'static';
	}
</script>

<SymbolWrap
	x={getSymbolXDynamic(props.reelIndex, symbolWidth)}
	y={scaledY}
	scale={winScale}
	animating={isAnimatingWin || ((symbolInfo.type === 'spine' || symbolInfo.type === 'spriteSheet') &&
		(props.reelSymbol.symbolState === 'land' || props.reelSymbol.symbolState === 'win'))}
>
	<Symbol
		state={props.reelSymbol.symbolState}
		rawSymbol={props.reelSymbol.rawSymbol}
		oncomplete={handleComplete}
	/>
</SymbolWrap>
