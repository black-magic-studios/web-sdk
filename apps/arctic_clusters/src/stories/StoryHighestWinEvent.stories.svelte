<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'STORY_HIGHEST_WIN/bookEvent',
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
	import { playBookEvent } from '../game/utils';
	import events from './data/story_highest_win_events';

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
	name="reveal"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.reveal,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="auroraReveal"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.auroraReveal,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="freeSpinTrigger"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.freeSpinTrigger,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="setTotalWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.setTotalWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="updateFreeSpin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.updateFreeSpin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="updateGrid"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.updateGrid,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="winInfo"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.winInfo,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="updateTumbleWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.updateTumbleWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="tumbleBoard"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.tumbleBoard,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="setWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.setWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="auroraMeterUpdate"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.auroraMeterUpdate,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="auroraExplode"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.auroraExplode,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="auroraWildPlace"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.auroraWildPlace,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="freeSpinEnd"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.freeSpinEnd,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="finalWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.finalWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
