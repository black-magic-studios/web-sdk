<script lang="ts">
/**
 * ConstellationWildMeter — "Node Map" wild meter
 *
 * A reusable starlight node-map that draws glowing connections between
 * waypoints as `sessionTotal` increments.  Every graphic uses additive
 * blending so it interacts with the dark background like real light.
 *
 * Architecture:
 *   • `nodeCoordinates` — 49 waypoints forming an 8-pointed star
 *   • Lines use the "core + glow" method (wide blurred cyan + crisp thin white)
 *   • Nodes are twinkling stars (concentric halo + white center)
 *   • A leading spark travels along the newest connection
 *   • Wild-release mode rapidly pulses all active connections
 */
import { onDestroy } from 'svelte';
import { Container, Graphics, Text } from 'pixi-svelte';
import { FadeContainer } from 'components-pixi';

import { getContext } from '../game/context';
import { stateGame } from '../game/stateGame.svelte';
import { isFreegameType } from '../game/types';

const context = getContext();
const canvas = $derived(context.stateLayoutDerived.canvasSizes());
const boardLayout = $derived(context.stateGameDerived.boardLayout());
const isStacked = $derived(context.stateLayoutDerived.isStacked());

// ── Props from game state ──────────────────────────────
const isWildRelease = $derived(stateGame.isWildRelease);
const sessionTotal = $derived(stateGame.auroraWildsSessionTotal);
const totalPlaced = $derived(stateGame.auroraWildPositions.length);
const count = $derived(sessionTotal);

const visible = $derived(
isFreegameType(stateGame.gameType) && stateGame.spinActive && (isWildRelease || sessionTotal > 0 || totalPlaced > 0),
);

// ── Constants ──────────────────────────────────────────
const MAX_NODES = 49;
const LINE_ANIM_MS = 900;

// ── Positioning ────────────────────────────────────────
// Desktop/landscape: right side of board
// Mobile/portrait:   large, centered above the board filling the gap
const meterSize = $derived(isStacked ? canvas.width * 0.45 : canvas.width * 0.18);
const meterX = $derived(
isStacked
	? boardLayout.x - meterSize * 0.5
	: boardLayout.x + boardLayout.width * 0.5 + meterSize * 0.15,
);
const meterY = $derived(
isStacked
	? (boardLayout.y - boardLayout.height * 0.5) * 0.5 - meterSize * 0.5
	: boardLayout.y - boardLayout.height * 0.5 + meterSize * 0.1,
);

// ── Node Map — star geometry builder ───────────────────
// Builds 49 line segments in 5 phases and collects unique vertices.
type Pt = { x: number; y: number };
type Seg = { from: Pt; to: Pt };

function buildSegments(size: number): Seg[] {
const cx = size * 0.5, cy = size * 0.5;
const outerR = size * 0.46, notchR = size * 0.18, midR = size * 0.30;
const tips: Pt[] = [], notches: Pt[] = [], mids: Pt[] = [];

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
for (let i = 0; i < 8; i++) segs.push({ from: tips[i], to: mids[i] });
// Phase 3: Inner ring (8 segs)
for (let i = 0; i < 8; i++) segs.push({ from: mids[i], to: mids[(i + 1) % 8] });
// Phase 4: Notch-to-mid web (16 segs)
for (let i = 0; i < 8; i++) {
segs.push({ from: notches[i], to: mids[i] });
segs.push({ from: notches[i], to: mids[(i + 1) % 8] });
}
// Phase 5: Center completion marker (1 seg)
segs.push({ from: center, to: center });

return segs;
}

/** Unique vertex positions for drawing star-node dots */
function collectVertices(size: number): Pt[] {
const cx = size * 0.5, cy = size * 0.5;
const outerR = size * 0.46, notchR = size * 0.18, midR = size * 0.30;
const verts: Pt[] = [];

for (let i = 0; i < 8; i++) {
const tipA = -Math.PI / 2 + i * (Math.PI / 4);
const notchA = tipA + Math.PI / 8;
verts.push({ x: cx + outerR * Math.cos(tipA), y: cy + outerR * Math.sin(tipA) });
verts.push({ x: cx + notchR * Math.cos(notchA), y: cy + notchR * Math.sin(notchA) });
}
for (let i = 0; i < 8; i++) {
const tipA = -Math.PI / 2 + i * (Math.PI / 4);
verts.push({ x: cx + midR * Math.cos(tipA), y: cy + midR * Math.sin(tipA) });
}
verts.push({ x: cx, y: cy });
return verts;
}

// ── Visual palette ─────────────────────────────────────
const GLOW_W = 5;
const CORE_W = 1.5;
const GLOW_COLOR = 0x66ccff;   // icy cyan
const CORE_COLOR = 0xffffff;    // pure white
const GHOST_COLOR = 0x334466;   // dim blue for dormant topology
const STAR_HALO = 0x88ccff;
const SPARK_COLOR = 0xeeffff;

