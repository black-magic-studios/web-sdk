<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MODE_M128X/book',
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
	import books from './data/curated_m128x';

	setContext();

	const findBook = (label: string) => books.find((b: any) => b._label === label)!;
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
			console.log('Running book at index', index, 'label:', (data as any)._label);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="no_win"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('no_win');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="large_win"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('large_win');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="freespin_trigger"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('freespin_trigger');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="super_bonus"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('super_bonus');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="aurora_active"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('aurora_active');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="wild_release"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('wild_release');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="long_tumble_chain"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('long_tumble_chain');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>

<Story
	name="mega_win"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = findBook('mega_win');
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>
