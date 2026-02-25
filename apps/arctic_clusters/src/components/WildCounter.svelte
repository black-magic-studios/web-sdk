<script lang="ts">
	import { getContext } from '../game/context';
	import { stateGame } from '../game/stateGame.svelte';

	const context = getContext();

	// During normal free spins: show session total of connected wilds
	// During wild release: show remaining wilds counting down
	const isWildRelease = $derived(stateGame.isWildRelease);
	const sessionTotal = $derived(stateGame.auroraWildsSessionTotal);
	const remaining = $derived(stateGame.wildReleaseRemaining);
	const totalPlaced = $derived(stateGame.auroraWildPositions.length);

	// Display count: during wild release show remaining, otherwise show session total
	const count = $derived(isWildRelease ? remaining : sessionTotal);

	// Visible during active spin when either:
	// - Free spins with session total > 0 (accumulated connected wilds)
	// - Wild release phase
	const visible = $derived(
		stateGame.spinActive && (isWildRelease || sessionTotal > 0 || totalPlaced > 0),
	);

	// Animate the count when it changes
	let prevCount = $state(0);
	let pop = $state(false);

	$effect(() => {
		if (count !== prevCount) {
			prevCount = count;
			if (count > 0) {
				pop = true;
				const timeout = setTimeout(() => (pop = false), 300);
				return () => clearTimeout(timeout);
			}
		}
	});
</script>

{#if visible}
	<div class="wild-counter" class:pop>
		<div class="wild-icon">W</div>
		<div class="wild-count">{count}</div>
	</div>
{/if}

<style lang="scss">
	.wild-counter {
		position: fixed;
		top: clamp(6px, 2vh, 16px);
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 14px 4px 8px;
		border-radius: 20px;
		background: linear-gradient(135deg, rgba(20, 50, 80, 0.92) 0%, rgba(10, 25, 50, 0.94) 100%);
		border: 1.5px solid rgba(0, 255, 170, 0.4);
		box-shadow: 0 0 12px rgba(0, 255, 170, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
		pointer-events: none;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
		animation: fadeIn 0.3s ease;

		&.pop {
			transform: translateX(-50%) scale(1.15);
		}
	}

	.wild-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(22px, 5vw, 32px);
		height: clamp(22px, 5vw, 32px);
		border-radius: 50%;
		background: linear-gradient(135deg, #00cc88, #00ffaa);
		color: #0d1b2a;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(12px, 3vw, 16px);
		font-weight: 900;
		line-height: 1;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.wild-count {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: clamp(14px, 3.5vw, 20px);
		font-weight: 800;
		color: #00ffcc;
		text-shadow: 0 0 8px rgba(0, 255, 170, 0.5);
		line-height: 1;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateX(-50%) scale(0.8); }
		to { opacity: 1; transform: translateX(-50%) scale(1); }
	}
</style>