// ── Cached geometry (recomputed only when meterSize changes) ──
const cachedSegs = $derived(buildSegments(meterSize));
const cachedVerts = $derived(collectVertices(meterSize));

// ── Animation loop (only runs when visible) ────────────
let time = $state(0);
let raf: number;
let animRunning = false;
let animT0 = 0;

function startAnim() {
if (animRunning) return;
animRunning = true;
if (!animT0) animT0 = performance.now();
function tick() {
if (!animRunning) return;
time = (performance.now() - animT0) * 0.001;
raf = requestAnimationFrame(tick);
}
raf = requestAnimationFrame(tick);
}

function stopAnim() {
animRunning = false;
cancelAnimationFrame(raf);
}

$effect(() => {
if (visible) {
startAnim();
} else {
stopAnim();
}
});

onDestroy(() => stopAnim());

// ── Segment activation tracking ────────────────────────
let prevCount = 0;
let segActivation: number[] = new Array(MAX_NODES).fill(0);
let segDeactivation: number[] = new Array(MAX_NODES).fill(0);
const activeCount = $derived(Math.min(count, MAX_NODES));

$effect(() => {
const now = performance.now();
if (activeCount > prevCount) {
for (let i = prevCount; i < activeCount; i++) {
segActivation[i] = now + (i - prevCount) * (LINE_ANIM_MS * 0.65);
segDeactivation[i] = 0;
}
} else if (activeCount < prevCount) {
for (let i = prevCount - 1; i >= activeCount; i--) {
segDeactivation[i] = now + (prevCount - 1 - i) * (LINE_ANIM_MS * 0.35);
}
}
prevCount = activeCount;
});

function segProgress(i: number): number {
const deact = segDeactivation[i];
if (deact > 0) {
const elapsed = performance.now() - deact;
const fade = 1 - Math.min(1, Math.max(0, elapsed / (LINE_ANIM_MS * 0.5)));
return fade <= 0 ? 0 : fade;
}
if (i >= activeCount) return 0;
const t = segActivation[i];
if (t === 0) return 1;
const elapsed = performance.now() - t;
return Math.min(1, Math.max(0, elapsed / LINE_ANIM_MS));
}

// ── Twinkle — each vertex gets a unique phase from golden angle ──
function twinkle(vi: number, t: number): number {
const phase = (vi * 2.39996) % (Math.PI * 2);
const slow = Math.sin(t * 1.2 + phase) * 0.5 + 0.5;
const fast = Math.sin(t * 3.7 + phase * 1.5) * 0.5 + 0.5;
return 0.35 + 0.45 * slow + 0.2 * fast;
}

// ── Wild-release rapid pulse (~3 Hz triangle wave) ─────
function releasePulse(t: number): number {
return 0.5 + 0.5 * Math.abs(((t * 3.0) % 1.0) * 2 - 1);
}

// ── Helper: partition segments into completed/animating ─
function partitionSegs(): {
completed: Seg[];
animating: { seg: Seg; p: number }[];
} {
const segs = cachedSegs;
const completed: Seg[] = [];
const animating: { seg: Seg; p: number }[] = [];
for (let i = 0; i < 48; i++) {
const p = segProgress(i);
if (p <= 0) continue;
if (p >= 1) completed.push(segs[i]);
else animating.push({ seg: segs[i], p });
}
return { completed, animating };
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
fontFamily: 'Montserrat, Arial, sans-serif',
fontWeight: '700',
dropShadow: true,
dropShadowColor: 0x000022,
dropShadowBlur: 4,
dropShadowDistance: 0,
}}
/>

<!-- All graphics use additive blending for true-light compositing -->
<Container blendMode={'add'}>

