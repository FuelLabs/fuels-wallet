import type {
  CommunicationMessage,
  FuelEventArg,
  FuelEvents,
  FuelProviderConfig,
} from '@fuel-wallet/types';
import {
  CONTENT_SCRIPT_NAME,
  PAGE_SCRIPT_NAME,
  MessageTypes,
} from '@fuel-wallet/types';
import type { TransactionRequestLike } from 'fuels';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import { WindowConnection } from './connections/WindowConnection';

export class FuelWalletConnection extends WindowConnection {
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

  async network(): Promise<FuelProviderConfig> {
    return this.client.request('network', {});
  }

  async isConnected(): Promise<boolean> {
    return this.client.request('isConnected', {});
  }

  async connect(): Promise<boolean> {
    return this.client.request('connect', {});
  }

  async disconnect(): Promise<boolean> {
    return this.client.request('disconnect', {});
  }

  async accounts(): Promise<Array<string>> {
    return this.client.request('accounts', {});
  }

  async currentAccount(): Promise<string> {
    return this.client.request('currentAccount', {});
  }

  async signMessage(address: string, message: string): Promise<string> {
    if (!message.trim()) {
      throw new Error('Message is required');
    }
    return this.client.request('signMessage', {
      address,
      message,
    });
  }

  async sendTransaction(
    transaction: TransactionRequestLike,
    providerConfig: FuelProviderConfig
  ): Promise<string> {
    if (!transaction) {
      throw new Error('Transaction is required');
    }
    return this.client.request('sendTransaction', {
      provider: providerConfig,
      transaction: JSON.stringify(transaction),
    });
  }

  on<E extends FuelEvents['type'], D extends FuelEventArg<E>>(
    eventName: E,
    listener: (data: D) => void
  ): this {
    return super.on(eventName, listener);
  }
}
