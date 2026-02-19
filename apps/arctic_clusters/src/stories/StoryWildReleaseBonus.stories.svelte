<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'STORY_WILD_RELEASE_BONUS/book',
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
	import storyWildReleaseBonus from './data/story_wild_release_bonus';

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
	name="wild release bonus (115.80x free spins)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			console.log('Running story_wild_release_bonus, id:', storyWildReleaseBonus.id);
			await playBet({ ...storyWildReleaseBonus, state: storyWildReleaseBonus.events });
		},
	})}
	{template}
/>