<!-- All meter visuals batched into a single Graphics draw -->
<Graphics
draw={(g) => {
const _t = time;
const _c = activeCount;
const segs = cachedSegs;
const verts = cachedVerts;
const { completed, animating } = partitionSegs();
const pulse = isWildRelease ? releasePulse(_t) : 1.0;
const breathe = 0.85 + 0.15 * Math.sin(_t * 1.8);
const size = meterSize;

// ════════ Ghost topology ════════
for (const s of segs) {
g.moveTo(s.from.x, s.from.y);
g.lineTo(s.to.x, s.to.y);
}
g.stroke({ color: GHOST_COLOR, width: 0.5, alpha: 0.12 });

for (const v of verts) {
g.circle(v.x, v.y, 1.0);
}
g.fill({ color: GHOST_COLOR, alpha: 0.10 });

// ════════ Glow lines (wide icy cyan) ════════
if (completed.length > 0) {
for (const s of completed) {
g.moveTo(s.from.x, s.from.y);
g.lineTo(s.to.x, s.to.y);
}
g.stroke({ color: GLOW_COLOR, width: GLOW_W, alpha: breathe * pulse * 0.18 });
}

for (const { seg, p } of animating) {
const tx = seg.from.x + (seg.to.x - seg.from.x) * p;
const ty = seg.from.y + (seg.to.y - seg.from.y) * p;
g.moveTo(seg.from.x, seg.from.y);
g.lineTo(tx, ty);
g.stroke({ color: GLOW_COLOR, width: GLOW_W, alpha: p * pulse * 0.18 });
}

// ════════ Core lines (thin white) ════════
if (completed.length > 0) {
for (const s of completed) {
g.moveTo(s.from.x, s.from.y);
g.lineTo(s.to.x, s.to.y);
}
g.stroke({ color: CORE_COLOR, width: CORE_W, alpha: breathe * pulse * 0.7 });
}

for (const { seg, p } of animating) {
const tx = seg.from.x + (seg.to.x - seg.from.x) * p;
const ty = seg.from.y + (seg.to.y - seg.from.y) * p;
g.moveTo(seg.from.x, seg.from.y);
g.lineTo(tx, ty);
g.stroke({ color: CORE_COLOR, width: CORE_W, alpha: p * pulse * 0.7 });
}

// ════════ Star nodes (twinkling) ════════
const lit = new Set<string>();
for (let i = 0; i < 48; i++) {
const p = segProgress(i);
if (p <= 0) continue;
const s = segs[i];
lit.add(`${s.from.x.toFixed(1)},${s.from.y.toFixed(1)}`);
if (p >= 1) lit.add(`${s.to.x.toFixed(1)},${s.to.y.toFixed(1)}`);
}

for (let vi = 0; vi < verts.length; vi++) {
const v = verts[vi];
const key = `${v.x.toFixed(1)},${v.y.toFixed(1)}`;
const isLit = lit.has(key);
const tw = twinkle(vi, _t);

if (isLit) {
const a = tw * pulse;
g.circle(v.x, v.y, 6);
g.fill({ color: STAR_HALO, alpha: a * 0.08 });
g.circle(v.x, v.y, 4);
g.fill({ color: STAR_HALO, alpha: a * 0.14 });
g.circle(v.x, v.y, 2.0);
g.fill({ color: 0xffffff, alpha: a * 0.65 });
g.circle(v.x, v.y, 1.0);
g.fill({ color: 0xffffff, alpha: a * 0.9 });
} else {
g.circle(v.x, v.y, 1.2);
g.fill({ color: GHOST_COLOR, alpha: 0.06 + tw * 0.04 });
}
}

// ════════ Spark (leading edge of animating segments) ════════
for (let i = 0; i < 48; i++) {
const p = segProgress(i);
if (p <= 0 || p >= 1) continue;

const seg = segs[i];
const sx = seg.from.x + (seg.to.x - seg.from.x) * p;
const sy = seg.from.y + (seg.to.y - seg.from.y) * p;
const shimmer = 0.7 + 0.3 * Math.sin(_t * 12 + i);

g.circle(sx, sy, 8);
g.fill({ color: GLOW_COLOR, alpha: shimmer * 0.12 });
g.circle(sx, sy, 5);
g.fill({ color: SPARK_COLOR, alpha: shimmer * 0.25 });
g.circle(sx, sy, 2.5);
g.fill({ color: CORE_COLOR, alpha: shimmer * 0.85 });
}

// ════════ Polaris (north tip) ════════
const p0 = segProgress(0);
if (p0 > 0) {
const cx = size * 0.5;
const topY = size * 0.5 - size * 0.46;
const a = breathe * p0;

g.circle(cx, topY, 10);
g.fill({ color: 0xaaddff, alpha: a * 0.05 });
g.circle(cx, topY, 6);
g.fill({ color: 0xc8e0ff, alpha: a * 0.10 });

const outerS = 5, innerS = 2, step = Math.PI / 8;
g.moveTo(cx, topY - outerS);
for (let j = 0; j < 8; j++) {
const oa = -Math.PI / 2 + j * 2 * step;
const ia = oa + step;
g.lineTo(cx + outerS * Math.cos(oa), topY + outerS * Math.sin(oa));
g.lineTo(cx + innerS * Math.cos(ia), topY + innerS * Math.sin(ia));
}
g.closePath();
g.fill({ color: CORE_COLOR, alpha: a * 0.85 });
}

// ════════ Center completion glow ════════
const p48 = segProgress(48);
if (p48 > 0) {
const cx = size * 0.5, cy = size * 0.5;
const cpulse = 0.7 + 0.3 * Math.sin(_t * 2.5);

g.circle(cx, cy, size * 0.08);
g.fill({ color: GLOW_COLOR, alpha: p48 * cpulse * 0.10 });
g.circle(cx, cy, size * 0.05);
g.fill({ color: STAR_HALO, alpha: p48 * cpulse * 0.20 });
g.circle(cx, cy, size * 0.025);
g.fill({ color: CORE_COLOR, alpha: p48 * cpulse * 0.85 });
}
}}
/>
</Container>
</Container>
</FadeContainer>
