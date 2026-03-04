import { i18n, type Messages } from '@lingui/core';
import { type Language } from './stateUrl.svelte';

// All our catalog messages are plain strings (no ICU interpolation/plurals),
// so we use a lightweight passthrough compiler instead of the full
// @lingui/message-utils/compileMessage which bundles the heavyweight
// @messageformat/parser (~11 KB) and parses every message at load time.
i18n.setMessagesCompiler((message: string) => message);

export const stateI18n = $state({
	i18n
});

export const stateI18nDerived = {
	init: (lang: Language, messages: Messages) => {
		stateI18n.i18n.load(lang, messages as Messages);
		stateI18n.i18n.activate(lang);
	},
	// Single lookup — i18n.t is an alias of i18n._, so the previous
	// i18n._(i18n.t(v)) was double-translating (and re-looking-up the
	// translated VALUE as a key, causing missing-message warnings).
	translate: (value: string) => stateI18n.i18n._(value),
};