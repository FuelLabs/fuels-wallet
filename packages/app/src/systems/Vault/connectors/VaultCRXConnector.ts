import { POPUP_SCRIPT_NAME, VAULT_SCRIPT_NAME } from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  EventMessage,
  RequestMessage,
  ResponseMessage,
} from '@fuel-wallet/types';
import { MessageTypes } from '@fuel-wallet/types';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import type { VaultClient } from '../services/VaultClient';

export class VaultCRXConnector {
  readonly clientVault: VaultClient;

  constructor(clientVault: VaultClient) {
    this.clientVault = clientVault;
    this.onRequest = this.onRequest.bind(this);
    this.clientVault.onRequest = this.onRequest;
    this.onResponse = this.onResponse.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this.destroy = this.destroy.bind(this);
    this.onCommunicationMessage = this.onCommunicationMessage.bind(this);
    this.connectAndAttachListeners();
  }

  connectAndAttachListeners() {
    this.clientVault.connection = chrome.runtime.connect(chrome.runtime.id, {
      name: VAULT_SCRIPT_NAME,
    });
    this.clientVault.connection.onDisconnect.addListener(this.destroy);
    this.clientVault.connection.onMessage.addListener(
      this.onCommunicationMessage
    );
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

  onEvent(message: EventMessage) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    message.events.forEach((event) => {
      this.clientVault.emit(event.event, ...event.params);
    });
  }

  onResponse(message: ResponseMessage) {
    this.clientVault.client.receive(message.response);
  }

  async onRequest(request: JSONRPCRequest) {
    if (!request) return;
    if (!this.clientVault.connection) this.connectAndAttachListeners();
    if (this.clientVault.connection) {
      const responseMessage: RequestMessage = {
        target: VAULT_SCRIPT_NAME,
        type: MessageTypes.request,
        request,
      };
      this.clientVault.connection.postMessage(responseMessage);
    }
  }

  destroy() {
    this.clientVault.connection?.onMessage.removeListener(
      this.onCommunicationMessage
    );
    this.clientVault.connection?.onDisconnect.removeListener(this.destroy);
    this.clientVault.connection = undefined;
  }
}
