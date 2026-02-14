<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'STORY_HIGHEST_WIN/book',
	});
</script>

<script lang="ts">
	import {
		StoryGameTemplate,
		StoryLocale,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import { playBet } from '../game/utils';
	import storyHighestWin from './data/story_highest_win';

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
	name="highest win (7457.10x free spins)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			console.log('Running story_highest_win, id:', storyHighestWin.id);
			await playBet({ ...storyHighestWin, state: storyHighestWin.events });
		},
	})}
	{template}
/>
