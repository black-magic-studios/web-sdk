<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Validation/Book 487',
	});
</script>

<script lang="ts">
	import {
		StoryGameTemplate,
		StoryLocale,
		templateArgs,
		type TemplateArgs,
	} from 'components-storybook';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import { playBet } from '../game/utils';
	import books from './data/validate_487';

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
	name="book 487"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const data = books[0];
			console.log('Running validation book id', data.id);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>
