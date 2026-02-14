<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Arctic Clusters/H2 Mortar Animation',
		args: {
			loop: true,
		},
	});
</script>

<script lang="ts">
	import { Container, Text, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	import Symbol from '../components/Symbol.svelte';
	import { SYMBOL_STATES } from '../game/types';
	import assets from '../game/assets';

	const SYMBOL_SIZE = 180;
</script>

<!-- Test just the H2 symbol in all states -->
<Story name="H2 All States">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container scale={0.8}>
				{#each SYMBOL_STATES as state, columnIndex}
					{@const x = (columnIndex + 1) * SYMBOL_SIZE}
					{@const y = 150}
					<Text {x} y={50} anchor={{ x: 0.5, y: 0 }} text={state} style={{ fill: 0xffffff, fontSize: 16 }} />
					<Symbol {x} {y} rawSymbol={{ name: 'H2' }} {state} loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Isolated win animation test -->
<Story name="H2 Win Animation Only">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={30} anchor={{ x: 0.5, y: 0 }} text="H2 Win Animation (Mortar & Pestle)" style={{ fill: 0xffffff, fontSize: 20 }} />
				<Symbol x={300} y={200} rawSymbol={{ name: 'H2' }} state="win" loop={args.loop} oncomplete={() => console.log('H2 win animation complete')} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Raw Spine animation test for debugging -->
<Story name="H2 Raw Spine">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={30} anchor={{ x: 0.5, y: 0 }} text="Raw SpineProvider for H2" style={{ fill: 0xffffff, fontSize: 20 }} />
				<SpineProvider x={300} y={250} key="H2" height={200}>
					<SpineTrack
						loop={args.loop}
						trackIndex={0}
						animationName="h2"
						timeScale={1}
						listener={{
							complete: () => console.log('Spine animation complete'),
							event: (_, event) => console.log('Spine event:', event.data?.name),
						}}
					/>
				</SpineProvider>
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Compare H2 with other symbols -->
<Story name="Compare H2 with Others">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container scale={0.6}>
				<Text x={100} y={20} anchor={{ x: 0.5, y: 0 }} text="H1 (Coin)" style={{ fill: 0xffffff, fontSize: 14 }} />
				<Symbol x={100} y={150} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} />
				
				<Text x={280} y={20} anchor={{ x: 0.5, y: 0 }} text="H2 (Mortar)" style={{ fill: 0xffffff, fontSize: 14 }} />
				<Symbol x={280} y={150} rawSymbol={{ name: 'H2' }} state="win" loop={args.loop} />
				
				<Text x={460} y={20} anchor={{ x: 0.5, y: 0 }} text="H3 (Hammer)" style={{ fill: 0xffffff, fontSize: 14 }} />
				<Symbol x={460} y={150} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} />
				
				<Text x={640} y={20} anchor={{ x: 0.5, y: 0 }} text="H4 (Shovel)" style={{ fill: 0xffffff, fontSize: 14 }} />
				<Symbol x={640} y={150} rawSymbol={{ name: 'H4' }} state="win" loop={args.loop} />
				
				<Text x={820} y={20} anchor={{ x: 0.5, y: 0 }} text="H5 (Pick)" style={{ fill: 0xffffff, fontSize: 14 }} />
				<Symbol x={820} y={150} rawSymbol={{ name: 'H5' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Static vs Animated comparison -->
<Story name="H2 Static vs Animated">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={200} y={30} anchor={{ x: 0.5, y: 0 }} text="Static (Sprite)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={200} y={180} rawSymbol={{ name: 'H2' }} state="static" />
				
				<Text x={450} y={30} anchor={{ x: 0.5, y: 0 }} text="Win (Spine Animation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={450} y={180} rawSymbol={{ name: 'H2' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
