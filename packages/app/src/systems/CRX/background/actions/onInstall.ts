import { welcomeLink } from '../../config';
import { executeContentScript } from '../../scripts/executeContentScript';

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: welcomeLink() });
    executeContentScript();
  }
});
