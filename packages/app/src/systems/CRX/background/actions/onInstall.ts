import { welcomeLink } from '../../config';
import { executeContentScript } from '../../scripts/executeContentScript';
import { REINJECT_AFTER_RELOAD_KEY } from '../../utils/tabs';

chrome.runtime.onInstalled.addListener(async (object) => {
  // Tabs opened before an install or update have no live content script
  executeContentScript();
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: welcomeLink() });
  }
});

// A same-version runtime.reload() disconnects content scripts without firing onInstalled
chrome.storage.local.get(REINJECT_AFTER_RELOAD_KEY).then((items) => {
  if (!items?.[REINJECT_AFTER_RELOAD_KEY]) return;
  chrome.storage.local.remove(REINJECT_AFTER_RELOAD_KEY);
  executeContentScript();
});
