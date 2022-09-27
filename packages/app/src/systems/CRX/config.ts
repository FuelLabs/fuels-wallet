import { indexPage } from './utils';

import { PageLinks } from '~/systems/Core/types';

export const welcomeLink = chrome.runtime.getURL(indexPage(PageLinks.signUpWelcome));
