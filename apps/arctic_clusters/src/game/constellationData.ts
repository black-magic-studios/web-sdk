// ────────────────────────────────────────────────────────
// Constellation definitions, demo-mode deterministic
// timeline scheduler, and state machine utilities.
// ────────────────────────────────────────────────────────

// ── Star / constellation types ──────────────────────────

export type ConstellationStar = {
	x: number; // 0-1 normalised within bounding box
	y: number;
	brightness: number; // 0-1
};

export type ConstellationDef = {
	id: ConstellationId;
	name: string;
	stars: ConstellationStar[];
	lines: [number, number][];
	renderWidth: number; // px at 1920-wide reference
	renderHeight: number;
};

// ── Demo constants ──────────────────────────────────────

export const DEMO = {
	CYCLE_SECONDS: 60,
	BLOCK_SECONDS: 12,
	FADE_IN: 1.0,
	HOLD: 9.5,
	FADE_OUT: 1.5,

	OPACITY_BASE: 0.30,
	OPACITY_PEAK: 0.45,
	OPACITY_MAX_COMBINED: 0.60,
	LINE_OPACITY_MULT: 0.85,
	BLUR_PX_MIN: 0.6,
	BLUR_PX_MAX: 1.0,
	TWINKLE_AMPLITUDE_MIN: 0.03,
	TWINKLE_AMPLITUDE_MAX: 0.06,

	POLARIS_ANCHOR: { x: 0.50, y: 0.22 },
	THETA_DEG_PER_SEC: 6,

	/** Base offsets from Polaris (before rotation) */
	OFFSETS: {
		cassiopeia: { dx: -0.24, dy: 0.10 },
		ursaMajor: { dx: 0.28, dy: -0.06 },
	} as Record<string, { dx: number; dy: number }>,

	/** Fixed positions for non-circumpolar constellations */
	FIXED_POSITIONS: {
		orion: { x: 0.62, y: 0.58 },
		coronaBorealis: { x: 0.78, y: 0.42 },
	} as Record<string, { x: number; y: number }>,

	/** Drift for non-circumpolar (px/s) */
	DRIFT: {
		orion: { vx: -2.5, vy: -1.5 },
		coronaBorealis: { vx: 1.8, vy: -2.0 },
	} as Record<string, { vx: number; vy: number }>,
} as const;

// ── Block schedule (deterministic order) ────────────────

export const BLOCK_ORDER = [
	'ursaMinor',
	'cassiopeia',
	'ursaMajor',
	'orion',
	'coronaBorealis',
] as const;

export type ConstellationId = (typeof BLOCK_ORDER)[number];

// ── Constellation star / line data ──────────────────────

