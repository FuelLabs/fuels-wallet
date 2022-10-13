import { getPopUpPosition } from './getPopUpPosition';

import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

const popups = new Map<string, number>();

export async function openPopUp(origin: string, url: string) {
  const currentPopUpId = popups.get(origin);
  if (currentPopUpId) {
    try {
      const current = await chrome.windows.get(currentPopUpId);
      if (current) {
        const window = await chrome.windows.update(currentPopUpId, {
          focused: true,
        });
        return window;
      }
    } catch (err) {
      console.log(err);
    }
  }
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

export async function openTab(url: string) {
  chrome.tabs.create({ url });
}
