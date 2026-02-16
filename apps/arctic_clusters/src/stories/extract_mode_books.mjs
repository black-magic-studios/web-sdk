/**
 * Extract 10 representative books per multiplier mode from batch_output.
 * Picks: 2 zero-wins, 2 small base-game wins, 2 medium wins, 2 large wins,
 *        1 free-spin win, and 1 highest win.
 * Outputs TypeScript data files + Storybook story files.
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const BATCH_DIR = path.resolve('batch_output');
const DATA_DIR = path.resolve('data');
const STORIES_DIR = path.resolve('.');

const MODES = ['M2X', 'M4X', 'M8X', 'M16X', 'M32X', 'M64X', 'M128X', 'M256X', 'M512X', 'M1024X'];

const SPIN_PRICES = {
	M2X: 2.9,
	M4X: 5.8,
	M8X: 11.2,
	M16X: 23.0,
	M32X: 46.2,
	M64X: 90.6,
	M128X: 181.8,
	M256X: 354.5,
	M512X: 665.1,
	M1024X: 1110.8,
};

const MULTIPLIERS = {
	M2X: 2,
	M4X: 4,
	M8X: 8,
	M16X: 16,
	M32X: 32,
	M64X: 64,
	M128X: 128,
	M256X: 256,
	M512X: 512,
	M1024X: 1024,
};

function loadDetailedLUT(modeDir) {
	const csvPath = path.join(modeDir, 'lookUpTable_0_0_detailed.csv');
	const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n');
	// header: id,weight,total_win,base_win,free_win,super_win,criteria
	const header = lines[0].split(',');
	return lines.slice(1).map((line) => {
		const cols = line.split(',');
		return {
			id: parseInt(cols[0]),
			weight: parseInt(cols[1]),
			total_win: parseFloat(cols[2]),
			base_win: parseFloat(cols[3]),
			free_win: parseFloat(cols[4]),
			super_win: parseFloat(cols[5]),
			criteria: cols[6],
		};
	});
}

function loadBook(modeDir, globalId) {
	const batchIndex = Math.floor(globalId / 1000);
	const bookIndex = globalId % 1000;
	const batchFile = path.join(modeDir, `books_batch_${batchIndex}.json.gz`);
	const data = JSON.parse(zlib.gunzipSync(fs.readFileSync(batchFile)));
	// Books in the batch have sequential ids starting from 1, but we find by index
	return data[bookIndex];
}

function countTumbles(book) {
	return book.events.filter((e) => e.type === 'reveal').length;
}

function pickBooks(lut, modeDir) {
	// Sort into categories
	const zeros = lut.filter((r) => r.criteria === '0');
	const baseGame = lut.filter((r) => r.criteria === 'basegame').sort((a, b) => a.total_win - b.total_win);
	const freeGame = lut.filter((r) => r.criteria === 'freegame').sort((a, b) => a.total_win - b.total_win);
	
	// All non-zero sorted by total_win
	const allWins = lut.filter((r) => r.total_win > 0).sort((a, b) => a.total_win - b.total_win);

	const picks = [];
	const usedIds = new Set();

	function addPick(row, label) {
		if (!row || usedIds.has(row.id)) return false;
		usedIds.add(row.id);
		picks.push({ ...row, label });
		return true;
	}

	// 1-2: Zero wins (pick 2 spread out)
	if (zeros.length > 0) addPick(zeros[0], 'zero_win_1');
	if (zeros.length > 1) addPick(zeros[Math.floor(zeros.length / 2)], 'zero_win_2');

	// 3-4: Small base game wins (bottom 10-20%)
	if (baseGame.length > 2) {
		addPick(baseGame[Math.floor(baseGame.length * 0.1)], 'small_base_win_1');
		addPick(baseGame[Math.floor(baseGame.length * 0.2)], 'small_base_win_2');
	}

	// 5-6: Medium wins (around 50th percentile)
	if (allWins.length > 2) {
		addPick(allWins[Math.floor(allWins.length * 0.5)], 'medium_win_1');
		addPick(allWins[Math.floor(allWins.length * 0.55)], 'medium_win_2');
	}

	// 7-8: Large wins (top 5-10%)
	if (allWins.length > 10) {
		addPick(allWins[Math.floor(allWins.length * 0.9)], 'large_win_1');
		addPick(allWins[Math.floor(allWins.length * 0.95)], 'large_win_2');
	}

	// 9: A free-spin win (medium free-spin)
	if (freeGame.length > 2) {
		addPick(freeGame[Math.floor(freeGame.length * 0.5)], 'freespin_win');
	}

	// 10: Highest win overall
	const highest = lut.reduce((max, r) => (r.total_win > max.total_win ? r : max), lut[0]);
	addPick(highest, 'highest_win');

	// Load actual book data for each pick
	return picks.map((pick) => {
		const book = loadBook(modeDir, pick.id);
		const tumbles = countTumbles(book);
		return {
			...pick,
			book,
			tumbles,
		};
	});
}

function generateDataFile(mode, picks) {
	const entries = picks.map((p) => {
		const bookJson = JSON.stringify(p.book, null, '\t');
		return bookJson;
	});

	const content = `// ${mode} mode books - auto-generated from batch_output
// Spin price: ${SPIN_PRICES[mode]}x, Starting multiplier: ${MULTIPLIERS[mode]}x
export default [\n${entries.join(',\n')}\n] as const;\n`;

	const filePath = path.join(DATA_DIR, `mode_${mode.toLowerCase()}_books.ts`);
	fs.writeFileSync(filePath, content);
	console.log(`  Written: ${filePath}`);
	return `mode_${mode.toLowerCase()}_books`;
}

function generateStoryFile(mode, picks, dataModule) {
	const spinPrice = SPIN_PRICES[mode];
	const mult = MULTIPLIERS[mode];

	const storyEntries = picks.map((p, i) => {
		const winLabel = p.total_win > 0 ? `${p.total_win.toFixed(2)}x` : '0x';
		const criteriaLabel = p.criteria === '0' ? 'no win' : p.criteria === 'basegame' ? 'base game' : 'free spins';
		const tumbleLabel = p.tumbles > 1 ? `${p.tumbles} tumbles` : `${p.tumbles} tumble`;
		const name = `${p.label.replace(/_/g, ' ')} (${winLabel}, ${criteriaLabel}, ${tumbleLabel})`;

		return `<Story
	name="${name}"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[${i}];
			console.log('${mode} - ${p.label}, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>`;
	});

	// Also add a "random" story
	const randomStory = `<Story
	name="random"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const index = randomInteger({ min: 0, max: books.length - 1 });
			const data = books[index];
			console.log('${mode} random book at index', index);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>`;

	const content = `<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: '${mode} (${mult}x cells, ${spinPrice}x price)/book',
	});
</script>

<script lang="ts">
	import {
		StoryGameTemplate,
		StoryLocale,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';
	import { randomInteger } from 'utils-shared/random';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import { playBet } from '../game/utils';
	import books from './data/${dataModule}';

	setContext();
</script>

{#snippet template(args: TemplateArgs<any>)}
	<StoryGameTemplate
		skipLoadingScreen={args.skipLoadingScreen}
		action={async () => {
			await args.action?.(args.data);
		}}
	>
		<StoryLocale lang="en">
			<Game />
		</StoryLocale>
	</StoryGameTemplate>
{/snippet}

${randomStory}

${storyEntries.join('\n\n')}
`;

	const filePath = path.join(STORIES_DIR, `Mode${mode}.stories.svelte`);
	fs.writeFileSync(filePath, content);
	console.log(`  Written: ${filePath}`);
}

// Main
for (const mode of MODES) {
	console.log(`\nProcessing ${mode}...`);
	const modeDir = path.join(BATCH_DIR, mode);

	if (!fs.existsSync(modeDir)) {
		console.log(`  Skipping ${mode} - directory not found`);
		continue;
	}

	const lut = loadDetailedLUT(modeDir);
	console.log(`  LUT entries: ${lut.length}`);

	const picks = pickBooks(lut, modeDir);
	console.log(`  Picked ${picks.length} books:`);
	for (const p of picks) {
		console.log(`    ${p.label}: id=${p.id}, win=${p.total_win.toFixed(2)}x, criteria=${p.criteria}, tumbles=${p.tumbles}`);
	}

	const dataModule = generateDataFile(mode, picks);
	generateStoryFile(mode, picks, dataModule);
}

console.log('\nDone!');
