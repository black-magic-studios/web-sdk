import { mergeMessagesMaps } from 'utils-shared/i18n';
import { messagesMap as messagesMapUiPixi } from 'components-ui-pixi';
import { messagesMap as messagesMapUiHtml } from 'components-ui-html';

import en from './en';
import zh from './zh';
import sweeps_en from './sweeps_en';

const messagesMapGame = {
	en,
	zh,
};

// Social/sweeps overrides — keyed as sweeps_<lang>
const messagesMapSweeps = {
	en: sweeps_en,
};

const messagesMap = mergeMessagesMaps([messagesMapGame, messagesMapUiPixi, messagesMapUiHtml]);

// Export sweeps map separately so LoadI18n can merge when social=true
export const sweepsMessagesMap = messagesMapSweeps;

export default messagesMap;
