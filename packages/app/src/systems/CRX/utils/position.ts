import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export async function getPopUpPosition() {
  let left = 0;
  let top = 0;

  try {
    // Get information about all connected displays
    const displays = await chrome.system.display.getInfo();

    // Assume primary display is the first one marked as primary
    const primaryDisplay =
      displays.find((display) => display.isPrimary) || displays[0];

    if (!primaryDisplay) {
      throw new Error('No displays found');
    }

    const { bounds } = primaryDisplay;
    const screenWidth = bounds.width;
    const screenHeight = bounds.height;

    // Attempt to position at top-right Corner
    left = bounds.left + screenWidth - WALLET_WIDTH;
    top = bounds.top;

    // Ensure at least 50% within bounds
    const isTopRightValid =
      left + WALLET_WIDTH * 0.5 >= bounds.left &&
      top + WALLET_HEIGHT * 0.5 >= bounds.top &&
      left <= bounds.left + screenWidth - WALLET_WIDTH * 0.5 &&
      top <= bounds.top + screenHeight - WALLET_HEIGHT * 0.5;

    if (!isTopRightValid) {
      // Fallback to centered position
      left = bounds.left + (screenWidth - WALLET_WIDTH) / 2;
      top = bounds.top + (screenHeight - WALLET_HEIGHT) / 2;
    }

    // **Final adjustment to ensure full isibility
    left = Math.max(
      bounds.left,
      Math.min(left, bounds.left + screenWidth - WALLET_WIDTH)
    );
    top = Math.max(
      bounds.top,
      Math.min(top, bounds.top + screenHeight - WALLET_HEIGHT)
    );
  } catch (error) {
    console.error('Failed to get display info:', error);
    try {
      const focusedWindow = await chrome.windows.getLastFocused();
      const {
        left: windowLeft = 0,
        top: windowTop = 0,
        width: windowWidth = 0,
      } = focusedWindow;

      // Attempt top-Right relative to focused window
      left = windowLeft + windowWidth - WALLET_WIDTH;
      top = windowTop;

      // ensure at least 50% within bounds**
      const { width: screenWidth, height: screenHeight } =
        await getPrimaryDisplaySize();
      const isTopRightValid =
        left + WALLET_WIDTH * 0.5 >= 0 &&
        top + WALLET_HEIGHT * 0.5 >= 0 &&
        left <= screenWidth - WALLET_WIDTH * 0.5 &&
        top <= screenHeight - WALLET_HEIGHT * 0.5;

      if (!isTopRightValid) {
        // fallback to centered position**
        left = (screenWidth - WALLET_WIDTH) / 2;
        top = (screenHeight - WALLET_HEIGHT) / 2;
      }

      // final adjustment
      left = Math.max(0, Math.min(left, screenWidth - WALLET_WIDTH));
      top = Math.max(0, Math.min(top, screenHeight - WALLET_HEIGHT));
    } catch (fallbackError) {
      console.error('Failed to get focused window:', fallbackError);
      // bsolute fallback to top-left corner
      left = 100;
      top = 100;
    }
  }

  return { left, top };
}

// Helper function to get primary display size
async function getPrimaryDisplaySize() {
  const displays = await chrome.system.display.getInfo();
  const primaryDisplay =
    displays.find((display) => display.isPrimary) || displays[0];

  if (!primaryDisplay) {
    throw new Error('No displays found');
  }

  return {
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
  };
}
