<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Container } from 'pixi-svelte';

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();

</script>


<Container>
	{@render props.children()}
</Container>
