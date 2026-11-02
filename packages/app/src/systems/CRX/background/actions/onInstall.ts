import { welcomeLink } from '../../config';
import { executeContentScript } from '../../scripts/executeContentScript';

const CONTENT_SCRIPTS_CHECKED_KEY = 'contentScriptsChecked';

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: welcomeLink() });
  }
});

// chrome.storage.session starts empty after an install, update, reload,
// re-enable or browser restart. Tabs opened before that keep a disconnected
// content script, so inject a new one where the old one does not answer.
// Locking also clears the session, which only adds one extra check.
chrome.storage.session.get(CONTENT_SCRIPTS_CHECKED_KEY).then((items) => {
  if (items?.[CONTENT_SCRIPTS_CHECKED_KEY]) return;
  chrome.storage.session.set({ [CONTENT_SCRIPTS_CHECKED_KEY]: true });
  executeContentScript();
});
