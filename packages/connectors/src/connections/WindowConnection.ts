import {
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuel-wallet/types';
import type { CommunicationMessage } from '@fuel-wallet/types';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import { BaseConnection } from './BaseConnection';

export class WindowConnection extends BaseConnection {
  isListenerAdded = false;

  constructor() {
    super();
    this.setupListener();
  }

  acceptMessage(message: MessageEvent<CommunicationMessage>): boolean {
    const { data: event } = message;
    return (
      message.origin === window.origin && event.type !== MessageTypes.request
    );
  }

  setupListener() {
    window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
  }

  async sendRequest(request: JSONRPCRequest | null) {
    if (!request) return;
    this.postMessage({
      type: MessageTypes.request,
      target: CONTENT_SCRIPT_NAME,
      request,
    });
  }

  onMessage = (message: MessageEvent<CommunicationMessage>) => {
    const messageFroze = Object.freeze(message);
    if (!this.acceptMessage(messageFroze)) return;
    const { data: event } = messageFroze;
    this.onCommunicationMessage(event);
  };

  postMessage(message: CommunicationMessage, origin?: string) {
    window.postMessage(message, origin || window.origin);
  }
}
