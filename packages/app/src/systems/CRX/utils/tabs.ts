export async function openTab(url: string) {
  chrome.tabs.create({ url });
}

// Set before a same-version runtime.reload(), which does not fire onInstalled
export const REINJECT_AFTER_RELOAD_KEY = 'reinjectContentScripts';
