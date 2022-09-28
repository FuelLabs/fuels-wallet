import { PageLinks } from '~/systems/Core/types';

export enum CRXPages {
  'index' = '/index.html',
  'popup' = '/popup.html',
}

export const welcomeLink = chrome.runtime.getURL(`${CRXPages.index}#${PageLinks.signUpWelcome}`);
