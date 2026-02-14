<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BitmapText, Container, type Sizes } from 'pixi-svelte';

	import { SYMBOL_HEIGHT } from '../game/constants';

	type Props = {
		children: Snippet<[{ frameSizes: Sizes }]>;
	};

	const props: Props = $props();
	const TITLE_HEIGHT = SYMBOL_HEIGHT * 0.28;

	const PANEL_RATIO = 1442 / 374;
	const PANEL_HEIGHT = SYMBOL_HEIGHT * 0.8;
	const PANEL_SIZES = {
		width: PANEL_HEIGHT * PANEL_RATIO,
		height: PANEL_HEIGHT,
	};
</script>

<Container y={-TITLE_HEIGHT * 1.2}>
	<BitmapText
		anchor={0.5}
		y={-TITLE_HEIGHT * 0.025}
		text="TUMBLE WIN"
		style={{ fontFamily: 'gold', fontSize: TITLE_HEIGHT * 0.45 }}
	/>
</Container>

{@render props.children({ frameSizes: PANEL_SIZES })}
