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

	context.eventEmitter.subscribeOnMount({
		showClusterWinAmounts: async (emitterEvent) => {
			// Compute center of mass of all winning cells
			const rawWins = emitterEvent.wins;
			const cx = rawWins.reduce((s, w) => s + w.reel, 0) / rawWins.length;
			const cy = rawWins.reduce((s, w) => s + w.row, 0) / rawWins.length;

			// Give each win a direction vector pointing outward from center
			wins = rawWins.map((rawWin) => {
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
				return { ...rawWin, dirX: dx, dirY: dy, oncomplete: () => {} };
			});
			const gerPromises = () =>
				wins.map(async (win) => {
					await waitForResolve((resolve) => (win.oncomplete = resolve));
				});
			await Promise.all(gerPromises());
			wins = [];
		},
	});
</script>

<BoardContainer zIndex={200}>
	{#each wins as win}
		<ClusterWinAmount {win} />
	{/each}
</BoardContainer>
