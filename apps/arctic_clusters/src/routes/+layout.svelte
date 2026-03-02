<script lang="ts">
	import { type Snippet } from 'svelte';
	import { GlobalStyle } from 'components-ui-html';
	import { Authenticate, LoaderStakeEngine, LoadI18n } from 'components-shared';
	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';

	import messagesMap, { sweepsMessagesMap } from '../i18n/messagesMap';
	import { stateUrlDerived, type Language } from 'state-shared';

	type Props = { children: Snippet };

	const props: Props = $props();

	const loaderUrlStakeEngine = new URL('../../stake-engine-loader.gif', import.meta.url).href;

	// When social=true, overlay sweeps_<lang> messages on top of the base messages
	const effectiveMessagesMap = $derived.by(() => {
		if (!stateUrlDerived.social()) return messagesMap;
		const merged = { ...messagesMap };
		for (const [lang, sweepsMsgs] of Object.entries(sweepsMessagesMap)) {
			const base = merged[lang as Language] ?? {};
			merged[lang as Language] = { ...base, ...sweepsMsgs };
		}
		return merged;
	});

	setContext();
</script>

<GlobalStyle>
	<Authenticate>
		<LoadI18n messagesMap={effectiveMessagesMap}>
			<Game />
		</LoadI18n>
	</Authenticate>
</GlobalStyle>

<LoaderStakeEngine src={loaderUrlStakeEngine} />



{@render props.children()}