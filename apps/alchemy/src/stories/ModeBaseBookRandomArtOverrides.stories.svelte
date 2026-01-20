<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MODE_BASE/book',
	});
</script>

<script lang="ts">
	import { createApp, setContextApp, type Assets } from 'pixi-svelte';

	import {
		StoryGameTemplate,
		StoryLocale,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';
	import { randomInteger } from 'utils-shared/random';

	import Game from './components/GameArtOverrides.svelte';
	import { setContext } from '../game/context';
	import { playBet } from '../game/utils';
	import books from './data/base_books';
	import defaultAssets from '../game/assets';

	// Keep the normal game contexts (event emitter, layout, xstate, etc)
	setContext();

	// Create a story-local Pixi app with story-local assets.
	// Edit the overrides below to swap background/reel-frame ONLY for this story.
	const assets = {
		...defaultAssets,
		reelMask: { type: 'sprite', src: '/assets/sprites/reelsFrame/reel_mask/reel_mask.png' },
		reelFrameEdge: {
			type: 'sprite',
			src: '/assets/sprites/reelsFrame/cursed_clusters_reel_frame.png',
		},
		// Example overrides (served from apps/alchemy/static):
		// castleBackground: { type: 'sprite', src: '/assets/my_background.png' },
		// reelFrameEdge: { type: 'sprite', src: '/assets/my_reel_frame_1400.png' },
		// reelBackgroundPlate: { type: 'sprite', src: '/assets/my_reel_frame_center.png' },
	} satisfies Assets;

	const { stateApp } = createApp({ assets });
	setContextApp({ stateApp });
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
	name="random (art overrides)"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			const index = randomInteger({ min: 0, max: books.length - 1 });
			const data = books[index];
			console.log('Running a book at index', index);
			await playBet({ ...data, state: data.events });
		},
	})}
	{template}
/>
