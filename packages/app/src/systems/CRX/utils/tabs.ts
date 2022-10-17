import { Methods } from '../types';

export async function openTab(url: string) {
  chrome.tabs.create({ url });
}

export const createCachedGetTabId = () => {
  let tabId: number;
  return async () => {
    if (tabId) return tabId;
    tabId = await chrome.runtime.sendMessage<{ type: string }, number>(
      chrome.runtime.id,
      {
        type: Methods.getTabId,
      }
    );
    return tabId;
  };
};
