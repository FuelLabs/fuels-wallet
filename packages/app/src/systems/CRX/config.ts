import { CRXPages, Pages } from '~/systems/Core/types';

export const welcomeLink = () =>
  chrome.runtime.getURL(`${CRXPages.signup}#${Pages.signUpWelcome()}`);
