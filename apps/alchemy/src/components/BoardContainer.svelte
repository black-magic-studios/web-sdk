<script lang="ts">
import type { Snippet } from 'svelte';

import { Container } from 'pixi-svelte';

import { getContext } from '../game/context';

type Props = {
children: Snippet;
zIndex?: number;
};

const props: Props = $props();
const context = getContext();

const boardLayout = $derived(context.stateGameDerived.boardLayout());
</script>

<Container
x={boardLayout.x}
y={boardLayout.y}
pivot={boardLayout.pivot}
zIndex={props.zIndex}
sortableChildren={true}
>
{@render props.children()}
</Container>
