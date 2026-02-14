<script context="module">
  export const meta = {
    title: 'Books/Aurora Freespin',
    tags: ['autodocs'],
  };
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { Story } from '@storybook/addon-svelte-csf';
  import StoryGameTemplate from '../StoryGameTemplate.svelte';
  import { story_aurora_freespin } from './data/story_aurora_freespin';
  import { playBet } from '$lib/events/playBet';

  const data = story_aurora_freespin;
</script>

<Story name="Aurora Freespin (All 4 Aurora Events)">
  <StoryGameTemplate>
    <button
      on:click={() => {
        playBet({ ...data, state: data.events });
      }}
    >
      Play Aurora Freespin
    </button>
  </StoryGameTemplate>
</Story>
