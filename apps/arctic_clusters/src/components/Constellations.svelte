<script lang="ts">
	// ────────────────────────────────────────────────────────
	// Constellations — deterministic demo-mode sky renderer
	//
	// Uses a fixed 60s looping timeline to cycle through all
	// 5 Arctic constellations. Each frame calls
	// updateConstellationState(elapsedSeconds) which returns
	// 0-2 drawable configs. Rendering uses PixiJS Graphics.
	// ────────────────────────────────────────────────────────

	import { onMount, onDestroy } from 'svelte';
	import { Graphics, Container } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import {
		DEMO,
		CONSTELLATIONS,
		updateConstellationState,
		createSeededRng,
		type DrawableConstellation,
	} from '../game/constellationData';

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// ── Visual constants ───────────────────────────────────
	const STAR_CORE_RADIUS = 2.2;
	const STAR_GLOW_RADIUS = 4;
	const STAR_HALO_RADIUS = 7;
	const LINE_WIDTH = 1.0;

	// ── State ──────────────────────────────────────────────
	const sessionStartTime = performance.now();
	const rng = createSeededRng(42); // deterministic seed for twinkle phases

	// Pre-compute twinkle offsets per constellation (stable across frames)
	const twinklePhases: Record<string, number[]> = {};
	const twinkleSpeeds: Record<string, number[]> = {};
	for (const [id, def] of Object.entries(CONSTELLATIONS)) {
		twinklePhases[id] = def.stars.map(() => rng() * Math.PI * 2);
		twinkleSpeeds[id] = def.stars.map(
			() => 0.008 + rng() * 0.012, // range ~0.008-0.020
		);
	}

	let drawables = $state<DrawableConstellation[]>([]);
	let frameCount = $state(0);
	let raf: number;

	// ── RAF loop — call scheduler each frame ───────────────
	onMount(() => {
		const tick = () => {
			frameCount++;
			const elapsedS = (performance.now() - sessionStartTime) / 1000;
			drawables = updateConstellationState(elapsedS);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
	});

	// ── Per-star twinkle helper ────────────────────────────
	function getStarAlpha(
		constellationId: string,
		starIndex: number,
		brightness: number,
		twinkleAmplitude: number,
	): number {
		const phase = twinklePhases[constellationId]?.[starIndex] ?? 0;
		const speed = twinkleSpeeds[constellationId]?.[starIndex] ?? 0.01;
		const twinkle = 1.0 - twinkleAmplitude + twinkleAmplitude * Math.sin(frameCount * speed + phase);
		return brightness * twinkle;
	}
</script>

<Container zIndex={-1}>
	{#each drawables as d (d.id)}
		{@const w = d.def.renderWidth * (canvas.width / 1920)}
		{@const h = d.def.renderHeight * (canvas.height / 1080)}
		{@const px = d.position.x * canvas.width}
		{@const py = d.position.y * canvas.height}
		<Graphics
			x={px}
			y={py}
			alpha={d.alpha}
			rotation={d.rotation}
			pivot={{ x: w / 2, y: h / 2 }}
			draw={(g) => {
				// ── Lines ──
				for (const [a, b] of d.def.lines) {
					const sa = d.def.stars[a];
					const sb = d.def.stars[b];
					const alphaA = getStarAlpha(d.id, a, sa.brightness, d.twinkleAmplitude);
					const alphaB = getStarAlpha(d.id, b, sb.brightness, d.twinkleAmplitude);
					const lineAlpha = Math.min(alphaA, alphaB) * DEMO.LINE_OPACITY_MULT;
					if (lineAlpha <= 0) continue;

					g.moveTo(sa.x * w, sa.y * h);
					g.lineTo(sb.x * w, sb.y * h);
					g.stroke({ color: 0xc8d8ff, width: LINE_WIDTH, alpha: lineAlpha });
				}

				// ── Stars ──
				for (let i = 0; i < d.def.stars.length; i++) {
					const star = d.def.stars[i];
					const a = getStarAlpha(d.id, i, star.brightness, d.twinkleAmplitude);
					if (a <= 0) continue;

					const sx = star.x * w;
					const sy = star.y * h;
					const r = STAR_CORE_RADIUS * (0.6 + star.brightness * 0.4);

					// Outer halo (soft distance blur)
					g.circle(sx, sy, STAR_HALO_RADIUS * (0.7 + star.brightness * 0.3));
					g.fill({ color: 0xc8d8ff, alpha: a * 0.08 });

					// Glow
					g.circle(sx, sy, STAR_GLOW_RADIUS * (0.7 + star.brightness * 0.3));
					g.fill({ color: 0xd8e8ff, alpha: a * 0.2 });

					// Core
					g.circle(sx, sy, r);
					g.fill({ color: 0xffffff, alpha: a * 0.85 });

					// Bright center point
					g.circle(sx, sy, r * 0.35);
					g.fill({ color: 0xffffff, alpha: a * 0.95 });
				}
			}}
		/>
	{/each}
</Container>
