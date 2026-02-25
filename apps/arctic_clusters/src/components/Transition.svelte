<script lang="ts" module>
	export type EmitterEventTransition = { type: 'transition' };
</script>

<script lang="ts">
	import { getContext } from '../game/context';

	const context = getContext();

	context.eventEmitter.subscribeOnMount({
		transition: async () => {
			// Skip the Mining Mayhem purple rocks animation — resolve immediately
		},
	});
</script>
