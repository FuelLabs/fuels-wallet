import {
  FuelConnectorEventTypes,
  type ConnectorMetadata,
  type FuelABI,
  type FuelAsset,
  type Network,
  type Version,
} from '@fuel-wallet/sdk-v2';
import { transactionRequestify, type TransactionRequestLike } from 'fuels';

import { WindowConnection } from '../../connections/WindowConnection';

export class FuelWalletConnector extends WindowConnection {
  name: string = 'Fuel Wallet';
  connected: boolean = false;
  installed: boolean = false;
  events = FuelConnectorEventTypes;
  metadata: ConnectorMetadata = {
    image: '/connectors/fuel-wallet.svg',
    install: {
      action: 'Install',
      description:
        'To connect your Fuel Wallet, install the browser extension.',
      link: 'https://chrome.google.com/webstore/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok',
    },
  };

  async ping(): Promise<boolean> {
    return this.client.timeout(1000).request('ping', {});
  }

  async isConnected(): Promise<boolean> {
    // If the wallet not exists or not connected, return false
    try {
      return await this.client.request('isConnected', {});
    } catch {
      return false;
    }
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

  async currentAccount(): Promise<string | null> {
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
    address: string,
    transaction: TransactionRequestLike
  ): Promise<string> {
    if (!transaction) {
      throw new Error('Transaction is required');
    }
    // Transform transaction object to a transaction request
    const txRequest = transactionRequestify(transaction);

    /**
     * @todo We should remove this once the chainId standard start to be used and chainId is required
     * to be correct according to the network the transaction wants to target.
     */
    const network = await this.currentNetwork();
    const provider = {
      url: network.url,
    };

    return this.client.request('sendTransaction', {
      address,
      transaction: JSON.stringify(txRequest),
      provider,
    });
  }

  async assets(): Promise<Array<FuelAsset>> {
    return this.client.request('assets', {});
  }

  async addAsset(asset: FuelAsset): Promise<boolean> {
    return this.addAssets([asset]);
  }

  async addAssets(assets: FuelAsset[]): Promise<boolean> {
    return this.client.request('addAssets', {
      assets,
    });
  }

  async addABI(contractId: string, abi: FuelABI): Promise<boolean> {
    return this.client.request('addAbi', {
      abiMap: {
        [contractId]: abi,
      },
    });
  }

  async getABI(contractId: string): Promise<FuelABI> {
    return this.client.request('getAbi', {
      contractId,
    });
  }

  async hasABI(contractId: string): Promise<boolean> {
    const abi = await this.getABI(contractId);
    return !!abi;
  }

  async currentNetwork(): Promise<Network> {
    return this.client.request('network', {});
  }

  async selectNetwork(_network: Network): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async networks(): Promise<Network[]> {
    return this.client.request('networks', {});
  }

  async addNetwork(network: Network): Promise<boolean> {
    return this.client.request('addNetwork', { network });
  }

  async version(): Promise<Version> {
    return this.client.request('version', {
      app: '0.0.0',
      network: '0.0.0',
    });
  }
}
