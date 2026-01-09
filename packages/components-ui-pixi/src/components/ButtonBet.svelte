<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Text, BaseSprite, Circle } from 'pixi-svelte';
	import { Texture, Assets } from 'pixi.js';
	import { Button, type ButtonProps } from 'components-pixi';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';

	import UiSprite from './UiSprite.svelte';
	import ButtonBetProvider from './ButtonBetProvider.svelte';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE } from '../constants';
	import { i18nDerived } from '../i18n/i18nDerived';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	// Play button image is 2816x1536, circle is centered with diameter = height (1536)
	const buttonScale = 0.1;
	const circleDiameter = 1536 * buttonScale;
	const sizes = { width: circleDiameter, height: circleDiameter };

	let texture = $state<Texture>(Texture.EMPTY);

	onMount(async () => {
		try {
			texture = await Assets.load('/assets/sprites/buttons/play_button.png');
		} catch (error) {
			console.error('Failed to load play button texture:', error);
		}
	});
</script>

<ButtonBetProvider>
	{#snippet children({ key, onpress })}
		<OnHotkey hotkey="Space" {disabled} {onpress} />
		<Button {...props} {sizes} {onpress} {disabled}>
			{#snippet children({ center, hovered })}
				<Container {...center}>
					<!-- Circular hit area matching the button -->
					<Circle
						diameter={circleDiameter}
						anchor={0.5}
						alpha={0}
						backgroundColor={0xffffff}
					/>
					<BaseSprite
						{texture}
						width={circleDiameter}
						height={circleDiameter}
						anchor={0.5}
						{...(disabled || ['spin_disabled', 'stop_disabled'].includes(key))
							? {
									tint: 0xaaaaaa,
								}
							: {}}
					/>
				</Container>
			{/snippet}
		</Button>
	{/snippet}
</ButtonBetProvider>
