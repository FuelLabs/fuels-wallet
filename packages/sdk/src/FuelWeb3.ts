import EventEmitter from 'events';
import { JSONRPCClient } from 'json-rpc-2.0';

import { PAGE_SCRIPT_NAME, CONTENT_SCRIPT_NAME, EVENT_MESSAGE } from './config';
import { isFuelEventMessage, isFuelRPCMessage } from './guards';
import type { FuelMessage } from './types';

export class FuelWeb3 extends EventEmitter {
  readonly client: JSONRPCClient;

  constructor() {
    super();
    this.client = new JSONRPCClient(async (rpcRequest) => {
      this.postMessage({
        target: CONTENT_SCRIPT_NAME,
        request: rpcRequest,
      });
    });
    window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
  }

  postMessage(request: FuelMessage) {
    window.postMessage(request, window.origin);
  }

  onMessage(event: MessageEvent<FuelMessage>) {
    const frozenEvent = Object.freeze(event);
    if (
      event.origin === window.origin &&
      event.data.target === PAGE_SCRIPT_NAME
    ) {
      if (isFuelRPCMessage(frozenEvent.data)) {
        this.client.receive(frozenEvent.data.request);
      } else if (isFuelEventMessage(frozenEvent.data)) {
        frozenEvent.data.data.forEach((eventData) => {
          this.emit(eventData.event, ...eventData.params);
        });
      }
    }
  }

  async connect(): Promise<boolean> {
    return this.client.request('connect');
  }

  async disconnect(): Promise<boolean> {
    return this.client.request('disconnect');
  }

  async accounts(): Promise<Array<string>> {
    return this.client.request('accounts');
  }
}
