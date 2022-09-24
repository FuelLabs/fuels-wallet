import { openPopup, openTab } from './utils';

import { PageLinks } from '~/systems/Core/types';

chrome.runtime.onInstalled.addListener((object) => {
  const internalUrl = chrome.runtime.getURL(PageLinks.signUpWelcome);

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl });
  }
});

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === 'openWallet') {
    const walletUrl = chrome.runtime.getURL(PageLinks.wallet);
    openPopup(walletUrl);
  }
  if (request.type === 'openSetupPage') {
    openTab(PageLinks.signUpWelcome);
  }
});
