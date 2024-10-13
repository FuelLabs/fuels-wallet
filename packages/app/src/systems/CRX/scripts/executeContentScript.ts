import { ContentScriptMessageTypes } from '@fuel-wallet/types';
import fileName from './contentScript?script';

/*
 * This function is called by the background script to register the content script
 * on all tabs. This is necessary because the content script is not automatically
 * registered on tabs that are already open when the extension is installed.
 */

// Ping to check if the content script is already injected
export async function executeContentScript() {
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id || tab.url?.startsWith('chrome://')) continue;
      injectContentScript(tab.id!);
    }
  });
}

function injectContentScript(tabId: number) {
  chrome.scripting
    .executeScript({
      target: { tabId: tabId, allFrames: true },
      files: [fileName],
      injectImmediately: true,
    })
    .catch((err) => {
      if (process.env?.NODE_ENV === 'development') {
        console.warn(err);
      }
    });
}
