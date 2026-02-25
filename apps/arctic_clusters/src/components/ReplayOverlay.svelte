<script lang="ts">
	import { stateUrlDerived } from 'state-shared';
	import { getContext } from '../game/context';

	type Props = {
		replayState: 'ready' | 'playing' | 'done';
		onplay: () => void;
		onplayagain: () => void;
	};

	const props: Props = $props();
	const isReplay = $derived(stateUrlDerived.replay());
</script>

{#if isReplay && props.replayState !== 'playing'}
	<div class="replay-overlay">
		<div class="replay-card">
			{#if props.replayState === 'ready'}
				<div class="replay-label">BET REPLAY</div>
				<button class="replay-btn" onclick={props.onplay}>
					<svg viewBox="0 0 24 24" width="28" height="28" fill="white">
						<path d="M8 5v14l11-7z"/>
					</svg>
					PLAY
				</button>
			{:else if props.replayState === 'done'}
				<div class="replay-label">REPLAY COMPLETE</div>
				<button class="replay-btn" onclick={props.onplayagain}>
					<svg viewBox="0 0 24 24" width="22" height="22" fill="white">
						<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
					</svg>
					PLAY AGAIN
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.replay-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
	}

	.replay-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 32px 48px;
		border-radius: 16px;
		background: rgba(20, 30, 60, 0.85);
		border: 1px solid rgba(150, 200, 255, 0.2);
		box-shadow: 0 0 40px rgba(100, 180, 255, 0.15);
	}

	.replay-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 18px;
		font-weight: 800;
		color: #c8e0ff;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.replay-btn {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 36px;
		border: none;
		border-radius: 10px;
		background: linear-gradient(135deg, #3388ff, #55bbff);
		color: white;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 16px;
		font-weight: 800;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: transform 0.15s, box-shadow 0.15s;
		box-shadow: 0 4px 20px rgba(50, 140, 255, 0.4);
	}

	.replay-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 28px rgba(50, 140, 255, 0.55);
	}

	.replay-btn:active {
		transform: scale(0.97);
	}
</style>
