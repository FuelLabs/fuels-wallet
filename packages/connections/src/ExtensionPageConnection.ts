import { BACKGROUND_SCRIPT_NAME, POPUP_SCRIPT_NAME } from '@fuel-wallet/types';
import {
  type CommunicationMessage,
  MessageTypes,
  type RequestMessage,
  type ResponseMessage,
} from '@fuels/connectors';
import type { JSONRPCResponse } from 'json-rpc-2.0';

import { BaseConnection } from './BaseConnection';

export class ExtensionPageConnection extends BaseConnection {
  readonly connection: chrome.runtime.Port;

  constructor() {
    super();
    this.connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    this.connection.onMessage.addListener(this.onCommunicationMessage);
    this.ready();
  }

  allowMessage(message: CommunicationMessage): boolean {
    return message.target === POPUP_SCRIPT_NAME;
  }

  sendResponse(response: JSONRPCResponse | null, message: RequestMessage) {
    if (!response) return;
    const responseMessage: ResponseMessage = {
      id: message.id,
      target: BACKGROUND_SCRIPT_NAME,
      type: MessageTypes.response,
      response,
    };
    this.connection.postMessage(responseMessage);
    this.onResponseSent();
  }

  onResponseSent() {
    window.close();
  }

  ready() {
    // Get session from query params
    const session = new URLSearchParams(window.location.search).get('s');
    this.connection.postMessage({
      target: BACKGROUND_SCRIPT_NAME,
      type: MessageTypes.uiEvent,
      ready: true,
      session,
    });
  }

  destroy() {
    this.client.rejectAllPendingRequests('Connection closed');
    this.connection.disconnect();
    this.connection.onMessage.removeListener(this.onCommunicationMessage);
  }

  onRequest(message: RequestMessage) {
    this.server.receive(message.request).then((response) => {
      this.sendResponse(response, message);
    });
  }
}
