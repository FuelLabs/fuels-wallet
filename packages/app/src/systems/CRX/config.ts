import { Pages, CRXPages } from '~/systems/Core/types';

export const welcomeLink = () =>
  chrome.runtime.getURL(`${CRXPages.signup}#${Pages.signUpWelcome()}`);

export const continueSignUpLink = () =>
  chrome.runtime.getURL(`${CRXPages.signup}#${Pages.signUpCreateWallet()}`);