export const CONSTELLATIONS: Record<ConstellationId, ConstellationDef> = {
	ursaMinor: {
		id: 'ursaMinor',
		name: 'Ursa Minor',
		stars: [
			{ x: 1.0, y: 0.0, brightness: 1.0 }, // Polaris
			{ x: 0.78, y: 0.15, brightness: 0.6 }, // Yildun
			{ x: 0.55, y: 0.28, brightness: 0.55 }, // Epsilon
			{ x: 0.38, y: 0.18, brightness: 0.6 }, // Zeta
			{ x: 0.2, y: 0.55, brightness: 0.5 }, // Eta
			{ x: 0.0, y: 0.25, brightness: 0.55 }, // Gamma
			{ x: 0.15, y: 0.0, brightness: 0.9 }, // Kochab
		],
		lines: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 5],
			[5, 6],
			[6, 3],
		],
		renderWidth: 190,
		renderHeight: 170,
	},
	cassiopeia: {
		id: 'cassiopeia',
		name: 'Cassiopeia',
		stars: [
			{ x: 0.0, y: 0.6, brightness: 0.9 }, // Schedar
			{ x: 0.25, y: 0.0, brightness: 1.0 }, // Caph
			{ x: 0.5, y: 0.55, brightness: 0.85 }, // Gamma Cas
			{ x: 0.75, y: 0.05, brightness: 0.9 }, // Ruchbah
			{ x: 1.0, y: 0.5, brightness: 0.8 }, // Segin
		],
		lines: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
		],
		renderWidth: 220,
		renderHeight: 130,
	},
	ursaMajor: {
		id: 'ursaMajor',
		name: 'Ursa Major',
		stars: [
			{ x: 0.75, y: 0.0, brightness: 1.0 }, // Dubhe
			{ x: 0.72, y: 0.38, brightness: 0.9 }, // Merak
			{ x: 0.5, y: 0.35, brightness: 0.85 }, // Phecda
			{ x: 0.52, y: 0.0, brightness: 0.75 }, // Megrez
			{ x: 0.35, y: 0.18, brightness: 0.85 }, // Alioth
			{ x: 0.18, y: 0.38, brightness: 0.9 }, // Mizar
			{ x: 0.0, y: 0.6, brightness: 0.8 }, // Alkaid
		],
		lines: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],
			[3, 4],
			[4, 5],
			[5, 6],
		],
		renderWidth: 280,
		renderHeight: 170,
	},
	orion: {
		id: 'orion',
		name: 'Orion',
		stars: [
			{ x: 0.2, y: 0.0, brightness: 1.0 }, // Betelgeuse
			{ x: 0.8, y: 0.05, brightness: 0.95 }, // Bellatrix
			{ x: 0.35, y: 0.45, brightness: 0.85 }, // Alnitak
			{ x: 0.5, y: 0.43, brightness: 0.9 }, // Alnilam
			{ x: 0.65, y: 0.41, brightness: 0.85 }, // Mintaka
			{ x: 0.25, y: 1.0, brightness: 0.8 }, // Saiph
			{ x: 0.75, y: 0.95, brightness: 1.0 }, // Rigel
		],
		lines: [
			[0, 2],
			[1, 4],
			[2, 3],
			[3, 4],
			[2, 5],
			[4, 6],
		],
		renderWidth: 240,
		renderHeight: 300,
	},
	coronaBorealis: {
		id: 'coronaBorealis',
		name: 'Corona Borealis',
		stars: [
			{ x: 0.0, y: 0.3, brightness: 0.7 },
			{ x: 0.12, y: 0.6, brightness: 0.8 },
			{ x: 0.3, y: 0.85, brightness: 0.9 },
			{ x: 0.5, y: 0.95, brightness: 0.85 },
			{ x: 0.68, y: 0.82, brightness: 1.0 }, // Alphekka/Gemma
			{ x: 0.85, y: 0.5, brightness: 0.8 },
			{ x: 0.95, y: 0.0, brightness: 0.7 },
		],
		lines: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 5],
			[5, 6],
		],
		renderWidth: 150,
		renderHeight: 120,
	},
};

// ── Scheduler functions ─────────────────────────────────

/** Which block (0-4) is active at a given elapsed time. */
export function getDemoBlock(tSeconds: number): number {
	const cycleT = tSeconds % DEMO.CYCLE_SECONDS;
	return Math.min(BLOCK_ORDER.length - 1, Math.floor(cycleT / DEMO.BLOCK_SECONDS));
}

/** Local time within the current 12s block (0 → BLOCK_SECONDS). */
export function getBlockLocalTime(tSeconds: number): number {
	const cycleT = tSeconds % DEMO.CYCLE_SECONDS;
	return cycleT - getDemoBlock(tSeconds) * DEMO.BLOCK_SECONDS;
}

/**
 * Fade envelope: returns alpha multiplier 0-1 based on local time.
 *   [0, FADE_IN)          → ramp up
 *   [FADE_IN, FADE_IN+HOLD) → 1.0
 *   [FADE_IN+HOLD, BLOCK_SECONDS] → ramp down
 */
export function easeInOutAlpha(localTime: number): number {
	if (localTime < 0) return 0;
	if (localTime < DEMO.FADE_IN) {
		return localTime / DEMO.FADE_IN;
	}
	const holdEnd = DEMO.FADE_IN + DEMO.HOLD;
	if (localTime < holdEnd) {
		return 1.0;
	}
	if (localTime >= DEMO.BLOCK_SECONDS) return 0;
	const fadeProgress = (localTime - holdEnd) / DEMO.FADE_OUT;
	return Math.max(0, 1.0 - fadeProgress);
}

