<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Graphics, Container } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// ── Configuration ──────────────────────────────────────
	const SNOWFLAKE_COUNT = 25;
	const MIN_RADIUS = 3;
	const MAX_RADIUS = 7;
	const MIN_ALPHA = 0.12;
	const MAX_ALPHA = 0.3;
	const MIN_SPEED = 0.15; // px per frame (vertical)
	const MAX_SPEED = 0.45;
	const HORIZONTAL_DRIFT = 0.3; // max horizontal sine amplitude in px/frame
	const DRIFT_FREQUENCY_MIN = 0.002; // sine frequency (lower = slower sway)
	const DRIFT_FREQUENCY_MAX = 0.006;
	const BRANCH_COUNT = 6; // six-fold symmetry
	const BRANCH_RATIO = 0.35; // where side branches sprout (0-1 along main arm)
	const SIDE_ANGLE = Math.PI / 4; // angle of side branches off main arm

	// ── Snowflake state ────────────────────────────────────
	type Snowflake = {
		x: number;
		y: number;
		radius: number;
		alpha: number;
		speed: number;
		driftAmp: number;
		driftFreq: number;
		driftPhase: number;
		rotation: number;
		rotationSpeed: number;
		variant: number; // 0-2 visual variation
	};

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function createSnowflake(canvasW: number, canvasH: number, randomY = true): Snowflake {
		return {
			x: rand(0, canvasW),
			y: randomY ? rand(0, canvasH) : -rand(5, 30),
			radius: rand(MIN_RADIUS, MAX_RADIUS),
			alpha: rand(MIN_ALPHA, MAX_ALPHA),
			speed: rand(MIN_SPEED, MAX_SPEED),
			driftAmp: rand(HORIZONTAL_DRIFT * 0.3, HORIZONTAL_DRIFT),
			driftFreq: rand(DRIFT_FREQUENCY_MIN, DRIFT_FREQUENCY_MAX),
			driftPhase: rand(0, Math.PI * 2),
			rotation: rand(0, Math.PI * 2),
			rotationSpeed: rand(-0.003, 0.003),
			variant: Math.floor(rand(0, 3)),
		};
	}

	let snowflakes = $state<Snowflake[]>([]);
	let frameCount = $state(0);
	let raf: number;

	onMount(() => {
		// Seed initial snowflakes scattered across the canvas
		snowflakes = Array.from({ length: SNOWFLAKE_COUNT }, () =>
			createSnowflake(canvas.width, canvas.height, true),
		);

		const tick = () => {
			frameCount++;
			const w = canvas.width;
			const h = canvas.height;

			for (let i = 0; i < snowflakes.length; i++) {
				const s = snowflakes[i];
				// Fall downward
				s.y += s.speed;
				// Horizontal sine drift
				s.x += Math.sin(frameCount * s.driftFreq + s.driftPhase) * s.driftAmp;
				// Gentle rotation
				s.rotation += s.rotationSpeed;

				// Wrap: when below canvas, respawn at top
				if (s.y > h + 10) {
					s.x = rand(0, w);
					s.y = -rand(5, 30);
					s.radius = rand(MIN_RADIUS, MAX_RADIUS);
					s.alpha = rand(MIN_ALPHA, MAX_ALPHA);
					s.speed = rand(MIN_SPEED, MAX_SPEED);
				}
				// Wrap horizontal
				if (s.x < -10) s.x = w + 5;
				if (s.x > w + 10) s.x = -5;
			}

			// Trigger reactivity
			snowflakes = snowflakes;
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
	});
</script>

<Container zIndex={-1}>
	{#each snowflakes as flake, i (i)}
		<Graphics
			x={flake.x}
			y={flake.y}
			alpha={flake.alpha}
			rotation={flake.rotation}
			draw={(g) => {
				const r = flake.radius;
				const lineW = Math.max(0.6, r * 0.15);
				const sideLen = r * 0.35;

				g.setStrokeStyle({ width: lineW, color: 0xffffff, cap: 'round' });

				// Draw 6 main arms with side branches
				for (let b = 0; b < BRANCH_COUNT; b++) {
					const angle = (b / BRANCH_COUNT) * Math.PI * 2;
					const cosA = Math.cos(angle);
					const sinA = Math.sin(angle);

					// Main arm
					g.moveTo(0, 0);
					g.lineTo(cosA * r, sinA * r);

					// Side branches (variant controls style)
					const branchPoints =
						flake.variant === 0
							? [BRANCH_RATIO, BRANCH_RATIO * 1.8]
							: flake.variant === 1
								? [BRANCH_RATIO * 1.4]
								: [BRANCH_RATIO, BRANCH_RATIO * 1.4, BRANCH_RATIO * 1.9];

					for (const t of branchPoints) {
						const bx = cosA * r * t;
						const by = sinA * r * t;
						const len = sideLen * (1 - t * 0.3);

						// Two sub-branches at ±45° from main arm
						for (const sign of [-1, 1]) {
							const subAngle = angle + SIDE_ANGLE * sign;
							g.moveTo(bx, by);
							g.lineTo(bx + Math.cos(subAngle) * len, by + Math.sin(subAngle) * len);
						}
					}
				}
				g.stroke();

				// Tiny center dot
				g.circle(0, 0, lineW * 1.2);
				g.fill({ color: 0xffffff });
			}}
		/>
	{/each}
</Container>
