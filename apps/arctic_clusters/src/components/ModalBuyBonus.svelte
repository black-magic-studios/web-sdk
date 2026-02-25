<script lang="ts">
	import { zIndex } from 'constants-shared/zIndex';
	import { stateBet, stateI18nDerived, stateConfig, stateBetDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { stateBonus } from 'components-ui-html/src/stateBonus.svelte';
	import { getContextEventEmitter } from 'utils-event-emitter';

	import PopupLight from './PopupLight.svelte';

	type Props = {
		show: boolean;
		onclose: () => void;
	};

	const props: Props = $props();
	const { eventEmitter } = getContextEventEmitter();

	// ── Bet options from config ──
	const betOptions = $derived(stateConfig.betAmountOptions);
	const currentBetIndex = $derived(betOptions.indexOf(stateBet.betAmount));

	const betUp = () => {
		const idx = currentBetIndex;
		if (idx < betOptions.length - 1) {
			stateBetDerived.setBetAmount(betOptions[idx + 1]);
		}
	};
	const betDown = () => {
		const idx = currentBetIndex;
		if (idx > 0) {
			stateBetDerived.setBetAmount(betOptions[idx - 1]);
		}
	};

	// ── Multiplier mode definitions ──
	const MULT_MODES = [
		{ key: 'M2X', label: '2x', cost: 2.9, color: '#ff88bb' },
		{ key: 'M4X', label: '4x', cost: 5.8, color: '#ff99aa' },
		{ key: 'M8X', label: '8x', cost: 11.2, color: '#ffcc66' },
		{ key: 'M16X', label: '16x', cost: 23.0, color: '#55ddbb' },
		{ key: 'M32X', label: '32x', cost: 46.2, color: '#ffcc55' },
		{ key: 'M64X', label: '64x', cost: 90.6, color: '#88aaff' },
		{ key: 'M128X', label: '128x', cost: 181.8, color: '#ff8877' },
		{ key: 'M256X', label: '256x', cost: 354.5, color: '#66ddee' },
		{ key: 'M512X', label: '512x', cost: 665.1, color: '#ffaa66' },
		{ key: 'M1024X', label: '1024x', cost: 1110.8, color: '#ff88cc' },
	] as const;

	let multIndex = $state(0);
	const currentMult = $derived(MULT_MODES[multIndex]);

	const multUp = () => {
		if (multIndex < MULT_MODES.length - 1) multIndex++;
	};
	const multDown = () => {
		if (multIndex > 0) multIndex--;
	};

	// ── Card actions ──
	const activateMode = (modeKey: string) => {
		stateBonus.selectedBetModeKey = modeKey;
		stateBet.activeBetModeKey = modeKey;
		eventEmitter.broadcast({ type: 'soundPressGeneral' as any });
		props.onclose();
	};

	const buyMode = (modeKey: string) => {
		stateBonus.selectedBetModeKey = modeKey;
		stateBet.activeBetModeKey = modeKey;
		eventEmitter.broadcast({ type: 'bet' as any });
		eventEmitter.broadcast({ type: 'soundPressGeneral' as any });
		props.onclose();
	};

	// ── Computed costs ──
	// ── Symbol / multiplier images for cards ──
	const BONUS_IMG = '/assets/sprites/symbolsStatic/cool_clusters/symbols/arctic_clusters_bonus.png';

	// Map each multiplier to its grid image (512x and 1024x fall back to 256+)
	const MULT_IMG_MAP: Record<string, string> = {
		M2X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x2.png',
		M4X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x4.png',
		M8X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x8.png',
		M16X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x16.png',
		M32X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x32.png',
		M64X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x64.png',
		M128X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x128.png',
		M256X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x256.png',
		M512X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x512.png',
		M1024X: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x1024.png',
	};
	const currentMultImg = $derived(MULT_IMG_MAP[currentMult.key]);

	const anteCost = $derived(stateBet.betAmount * 1.2);
	const multCost = $derived(stateBet.betAmount * currentMult.cost);
	const bonusCost = $derived(stateBet.betAmount * 100);

	const canAfford = (cost: number) => stateBet.betAmount > 0 && stateBet.balanceAmount >= cost;
</script>

{#if props.show}
	<PopupLight zIndex={zIndex.modal} onclose={props.onclose}>
		<!-- Bet size selector -->
		<div class="bet-bar">
			<span class="bet-label">BET</span>
			<button class="pick-btn" onclick={betDown} disabled={currentBetIndex <= 0}>&#9660;</button>
			<span class="pick-label">{numberToCurrencyString(stateBet.betAmount)}</span>
			<button class="pick-btn" onclick={betUp} disabled={currentBetIndex >= betOptions.length - 1}>&#9650;</button>
		</div>

		<div class="buy-modal">
			<!-- Card 1: Extra Chance -->
			<div
				class="card"
				class:disabled={!canAfford(anteCost)}
			>
				<div class="card-bg" style="background-position: 20% 30%;"></div>
				<div class="card-body">
					<div class="card-title">EXTRA CHANCE</div>
					<img src={BONUS_IMG} alt="Bonus" class="feature-img" />
					<div class="card-desc">1 Bonus symbol guaranteed on the last reel each spin.</div>
					<div class="card-price">{numberToCurrencyString(anteCost)}</div>
					<button
						class="card-action"
						class:disabled={!canAfford(anteCost)}
						disabled={!canAfford(anteCost)}
						onclick={() => activateMode('ANTE')}
					>ACTIVATE</button>
				</div>
			</div>

			<!-- Card 2: Multiplier Grid -->
			<div class="card featured" class:disabled={!canAfford(multCost)}>
				<div class="card-bg" style="background-position: 50% 40%;"></div>
				<div class="card-body">
					<div class="card-title">{currentMult.label} Grid</div>
					<div class="cell-preview">
						<img src={currentMultImg} alt="Grid cell" class="cell-img" />
						<span class="cell-label" style="color: {currentMult.color}; text-shadow: 0 0 8px {currentMult.color}80, 0 1px 3px rgba(0,0,0,0.7);">{currentMult.label}</span>
					</div>
					<div class="card-desc">All cells set to {currentMult.label} multiplier.</div>
					<div class="card-price">{numberToCurrencyString(multCost)}</div>
					<button
						class="card-action"
						class:disabled={!canAfford(multCost)}
						disabled={!canAfford(multCost)}
						onclick={() => activateMode(currentMult.key)}
					>ACTIVATE</button>
				</div>
			</div>

			<!-- Card 3: Buy Bonus -->
			<div
				class="card"
				class:disabled={!canAfford(bonusCost)}
			>
				<div class="card-bg" style="background-position: 80% 50%;"></div>
				<div class="card-body">
					<div class="card-title">{stateI18nDerived.translate('BUY BONUS')}</div>
					<div class="bonus-row">
						<img src={BONUS_IMG} alt="Bonus" class="feature-img" />
						<img src={BONUS_IMG} alt="Bonus" class="feature-img" />
						<img src={BONUS_IMG} alt="Bonus" class="feature-img" />
					</div>
					<div class="card-desc">Starts a Bonus round with 8 spins.</div>
					<div class="card-price">{numberToCurrencyString(bonusCost)}</div>
					<button
						class="card-action"
						class:disabled={!canAfford(bonusCost)}
						disabled={!canAfford(bonusCost)}
						onclick={() => buyMode('BONUS')}
					>{stateI18nDerived.translate('BUY')}</button>
				</div>
			</div>
		</div>
	</PopupLight>
{/if}

<style>
	/* ── Bet size bar ── */
	.bet-bar {
		position: relative;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		padding: 10px 14px 0;
		font-size: min(1.8vw, 12px);
	}

	.bet-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: rgba(144, 200, 232, 0.55);
		margin-right: 4px;
	}

	/* ── Modal wrapper: 3 cards in a row, scales with viewport ── */
	.buy-modal {
		--card-w: min(28vw, 180px);
		--card-featured-w: min(32vw, 200px);
		--gap: min(1.5vw, 10px);

		position: relative;
		z-index: 100;
		display: flex;
		gap: var(--gap);
		padding: 1rem;
		justify-content: center;
		align-items: stretch;
	}

	/* ── Card shell ── */
	.card {
		position: relative;
		width: var(--card-w);
		border-radius: 10px;
		background: rgba(0, 20, 40, 0.65);
		border: 1px solid rgba(100, 200, 255, 0.25);
		color: white;
		padding: 0;
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		text-align: center;
		transition: border-color 0.15s, transform 0.2s, box-shadow 0.2s;
		overflow: hidden;
	}

	.card:hover:not(.disabled) {
		border-color: rgba(100, 200, 255, 0.5);
		transform: scale(1.03);
		box-shadow: 0 0 20px rgba(80, 180, 255, 0.2);
	}

	.card:active:not(.disabled) {
		transform: scale(0.97);
	}

	.card.disabled {
		opacity: 0.4;
	}

	.card.featured {
		width: var(--card-featured-w);
		border-color: rgba(100, 220, 255, 0.4);
		box-shadow: 0 0 24px rgba(60, 180, 255, 0.15);
		cursor: default;
	}

	.card.featured:hover {
		transform: none;
		box-shadow: 0 0 24px rgba(60, 180, 255, 0.15);
	}

	/* ── Blurred background layer ── */
	.card-bg {
		position: absolute;
		inset: -12px;
		background-image: url('/assets/sprites/background/arctic_background_3840x2160.webp');
		background-size: 600%;
		filter: blur(6px) brightness(0.5);
		opacity: 0.7;
		z-index: 0;
		pointer-events: none;
	}

	/* ── Card content ── */
	.card-body {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.4em;
		padding: 0.8em 0.6em;
		min-height: 100%;
		box-sizing: border-box;
		background: linear-gradient(180deg, rgba(0,15,35,0.3) 0%, rgba(0,15,35,0.55) 100%);
		font-size: min(1.8vw, 12px);
	}

	/* ── Typography ── */
	.card-title {
		font-size: 1.3em;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: 0.04em;
		text-shadow: 0 1px 6px rgba(0,0,0,0.5);
	}

	.card-desc {
		font-size: 0.9em;
		opacity: 0.7;
		line-height: 1.35;
		padding: 0 0.3em;
		text-shadow: 0 1px 4px rgba(0,0,0,0.4);
	}

	.card-price {
		font-size: 1.2em;
		font-weight: 600;
		color: #66ddaa;
		text-shadow: 0 0 8px rgba(102,221,170,0.3);
	}

	.card-action {
		font-size: 0.9em;
		font-weight: 600;
		letter-spacing: 0.06em;
		padding: 0.3em 1em;
		border-radius: 5px;
		border: 1px solid rgba(255,255,255,0.3);
		background: transparent;
		color: white;
		cursor: pointer;
		transition: background 0.12s;
	}

	.card-action:hover {
		background: rgba(255,255,255,0.1);
	}

	.card-action.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* ── Images ── */
	.feature-img {
		width: 2.8em;
		height: 2.8em;
		object-fit: contain;
		filter: drop-shadow(0 0 8px rgba(136,238,255,0.35));
	}

	.bonus-row {
		display: flex;
		gap: 0.3em;
		justify-content: center;
	}

	/* ── Multiplier cell preview ── */
	.cell-preview {
		width: 4.5em;
		height: 4.5em;
		border-radius: 5px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cell-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 5px;
	}

	.cell-label {
		position: relative;
		z-index: 1;
		font-size: 1.4em;
		font-weight: 800;
	}

	.pick-label {
		font-size: 1.8em;
		font-weight: 800;
		color: #88eeff;
		min-width: 3em;
		text-align: center;
		text-shadow: 0 0 12px rgba(136,238,255,0.4);
	}

	.pick-btn {
		font-size: 1em;
		width: 1.8em;
		height: 1.8em;
		border-radius: 50%;
		border: 1px solid rgba(255,255,255,0.3);
		background: rgba(255,255,255,0.08);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.12s;
	}

	.pick-btn:hover:not(:disabled) {
		background: rgba(255,255,255,0.2);
	}

	.pick-btn:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}

</style>
