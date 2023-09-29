import type { Asset } from '@fuels/assets';
import { WalletLocked, type TransactionRequestLike, Provider } from 'fuels';

import type { FuelABI, Network } from '../FuelConnector';
import { FuelConnector } from '../FuelConnector';

export class FuelWalletConnector extends FuelConnector {
  constructor() {
    super();

    setTimeout(() => {
      this.emit('connection', true);
    }, 3000);
  }

  metadata = {
    name: 'Fuel Wallet',
    image: '/connectors/fuel-wallet.svg',
    connector: 'Fuel Wallet',
    install: {
      action: 'Install',
      description:
        'To connect your Fuel Wallet, install the browser extension.',
      link: 'https://chrome.google.com/webstore/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok',
    },
  };

  async ping() {
    return true;
  }

  async version() {
    return {
      app: '0.0.1',
      network: '>=0.12.4',
    };
  }

  async isConnected() {
    return true;
  }

  async accounts() {
    return [];
  }

  async connect() {
    return true;
  }

  async disconnect() {
    return false;
  }

  async sendTransaction(
    _address: string,
    _transaction: TransactionRequestLike,
    _network: Network
  ) {
    return '0xefca54d7824226b6710208c8f6088c532a91715fa3db85a7645d0b59f8c57c98';
  }

  async currentAccount() {
    return null;
  }

  async assets() {
    return [];
  }

  async addAssets(_assets: Array<Asset>) {
    return true;
  }

  async addNetwork(_network: Network) {
    return true;
  }

  async networks() {
    return [];
  }

  async currentNetwork() {
    return {
      url: 'text',
      chainId: 0,
    } as Network;
  }

  async addABI(_contractId: string, _abi: FuelABI) {
    return true;
  }

  async getABI(_id: string) {
    return null;
  }

  async hasABI(_id: string) {
    return true;
  }

  async getWallet(address: string) {
    const provider = await Provider.create('http://localhost:4000/graphql');
    return new WalletLocked(address, provider);
  }

  async getProvider() {
    return Provider.create('http://localhost:4000/graphql');
  }
}
