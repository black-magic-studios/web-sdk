<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Graphics, Container } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		/** zIndex layer: 'background' renders behind board, 'foreground' in front */
		layer?: 'background' | 'foreground';
	};

	const props: Props = $props();
	const layer = $derived(props.layer ?? 'background');

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// ── Configuration ──────────────────────────────────────
	const PARTICLE_COUNT = 8;
	const MIN_RADIUS = 1.2;
	const MAX_RADIUS = 3.0;
	const MIN_SPEED_X = 0.3;
	const MAX_SPEED_X = 0.9;
	const VERTICAL_DRIFT = 0.3;
	const DRIFT_FREQ_MIN = 0.003;
	const DRIFT_FREQ_MAX = 0.008;
	const MIN_ALPHA = 0.25;
	const MAX_ALPHA = 0.65;
	// Foreground particles are subtler — fewer, smaller, more transparent
	const FG_PARTICLE_COUNT = 3;
	const FG_MIN_RADIUS = 0.8;
	const FG_MAX_RADIUS = 2.0;
	const FG_MIN_ALPHA = 0.12;
	const FG_MAX_ALPHA = 0.35;

	// Aurora colours
	const AURORA_COLORS = [
		0x33ee88, // green
		0x22cc55, // deep green
		0x44ff99, // light green
		0x4466dd, // blue
		0x5577ee, // light blue
		0x9955ee, // purple
		0xaa66ff, // light purple
		0xee55aa, // pink
		0xff66bb, // light pink
		0xddcc33, // gold
		0x22dd77, // teal-green
		0x33bbcc, // teal
	];

	// ── Particle state ─────────────────────────────────────
	type AuroraParticle = {
		x: number;
		y: number;
		radius: number;
		color: number;
		alpha: number;
		baseAlpha: number;
		speedX: number;
		speedY: number;
		driftAmp: number;
		driftFreq: number;
		driftPhase: number;
		shimmerFreq: number;
		shimmerPhase: number;
		glowRadius: number;
	};

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function pickColor(): number {
		return AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)];
	}

	function createParticle(canvasW: number, canvasH: number, randomX = true): AuroraParticle {
		const isFg = layer === 'foreground';
		const radius = rand(
			isFg ? FG_MIN_RADIUS : MIN_RADIUS,
			isFg ? FG_MAX_RADIUS : MAX_RADIUS,
		);
		const baseAlpha = rand(
			isFg ? FG_MIN_ALPHA : MIN_ALPHA,
			isFg ? FG_MAX_ALPHA : MAX_ALPHA,
		);

		return {
			x: randomX ? rand(-canvasW * 0.1, canvasW * 0.6) : rand(-canvasW * 0.15, -10),
			y: rand(canvasH * 0.05, canvasH * 0.85),
			radius,
			color: pickColor(),
			baseAlpha,
			alpha: baseAlpha,
			speedX: rand(MIN_SPEED_X, MAX_SPEED_X),
			speedY: 0,
			driftAmp: rand(VERTICAL_DRIFT * 0.3, VERTICAL_DRIFT),
			driftFreq: rand(DRIFT_FREQ_MIN, DRIFT_FREQ_MAX),
			driftPhase: rand(0, Math.PI * 2),
			shimmerFreq: rand(0.01, 0.03),
			shimmerPhase: rand(0, Math.PI * 2),
			glowRadius: radius * rand(2.0, 3.5),
		};
	}

	let particles = $state<AuroraParticle[]>([]);
	let frameCount = $state(0);
	let raf: number;

	onMount(() => {
		const count = layer === 'foreground' ? FG_PARTICLE_COUNT : PARTICLE_COUNT;
		particles = Array.from({ length: count }, () =>
			createParticle(canvas.width, canvas.height, true),
		);

		const tick = () => {
			frameCount++;
			const w = canvas.width;
			const h = canvas.height;

			// Fade-out zone: last 25% of screen width
			const fadeStart = w * 0.70;
			const fadeEnd = w * 0.95;

			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];

				// Move right
				p.x += p.speedX;

				// Vertical sinusoidal drift
				p.speedY = Math.sin(frameCount * p.driftFreq + p.driftPhase) * p.driftAmp;
				p.y += p.speedY;

				// Alpha shimmer
				const shimmer = Math.sin(frameCount * p.shimmerFreq + p.shimmerPhase) * 0.08;

				// Fade out as particle approaches right edge
				if (p.x > fadeStart) {
					const fadeProgress = Math.min(1, (p.x - fadeStart) / (fadeEnd - fadeStart));
					p.alpha = p.baseAlpha * (1 - fadeProgress) + shimmer;
				} else {
					// Gentle fade-in from left edge
					const fadeInEnd = w * 0.08;
					if (p.x < fadeInEnd) {
						p.alpha = p.baseAlpha * Math.max(0, p.x / fadeInEnd) + shimmer;
					} else {
						p.alpha = p.baseAlpha + shimmer;
					}
				}

				p.alpha = Math.max(0, Math.min(1, p.alpha));

				// Reset when fully faded or past edge
				if (p.x > fadeEnd || p.alpha <= 0) {
					Object.assign(p, createParticle(w, h, false));
				}

				// Keep within vertical bounds
				if (p.y < h * 0.02) p.y = h * 0.02;
				if (p.y > h * 0.90) p.y = h * 0.90;
			}

			particles = particles;
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
	});
</script>

<Container zIndex={layer === 'foreground' ? 10 : -1}>
	<Graphics
		draw={(g) => {
			const _f = frameCount;
			for (const p of particles) {
				if (p.alpha <= 0) continue;
				// Soft glow halo
				g.circle(p.x, p.y, p.glowRadius);
				g.fill({ color: p.color, alpha: p.alpha * 0.2 });
				// Bright core
				g.circle(p.x, p.y, p.radius);
				g.fill({ color: p.color, alpha: p.alpha });
				g.circle(p.x, p.y, p.radius * 0.45);
				g.fill({ color: 0xffffff, alpha: p.alpha });
			}
		}}
	/>
</Container>
