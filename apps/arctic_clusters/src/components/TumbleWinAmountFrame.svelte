<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Container, type Sizes } from 'pixi-svelte';

	import { SYMBOL_HEIGHT } from '../game/constants';

	type Props = {
		children: Snippet<[{ frameSizes: Sizes }]>;
	};

	const props: Props = $props();

	const PANEL_RATIO = 1442 / 374;
	const PANEL_HEIGHT = SYMBOL_HEIGHT * 0.8;
	const PANEL_SIZES = {
		width: PANEL_HEIGHT * PANEL_RATIO,
		height: PANEL_HEIGHT,
	};
</script>

{@render props.children({ frameSizes: PANEL_SIZES })}
