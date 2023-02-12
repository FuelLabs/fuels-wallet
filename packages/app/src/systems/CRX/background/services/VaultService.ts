import {
  MessageTypes,
  POPUP_SCRIPT_NAME,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';

import type { CommunicationProtocol } from './CommunicationProtocol';

import { VaultServer } from '~/systems/Vault/services';

export class VaultService {
  readonly vault: VaultServer;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.vault = new VaultServer();
    this.setupListeners();
    this.setupAutoClose();
  }

  async setupAutoClose() {
    this.vault.manager.on('unlock', () => {
      chrome.alarms.create('VaultAutoClose', { delayInMinutes: 15 });
      chrome.alarms.onAlarm.addListener((event) => {
        if (event.name === 'VaultAutoClose') {
          this.vault.manager.lock();
        }
      });
    });
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new VaultService(communicationProtocol);
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, async (event) => {
      if (!event.sender?.origin?.includes(chrome.runtime.id)) return;
      if (event.sender?.id !== chrome.runtime.id) return;
      if (event.target !== VAULT_SCRIPT_NAME) return;
      const response = await this.vault.server.receive(event.request);
      if (response) {
        this.communicationProtocol.postMessage({
          id: event.id,
          type: MessageTypes.response,
          target: POPUP_SCRIPT_NAME,
          response,
        });
      }
    });
  }
}
