<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Alchemy/Win Frame (Sprite)',
	});
</script>

<script lang="ts">
	import { Container, Text } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	import Symbol from '../components/Symbol.svelte';
	import assets from '../game/assets';

	const BASE = 220;

	const CASES: Array<{ label: string; rawSymbol: { name: string; scatter?: boolean }; state: any }> = [
		{ label: 'Win (H3)', rawSymbol: { name: 'H3' }, state: 'win' },
		{ label: 'Post-win static (H3)', rawSymbol: { name: 'H3' }, state: 'postWinStatic' },
		{ label: 'Explosion (W)', rawSymbol: { name: 'W' }, state: 'explosion' },
		{ label: 'Static (no frame)', rawSymbol: { name: 'H3' }, state: 'static' },
		{ label: 'Scatter (no frame)', rawSymbol: { name: 'S', scatter: true }, state: 'win' },
	];
</script>

<Story name="preview">
	{#snippet template()}
		<StoryPixiApp {assets}>
			<Container scale={0.8} x={100} y={140}>
				{#each CASES as c, i}
					{@const x = (i + 1) * BASE}
					<Text x={x} y={-120} anchor={{ x: 0.5, y: 0 }} text={c.label} style={{ fill: 0xffffff, fontSize: 18 }} />
					<Symbol x={x} y={120} rawSymbol={c.rawSymbol} state={c.state} loop />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
