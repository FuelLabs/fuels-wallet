import { POPUP_SCRIPT_NAME, VAULT_SCRIPT_NAME } from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  EventMessage,
  RequestMessage,
  ResponseMessage,
} from '@fuels/connectors';
import { MessageTypes } from '@fuels/connectors';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import type { VaultClient } from '../services/VaultClient';

export class VaultCRXConnector {
  readonly connection: chrome.runtime.Port;
  readonly clientVault: VaultClient;

  constructor(clientVault: VaultClient) {
    this.clientVault = clientVault;
    this.connection = chrome.runtime.connect(chrome.runtime.id, {
      name: VAULT_SCRIPT_NAME,
    });
    this.connection.onMessage.addListener(this.onCommunicationMessage);
    this.clientVault.onRequest = this.onRequest.bind(this);
  }

  onCommunicationMessage = (message: CommunicationMessage) => {
    if (message.target !== POPUP_SCRIPT_NAME) return;
    switch (message.type) {
      case MessageTypes.response:
        this.onResponse(message);
        break;
      case MessageTypes.event:
        this.onEvent(message);
        break;
      default:
    }
  };

  async onEvent(message: EventMessage) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    message.events.forEach((event) => {
      this.clientVault.emit(event.event, ...event.params);
    });
  }

  async onResponse(message: ResponseMessage) {
    this.clientVault.client.receive(message.response);
  }

  async onRequest(request: JSONRPCRequest): Promise<void> {
    if (!request) return;
    const responseMessage: RequestMessage = {
      target: VAULT_SCRIPT_NAME,
      type: MessageTypes.request,
      request,
    };
    this.connection.postMessage(responseMessage);
  }
}
