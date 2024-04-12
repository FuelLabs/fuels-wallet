import {
  BACKGROUND_SCRIPT_NAME,
  type DatabaseRestartEvent,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';

import { errorBoundary } from '../utils';

import { BackgroundService } from './services/BackgroundService';
import { CommunicationProtocol } from './services/CommunicationProtocol';
import { DatabaseEvents } from './services/DatabaseEvents';
import { VaultService } from './services/VaultService';

errorBoundary(() => {
  let communicationProtocol: CommunicationProtocol | undefined =
    new CommunicationProtocol();

  chrome.runtime.onConnect.addListener((port) => {
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
      communicationProtocol?.addConnection(port);
    }
  });

  const backgroundService = BackgroundService.start(communicationProtocol);
  const vaultService = VaultService.start(communicationProtocol);
  const databaseEvents = DatabaseEvents.start(communicationProtocol);

  chrome.runtime.onMessage.addListener(
    (message: DatabaseRestartEvent, _sender, _sendResponse) => {
      if (message?.type === 'DB_EVENT') {
        if (message?.payload?.event === 'restarted') {
          communicationProtocol?.destroy();
          communicationProtocol = undefined;
          communicationProtocol = new CommunicationProtocol();
          backgroundService.restart(communicationProtocol);
          vaultService.restart(communicationProtocol);
          databaseEvents.restart(communicationProtocol);
        }
      }
    }
  );
});
