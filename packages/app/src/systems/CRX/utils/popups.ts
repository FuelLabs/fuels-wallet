import { getPopUpPosition } from './position';

import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

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
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return false;
}

export async function createPopUp(url: string) {
  try {
    const { left, top } = await getPopUpPosition();
    const win = await chrome.windows.create({
      type: 'popup',
      url,
      width: WALLET_WIDTH,
      height: WALLET_HEIGHT + TAB_BAR_HEIGHT,
      left,
      top,
    });
    return win?.id;
  } catch (err) {
    throw new Error(`Failed to create popup: ${err}`);
  }
}
