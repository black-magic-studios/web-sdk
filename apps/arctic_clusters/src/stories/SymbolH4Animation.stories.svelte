<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Arctic Clusters/H4 Snowflake Animation',
		args: {
			loop: true,
		},
	});
</script>

<script lang="ts">
	import { Container, Text, SpriteSheet } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	import Symbol from '../components/Symbol.svelte';
	import { SYMBOL_STATES } from '../game/types';
	import assets from '../game/assets';

	const SYMBOL_SIZE = 180;
</script>

<!-- Raw SpriteSheet test - bypasses Symbol component -->
<Story name="Raw SpriteSheet Animation">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={20} anchor={{ x: 0.5, y: 0 }} text="Raw SpriteSheet (h4WinAnimation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Text x={300} y={45} anchor={{ x: 0.5, y: 0 }} text="168x168 frames, 60 frames, 8x8 grid" style={{ fill: 0xaaaaaa, fontSize: 12 }} />
				<SpriteSheet
					key="h4WinAnimation"
					x={300}
					y={280}
					anchor={0.5}
					scale={1}
					animationSpeed={0.5}
					loop={args.loop}
					play={true}
				/>
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Test just the H4 symbol in all states -->
<Story name="H4 All States">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container scale={0.8}>
				{#each SYMBOL_STATES as state, columnIndex}
					{@const x = (columnIndex + 1) * SYMBOL_SIZE}
					{@const y = 150}
					<Text {x} y={50} anchor={{ x: 0.5, y: 0 }} text={state} style={{ fill: 0xffffff, fontSize: 16 }} />
					<Symbol {x} {y} rawSymbol={{ name: 'H4' }} {state} loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Isolated win animation test -->
<Story name="H4 Win Animation Only">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={30} anchor={{ x: 0.5, y: 0 }} text="H4 Win Animation (Snowflake Spin)" style={{ fill: 0xffffff, fontSize: 20 }} />
				<Symbol x={300} y={250} rawSymbol={{ name: 'H4' }} state="win" loop={args.loop} oncomplete={() => console.log('H4 win animation complete')} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Static vs Animated comparison -->
<Story name="H4 Static vs Animated">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={200} y={30} anchor={{ x: 0.5, y: 0 }} text="Static (Sprite)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={200} y={200} rawSymbol={{ name: 'H4' }} state="static" />
				
				<Text x={450} y={30} anchor={{ x: 0.5, y: 0 }} text="Win (SpriteSheet Animation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={450} y={200} rawSymbol={{ name: 'H4' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Compare all four high symbols -->
<Story name="H1 vs H2 vs H3 vs H4 Comparison">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={120} y={30} anchor={{ x: 0.5, y: 0 }} text="H1 (Bear)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<Symbol x={120} y={200} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} />
				
				<Text x={290} y={30} anchor={{ x: 0.5, y: 0 }} text="H2 (Fox)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<Symbol x={290} y={200} rawSymbol={{ name: 'H2' }} state="win" loop={args.loop} />
				
				<Text x={460} y={30} anchor={{ x: 0.5, y: 0 }} text="H3 (Narwhal)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<Symbol x={460} y={200} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} />
				
				<Text x={630} y={30} anchor={{ x: 0.5, y: 0 }} text="H4 (Snowflake)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<Symbol x={630} y={200} rawSymbol={{ name: 'H4' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
