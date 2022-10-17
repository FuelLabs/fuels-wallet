import EventEmitter from 'events';
import { JSONRPCClient } from 'json-rpc-2.0';

import { PAGE_SCRIPT_NAME, CONTENT_SCRIPT_NAME, EVENT_MESSAGE } from './config';
import type { FuelWeb3Event, FuelWeb3Message, FuelWeb3Response } from './types';
import { EventType } from './types';

export class FuelWeb3 extends EventEmitter {
  readonly client: JSONRPCClient;

  constructor() {
    super();
    this.client = new JSONRPCClient(async (rpcRequest) => {
      this.postMessage({
        type: EventType.request,
        target: CONTENT_SCRIPT_NAME,
        request: rpcRequest,
      });
    });
    window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
  }

  postMessage(message: FuelWeb3Message) {
    window.postMessage(message, window.origin);
  }

  onResponse(event: FuelWeb3Response) {
    this.client.receive(event.response);
  }

  onEvent(event: FuelWeb3Event) {
    event.events.forEach((eventData) => {
      this.emit(eventData.event, ...eventData.params);
    });
  }

  onMessage(message: MessageEvent<FuelWeb3Message>) {
    const { data: event } = Object.freeze(message);
    const acceptIncomingMessage =
      message.origin === window.origin && event.target === PAGE_SCRIPT_NAME;

    // Check is from the same origin and
    // has the correct target otherwise rejects
    // the message
    if (!acceptIncomingMessage) return null;

    switch (event.type) {
      case EventType.response:
        return this.onResponse(event);
      case EventType.event:
        return this.onEvent(event);
      default:
        return null;
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
