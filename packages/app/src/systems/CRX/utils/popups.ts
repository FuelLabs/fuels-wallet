import { getPopUpPosition } from './position';

import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

const popups = new Map<string, number>();

export async function getPopUp(windowId?: number) {
  const tabs = await chrome.tabs.query({ windowId });
  const tabId = tabs?.[0].id;

  return tabId || null;
}

export async function getCurrentPopUp(origin: string) {
  const windowId = popups.get(origin);
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

export async function showPopUp(origin: string, url: string) {
  const current = await getCurrentPopUp(origin);
  if (current) return current;
  return openPopUp(origin, url);
}

export async function openPopUp(origin: string, url: string) {
  const { left, top } = await getPopUpPosition();
  const popup = await chrome.windows.create({
    type: 'popup',
    url,
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT + TAB_BAR_HEIGHT,
    left,
    top,
  });

  if (popup.id) {
    popups.set(origin, popup.id);
  }

  return popup;
}
