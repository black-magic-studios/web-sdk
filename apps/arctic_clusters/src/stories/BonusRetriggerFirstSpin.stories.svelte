<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'BONUS_RETRIGGER_FIRST_SPIN/book',
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
	import bonusRetriggerData from './data/bonus_retrigger_first_spin';

	setContext();

	const book = bonusRetriggerData[0];
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
	name="play"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			await playBet({ ...book, state: book.events });
		},
	})}
	{template}
/>
