import { WALLET_WIDTH } from '~/config';

export async function getPopUpPosition() {
  let left = 0;
  let top = 0;
  try {
    const {
      top: windowTop = 0,
      left: windowLeft = 0,
      width: windowWidth = 0,
    } = await chrome.windows.getLastFocused();
    top = windowTop;
    left = windowLeft + (windowWidth - WALLET_WIDTH);
  } catch (_) {
    const { screenX, screenY, outerWidth } = window;
    top = Math.max(screenY, 0);
    left = Math.max(screenX + (outerWidth - WALLET_WIDTH), 0);
  }

  return { left, top };
}
