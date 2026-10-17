export async function openTab(url: string) {
  chrome.tabs.create({ url });
}

export const REINJECT_AFTER_RELOAD_KEY = 'reinjectContentScripts';
