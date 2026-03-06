<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Container } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { SYMBOL_HEIGHT } from '../game/constants';
	import { isFreegameType } from '../game/types';
	import BoardContainer from './BoardContainer.svelte';

	type Props = {
		show: boolean;
		children: Snippet;
	};

	const props: Props = $props();
	const context = getContext();

	const desktopPosition = $derived({
		x: context.stateGameDerived.boardLayout().width * 0.5,
		y: -SYMBOL_HEIGHT * 0.8 * 0.58,
	});

	const portraitPosition = $derived({
		x:
			context.stateGameDerived.boardLayout().width *
			(!isFreegameType(context.stateGame.gameType) ? 0.5 : 0.37),
		y: Math.max(-SYMBOL_HEIGHT * 0.8 * 0.68, 0),
	});

	const position = $derived(
		context.stateLayoutDerived.isStacked() ? portraitPosition : desktopPosition,
	);

	const scale = $derived(context.stateLayoutDerived.isStacked() ? 1.28 : 1);
</script>

<FadeContainer show={props.show}>
	<BoardContainer>
		<Container {...position} {scale}>
			{@render props.children()}
		</Container>
	</BoardContainer>
</FadeContainer>
