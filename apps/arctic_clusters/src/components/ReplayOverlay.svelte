<script lang="ts">
	import { stateUrlDerived, stateI18nDerived, stateBet, stateMeta } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { BOOK_AMOUNT_MULTIPLIER, API_AMOUNT_MULTIPLIER } from 'constants-shared/bet';
	import { getContext } from '../game/context';

	type Props = {
		replayState: 'ready' | 'playing' | 'done';
		onplay: () => void;
		onplayagain: () => void;
	};

	const props: Props = $props();
	const isReplay = $derived(stateUrlDerived.replay());
	const isSocial = $derived(stateUrlDerived.social());
	const t = (key: string) => stateI18nDerived.translate(key);

	// ── Replay info derived from URL params + state ──
	const modeKey = $derived(stateUrlDerived.mode() || stateBet.activeBetModeKey || 'BASE');
	const baseBet = $derived(stateBet.betAmount);
	// Look up cost multiplier: mode key may be lowercase (from URL) or uppercase (in betModeMeta)
	const costMultiplier = $derived(
		stateMeta.betModeMeta[modeKey]?.costMultiplier
		?? stateMeta.betModeMeta[modeKey.toUpperCase()]?.costMultiplier
		?? 1
	);
	const totalBetCost = $derived(baseBet * costMultiplier);

	// ── Total win: try API-level payout first, then compute from state events ──
	const totalWin = $derived.by(() => {
		const resume = stateBet.betToResume as any;
		if (!resume) return 0;

		// 1) API-level payout (from authenticate round or replay response)
		if (resume.payout && resume.payout > 0) {
			return resume.payout / API_AMOUNT_MULTIPLIER;
		}

		// 2) Compute from state events: find the last setTotalWin event
		if (Array.isArray(resume.state)) {
			let lastTotalWin = 0;
			for (const evt of resume.state) {
				if (evt.type === 'setTotalWin' && typeof evt.amount === 'number') {
					lastTotalWin = evt.amount;
				}
			}
			if (lastTotalWin > 0) {
				// Book event amounts use BOOK_AMOUNT_MULTIPLIER, scaled by bet
				return (lastTotalWin / BOOK_AMOUNT_MULTIPLIER) * baseBet;
			}
		}

		return 0;
	});

	// Payout multiplier: try API field, else compute from totalWin / totalBetCost
	const payoutMultiplier = $derived.by(() => {
		const resume = stateBet.betToResume as any;
		if (resume?.payoutMultiplier && resume.payoutMultiplier > 0) {
			return resume.payoutMultiplier;
		}
		if (totalBetCost > 0 && totalWin > 0) {
			return Math.round((totalWin / totalBetCost) * 100) / 100;
		}
		return 0;
	});
</script>

