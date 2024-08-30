import { BACKGROUND_SCRIPT_NAME, VAULT_SCRIPT_NAME } from '@fuel-wallet/types';

import { communicationProtocol, errorBoundary } from '../utils';

import { BackgroundService } from './services/BackgroundService';
import { DatabaseEvents } from './services/DatabaseEvents';
import { VaultService } from './services/VaultService';

errorBoundary(() => {
  let backgroundService: BackgroundService | null = null;
  let vaultService: VaultService | null = null;
  let databaseEvents: DatabaseEvents | null = null;
  function onConnectHandler(port: chrome.runtime.Port) {
    // Only allow connections from the extension
    // This is to prevent other extensions from connecting
    // to the background script and sending messages
    // This is a security measure, this should never happen as
    // manifest configuration externally_connectable is set to
    // only allow connections from the extension itself
    if (port.sender?.id !== chrome.runtime.id) {
      port.disconnect();
      return;
    }
    if ([BACKGROUND_SCRIPT_NAME, VAULT_SCRIPT_NAME].includes(port.name)) {
      communicationProtocol.addConnection(port);
    }
  }

  function onSuspendHandler() {
    // Handle cleanup before the background script is suspended
    backgroundService?.stop();
    vaultService?.stop();
    databaseEvents?.stop();
    backgroundService = null;
    vaultService = null;
    databaseEvents = null;
  }

  function onStartupHandler() {
    // Handle initialization when the background script starts up
    backgroundService = BackgroundService.start(communicationProtocol);
    vaultService = VaultService.start(communicationProtocol);
    databaseEvents = DatabaseEvents.start(communicationProtocol);
  }

  function onRestartHandler() {
    console.log('fsk onRestartHandler');
    onSuspendHandler();
    onStartupHandler();
  }

  // Initialize services when the background script starts up
  onStartupHandler();

  chrome.runtime.onConnect.addListener(onConnectHandler);
  chrome.runtime.onSuspend.addListener(onSuspendHandler);
  chrome.runtime.onStartup.addListener(onStartupHandler);
  chrome.runtime.onUpdateAvailable.addListener(onRestartHandler);
});
