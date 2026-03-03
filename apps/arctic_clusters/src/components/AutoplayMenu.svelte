<script lang="ts">
	import {
		stateUi,
		stateBet,
		stateBetDerived,
		stateI18nDerived,
		AUTO_SPINS_TEXT_OPTIONS,
		AUTO_SPINS_TEXT_OPTION_MAP,
		type AutoSpinsText,
	} from 'state-shared';
	import { getContext } from '../game/context';

	type Props = { show: boolean; onclose: () => void };
	let { show = $bindable(), onclose }: Props = $props();

	const context = getContext();

	// Custom limit options: 5×, 20×, 50×, No Limit
	const LOCAL_LIMIT_OPTIONS = ['5×', '20×', '50×', 'No Limit'] as const;
	type LocalLimitOption = (typeof LOCAL_LIMIT_OPTIONS)[number];
	const LOCAL_LIMIT_MULTIPLIER_MAP: Record<LocalLimitOption, number> = {
		'5×': 5,
		'20×': 20,
		'50×': 50,
		'No Limit': Infinity,
	};

	// Local selections (synced to stateUi)
	let selectedSpins = $state<AutoSpinsText>(stateUi.autoSpinsText);
	let selectedLossLimit = $state<LocalLimitOption>('No Limit');
	let selectedWinLimit = $state<LocalLimitOption>('No Limit');
	let stopOnBonus = $state(stateBet.stopOnBonus);

	// Sections: 'spins' | 'limits'
	let activeSection = $state<'spins' | 'limits'>('spins');

	const startAutoplay = () => {
		// Sync spin selection to shared state
		stateUi.autoSpinsText = selectedSpins;
		stateBet.stopOnBonus = stopOnBonus;

		// Set auto spin values
		stateBet.autoSpinsCounter = AUTO_SPINS_TEXT_OPTION_MAP[selectedSpins];
		stateBet.autoSpinsLossLimitAmount = stateBet.betAmount * LOCAL_LIMIT_MULTIPLIER_MAP[selectedLossLimit];
		stateBet.autoSpinsSingleWinLimitAmount = stateBet.betAmount * LOCAL_LIMIT_MULTIPLIER_MAP[selectedWinLimit];
		if (stateBetDerived.activeBetMode().type === 'buy') stateBet.activeBetModeKey = 'BASE';

		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_btn_click_3' });
		context.eventEmitter.broadcast({ type: 'autoBet' });
		onclose();
	};
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onclose}></div>

	<div class="menu">
		<!-- TAB BAR -->
		<div class="tab-bar">
			<button
				class="tab"
				class:active={activeSection === 'spins'}
				onclick={() => activeSection = 'spins'}
			>SPINS</button>
			<button
				class="tab"
				class:active={activeSection === 'limits'}
				onclick={() => activeSection = 'limits'}
			>LIMITS</button>
		</div>

		{#if activeSection === 'spins'}
			<!-- SPIN COUNT OPTIONS -->
			<div class="section-label">{stateI18nDerived.translate('AUTO SPINS')}</div>
			<div class="options-grid">
				{#each AUTO_SPINS_TEXT_OPTIONS as option}
					<button
						class="option-chip"
						class:selected={selectedSpins === option}
						onclick={() => selectedSpins = option}
					>{option}</button>
				{/each}
			</div>
		{:else}
			<!-- SINGLE WIN LIMIT -->
			<div class="section-label">{stateI18nDerived.translate('SINGLE WIN LIMIT')}</div>
			<div class="options-grid">
				{#each LOCAL_LIMIT_OPTIONS as option}
					<button
						class="option-chip"
						class:selected={selectedWinLimit === option}
						onclick={() => selectedWinLimit = option}
					>{option}</button>
				{/each}
			</div>

			<!-- LOSS LIMIT -->
			<div class="section-label">{stateI18nDerived.translate('LOSS LIMIT')}</div>
			<div class="options-grid">
				{#each LOCAL_LIMIT_OPTIONS as option}
					<button
						class="option-chip"
						class:selected={selectedLossLimit === option}
						onclick={() => selectedLossLimit = option}
					>{option}</button>
				{/each}
			</div>
		{/if}

		<!-- STOP ON SPECIAL FEATURE WIN TOGGLE -->
		<div class="toggle-row">
			<span class="toggle-label">STOP ON SPECIAL FEATURE WIN</span>
			<button
				class="toggle-switch"
				class:active={stopOnBonus}
				onclick={() => stopOnBonus = !stopOnBonus}
			>
				<span class="toggle-knob"></span>
			</button>
		</div>

		<!-- START BUTTON -->
		<button class="start-btn" onclick={startAutoplay}>
			▶ START
		</button>
	</div>
{/if}

<style lang="scss">
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 998;
	}

	.menu {
		position: fixed;
		z-index: 999;
		bottom: calc(env(safe-area-inset-bottom, 0px) + 12%);
		right: 72px;
		display: flex;
		flex-direction: column;
		gap: 0;
		background: rgba(20, 20, 30, 0.92);
		border-radius: 14px;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(120, 180, 220, 0.2);
		overflow: hidden;
		overflow-y: auto;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		min-width: 220px;
		max-width: 280px;
		max-height: calc(100vh - env(safe-area-inset-bottom, 0px) - 14%);
		max-height: calc(100dvh - env(safe-area-inset-bottom, 0px) - 14%);
		animation: menuSlideIn 0.2s ease-out;
		padding-bottom: 6px;
	}

	/* Portrait mobile: center the menu */
	@media (orientation: portrait) {
		.menu {
			right: auto;
			left: 50%;
			transform: translateX(-50%);
			bottom: calc(env(safe-area-inset-bottom, 0px) + 18%);
			max-height: calc(100vh - env(safe-area-inset-bottom, 0px) - 20%);
			max-height: calc(100dvh - env(safe-area-inset-bottom, 0px) - 20%);
			animation: menuSlideInPortrait 0.2s ease-out;
		}
	}

	/* Very small viewports: full-width centered with more room */
	@media (max-height: 400px) {
		.menu {
			bottom: 4px;
			max-height: calc(100vh - 8px);
			max-height: calc(100dvh - 8px);
		}
	}

	@media (orientation: portrait) and (max-height: 500px) {
		.menu {
			bottom: 4px;
			max-height: calc(100vh - 8px);
			max-height: calc(100dvh - 8px);
		}
	}

	@keyframes menuSlideIn {
		from { opacity: 0; transform: translateY(10px) scale(0.96); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	@keyframes menuSlideInPortrait {
		from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.96); }
		to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
	}

	/* ── Tab bar ── */
	.tab-bar {
		display: flex;
		border-bottom: 1px solid rgba(120, 180, 220, 0.12);
	}

	.tab {
		flex: 1;
		padding: 10px 8px;
		border: none;
		background: transparent;
		color: rgba(144, 200, 232, 0.5);
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: color 0.15s, background 0.15s;

		&:hover {
			background: rgba(80, 140, 200, 0.08);
		}

		&.active {
			color: #90c8e8;
			border-bottom: 2px solid #68b8e0;
		}
	}

	/* ── Section label ── */
	.section-label {
		padding: 8px 14px 4px;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1.2px;
		color: rgba(144, 200, 232, 0.55);
	}

	/* ── Options grid ── */
	.options-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 4px 14px 10px;
	}

	.option-chip {
		padding: 6px 10px;
		border: 1.5px solid rgba(120, 180, 220, 0.2);
		border-radius: 8px;
		background: rgba(40, 50, 70, 0.5);
		color: #d0e8f8;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
		min-width: 38px;
		text-align: center;

		&:hover {
			background: rgba(60, 100, 150, 0.4);
			border-color: rgba(140, 200, 240, 0.4);
		}

		&.selected {
			background: rgba(80, 160, 220, 0.35);
			border-color: #68b8e0;
			color: #ffffff;
		}
	}

	/* ── Toggle row ── */
	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 14px;
		border-top: 1px solid rgba(120, 180, 220, 0.12);
	}

	.toggle-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 1px;
		color: #d0e8f8;
	}

	.toggle-switch {
		position: relative;
		width: 40px;
		height: 22px;
		border-radius: 11px;
		border: 1.5px solid rgba(120, 180, 220, 0.3);
		background: rgba(40, 50, 70, 0.6);
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s;
		padding: 0;

		&.active {
			background: rgba(80, 160, 220, 0.5);
			border-color: #68b8e0;
		}
	}

	.toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #90c8e8;
		transition: transform 0.2s;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

		.active & {
			transform: translateX(18px);
		}
	}

	/* ── Start button ── */
	.start-btn {
		margin: 6px 14px 8px;
		padding: 10px 16px;
		border: none;
		border-radius: 10px;
		background: linear-gradient(135deg, rgba(80, 160, 220, 0.6), rgba(60, 130, 200, 0.8));
		color: #ffffff;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 1.5px;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		text-align: center;

		&:hover {
			background: linear-gradient(135deg, rgba(100, 180, 240, 0.7), rgba(80, 150, 220, 0.9));
		}

		&:active {
			transform: scale(0.97);
		}
	}
</style>
