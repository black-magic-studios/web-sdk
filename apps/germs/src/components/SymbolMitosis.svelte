<script lang="ts">
	import * as PIXI from 'pixi.js';
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import { getContextParent, getContextApp } from 'pixi-svelte';
	import { SYMBOL_SIZE } from '../game/constants';
	import { getSymbolInfo } from '../game/utils';

	type Props = {
		x?: number;
		y?: number;
		/** Static symbol info — provides the sprite assetKey + sizeRatios */
		symbolInfo: ReturnType<typeof getSymbolInfo>;
		oncomplete?: () => void;
	};

	const props: Props = $props();
	const parentContext = getContextParent();
	const appContext = getContextApp();

	// Tuning knobs
	const TARGET_GENERATIONS = 2; // 1 → 2 → 4
	const SPLIT_PAUSE_MS = 120;
	const INITIAL_SCALE_FACTOR = 0.85;
	const SHRINK_PER_GEN = 0.68;

	onMount(() => {
		const texture = appContext.stateApp.loadedAssets?.[
			props.symbolInfo.assetKey
		] as PIXI.Texture;

		if (!texture || texture === PIXI.Texture.EMPTY) {
			props.oncomplete?.();
			return;
		}

		// Root container positioned at the symbol's slot
		const root = new PIXI.Container();
		root.x = props.x ?? 0;
		root.y = props.y ?? 0;
		parentContext.parent.addChild(root);

		const tweenTargets: (PIXI.Sprite | PIXI.ObservablePoint)[] = [];

		// ── helpers ──────────────────────────────────────
		function scaleForGen(gen: number): number {
			return INITIAL_SCALE_FACTOR * Math.pow(SHRINK_PER_GEN, gen);
		}

		function gridPositions(count: number): { x: number; y: number }[] {
			if (count === 1) return [{ x: 0, y: 0 }];
			const cols = Math.ceil(Math.sqrt(count));
			const rows = Math.ceil(count / cols);
			const usable = SYMBOL_SIZE * 0.78;
			const cellW = usable / cols;
			const cellH = usable / rows;
			const out: { x: number; y: number }[] = [];
			for (let i = 0; i < count; i++) {
				const col = i % cols;
				const row = Math.floor(i / cols);
				out.push({
					x: -usable / 2 + cellW * (col + 0.5),
					y: -usable / 2 + cellH * (row + 0.5),
				});
			}
			return out;
		}

		function makeSprite(x: number, y: number, gen: number): PIXI.Sprite {
			const s = new PIXI.Sprite(texture);
			s.anchor.set(0.5);
			s.x = x;
			s.y = y;
			const sc = scaleForGen(gen);
			const wr = props.symbolInfo.sizeRatios.width;
			const hr = props.symbolInfo.sizeRatios.height;
			s.width = SYMBOL_SIZE * wr * sc;
			s.height = SYMBOL_SIZE * hr * sc;
			root.addChild(s);
			tweenTargets.push(s, s.scale);
			return s;
		}

		// ── run animation ────────────────────────────────
		let germs: PIXI.Sprite[] = [];
		let generation = 0;

		// Initial germ
		germs.push(makeSprite(0, 0, 0));

		function splitGeneration(): void {
			if (generation >= TARGET_GENERATIONS) {
				// Done — brief hold then complete
				gsap.delayedCall(0.15, () => props.oncomplete?.());
				return;
			}

			const current = [...germs];
			const nextGen = ++generation;
			const newGerms: PIXI.Sprite[] = [];
			let done = 0;

			for (const germ of current) {
				const bx = germ.scale.x;
				const by = germ.scale.y;

				// Squash/stretch wobble
				gsap.to(germ.scale, {
					x: bx * 1.45,
					y: by * 0.55,
					duration: 0.12,
					yoyo: true,
					repeat: 1,
					onComplete: () => {
						// Spawn child offset from parent
						const offX = (Math.random() - 0.5) * SYMBOL_SIZE * 0.25;
						const offY = (Math.random() - 0.5) * SYMBOL_SIZE * 0.25;
						const child = makeSprite(germ.x + offX, germ.y + offY, nextGen);
						child.scale.set(0);
						newGerms.push(child);

						// Shrink parent to new-gen size
						const ns = scaleForGen(nextGen);
						const wr = props.symbolInfo.sizeRatios.width;
						const hr = props.symbolInfo.sizeRatios.height;
						gsap.to(germ, {
							width: SYMBOL_SIZE * wr * ns,
							height: SYMBOL_SIZE * hr * ns,
							duration: 0.18,
						});

						// Pop-in child
						gsap.to(child, {
							width: SYMBOL_SIZE * wr * ns,
							height: SYMBOL_SIZE * hr * ns,
							duration: 0.25,
							ease: 'back.out(2)',
							onComplete: () => {
								done++;
								if (done === current.length) {
									germs = [...current, ...newGerms];
									settleAndContinue();
								}
							},
						});
					},
				});
			}
		}

		function settleAndContinue(): void {
			const positions = gridPositions(germs.length);
			let settled = 0;
			for (let i = 0; i < germs.length; i++) {
				gsap.to(germs[i], {
					x: positions[i].x,
					y: positions[i].y,
					duration: 0.35,
					ease: 'power2.out',
					onComplete: () => {
						settled++;
						if (settled === germs.length) {
							setTimeout(() => splitGeneration(), SPLIT_PAUSE_MS);
						}
					},
				});
			}
		}

		// Kick off first split after a brief beat
		setTimeout(() => splitGeneration(), 100);

		// ── cleanup ──────────────────────────────────────
		return () => {
			for (const t of tweenTargets) gsap.killTweensOf(t);
			gsap.killTweensOf(root);
			root.destroy({ children: true });
		};
	});
</script>
