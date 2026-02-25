<script lang="ts">
	import type { Reel } from '../game/stateGame.svelte';

	type Props = {
		reel: Reel;
		oncomplete: () => void;
		visible?: boolean;
	};

	const props: Props = $props();

	// No visual — Mining Mayhem rocks removed.
	// Still need to clear the anticipating flag when the reel stops.
	$effect(() => {
		if (props.reel.reelState.motion === 'stopped') {
			props.oncomplete();
		}
	});
</script>
