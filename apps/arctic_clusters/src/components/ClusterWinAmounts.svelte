<script lang="ts" module>
	import ClusterWinAmount, { type RawWin, type Win } from './ClusterWinAmount.svelte';

	export type EmitterEventClusterWinAmounts = {
		type: 'showClusterWinAmounts';
		wins: RawWin[];
	};
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';

	const context = getContext();

	let wins: Win[] = $state([]);
	let winIdCounter = 0;

	context.eventEmitter.subscribeOnMount({
		showClusterWinAmounts: async (emitterEvent) => {
			// Compute center of mass of all winning cells
			const rawWins = emitterEvent.wins;
			const cx = rawWins.reduce((s, w) => s + w.reel, 0) / rawWins.length;
			const cy = rawWins.reduce((s, w) => s + w.row, 0) / rawWins.length;

			// Give each win a direction vector pointing outward from center
			// Append to existing wins so re-entrant calls don't destroy in-flight animations
			const newWins: Win[] = rawWins.map((rawWin) => {
				let dx = rawWin.reel - cx;
				let dy = rawWin.row - cy;
				const mag = Math.sqrt(dx * dx + dy * dy);
				if (mag > 0.01) {
					// Normalize to unit length
					dx /= mag;
					dy /= mag;
				} else {
					// Single win or perfectly centered — default to floating up
					dx = 0;
					dy = -1;
				}
				return { ...rawWin, id: winIdCounter++, dirX: dx, dirY: dy, oncomplete: () => {} };
			});
			wins = [...wins, ...newWins];
			const getPromises = () =>
				newWins.map(async (win) => {
					await waitForResolve((resolve) => (win.oncomplete = resolve));
				});
			await Promise.all(getPromises());
			// Remove only the wins from this batch
			const newWinIds = new Set(newWins.map((w) => w.id));
			wins = wins.filter((w) => !newWinIds.has(w.id));
		},
	});
</script>

<BoardContainer zIndex={999}>
	{#each wins as win (win.id)}
		<ClusterWinAmount {win} />
	{/each}
</BoardContainer>
