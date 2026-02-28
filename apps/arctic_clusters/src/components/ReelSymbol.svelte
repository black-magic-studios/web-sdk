<script lang="ts">
	import { untrack } from 'svelte';
	import Symbol from './Symbol.svelte';
	import SymbolWrap from './SymbolWrap.svelte';
	import { Graphics } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';
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
	let winScale = $state(1);
	let winGlowAlpha = $state(0);
	const isAnimatingWin = $derived(winScale !== 1 || winGlowAlpha > 0);

	$effect(() => {
		const state = props.reelSymbol.symbolState;
		const info = symbolInfo;
		const anim = { rafId: 0, cancelled: false };

		untrack(() => {
			if (state === 'win') {
				runWinAnim(anim);
				// For static sprites (type='sprite'), the underlying Symbol component
				// won't fire oncomplete because symbolInfo doesn't change between
				// 'static' and 'win' states. Schedule handleComplete after the win
				// animation finishes so the event chain doesn't deadlock.
				if (info.type === 'sprite') {
					setTimeout(() => {
						if (!anim.cancelled) handleComplete();
					}, 650 / stateBetDerived.timeScale());
				}
			} else {
				winScale = 1;
				winGlowAlpha = 0;
			}
		});

		return () => {
			anim.cancelled = true;
			cancelAnimationFrame(anim.rafId);
			untrack(() => {
				winScale = 1;
				winGlowAlpha = 0;
			});
		};
	});

	function runWinAnim(anim: { rafId: number; cancelled: boolean }) {
		const startTime = performance.now();
		const ts = stateBetDerived.timeScale();
		// Scale keyframes (timings divided by timeScale for speed)
		const scaleKf = [
			{ t: 0, s: 1 },
			{ t: 150 / ts, s: 1.18 },
			{ t: 350 / ts, s: 1.18 },
			{ t: 500 / ts, s: 0.97 },
			{ t: 600 / ts, s: 1.0 },
		];
		// Glow alpha keyframes
		const glowKf = [
			{ t: 0, a: 0 },
			{ t: 80 / ts, a: 0.75 },
			{ t: 200 / ts, a: 0.45 },
			{ t: 600 / ts, a: 0.45 },
		];
		const totalDuration = 600 / ts;

		function lerpKf(kf: { t: number; [k: string]: number }[], elapsed: number, key: string): number {
			for (let i = 0; i < kf.length - 1; i++) {
				if (elapsed >= kf[i].t && elapsed <= kf[i + 1].t) {
					const frac = (elapsed - kf[i].t) / (kf[i + 1].t - kf[i].t);
					const smooth = frac * frac * (3 - 2 * frac);
					return kf[i][key] + (kf[i + 1][key] - kf[i][key]) * smooth;
				}
			}
			return kf[kf.length - 1][key];
		}

		function tick() {
			if (anim.cancelled) return;
			const elapsed = performance.now() - startTime;
			if (elapsed >= totalDuration) {
				winScale = 1;
				// Keep glow on while still in 'win' state — it will clear via $effect cleanup
				winGlowAlpha = 0.35;
				return;
			}
			winScale = lerpKf(scaleKf, elapsed, 's');
			winGlowAlpha = lerpKf(glowKf, elapsed, 'a');
			anim.rafId = requestAnimationFrame(tick);
		}
		anim.rafId = requestAnimationFrame(tick);
	}

	// Stable function reference
	function handleComplete() {
		if (props.reelSymbol.symbolState === 'win') props.reelSymbol.oncomplete();
		if (props.reelSymbol.symbolState === 'land') props.reelSymbol.symbolState = 'static';
	}

	// ── Win glow draw — thin glowing border ──
	const WIN_BORDER_COLOR = 0xcc88ff;
	const WIN_BORDER_OUTER_COLOR = 0x9944ff;
	const GAP_RATIO = 0.92;

	const drawWinGlow = (g: PIXI.Graphics) => {
		const w = symbolWidth * GAP_RATIO;
		const h = symbolHeight * GAP_RATIO;
		const cr = Math.round(w * 0.10);

		// Outer soft glow ring (wider, lower opacity — handled by parent alpha)
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.stroke({ color: WIN_BORDER_OUTER_COLOR, width: 5 });

		// Inner bright border
		g.roundRect(-w / 2, -h / 2, w, h, cr);
		g.stroke({ color: WIN_BORDER_COLOR, width: 2 });
	};
</script>

<SymbolWrap
	x={getSymbolXDynamic(props.reelIndex, symbolWidth)}
	y={scaledY}
	scale={winScale}
	animating={isAnimatingWin || ((symbolInfo.type === 'spine' || symbolInfo.type === 'spriteSheet') &&
		(props.reelSymbol.symbolState === 'land' || props.reelSymbol.symbolState === 'win'))}
>
	{#if winGlowAlpha > 0.01}
		<Graphics draw={drawWinGlow} alpha={winGlowAlpha} />
	{/if}
	<Symbol
		state={props.reelSymbol.symbolState}
		rawSymbol={props.reelSymbol.rawSymbol}
		oncomplete={handleComplete}
	/>
</SymbolWrap>
