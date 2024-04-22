/* eslint-disable no-console */
import { compareVersions } from 'compare-versions';
import { APP_VERSION, VITE_CRX_VERSION_API, WALLET_NAME } from '~/config';

async function runVersionCheck() {
  const latestVersion = await fetch(VITE_CRX_VERSION_API)
    .then((res) => res.json())
    // If fails to fetch the version return current version
    .catch(() => ({ version: APP_VERSION }));
  const version = latestVersion[WALLET_NAME];
  // If app version is greater than the one on the release API ignores the check
  if (compareVersions(APP_VERSION, version) > -1) return;
  // Request update check and reload if available
  console.log('[FUEL WALLET] Checking for updates...');
  chrome.runtime.requestUpdateCheck((details) => {
    if (details === 'update_available') {
      console.log('[FUEL WALLET] Update available reload application...');
      chrome.runtime.reload();
    }
  });
}

chrome.alarms.create('autoUpdate', { periodInMinutes: 15 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'autoUpdate') {
    runVersionCheck();
  }
});
