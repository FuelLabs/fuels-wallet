import { compareVersions } from 'compare-versions';
import { APP_VERSION, VITE_CRX_VERSION_API, WALLET_NAME } from '~/config';

// Check if user has any open tab if not return false
async function isOpen() {
  // biome-ignore lint/suspicious/noExplicitAny: getContexts is not available on current types
  const contexts = await (chrome.runtime as any).getContexts({});
  const isOpen = !!contexts.find(({ contextType }: { contextType: string }) =>
    ['TAB', 'POPUP'].includes(contextType)
  );
  return isOpen;
}

async function runVersionCheck() {
  const latestVersion = await fetch(VITE_CRX_VERSION_API)
    .then((res) => res.json())
    // If fails to fetch the version return a empty object
    .catch(() => ({}));
  const version = latestVersion[WALLET_NAME] || APP_VERSION;
  // If app version is greater than the one on the release API ignores the check
  if (compareVersions(APP_VERSION, version) > -1) return;
  if (await isOpen()) return;
  // Request update check and reload if available
  console.log('[FUEL WALLET] Checking for updates...');
  chrome.runtime.requestUpdateCheck((details) => {
    if (details === 'update_available') {
      console.log('[FUEL WALLET] Update available reload application...');
      chrome.runtime.reload();
    }
  });
}

chrome.alarms.create('autoUpdate', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'autoUpdate') {
    runVersionCheck();
  }
});
