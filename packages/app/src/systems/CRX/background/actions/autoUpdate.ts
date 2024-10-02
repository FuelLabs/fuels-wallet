import { compareVersions } from 'compare-versions';
import { CHAIN_IDS } from 'fuels';
import { APP_VERSION, VITE_CRX_VERSION_API, WALLET_NAME } from '~/config';
import { AccountService } from '~/systems/Account/services/account';
import { NetworkService } from '~/systems/Network/services/network';

// Check if user has any open tab if not return false
async function isOpen() {
  // biome-ignore lint/suspicious/noExplicitAny: getContexts is not available on current types
  const contexts = await (chrome.runtime as any).getContexts({});
  const isOpen = !!contexts.find(({ contextType }: { contextType: string }) =>
    ['TAB', 'POPUP'].includes(contextType)
  );
  return isOpen;
}

async function fetchFeatureFlags() {
  const featureFlags = await fetch(VITE_CRX_VERSION_API)
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
    chrome.alarms.create('reloadWallet', { delayInMinutes: 5 });
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

async function createNetwork() {
  console.log('[FUEL WALLET] Checking create network...');

  const isOpened = await isOpen();
  if (isOpened) return;

  console.log('[FUEL WALLET] Checking current account');
  const account = await AccountService.getCurrentAccount();
  if (!account) return;

  console.log('[FUEL WALLET] Checking feature flag');
  const featureFlags = await fetchFeatureFlags();

  if (!featureFlags.networkUrl) return;

  console.log('[FUEL WALLET] Checking has network');
  const existsNetwork = await NetworkService.getNetworkByChainId({
    chainId: CHAIN_IDS.fuel.mainnet,
  });
  if (existsNetwork?.id) {
    if (existsNetwork.url === featureFlags.networkUrl) {
      console.log('[FUEL WALLET] Network url is the same, skipping');
      chrome.alarms.clear('createNetwork');
      return;
    }

    console.log('[FUEL WALLET] Network url is different, removing and adding');
    await NetworkService.removeNetwork({ id: existsNetwork.id });
  }

  console.log('[FUEL WALLET] Adding network');
  const newNetworkAdded = await NetworkService.addNetwork({
    data: {
      chainId: CHAIN_IDS.fuel.mainnet,
      name: 'Ignition',
      url: featureFlags.networkUrl,
    },
  });
  if (!newNetworkAdded?.id) return;
  console.log('[FUEL WALLET] Selecting network');
  await NetworkService.selectNetwork({ id: newNetworkAdded.id });
  chrome.alarms.clear('createNetwork');
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
    case 'createNetwork':
      createNetwork();
      break;
    default:
      break;
  }
});

// Register alarms to check for updates and reload the wallet
chrome.alarms.create('autoUpdate', { periodInMinutes: 10 });
chrome.alarms.create('createNetwork', { periodInMinutes: 0.1 });
