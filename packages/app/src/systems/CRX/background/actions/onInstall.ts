import { welcomeLink } from '../../config';
import { executeContentScript } from '../../scripts/executeContentScript';

// Execute everytime the background service starts
executeContentScript();

chrome.runtime.onInstalled.addListener(async (object) => {
  const { shouldRecoverWelcomeFromError } = await chrome.storage.local.get(
    'shouldRecoverWelcomeFromError'
  );

  chrome.storage.local.remove('shouldRecoverWelcomeFromError');

  if (
    shouldRecoverWelcomeFromError ||
    object.reason === chrome.runtime.OnInstalledReason.INSTALL
  ) {
    chrome.tabs.create({ url: welcomeLink() });
  }
});
