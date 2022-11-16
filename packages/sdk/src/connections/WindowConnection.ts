/* eslint-disable @typescript-eslint/no-unused-vars */
import { EVENT_MESSAGE } from '@fuel-wallet/types';
import type { CommunicationMessage } from '@fuel-wallet/types';

import { BaseConnection } from './BaseConnection';

export class WindowConnection extends BaseConnection {
  constructor() {
    super();
    window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
  }

  acceptMessage(message: MessageEvent<CommunicationMessage>) {
    return true;
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
