<script lang="ts">
	/**
	 * MultiplierFlyOut - Read-only overlay that animates multiplier values
	 * flying from their cell positions toward the board center on wins.
	 *
	 * Subscribes to existing 'showClusterWinAmounts' event (no new emits).
	 * Also exposes window.__debugMultiplierFlyOut for dev testing.
	 */
	import { onMount, onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';

	import { BitmapText, Container } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';
	import { SECOND } from 'constants-shared/time';

	import BoardContainer from './BoardContainer.svelte';
	import { getSymbolXDynamic, getSymbolYDynamic } from '../game/utils';
	import { getContext } from '../game/context';

	type FlyOutItem = {
		id: number;
		mult: number;
		startX: number;
		startY: number;
		targetX: number;
		targetY: number;
		x: Tween<number>;
		y: Tween<number>;
		scale: Tween<number>;
		alpha: Tween<number>;
		complete: boolean;
	};

	const context = getContext();

	const symbolWidth = $derived(context.stateGameDerived.symbolWidth());
	const symbolHeight = $derived(context.stateGameDerived.symbolHeight());
	const symbolSize = $derived(context.stateGameDerived.symbolSize());
	const boardLayout = $derived(context.stateGameDerived.boardLayout());

	let flyOuts: FlyOutItem[] = $state([]);
	let idCounter = 0;

	// Compute board center as destination
	const getBoardCenter = () => ({
		x: boardLayout.width / 2,
		y: boardLayout.height / 2,
	});

	const triggerFlyOut = async (wins: Array<{ reel: number; row: number; mult: number }>) => {
		// Filter to only cells with multiplier > 1
		const cellsWithMult = wins.filter((w) => w.mult > 1);
		if (cellsWithMult.length === 0) return;

		const center = getBoardCenter();
		const duration = (SECOND * 0.8) / stateBetDerived.timeScale();

		// Create fly-out items for each winning cell with a multiplier
		const newFlyOuts: FlyOutItem[] = cellsWithMult.map((win) => {
			const startX = getSymbolXDynamic(win.reel, symbolWidth);
			const startY = getSymbolYDynamic(win.row, symbolHeight);

			return {
				id: idCounter++,
				mult: win.mult,
				startX,
				startY,
				targetX: center.x,
				targetY: center.y,
				x: new Tween(startX),
				y: new Tween(startY),
				scale: new Tween(1),
				alpha: new Tween(1),
				complete: false,
			};
		});

		flyOuts = [...flyOuts, ...newFlyOuts];

		// Animate each fly-out
		await Promise.all(
			newFlyOuts.map(async (item) => {
				// Pop out effect
				await item.scale.set(1.5, { duration: duration * 0.15 });

				// Fly to center while shrinking and fading
				await Promise.all([
					item.x.set(item.targetX, { duration: duration * 0.7 }),
					item.y.set(item.targetY, { duration: duration * 0.7 }),
					item.scale.set(0.5, { duration: duration * 0.7 }),
					item.alpha.set(0, { duration: duration * 0.7 }),
				]);

				item.complete = true;
			}),
		);

		// Clean up completed items
		flyOuts = flyOuts.filter((f) => !f.complete);
	};

	// Subscribe to existing showClusterWinAmounts event
	context.eventEmitter.subscribeOnMount({
		showClusterWinAmounts: (emitterEvent) => {
			triggerFlyOut(emitterEvent.wins);
		},
	});

	// Dev-only debug trigger (no story needed)
	onMount(() => {
		(window as any).__debugMultiplierFlyOut = (
			payload: Array<{ reel: number; row: number; mult: number }>,
		) => {
			triggerFlyOut(payload);
		};
	});

	onDestroy(() => {
		delete (window as any).__debugMultiplierFlyOut;
	});
</script>

<BoardContainer zIndex={150}>
	{#each flyOuts as item (item.id)}
		<Container x={item.x.current} y={item.y.current} scale={item.scale.current} alpha={item.alpha.current}>
			<BitmapText
				anchor={0.5}
				text={`${item.mult}X`}
				style={{
					fontFamily: 'gold',
					fontSize: symbolSize * 0.6,
					letterSpacing: -3,
				}}
			/>
		</Container>
	{/each}
</BoardContainer>
