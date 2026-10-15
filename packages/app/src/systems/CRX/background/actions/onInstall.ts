import { welcomeLink } from '../../config';
import { executeContentScript } from '../../scripts/executeContentScript';

chrome.runtime.onInstalled.addListener(async (object) => {
  // Tabs opened before an install or update have no live content script
  executeContentScript();
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: welcomeLink() });
  }
});
