import fileName from './contentScript?script';

/*
 * This function is called by the background script to register the content script
 * on all tabs. This is necessary because the content script is not automatically
 * registered on tabs that are already open when the extension is installed.
 */
export async function executeContentScript() {
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id || tab.url?.startsWith('chrome://')) continue;
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: [fileName],
          injectImmediately: true,
        })
        // Ignore errors on tabs when executing script
        .catch((err) => {
          if (process.env?.NODE_ENV === 'development') {
            console.warn(err);
          }
        });
    }
  });
}
