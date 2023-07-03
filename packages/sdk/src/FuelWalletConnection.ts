import type {
  Asset,
  FuelEventArg,
  FuelProviderConfig,
  FuelEvents,
  AbiMap,
} from '@fuel-wallet/types';
import type { JsonFlatAbi, TransactionRequestLike } from 'fuels';
import { transactionRequestify } from 'fuels';

import { WindowConnection } from './connections/WindowConnection';
import { getTransactionSigner } from './utils/getTransactionSigner';

export class FuelWalletConnection extends WindowConnection {
  async ping(): Promise<boolean> {
    return this.client.timeout(1000).request('ping', {});
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
    transaction: TransactionRequestLike & { signer?: string },
    providerConfig: FuelProviderConfig,
    signer?: string
  ): Promise<string> {
    if (!transaction) {
      throw new Error('Transaction is required');
    }
    // Transform transaction object to a transaction request
    const txRequest = transactionRequestify(transaction);

    const address =
      signer || transaction.signer || getTransactionSigner(txRequest);

    return this.client.request('sendTransaction', {
      address,
      provider: providerConfig,
      transaction: JSON.stringify(txRequest),
    });
  }

  async assets(): Promise<Array<Asset>> {
    return this.client.request('assets', {});
  }

  async addAsset(asset: Asset): Promise<boolean> {
    return this.addAssets([asset]);
  }

  async addAssets(assets: Asset[]): Promise<boolean> {
    return this.client.request('addAssets', {
      assets,
    });
  }

  async addAbi(abiMap: AbiMap): Promise<boolean> {
    return this.client.request('addAbi', {
      abiMap,
    });
  }

  async getAbi(contractId: string): Promise<JsonFlatAbi> {
    return this.client.request('getAbi', {
      contractId,
    });
  }

  async hasAbi(contractId: string): Promise<boolean> {
    const abi = await this.getAbi(contractId);
    return !!abi;
  }

  on<E extends FuelEvents['type'], D extends FuelEventArg<E>>(
    eventName: E,
    listener: (data: D) => void
  ): this {
    return super.on(eventName, listener);
  }
}
