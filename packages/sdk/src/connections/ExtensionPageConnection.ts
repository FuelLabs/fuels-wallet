import type { JSONRPCResponse } from 'json-rpc-2.0';

import { BACKGROUND_SCRIPT_NAME, POPUP_SCRIPT_NAME } from '../config';
import type {
  CommunicationMessage,
  RequestMessage,
  ResponseMessage,
} from '../types';
import { MessageTypes } from '../types';

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
  }

  ready() {
    this.connection.postMessage({
      target: BACKGROUND_SCRIPT_NAME,
      type: MessageTypes.uiEvent,
      ready: true,
    });
  }

  destroy() {
    this.connection.disconnect();
  }
}
