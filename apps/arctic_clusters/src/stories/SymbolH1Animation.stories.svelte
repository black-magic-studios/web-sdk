<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Arctic Clusters/H1 Polar Bear Animation',
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
				<Text x={300} y={20} anchor={{ x: 0.5, y: 0 }} text="Raw SpriteSheet (h1WinAnimation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Text x={300} y={45} anchor={{ x: 0.5, y: 0 }} text="Frame size: 256x384, Static H1: 256x256" style={{ fill: 0xaaaaaa, fontSize: 12 }} />
				<SpriteSheet
					key="h1WinAnimation"
					x={300}
					y={280}
					anchor={0.5}
					scale={1}
					animationSpeed={0.3}
					loop={args.loop}
					play={true}
				/>
				<!-- Reference box showing 256x256 static symbol size -->
				<Text x={300} y={480} anchor={{ x: 0.5, y: 0 }} text="↑ Animation (256x384)" style={{ fill: 0xffff00, fontSize: 14 }} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Debug: Side by side static vs animation at 1:1 scale -->
<Story name="Debug Size Comparison">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={150} y={20} anchor={{ x: 0.5, y: 0 }} text="Static H1 (256x256)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<Symbol x={150} y={200} rawSymbol={{ name: 'H1' }} state="static" />
				
				<Text x={450} y={20} anchor={{ x: 0.5, y: 0 }} text="Animation (256x384)" style={{ fill: 0xffffff, fontSize: 16 }} />
				<SpriteSheet
					key="h1WinAnimation"
					x={450}
					y={200}
					anchor={0.5}
					scale={0.67}
					animationSpeed={0.3}
					loop={args.loop}
					play={true}
				/>
				
				<Text x={300} y={380} anchor={{ x: 0.5, y: 0 }} text="Note: Animation frames are taller than static symbol" style={{ fill: 0xaaaaaa, fontSize: 14 }} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Test just the H1 symbol in all states -->
<Story name="H1 All States">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container scale={0.8}>
				{#each SYMBOL_STATES as state, columnIndex}
					{@const x = (columnIndex + 1) * SYMBOL_SIZE}
					{@const y = 150}
					<Text {x} y={50} anchor={{ x: 0.5, y: 0 }} text={state} style={{ fill: 0xffffff, fontSize: 16 }} />
					<Symbol {x} {y} rawSymbol={{ name: 'H1' }} {state} loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Isolated win animation test -->
<Story name="H1 Win Animation Only">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={30} anchor={{ x: 0.5, y: 0 }} text="H1 Win Animation (Polar Bear)" style={{ fill: 0xffffff, fontSize: 20 }} />
				<Symbol x={300} y={250} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} oncomplete={() => console.log('H1 win animation complete')} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Static vs Animated comparison -->
<Story name="H1 Static vs Animated">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={200} y={30} anchor={{ x: 0.5, y: 0 }} text="Static (Sprite)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={200} y={200} rawSymbol={{ name: 'H1' }} state="static" />
				
				<Text x={450} y={30} anchor={{ x: 0.5, y: 0 }} text="Win (Sprite Animation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={450} y={200} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Multiple H1 animations side by side -->
<Story name="H1 Multiple Animations">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={400} y={20} anchor={{ x: 0.5, y: 0 }} text="Multiple H1 Win Animations" style={{ fill: 0xffffff, fontSize: 20 }} />
				{#each [150, 300, 450, 600] as x, i}
					<Symbol {x} y={200} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
