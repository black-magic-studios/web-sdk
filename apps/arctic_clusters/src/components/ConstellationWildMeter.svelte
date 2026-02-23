<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Container, Graphics, Text } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { stateGame } from '../game/stateGame.svelte';

	const context = getContext();
	const canvas = $derived(context.stateLayoutDerived.canvasSizes());
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
	const isStacked = $derived(context.stateLayoutDerived.isStacked());

	// ── Wild count ─────────────────────────────────────────
	const isWildRelease = $derived(stateGame.isWildRelease);
	const sessionTotal = $derived(stateGame.auroraWildsSessionTotal);
	const remaining = $derived(stateGame.wildReleaseRemaining);
	const totalPlaced = $derived(stateGame.auroraWildPositions.length);

	// Always use sessionTotal — during wild release, sessionTotal is decremented
	// directly by the auroraWildPlace handler so the constellation counts down smoothly
	const count = $derived(sessionTotal);
	const visible = $derived(
		stateGame.spinActive && (isWildRelease || sessionTotal > 0 || totalPlaced > 0),
	);

	const MAX_WILDS = 49;
	const LINE_ANIM_MS = 1200;

	// ── Positioning — right side of board ──────────────────
	const meterSize = $derived(isStacked ? canvas.width * 0.22 : canvas.width * 0.18);
	const meterX = $derived(
		boardLayout.x + boardLayout.width * 0.5 + (isStacked ? meterSize * 0.05 : meterSize * 0.15),
	);
	const meterY = $derived(boardLayout.y - boardLayout.height * 0.5 + meterSize * 0.1);

	// ── Star geometry ─────────────────────────────────────
	// Builds an 8-pointed star with 49 line segments in 5 phases:
	//   Phase 1 (0-15):  Outer perimeter  — 8 tip→notch + 8 notch→tip
	//   Phase 2 (16-23): Radial spokes    — each tip → inner mid-point
	//   Phase 3 (24-31): Inner ring       — connecting mid-points
	//   Phase 4 (32-47): Faceted detail   — each notch → two adjacent mids
	//   Phase 5 (48):    Center glow      — final completion marker

	type Pt = { x: number; y: number };
	type Seg = { from: Pt; to: Pt };

	function buildGeometry(cx: number, cy: number, size: number) {
		const outerR = size * 0.46;
		const notchR = size * 0.18;
		const midR = size * 0.30;

		const tips: Pt[] = [];
		const notches: Pt[] = [];
		const mids: Pt[] = [];

		for (let i = 0; i < 8; i++) {
			const tipA = -Math.PI / 2 + i * (Math.PI / 4);
			const notchA = tipA + Math.PI / 8;
			tips.push({ x: cx + outerR * Math.cos(tipA), y: cy + outerR * Math.sin(tipA) });
			notches.push({ x: cx + notchR * Math.cos(notchA), y: cy + notchR * Math.sin(notchA) });
			mids.push({ x: cx + midR * Math.cos(tipA), y: cy + midR * Math.sin(tipA) });
		}

		const center: Pt = { x: cx, y: cy };
		const segs: Seg[] = [];

		// Phase 1: Outer perimeter (16 segs)
		for (let i = 0; i < 8; i++) {
			segs.push({ from: tips[i], to: notches[i] });
			segs.push({ from: notches[i], to: tips[(i + 1) % 8] });
		}

		// Phase 2: Radial spokes (8 segs)
		for (let i = 0; i < 8; i++) {
			segs.push({ from: tips[i], to: mids[i] });
		}

		// Phase 3: Inner ring (8 segs)
		for (let i = 0; i < 8; i++) {
			segs.push({ from: mids[i], to: mids[(i + 1) % 8] });
		}

		// Phase 4: Notch-to-mid faceted detail (16 segs)
		for (let i = 0; i < 8; i++) {
			segs.push({ from: notches[i], to: mids[i] });
			segs.push({ from: notches[i], to: mids[(i + 1) % 8] });
		}

		// Phase 5: Center marker (1 seg — special)
		segs.push({ from: center, to: center });

		return { segs, tips, notches, mids, center };
	}

	// ── Visual constants ──────────────────────────────────
	const LINE_W = 1.5;
	const GHOST_OUTER_ALPHA = 0.14;
	const GHOST_INNER_ALPHA = 0.06;
	const ACTIVE_COLOR = 0xc8e0ff;
	const GLOW_COLOR = 0x88aaee;
	const GHOST_COLOR = 0x4466aa;

	// ── Twinkle ───────────────────────────────────────────
	let frameCount = $state(0);
	let raf: number;

	onMount(() => {
		const tick = () => {
			frameCount++;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	});
	onDestroy(() => cancelAnimationFrame(raf));

	// ── Segment activation timing ─────────────────────────
	// During wild release the count goes DOWN (remaining decrements as wilds are placed).
	// We track the "display count" which can go up or down, and animate accordingly.
	let prevCount = 0;
	let segActivationTime: number[] = new Array(MAX_WILDS).fill(0);
	// segDeactivationTime tracks when a segment starts fading OUT (for decrement)
	let segDeactivationTime: number[] = new Array(MAX_WILDS).fill(0);
	const activeCount = $derived(Math.min(count, MAX_WILDS));

	$effect(() => {
		const now = performance.now();
		console.log(`[ConstellationMeter] $effect: activeCount=${activeCount}, prevCount=${prevCount}, sessionTotal=${stateGame.auroraWildsSessionTotal}, isWildRelease=${stateGame.isWildRelease}, remaining=${stateGame.wildReleaseRemaining}`);
		if (activeCount > prevCount) {
			// Building up — stagger new segments
			console.log(`[ConstellationMeter] INCREMENT: ${prevCount} → ${activeCount}`);
			for (let i = prevCount; i < activeCount; i++) {
				segActivationTime[i] = now + (i - prevCount) * (LINE_ANIM_MS * 0.7);
				segDeactivationTime[i] = 0; // clear any pending deactivation
			}
		} else if (activeCount < prevCount) {
			// Decrementing — remove segments from the top (highest index first)
			console.log(`[ConstellationMeter] DECREMENT: ${prevCount} → ${activeCount}`);
			for (let i = prevCount - 1; i >= activeCount; i--) {
				segDeactivationTime[i] = now + (prevCount - 1 - i) * (LINE_ANIM_MS * 0.4);
			}
		}
		prevCount = activeCount;
	});

	function segProgress(i: number): number {
		// Check deactivation first (segment fading out)
		const deact = segDeactivationTime[i];
		if (deact > 0) {
			const elapsed = performance.now() - deact;
			const fadeOut = 1 - Math.min(1, Math.max(0, elapsed / (LINE_ANIM_MS * 0.6)));
			if (fadeOut <= 0) return 0;
			return fadeOut;
		}

		if (i >= activeCount) return 0;
		const t = segActivationTime[i];
		if (t === 0) return 1; // was active before tracking started
		const elapsed = performance.now() - t;
		return Math.min(1, Math.max(0, elapsed / LINE_ANIM_MS));
	}
</script>

<FadeContainer show={visible}>
	<Container x={meterX} y={meterY} zIndex={5}>
		<!-- Title -->
		<Text
			x={meterSize * 0.5}
			y={-10}
			anchor={{ x: 0.5, y: 1 }}
			text={`WILDS: ${count}`}
			style={{
				fill: 0xc8e0ff,
				fontSize: Math.max(14, meterSize * 0.11),
				fontFamily: 'proxima-nova, Arial, sans-serif',
				fontWeight: '700',
				dropShadow: true,
				dropShadowColor: 0x000022,
				dropShadowBlur: 4,
				dropShadowDistance: 0,
			}}
		/>

		<!-- Star wireframe -->
		<Graphics
			draw={(g) => {
				// Touch reactive state so the draw re-runs every frame
				const _f = frameCount;
				const _c = activeCount;

				const size = meterSize;
				const cx = size * 0.5;
				const cy = size * 0.5;
				const { segs, tips, notches, mids, center } = buildGeometry(cx, cy, size);

				// ── 1. Ghost outline — always visible so the star shape is clear ──

				// Outer perimeter ghost (brighter)
				g.moveTo(tips[0].x, tips[0].y);
				for (let i = 0; i < 8; i++) {
					g.lineTo(tips[i].x, tips[i].y);
					g.lineTo(notches[i].x, notches[i].y);
				}
				g.lineTo(tips[0].x, tips[0].y);
				g.stroke({ color: GHOST_COLOR, width: LINE_W * 0.5, alpha: GHOST_OUTER_ALPHA });

				// Inner detail ghost (dimmer)
				for (let i = 0; i < 8; i++) {
					// Radials
					g.moveTo(tips[i].x, tips[i].y);
					g.lineTo(mids[i].x, mids[i].y);
					// Inner ring
					g.moveTo(mids[i].x, mids[i].y);
					g.lineTo(mids[(i + 1) % 8].x, mids[(i + 1) % 8].y);
					// Notch connections
					g.moveTo(notches[i].x, notches[i].y);
					g.lineTo(mids[i].x, mids[i].y);
					g.moveTo(notches[i].x, notches[i].y);
					g.lineTo(mids[(i + 1) % 8].x, mids[(i + 1) % 8].y);
				}
				g.stroke({ color: GHOST_COLOR, width: LINE_W * 0.35, alpha: GHOST_INNER_ALPHA });

				// Ghost dots at key vertices
				for (const pt of [...tips, ...notches, ...mids]) {
					g.circle(pt.x, pt.y, 1.2);
				}
				g.fill({ color: GHOST_COLOR, alpha: GHOST_OUTER_ALPHA * 0.8 });

				// ── 2. Active segments — batch completed, animate leading edges ──

				const breathe = 0.82 + 0.18 * Math.sin(_f * 0.02);

				// Separate completed segments from animating ones
				// Also include deactivating segments (fading out during wild release)
				const completedSegs: Seg[] = [];
				const animatingSegs: { seg: Seg; p: number }[] = [];

				for (let i = 0; i < 48; i++) {
					const p = segProgress(i);
					if (p <= 0) continue;
					if (p >= 1) {
						completedSegs.push(segs[i]);
					} else {
						animatingSegs.push({ seg: segs[i], p });
					}
				}

				// Completed — glow layer (one batch stroke)
				if (completedSegs.length > 0) {
					for (const s of completedSegs) {
						g.moveTo(s.from.x, s.from.y);
						g.lineTo(s.to.x, s.to.y);
					}
					g.stroke({ color: GLOW_COLOR, width: LINE_W * 3.5, alpha: breathe * 0.10 });

					// Completed — core layer (one batch stroke)
					for (const s of completedSegs) {
						g.moveTo(s.from.x, s.from.y);
						g.lineTo(s.to.x, s.to.y);
					}
					g.stroke({ color: ACTIVE_COLOR, width: LINE_W, alpha: breathe * 0.65 });
				}

				// Animating — individual strokes for per-segment progress
				for (const { seg, p } of animatingSegs) {
					const toX = seg.from.x + (seg.to.x - seg.from.x) * p;
					const toY = seg.from.y + (seg.to.y - seg.from.y) * p;

					// Glow
					g.moveTo(seg.from.x, seg.from.y);
					g.lineTo(toX, toY);
					g.stroke({ color: GLOW_COLOR, width: LINE_W * 3.5, alpha: p * 0.10 });

					// Core
					g.moveTo(seg.from.x, seg.from.y);
					g.lineTo(toX, toY);
					g.stroke({ color: ACTIVE_COLOR, width: LINE_W, alpha: p * 0.65 });
				}

				// ── 3. Vertex dots on all visible segment endpoints ──
				const allVisible = [...completedSegs, ...animatingSegs.map(a => a.seg)];
				if (allVisible.length > 0) {
					// Glow halo pass
					for (const s of allVisible) {
						g.circle(s.to.x, s.to.y, 3.5);
					}
					g.fill({ color: ACTIVE_COLOR, alpha: breathe * 0.10 });

					// Core dot pass
					for (const s of allVisible) {
						g.circle(s.to.x, s.to.y, 1.8);
					}
					g.fill({ color: 0xffffff, alpha: breathe * 0.55 });
				}

				// ── 4. Polaris 8-pointed mini-star at the top tip ──
				{
					const pt = tips[0];
					const p = segProgress(0);
					if (p <= 0) { /* skip */ } else {
					const a = breathe * p;

					// Outer halo
					g.circle(pt.x, pt.y, 8);
					g.fill({ color: 0xaaccff, alpha: a * 0.06 });
					g.circle(pt.x, pt.y, 5);
					g.fill({ color: 0xc8e0ff, alpha: a * 0.12 });

					// 8-pointed star polygon
					const outerS = 5;
					const innerS = 2;
					const step = Math.PI / 8;
					g.moveTo(pt.x, pt.y - outerS);
					for (let j = 0; j < 8; j++) {
						const oa = -Math.PI / 2 + j * 2 * step;
						const ia = oa + step;
						g.lineTo(pt.x + outerS * Math.cos(oa), pt.y + outerS * Math.sin(oa));
						g.lineTo(pt.x + innerS * Math.cos(ia), pt.y + innerS * Math.sin(ia));
					}
					g.closePath();
					g.fill({ color: 0xffffff, alpha: a * 0.9 });
					}
				}

				// ── 5. Center glow (segment 48 — final completion) ──
				{
					const p = segProgress(48);
					if (p > 0) {
					const pulse = 0.7 + 0.3 * Math.sin(_f * 0.04);
					g.circle(center.x, center.y, size * 0.06);
					g.fill({ color: 0xc8e0ff, alpha: p * pulse * 0.3 });
					g.circle(center.x, center.y, size * 0.025);
					g.fill({ color: 0xffffff, alpha: p * pulse * 0.8 });
					}
				}

				// ── 6. Pulse on the newest segment endpoint ──
				if (_c > 0 && _c <= 48) {
					const seg = segs[_c - 1];
					const pulse = 0.5 + 0.5 * Math.sin(_f * 0.08);
					g.circle(seg.to.x, seg.to.y, 6);
					g.fill({ color: 0x88ccff, alpha: pulse * 0.12 });
				}
			}}
		/>
	</Container>
</FadeContainer>
