import { getPopUpPosition } from './position';

import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export async function getPopUpId(windowId?: number) {
  const tabs = await chrome.tabs.query({ windowId });
  const tabId = tabs?.[0].id;

  return tabId || null;
}

export async function showPopUp(windowId: number | null | undefined) {
  if (!windowId) return null;

  try {
    const current = await chrome.windows.get(windowId);
    if (current) {
      const window = await chrome.windows.update(windowId, {
        focused: true,
      });
      return window;
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return null;
}

export async function createPopUp(origin: string, url: string) {
  const { left, top } = await getPopUpPosition();
  const window = await chrome.windows.create({
    type: 'popup',
    url,
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT + TAB_BAR_HEIGHT,
    left,
    top,
  });
  return window;
}
