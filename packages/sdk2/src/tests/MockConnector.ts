import type { Asset } from '@fuels/assets';
import { WalletLocked, type TransactionRequestLike, Provider } from 'fuels';
import { setTimeout } from 'timers/promises';

import type {
  FuelABI,
  Network,
  WalletConnectorMetadata,
} from '../FuelConnector';
import { FuelConnector } from '../FuelConnector';
import { FuelEvents } from '../FuelConnectorAPI';

import { generateAccounts } from './utils/generateAccounts';

type MockConnectorOptions = {
  name?: string;
  accounts?: Array<string>;
  networks?: Array<Network>;
  pingDelay?: number;
  metadata?: Partial<WalletConnectorMetadata>;
};

export class MockConnector extends FuelConnector {
  _accounts: Array<string>;
  _networks: Array<Network>;
  _pingDelay: number;
  name = 'Fuel Wallet';

  constructor(options: MockConnectorOptions = {}) {
    super();
    this._accounts = options.accounts ?? generateAccounts(2);
    this._networks = options.networks ?? [
      {
        chainId: 0,
        url: 'http://localhost:4000/graphql',
      },
    ];
    // Time should be under 1 second
    this._pingDelay = options.pingDelay ?? 900;
    this.name = options.name ?? this.name;
    this.metadata = {
      image: '/connectors/fuel-wallet.svg',
      connector: 'Fuel Wallet',
      install: {
        action: 'Install',
        description:
          'To connect your Fuel Wallet, install the browser extension.',
        link: 'https://chrome.google.com/webstore/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok',
      },
      ...options.metadata,
    };
  }

  async ping() {
    await setTimeout(this._pingDelay);
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
    return this._accounts;
  }

  async connect() {
    this.emit(FuelEvents.connection, true);
    this.emit(FuelEvents.accounts, this._accounts);
    this.emit(FuelEvents.currentAccount, this._accounts[0]);
    return true;
  }

  async disconnect() {
    this.emit(FuelEvents.connection, false);
    this.emit(FuelEvents.accounts, []);
    this.emit(FuelEvents.currentAccount, null);
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
    return this._accounts[0];
  }

  async assets() {
    return [];
  }

  async addAssets(_assets: Array<Asset>) {
    return true;
  }

  async addNetwork(_network: Network) {
    this._networks.push(_network);
    this.emit(FuelEvents.networks, this._networks);
    this.emit(FuelEvents.currentNetwork, _network);
    return true;
  }

  async selectNetwork(_network: Network) {
    this.emit(FuelEvents.currentNetwork, _network);
    return true;
  }

  async networks() {
    return this._networks ?? [];
  }

  async currentNetwork() {
    return this._networks[0];
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
