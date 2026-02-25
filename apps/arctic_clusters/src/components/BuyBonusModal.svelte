<script lang="ts" module>
	export type BuyBonusModalEvent =
		| { type: 'buyBonusModalOpen' }
		| { type: 'buyBonusModalClose' };
</script>

<script lang="ts">
	import { zIndex } from 'constants-shared/zIndex';
	import { stateBet, stateMetaDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';
	import { getContext } from '../game/context';

	import PopupLight from './PopupLight.svelte';

	const context = getContext();

	let show = $state(false);

	const buyList = $derived(
		stateMetaDerived.betModeMetaList().filter((item) => item.type === 'buy'),
	);

	const activateList = $derived(
		stateMetaDerived.betModeMetaList().filter((item) => item.type === 'activate'),
	);

	const allModes = $derived([...activateList, ...buyList]);

	const close = () => {
		show = false;
	};

	context.eventEmitter.subscribeOnMount({
		buyBonusModalOpen: () => {
			show = true;
		},
		buyBonusModalClose: () => {
			show = false;
		},
	});

	const selectMode = (mode: string) => {
		// Set the selected mode key in shared bonus state, then trigger the confirm flow
		// Import stateBonus inline to set selectedBetModeKey
		import('components-ui-html/src/stateBonus.svelte').then(({ stateBonus }) => {
			stateBonus.selectedBetModeKey = mode;
			context.eventEmitter.broadcast({ type: 'buyBonusConfirm' });
			context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
			close();
		});
	};
</script>

{#if show}
	<PopupLight zIndex={zIndex.modal} onclose={close}>
		<div class="buy-bonus-modal">
			<div class="modes-grid">
				{#each allModes as modeData}
					{#if modeData.type !== 'default'}
						{@const cost = stateBet.betAmount * modeData.costMultiplier}
						{@const disabled = stateBet.betAmount <= 0 || stateBet.balanceAmount < cost}
						<button
							class="mode-card"
							class:disabled
							{disabled}
							onclick={() => selectMode(modeData.mode)}
						>
							<span class="mode-title">{modeData.text.title}</span>
							{#if modeData.text.description}
								<span class="mode-desc">{modeData.text.description}</span>
							{/if}
							<span class="mode-price">{numberToCurrencyString(cost)}</span>
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</PopupLight>
{/if}

<style lang="scss">
	.buy-bonus-modal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		z-index: 100;
		position: relative;
	}

	.modes-grid {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 90vw;
		overflow-y: auto;
		max-height: 70vh;
	}

	.mode-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem;
		min-width: 140px;
		max-width: 170px;
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: white;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, transform 0.1s;
		font-family: 'Montserrat', sans-serif;

		&:hover:not(.disabled) {
			background: rgba(40, 80, 120, 0.7);
			border-color: rgba(100, 200, 255, 0.4);
			transform: scale(1.03);
		}

		&:active:not(.disabled) {
			transform: scale(0.97);
		}

		&.disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.mode-title {
		font-size: 1rem;
		font-weight: 700;
		text-align: center;
		line-height: 1.2;
	}

	.mode-desc {
		font-size: 0.7rem;
		text-align: center;
		opacity: 0.75;
		white-space: pre-line;
		min-height: 2rem;
		display: inline-flex;
		align-items: center;
	}

	.mode-price {
		font-size: 0.9rem;
		font-weight: 600;
		color: #66ddaa;
		text-align: center;
	}
</style>