/** Rotate an offset {dx,dy} around Polaris anchor by thetaDeg degrees. */
export function rotateAroundPolaris(
	offset: { dx: number; dy: number },
	thetaDeg: number,
): { x: number; y: number } {
	const rad = (thetaDeg * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return {
		x: DEMO.POLARIS_ANCHOR.x + offset.dx * cos - offset.dy * sin,
		y: DEMO.POLARIS_ANCHOR.y + offset.dx * sin + offset.dy * cos,
	};
}

/** Clamp alphas so their sum ≤ maxTotal. Scales proportionally. */
export function clampCombinedOpacity(alphas: number[], maxTotal: number): number[] {
	const sum = alphas.reduce((s, a) => s + a, 0);
	if (sum <= maxTotal) return alphas;
	const scale = maxTotal / sum;
	return alphas.map((a) => a * scale);
}

// ── Drawable config type ────────────────────────────────

export type DrawableConstellation = {
	id: ConstellationId;
	def: ConstellationDef;
	position: { x: number; y: number }; // normalised viewport coords
	rotation: number; // radians (circumpolar only)
	alpha: number; // final opacity after envelope + clamping
	blurPx: number;
	twinkleAmplitude: number;
};

/**
 * Deterministic per-frame state update.
 * Returns 0-2 drawable constellation configs (never more than 2).
 *
 * Integration: call every frame with elapsedTimeSeconds from session start.
 * Render in sky background layer, NOT attached to board container.
 */
export function updateConstellationState(elapsedTime: number): DrawableConstellation[] {
	const block = getDemoBlock(elapsedTime);
	const localT = getBlockLocalTime(elapsedTime);
	const thetaDeg = (elapsedTime * DEMO.THETA_DEG_PER_SEC) % 360;

	// Current block
	const currentId = BLOCK_ORDER[block];
	const currentEnvelope = easeInOutAlpha(localT);

	// Previous block — may still be fading out during overlap
	const prevBlock = (block - 1 + BLOCK_ORDER.length) % BLOCK_ORDER.length;
	const prevId = BLOCK_ORDER[prevBlock];
	const prevLocalT = localT + DEMO.BLOCK_SECONDS; // as if still in prev block's timeline
	const prevEnvelope = easeInOutAlpha(prevLocalT);

	// Build candidates
	const candidates: { id: ConstellationId; envelope: number }[] = [];
	if (currentEnvelope > 0.001) candidates.push({ id: currentId, envelope: currentEnvelope });
	if (prevEnvelope > 0.001 && prevId !== currentId) {
		candidates.push({ id: prevId, envelope: prevEnvelope });
	}

	// Map envelope to actual opacity and clamp combined
	const rawAlphas = candidates.map(
		(c) => DEMO.OPACITY_BASE + c.envelope * (DEMO.OPACITY_PEAK - DEMO.OPACITY_BASE),
	);
	const clamped = clampCombinedOpacity(rawAlphas, DEMO.OPACITY_MAX_COMBINED);

	const drawables: DrawableConstellation[] = [];

	for (let i = 0; i < candidates.length; i++) {
		const { id } = candidates[i];
		const alpha = clamped[i];
		if (alpha < 0.001) continue;

		const def = CONSTELLATIONS[id];
		const position = getConstellationPosition(id, elapsedTime, thetaDeg);
		const rotation = getConstellationRotation(id, thetaDeg);
		const blurPx = DEMO.BLUR_PX_MIN + (DEMO.BLUR_PX_MAX - DEMO.BLUR_PX_MIN) * 0.5;
		const twinkleAmplitude =
			DEMO.TWINKLE_AMPLITUDE_MIN +
			(DEMO.TWINKLE_AMPLITUDE_MAX - DEMO.TWINKLE_AMPLITUDE_MIN) * 0.5;

		drawables.push({ id, def, position, rotation, alpha, blurPx, twinkleAmplitude });
	}

	return drawables;
}

// ── Internal position / rotation helpers ────────────────

function getConstellationPosition(
	id: ConstellationId,
	elapsedTime: number,
	thetaDeg: number,
): { x: number; y: number } {
	// Ursa Minor: Polaris-anchored, slightly offset so dipper extends from anchor
	if (id === 'ursaMinor') {
		return { x: DEMO.POLARIS_ANCHOR.x - 0.08, y: DEMO.POLARIS_ANCHOR.y - 0.02 };
	}

	// Circumpolar: rotate offset around Polaris
	const offset = DEMO.OFFSETS[id];
	if (offset) {
		return rotateAroundPolaris(offset, thetaDeg);
	}

	// Fixed + drift (drift resets per cycle to prevent wandering)
	const fixed = DEMO.FIXED_POSITIONS[id];
	if (fixed) {
		const drift = DEMO.DRIFT[id];
		if (drift) {
			const cycleT = elapsedTime % DEMO.CYCLE_SECONDS;
			return {
				x: fixed.x + (drift.vx * cycleT) / 1920,
				y: fixed.y + (drift.vy * cycleT) / 1080,
			};
		}
		return fixed;
	}

	return { x: 0.5, y: 0.5 };
}

function getConstellationRotation(id: ConstellationId, thetaDeg: number): number {
	if (id === 'cassiopeia' || id === 'ursaMajor') {
		return (thetaDeg * Math.PI) / 180;
	}
	return 0;
}

// ── Seeded RNG (mulberry32) — used for twinkle offsets ──

export function createSeededRng(seed: number) {
	return function (): number {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