{#if isReplay && props.replayState !== 'playing'}
	<div class="replay-overlay">
		<div class="replay-card">
			{#if props.replayState === 'ready'}
				<!-- ── REPLAY badge ── -->
				<div class="replay-badge">REPLAY</div>

				<!-- ── Title ── -->
				<h2 class="replay-title">{isSocial ? t('Bet Replay') : 'Bet Replay'}</h2>

				<!-- ── Info panel ── -->
				<div class="replay-info">
					<div class="info-row">
						<span class="info-label">Mode</span>
						<span class="info-value mode-value">{modeKey}</span>
					</div>
					<div class="info-divider"></div>

					<div class="info-row">
						<span class="info-label">{isSocial ? 'Base Play' : 'Base Bet'}</span>
						<span class="info-value">{numberToCurrencyString(baseBet)}</span>
					</div>
					<div class="info-row">
						<span class="info-label">{isSocial ? 'Feature Multiplier' : 'Cost Multiplier'}</span>
						<span class="info-value">{costMultiplier}x</span>
					</div>
					<div class="info-row highlight">
						<span class="info-label">{isSocial ? 'Total Play Cost' : 'Total Bet Cost'}</span>
						<span class="info-value cost-value">{numberToCurrencyString(totalBetCost)}</span>
					</div>
					<div class="info-divider"></div>

					<div class="info-row">
						<span class="info-label">{isSocial ? 'Final Multiplier' : 'Payout Multiplier'}</span>
						<span class="info-value mult-value">{payoutMultiplier}x</span>
					</div>
					<div class="info-row highlight">
						<span class="info-label">Total Win</span>
						<span class="info-value win-value">{numberToCurrencyString(totalWin)}</span>
					</div>
				</div>

				<!-- ── Start Replay button ── -->
				<button class="replay-btn start" onclick={props.onplay}>
					&#9654; Start Replay
				</button>

				<!-- ── Disclaimer ── -->
				<p class="replay-disclaimer">
					{isSocial
						? 'This is a replay of a previous play round. No plays will be placed.'
						: 'This is a replay of a previous bet round. No bets will be placed.'}
				</p>

			{:else if props.replayState === 'done'}
				<!-- ── REPLAY COMPLETE ── -->
				<div class="replay-badge">REPLAY</div>
				<h2 class="replay-title">Replay Complete</h2>

				<div class="replay-info">
					<div class="info-row">
						<span class="info-label">Mode</span>
						<span class="info-value mode-value">{modeKey}</span>
					</div>
					<div class="info-divider"></div>
					<div class="info-row highlight">
						<span class="info-label">{isSocial ? 'Total Play Cost' : 'Total Bet Cost'}</span>
						<span class="info-value cost-value">{numberToCurrencyString(totalBetCost)}</span>
					</div>
					<div class="info-row highlight">
						<span class="info-label">Total Win</span>
						<span class="info-value win-value">{numberToCurrencyString(totalWin)}</span>
					</div>
				</div>

				<button class="replay-btn again" onclick={props.onplayagain}>
					<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
						<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
					</svg>
					Replay Again
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
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(6px);
	}

	.replay-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 28px 36px 24px;
		border-radius: 16px;
		background: linear-gradient(180deg, #0d1830 0%, #121e3a 100%);
		border: 1px solid rgba(100, 160, 255, 0.18);
		box-shadow: 0 0 50px rgba(30, 80, 160, 0.25);
		min-width: 300px;
		max-width: min(400px, 90vw);
	}

	/* ── Badge ── */
	.replay-badge {
		display: inline-block;
		padding: 4px 18px;
		border-radius: 20px;
		border: 2px solid #e8b230;
		color: #e8b230;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	/* ── Title ── */
	.replay-title {
		margin: 0;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 26px;
		font-weight: 800;
		color: #ffffff;
		letter-spacing: 0.5px;
	}

	/* ── Info panel ── */
	.replay-info {
		width: 100%;
		background: rgba(10, 18, 40, 0.7);
		border: 1px solid rgba(100, 160, 255, 0.12);
		border-radius: 12px;
		padding: 14px 18px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 0;
	}

	.info-row.highlight {
		background: rgba(80, 120, 40, 0.2);
		border-radius: 6px;
		padding: 8px 10px;
		margin: 2px -10px;
	}

	.info-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: rgba(200, 220, 255, 0.7);
	}

	.info-value {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #ffffff;
	}

	.mode-value {
		color: #ff6655;
		font-weight: 800;
	}

	.cost-value {
		color: #ff6644;
		font-size: 16px;
	}

	.mult-value {
		color: #44bbff;
	}

	.win-value {
		color: #33cc66;
		font-size: 16px;
	}

	.info-divider {
		height: 1px;
		background: rgba(100, 160, 255, 0.12);
		margin: 4px 0;
	}

	/* ── Buttons ── */
	.replay-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 14px 24px;
		border: none;
		border-radius: 10px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 17px;
		font-weight: 800;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.replay-btn.start {
		background: linear-gradient(135deg, #e8b230, #f0c850);
		color: #1a1a2e;
		box-shadow: 0 4px 20px rgba(232, 178, 48, 0.35);
	}

	.replay-btn.again {
		background: linear-gradient(135deg, #e8b230, #f0c850);
		color: #1a1a2e;
		box-shadow: 0 4px 20px rgba(232, 178, 48, 0.35);
	}

	.replay-btn:hover {
		transform: scale(1.03);
	}

	.replay-btn:active {
		transform: scale(0.97);
	}

	/* ── Disclaimer ── */
	.replay-disclaimer {
		margin: 4px 0 0;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 400;
		color: rgba(180, 200, 230, 0.5);
		text-align: center;
		line-height: 1.4;
	}
</style>
