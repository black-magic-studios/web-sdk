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

			// Group wins by cell position so same-cell wins get unique spread angles
			const cellCounts = new Map<string, number>();
			const cellIndices = new Map<string, number>();
			for (const w of rawWins) {
				const key = `${w.reel},${w.row}`;
				cellCounts.set(key, (cellCounts.get(key) ?? 0) + 1);
			}

			// Give each win a direction vector pointing outward from center
			// Append to existing wins so re-entrant calls don't destroy in-flight animations
			const newWins: Win[] = rawWins.map((rawWin) => {
				const key = `${rawWin.reel},${rawWin.row}`;
				const idx = cellIndices.get(key) ?? 0;
				cellIndices.set(key, idx + 1);
				const count = cellCounts.get(key) ?? 1;

				let dx = rawWin.reel - cx;
				let dy = rawWin.row - cy;
				const mag = Math.sqrt(dx * dx + dy * dy);
				if (mag > 0.01) {
					dx /= mag;
					dy /= mag;
				} else {
					dx = 0;
					dy = -1;
				}

				// Fan same-cell wins into unique angles
				if (count > 1) {
					const baseAngle = Math.atan2(dy, dx);
					const spread = Math.PI * 0.5; // 90° total fan
					const offset = -spread / 2 + (spread / (count - 1)) * idx;
					const angle = baseAngle + offset;
					dx = Math.cos(angle);
					dy = Math.sin(angle);
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
