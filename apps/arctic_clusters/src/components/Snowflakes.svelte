<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Graphics, Container } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// ── Configuration ──────────────────────────────────────
	const SNOWFLAKE_COUNT = 50;
	const MIN_RADIUS = 1;
	const MAX_RADIUS = 3.5;
	const MIN_ALPHA = 0.15;
	const MAX_ALPHA = 0.5;
	const MIN_SPEED = 0.2;
	const MAX_SPEED = 0.6;
	const HORIZONTAL_DRIFT = 0.2;
	const DRIFT_FREQUENCY_MIN = 0.002;
	const DRIFT_FREQUENCY_MAX = 0.006;

	// ── Snowflake state ────────────────────────────────────
	type Snowflake = {
		x: number;
		y: number;
		radius: number;
		alpha: number;
		baseAlpha: number;
		speed: number;
		baseSpeed: number;
		driftAmp: number;
		driftFreq: number;
		driftPhase: number;
		drift2Amp: number;
		drift2Freq: number;
		drift2Phase: number;
		depth: number;
		shimmerFreq: number;
		shimmerPhase: number;
		scaleX: number; // slight squash/stretch
		scaleY: number;
		rotation: number; // orient the squash randomly
	};

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function createSnowflake(canvasW: number, canvasH: number, randomY = true): Snowflake {
		const depth = Math.random();
		const radius = MIN_RADIUS + depth * (MAX_RADIUS - MIN_RADIUS);
		const baseAlpha = MIN_ALPHA + depth * (MAX_ALPHA - MIN_ALPHA);
		const baseSpeed = MIN_SPEED + depth * (MAX_SPEED - MIN_SPEED);

		return {
			x: rand(0, canvasW),
			y: randomY ? rand(0, canvasH) : -rand(5, 30),
			radius,
			baseAlpha,
			alpha: baseAlpha,
			speed: baseSpeed,
			baseSpeed,
			driftAmp: rand(HORIZONTAL_DRIFT * 0.3, HORIZONTAL_DRIFT),
			driftFreq: rand(DRIFT_FREQUENCY_MIN, DRIFT_FREQUENCY_MAX),
			driftPhase: rand(0, Math.PI * 2),
			drift2Amp: rand(HORIZONTAL_DRIFT * 0.1, HORIZONTAL_DRIFT * 0.3),
			drift2Freq: rand(DRIFT_FREQUENCY_MAX, DRIFT_FREQUENCY_MAX * 2),
			drift2Phase: rand(0, Math.PI * 2),
			depth,
			shimmerFreq: rand(0.008, 0.02),
			shimmerPhase: rand(0, Math.PI * 2),
			scaleX: rand(0.7, 1.0),
			scaleY: rand(0.7, 1.0),
			rotation: rand(0, Math.PI * 2),
		};
	}

	// ── Shooting star ─────────────────────────────────────
	const STAR_MIN_INTERVAL = 480; // ~8s at 60fps
	const STAR_MAX_INTERVAL = 1200; // ~20s
	const STAR_SPEED = 4.5; // px per frame
	const STAR_TAIL_LENGTH = 120; // px – long streak
	const STAR_LIFE_FRAMES = 100;

	type ShootingStar = {
		x: number;
		y: number;
		vx: number;
		vy: number;
		alpha: number;
		age: number;
		life: number;
		angle: number;
	};

	let shootingStar = $state<ShootingStar | null>(null);
	let nextStarIn = $state(Math.floor(rand(STAR_MIN_INTERVAL, STAR_MAX_INTERVAL)));

	function spawnShootingStar(w: number, h: number) {
		// All variants start in the top 10% of the screen.
		// Angles are kept shallow enough that no star crosses the bottom 50%:
		// max vy = sin(angle) * STAR_SPEED * 1.2.  With life=100 frames and
		// start y ≤ h*0.10, we need vy*life ≤ h*0.40  →  vy ≤ h*0.004.
		// At h=800: vy ≤ 3.2.  sin⁻¹(3.2/5.4) ≈ 36° → cap sine component to 0.35.
		// Angles measured from +X axis: ~15-20° below horizontal gives sin≈0.26-0.34.
		const variant = Math.floor(Math.random() * 4);
		const speed = rand(STAR_SPEED * 0.85, STAR_SPEED * 1.2);
		let x: number, y: number, angle: number;

		switch (variant) {
			case 0: // top-right → bottom-left, shallow
				x = rand(w * 0.5, w + 40);
				y = rand(-20, h * 0.10);
				angle = rand(Math.PI * 0.58, Math.PI * 0.64); // ~104-115° (sin≤0.31)
				break;
			case 1: // top-left → bottom-right, shallow
				x = rand(-40, w * 0.4);
				y = rand(-20, h * 0.10);
				angle = rand(Math.PI * 0.36, Math.PI * 0.42); // ~65-76° (sin≤0.31)
				break;
			case 2: // right → left, nearly horizontal
				x = rand(w * 0.6, w + 30);
				y = rand(-20, h * 0.10);
				angle = rand(Math.PI * 0.55, Math.PI * 0.60); // ~99-108° (sin≤0.28)
				break;
			default: // left → right, nearly horizontal
				x = rand(-30, w * 0.35);
				y = rand(-20, h * 0.10);
				angle = rand(Math.PI * 0.40, Math.PI * 0.45); // ~72-81° (sin≤0.28)
				break;
		}

		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			alpha: 0,
			age: 0,
			life: STAR_LIFE_FRAMES,
			angle,
		};
	}
	let snowflakes = $state<Snowflake[]>([]);
	let frameCount = $state(0);
	let raf: number;

	onMount(() => {
		snowflakes = Array.from({ length: SNOWFLAKE_COUNT }, () =>
			createSnowflake(canvas.width, canvas.height, true),
		);

		const tick = () => {
			frameCount++;
			const w = canvas.width;
			const h = canvas.height;

			for (let i = 0; i < snowflakes.length; i++) {
				const s = snowflakes[i];

				// Gentle speed variation
				s.speed += rand(-0.004, 0.004);
				s.speed = Math.max(s.baseSpeed * 0.7, Math.min(s.baseSpeed * 1.3, s.speed));

				s.y += s.speed;

				// Dual-sine drift for organic movement
				s.x += Math.sin(frameCount * s.driftFreq + s.driftPhase) * s.driftAmp
					  + Math.sin(frameCount * s.drift2Freq + s.drift2Phase) * s.drift2Amp;

				// Subtle alpha shimmer
				s.alpha = s.baseAlpha + Math.sin(frameCount * s.shimmerFreq + s.shimmerPhase) * 0.04;

				// Wrap vertical
				if (s.y > h + 10) {
					const depth = Math.random();
					s.x = rand(0, w);
					s.y = -rand(5, 30);
					s.depth = depth;
					s.radius = MIN_RADIUS + depth * (MAX_RADIUS - MIN_RADIUS);
					s.baseAlpha = MIN_ALPHA + depth * (MAX_ALPHA - MIN_ALPHA);
					s.baseSpeed = MIN_SPEED + depth * (MAX_SPEED - MIN_SPEED);
					s.speed = s.baseSpeed;
				}
				// Wrap horizontal
				if (s.x < -10) s.x = w + 5;
				if (s.x > w + 10) s.x = -5;
			}

			snowflakes = snowflakes;

			// ── Shooting star tick ──
			if (shootingStar) {
				const ss = shootingStar;
				ss.age++;
				ss.x += ss.vx;
				ss.y += ss.vy;
				// Fade in quickly, hold, fade out
				const fadeIn = 8;
				const fadeOut = ss.life * 0.3;
				if (ss.age < fadeIn) {
					ss.alpha = (ss.age / fadeIn) * 0.7;
				} else if (ss.age > ss.life - fadeOut) {
					ss.alpha = ((ss.life - ss.age) / fadeOut) * 0.7;
				} else {
					ss.alpha = 0.7;
				}
				if (ss.age >= ss.life) {
					shootingStar = null;
					nextStarIn = Math.floor(rand(STAR_MIN_INTERVAL, STAR_MAX_INTERVAL));
				} else {
					shootingStar = { ...ss }; // trigger reactivity
				}
			} else {
				nextStarIn--;
				if (nextStarIn <= 0) {
					shootingStar = spawnShootingStar(w, h);
				}
			}

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
			scale={{ x: flake.scaleX, y: flake.scaleY }}
			draw={(g) => {
				const r = flake.radius;
				// Soft circle with a lighter core for a gentle glow look
				g.circle(0, 0, r);
				g.fill({ color: 0xffffff });
				g.circle(0, 0, r * 0.5);
				g.fill({ color: 0xffffff });
			}}
		/>
	{/each}

	<!-- Shooting star streak -->
	{#if shootingStar && shootingStar.alpha > 0}
		<Graphics
			x={shootingStar.x}
			y={shootingStar.y}
			alpha={shootingStar.alpha}
			rotation={shootingStar.angle}
			draw={(g) => {
				// Continuous tapered streak: thin bright line fading into nothing
				const segs = 20;
				for (let s = 0; s < segs; s++) {
					const t0 = s / segs;
					const t1 = (s + 1) / segs;
					const x0 = -STAR_TAIL_LENGTH * t0;
					const x1 = -STAR_TAIL_LENGTH * t1;
					const w0 = 1.4 * (1 - t0 * 0.85); // taper from 1.4 → thin
					const w1 = 1.4 * (1 - t1 * 0.85);
					const a = (1 - t0) * (1 - t0); // quadratic falloff

					g.moveTo(x0, -w0);
					g.lineTo(x1, -w1);
					g.lineTo(x1, w1);
					g.lineTo(x0, w0);
					g.closePath();
					g.fill({ color: 0xffffff, alpha: a });
				}

				// Bright head glow
				g.circle(0, 0, 2);
				g.fill({ color: 0xffffff });
				g.circle(0, 0, 4);
				g.fill({ color: 0xffffff, alpha: 0.15 });
			}}
		/>
	{/if}
</Container>
