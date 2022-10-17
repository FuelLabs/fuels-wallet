import { BACKGROUND_SCRIPT_NAME } from '@fuels-wallet/sdk';

import { BackgroundService } from '../services/BackgroundService';
import { CommunicationProtocol } from '../services/CommunicationProtocol';

const communicationProtocol = new CommunicationProtocol();

// eslint-disable-next-line no-new
new BackgroundService(communicationProtocol);

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === BACKGROUND_SCRIPT_NAME) {
    communicationProtocol.addConnection(port);
  }
});
