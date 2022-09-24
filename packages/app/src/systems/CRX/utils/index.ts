import { TAB_BAR_HEIGHT, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export async function openPopup(url: string) {
  const lastFocused = await chrome.windows.getLastFocused();
  // Position window in top right corner of lastFocused window.
  const top = lastFocused.top;
  const left = (lastFocused.left || 0) + ((lastFocused.width || 0) - 350);
  chrome.windows.create({
    type: 'popup',
    url,
    focused: true,
    height: WALLET_HEIGHT + TAB_BAR_HEIGHT,
    width: WALLET_WIDTH,
    left,
    top,
  });
}

export async function openTab(url: string) {
  const internalUrl = chrome.runtime.getURL(url);
  chrome.tabs.create({ url: internalUrl });
}
