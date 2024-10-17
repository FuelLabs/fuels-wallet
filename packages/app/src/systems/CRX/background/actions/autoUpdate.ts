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

function getCacheParam() {
  return `?v=${Date.now()}`;
}
async function fetchFeatureFlags() {
  const featureFlags = await fetch(VITE_CRX_VERSION_API + getCacheParam())
    .then((res) => res.json())
    // If fails to fetch the version return a empty object
    .catch(() => ({}));

  return featureFlags;
}

async function getLatestVersion() {
  const latestVersion = await fetchFeatureFlags();
  return latestVersion[WALLET_NAME] || APP_VERSION;
}

async function runVersionCheck() {
  const version = await getLatestVersion();
  // If app version is greater than the one on the release API ignores the check
  if (compareVersions(APP_VERSION, version) > -1) return;
  if (await isOpen()) return;
  // Request update check and reload if available
  console.debug('[FUEL WALLET] Checking for updates...');
  chrome.runtime.requestUpdateCheck((details) => {
    if (details === 'update_available') {
      console.log('[FUEL WALLET] Update available reload application...');
      // Remove the alarm to check for updates until next reload
      chrome.alarms.clear('autoUpdate');
      return;
    }
    console.debug('[FUEL WALLET] No update available', details);
  });
}

async function reloadWallet() {
  if (await isOpen()) {
    console.debug('[FUEL WALLET] Wallet is open, waiting 5 minutes...');
    // If the wallet is open, wait 5 minutes and try again
    chrome.alarms.create('reloadWallet', { delayInMinutes: 1 });
    return;
  }
  // Check if reload already happened
  const version = await getLatestVersion();
  if (APP_VERSION === version) {
    chrome.alarms.clear('reloadWallet');
    return;
  }
  chrome.runtime.reload();
}

// Once the app is updated reload the wallet
chrome.runtime.onUpdateAvailable.addListener(() => reloadWallet());
chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case 'autoUpdate':
      runVersionCheck();
      break;
    case 'reloadWallet':
      reloadWallet();
      break;
    default:
      break;
  }
});

// Register alarms to check for updates and reload the wallet
chrome.alarms.create('autoUpdate', { periodInMinutes: 1 });
