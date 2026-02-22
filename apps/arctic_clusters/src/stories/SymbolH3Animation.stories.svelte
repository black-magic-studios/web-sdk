<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Arctic Clusters/H3 Narwhal Animation',
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
				<Text x={300} y={20} anchor={{ x: 0.5, y: 0 }} text="Raw SpriteSheet (h3WinAnimation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Text x={300} y={45} anchor={{ x: 0.5, y: 0 }} text="168x168 frames, 192 frames, 14x14 grid" style={{ fill: 0xaaaaaa, fontSize: 12 }} />
				<SpriteSheet
					key="h3WinAnimation"
					x={300}
					y={280}
					anchor={0.5}
					scale={1}
					animationSpeed={1}
					loop={args.loop}
					play={true}
				/>
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Test just the H3 symbol in all states -->
<Story name="H3 All States">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container scale={0.8}>
				{#each SYMBOL_STATES as state, columnIndex}
					{@const x = (columnIndex + 1) * SYMBOL_SIZE}
					{@const y = 150}
					<Text {x} y={50} anchor={{ x: 0.5, y: 0 }} text={state} style={{ fill: 0xffffff, fontSize: 16 }} />
					<Symbol {x} {y} rawSymbol={{ name: 'H3' }} {state} loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Isolated win animation test -->
<Story name="H3 Win Animation Only">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={300} y={30} anchor={{ x: 0.5, y: 0 }} text="H3 Win Animation (Narwhal)" style={{ fill: 0xffffff, fontSize: 20 }} />
				<Symbol x={300} y={250} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} oncomplete={() => console.log('H3 win animation complete')} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Static vs Animated comparison -->
<Story name="H3 Static vs Animated">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={200} y={30} anchor={{ x: 0.5, y: 0 }} text="Static (Sprite)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={200} y={200} rawSymbol={{ name: 'H3' }} state="static" />
				
				<Text x={450} y={30} anchor={{ x: 0.5, y: 0 }} text="Win (SpriteSheet Animation)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={450} y={200} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Compare all three high symbols -->
<Story name="H1 vs H2 vs H3 Comparison">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={150} y={30} anchor={{ x: 0.5, y: 0 }} text="H1 (Polar Bear)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={150} y={200} rawSymbol={{ name: 'H1' }} state="win" loop={args.loop} />
				
				<Text x={350} y={30} anchor={{ x: 0.5, y: 0 }} text="H2 (Fox)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={350} y={200} rawSymbol={{ name: 'H2' }} state="win" loop={args.loop} />
				
				<Text x={550} y={30} anchor={{ x: 0.5, y: 0 }} text="H3 (Narwhal)" style={{ fill: 0xffffff, fontSize: 18 }} />
				<Symbol x={550} y={200} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<!-- Multiple H3 animations side by side -->
<Story name="H3 Multiple Animations">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Text x={400} y={20} anchor={{ x: 0.5, y: 0 }} text="Multiple H3 Win Animations (Narwhal)" style={{ fill: 0xffffff, fontSize: 20 }} />
				{#each [150, 300, 450, 600] as x, i}
					<Symbol {x} y={200} rawSymbol={{ name: 'H3' }} state="win" loop={args.loop} />
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
