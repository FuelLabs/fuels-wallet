import { getPopUpPosition } from './position';

import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export type PopUpInfo = {
  windowId?: number;
  tabId?: number;
};

export async function showPopUp(popUpInfo?: PopUpInfo | null) {
  if (!popUpInfo?.windowId || !popUpInfo?.tabId) return false;

  try {
    const current = await chrome.windows.get(popUpInfo.windowId);
    if (current) {
      await chrome.tabs.update(popUpInfo.tabId, {
        selected: true,
      });
      await chrome.windows.update(popUpInfo.windowId, {
        focused: true,
      });
      return true;
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return false;
}

export async function createPopUp(url: string) {
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
}
