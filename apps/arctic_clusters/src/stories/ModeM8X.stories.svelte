<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'M8X (8x cells, 11.2x price)/book',
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
	import books from './data/mode_m8x_books';

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

<Story
	name="random"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const index = randomInteger({ min: 0, max: books.length - 1 });
			const data = books[index];
			console.log('M8X random book at index', index);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="zero win 1 (0x, no win, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[0];
			console.log('M8X - zero_win_1, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="zero win 2 (0x, no win, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[1];
			console.log('M8X - zero_win_2, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="small base win 1 (0.36x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[2];
			console.log('M8X - small_base_win_1, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="small base win 2 (0.71x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[3];
			console.log('M8X - small_base_win_2, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="medium win 1 (1.79x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[4];
			console.log('M8X - medium_win_1, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="medium win 2 (2.00x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[5];
			console.log('M8X - medium_win_2, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="large win 1 (8.57x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[6];
			console.log('M8X - large_win_1, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="large win 2 (13.93x, base game, 1 tumble)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[7];
			console.log('M8X - large_win_2, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="freespin win (8.57x, free spins, 9 tumbles)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[8];
			console.log('M8X - freespin_win, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="highest win (696.71x, free spins, 11 tumbles)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[9];
			console.log('M8X - highest_win, id:', data.id, 'payout:', data.payoutMultiplier);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>
