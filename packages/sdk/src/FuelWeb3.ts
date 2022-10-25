import type { JSONRPCRequest } from 'json-rpc-2.0';

import { CONTENT_SCRIPT_NAME, PAGE_SCRIPT_NAME } from './config';
import { WindowConnection } from './connections/WindowConnection';
import type {
  CommunicationMessage,
  FuelWeb3EventArg,
  FuelWeb3Events,
} from './types';
import { MessageTypes } from './types';

export class FuelWeb3 extends WindowConnection {
  acceptMessage(message: MessageEvent<CommunicationMessage>): boolean {
    const { data: event } = message;
    return (
      message.origin === window.origin && event.target === PAGE_SCRIPT_NAME
    );
  }

  async sendRequest(request: JSONRPCRequest | null) {
    if (request) {
      this.postMessage({
        type: MessageTypes.request,
        target: CONTENT_SCRIPT_NAME,
        request,
      });
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

  on<E extends FuelWeb3Events['type'], D extends FuelWeb3EventArg<E>>(
    eventName: E,
    listener: (data: D) => void
  ): this {
    return super.on(eventName, listener);
  }
}
