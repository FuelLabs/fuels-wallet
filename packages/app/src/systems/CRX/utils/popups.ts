import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

import { getPopUpPosition } from './position';

export type ShowPopUp = {
  windowId?: number;
  tabId?: number;
};

export async function closePopUp(tabId: number | null) {
  if (tabId) {
    // silently dismiss error if tab was closed already
    chrome.tabs.remove(tabId).catch(() => {});
  }
}

export async function showPopUp(params?: ShowPopUp | null) {
  if (!params?.windowId || !params?.tabId) return false;

  try {
    const current = await chrome.windows.get(params.windowId);
    if (current) {
      await chrome.tabs.update(params.tabId, {
        selected: true,
      });
      await chrome.windows.update(params.windowId, {
        focused: true,
      });
      return true;
    }
  } catch (_err) {}

  return false;
}

export async function createPopUp(url: string) {
  const options: chrome.windows.CreateData = {
    type: 'popup',
    url,
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT + TAB_BAR_HEIGHT,
  };
  const { left, top } = await getPopUpPosition();
  try {
    const win = await chrome.windows.create({ ...options, left, top });
    return win?.id;
  } catch (_) {
    // Chrome rejects bounds that are less than 50% on screen, for example
    // after a display is unplugged. Let Chrome place the popup instead.
    const win = await chrome.windows.create(options);
    return win?.id;
  }
}
