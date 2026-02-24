<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Symbol Showcase',
	});
</script>

<script lang="ts">
	import { Container, Text } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	import Symbol from '../components/Symbol.svelte';
	import assets from '../game/assets';
	import { setContext } from '../game/context';
	import {
		GRID_COLS,
		GRID_ROWS,
		SYMBOL_WIDTH,
		SYMBOL_HEIGHT,
		MASK_WIDTH,
	} from '../game/constants';

	setContext();

	// All symbol names on the board
	const ALL_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'L1', 'L2', 'L3', 'L4', 'S', 'W'];

	// Layout: place symbols in a grid matching game size
	const CELL_W = SYMBOL_WIDTH;
	const CELL_H = SYMBOL_HEIGHT;
	const LABEL_SIZE = 14;
	const COLS = 5; // 5 columns of symbol pairs (static + win)
	const PADDING = 20;
</script>

<Story name="all-symbols-board-size">
	{#snippet template()}
		<StoryPixiApp {assets}>
			<Container x={PADDING} y={PADDING}>
				<!-- Header labels -->
				<Text x={CELL_W * 0.5} y={0} anchor={{ x: 0.5, y: 0 }} text="Static" style={{ fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }} />
				<Text x={CELL_W * 1.5 + 10} y={0} anchor={{ x: 0.5, y: 0 }} text="Win (loop)" style={{ fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }} />

				{#each ALL_SYMBOLS as symbolName, i}
					{@const row = i}
					{@const yPos = row * (CELL_H + 30) + 40}

					<!-- Symbol name label -->
					<Text
						x={0}
						y={yPos}
						anchor={{ x: 0, y: 0.5 }}
						text={symbolName}
						style={{ fontSize: LABEL_SIZE, fill: 0xaaaaaa }}
					/>

					<!-- Static symbol -->
					<Symbol
						x={CELL_W * 0.5}
						y={yPos}
						rawSymbol={{ name: symbolName }}
						state="static"
					/>

					<!-- Win animation (looping) -->
					<Symbol
						x={CELL_W * 1.5 + 10}
						y={yPos}
						rawSymbol={{ name: symbolName }}
						state="win"
						loop
					/>
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<Story name="reel-grid-win-animations">
	{#snippet template()}
		<StoryPixiApp {assets}>
			<Container>
				<!-- 7x7 grid with all symbols shown in win state at game size -->
				{@const symbols = ['H1', 'H2', 'H3', 'H4', 'L1', 'L2', 'L3']}
				{#each { length: GRID_ROWS } as _, row}
					{#each { length: GRID_COLS } as _, col}
						{@const symIdx = (row + col) % symbols.length}
						{@const x = CELL_W * (col + 0.5)}
						{@const y = CELL_H * (row + 0.5)}
						<Symbol
							{x}
							{y}
							rawSymbol={{ name: symbols[symIdx] }}
							state="win"
							loop
						/>
					{/each}
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>

<Story name="h1-h2-h3-comparison">
	{#snippet template()}
		<StoryPixiApp {assets}>
			<Container x={20} y={20}>
				<!-- Side by side: static vs win for H1, H2, H3 -->
				{#each ['H1', 'H2', 'H3'] as symbolName, i}
					{@const yPos = i * (CELL_H * 1.6 + 20) + 30}

					<Text x={0} y={yPos - 25} text={symbolName} style={{ fontSize: 18, fill: 0xffffff, fontWeight: 'bold' }} />

					<!-- Static -->
					<Text x={CELL_W * 0.5} y={yPos - CELL_H * 0.5 - 15} anchor={{ x: 0.5, y: 1 }} text="static" style={{ fontSize: 12, fill: 0x888888 }} />
					<Symbol
						x={CELL_W * 0.5}
						y={yPos}
						rawSymbol={{ name: symbolName }}
						state="static"
					/>

					<!-- Win -->
					<Text x={CELL_W * 2} y={yPos - CELL_H * 0.5 - 15} anchor={{ x: 0.5, y: 1 }} text="win" style={{ fontSize: 12, fill: 0x888888 }} />
					<Symbol
						x={CELL_W * 2}
						y={yPos}
						rawSymbol={{ name: symbolName }}
						state="win"
						loop
					/>

					<!-- Post-win static -->
					<Text x={CELL_W * 3.5} y={yPos - CELL_H * 0.5 - 15} anchor={{ x: 0.5, y: 1 }} text="postWinStatic" style={{ fontSize: 12, fill: 0x888888 }} />
					<Symbol
						x={CELL_W * 3.5}
						y={yPos}
						rawSymbol={{ name: symbolName }}
						state="postWinStatic"
					/>
				{/each}
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
