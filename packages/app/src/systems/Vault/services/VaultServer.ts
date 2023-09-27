import { WalletManager } from '@fuel-ts/wallet-manager';
import EventEmitter from 'events';
import { transactionRequestify, Address, Provider } from 'fuels';
import { JSONRPCServer } from 'json-rpc-2.0';
import { VITE_FUEL_PROVIDER_URL } from '~/config';
import { IndexedDBStorage } from '~/systems/Account/utils/storage';

export type VaultAccount = {
  address: string;
  publicKey: string;
  vaultId: number;
};

export type VaultInputs = {
  createVault: {
    type: string;
    secret: string;
  };
  unlock: {
    password: string;
  };
  addAccount: {
    vaultId: number;
  };
  signTransaction: {
    transaction: string;
    address: string;
    providerUrl: string;
  };
  signMessage: {
    message: string;
    address: string;
  };
  changePassword: {
    currentPassword: string;
    password: string;
  };
  exportVault: {
    vaultId: number;
    password: string;
  };
  exportPrivateKey: {
    address: string;
    password: string;
  };
};

export class VaultServer extends EventEmitter {
  readonly server: JSONRPCServer;
  readonly manager: WalletManager;
  static readonly methods: Array<string> = [
    'isLocked',
    'unlock',
    'createVault',
    'getAccounts',
    'addAccount',
    'signMessage',
    'signTransaction',
    'changePassword',
    'exportVault',
    'exportPrivateKey',
    'lock',
  ];

  constructor() {
    super();
    const storage = new IndexedDBStorage();
    const manager = new WalletManager({ storage });
    this.manager = manager;
    this.server = new JSONRPCServer();
    this.setupMethods();
  }

  setupMethods() {
    VaultServer.methods.forEach((methodName) => {
      if (!this[methodName]) {
        throw new Error('Method not exists!');
      }
      this.server.addMethod(methodName, this[methodName].bind(this));
    });
  }

  async createVault({
    type,
    secret,
  }: VaultInputs['createVault']): Promise<VaultAccount> {
    const provider = await Provider.create(VITE_FUEL_PROVIDER_URL);
    await this.manager.addVault({
      type,
      secret,
      provider,
    });
    const accounts = await this.manager.getAccounts();
    const vaults = await this.manager.getVaults();
    const vaultId = vaults.length - 1;
    const [account] = accounts.slice(-1);
    return {
      address: account.address.toString(),
      publicKey: account.publicKey,
      vaultId,
    };
  }

  async isLocked(): Promise<boolean> {
    return this.manager.isLocked;
  }

  async unlock({ password }: VaultInputs['unlock']): Promise<void> {
    await this.manager.unlock(password);
  }

  async lock(): Promise<void> {
    await this.manager.lock();
  }

  async addAccount({
    vaultId,
  }: VaultInputs['addAccount']): Promise<VaultAccount> {
    const account = await this.manager.addAccount({ vaultId });
    return {
      address: account.address.toString(),
      publicKey: account.publicKey,
      vaultId: account.vaultId || 0,
    };
  }

  async getAccounts(): Promise<Array<VaultAccount>> {
    const accounts = await this.manager.getAccounts();
    return accounts.map((ac) => ({
      address: ac.address.toString(),
      publicKey: ac.publicKey,
      vaultId: ac.vaultId || 0,
    }));
  }

  async signTransaction({
    transaction,
    address,
    providerUrl,
  }: VaultInputs['signTransaction']): Promise<string> {
    const wallet = await this.manager.getWallet(Address.fromString(address));
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    const provider = await Provider.create(providerUrl);
    wallet.connect(provider);
    const signature = await wallet.signTransaction(transactionRequest);
    return signature;
  }

  async signMessage({
    message,
    address,
  }: VaultInputs['signMessage']): Promise<string> {
    const wallet = await this.manager.getWallet(Address.fromString(address));
    const signature = wallet.signMessage(message);
    return signature;
  }

  async changePassword({
    currentPassword,
    password,
  }: VaultInputs['changePassword']): Promise<void> {
    await this.manager.updatePassphrase(currentPassword, password);
  }

  async exportVault({
    vaultId,
    password,
  }: VaultInputs['exportVault']): Promise<string> {
    await this.manager.unlock(password);
    const vault = await this.manager.exportVault(vaultId);
    return vault.secret || '';
  }

  async exportPrivateKey({
    address,
    password,
  }: VaultInputs['exportPrivateKey']): Promise<string> {
    await this.manager.unlock(password);
    return this.manager.exportPrivateKey(Address.fromString(address));
  }
}

export type VaultMethods = {
  [Method in keyof VaultServer]: VaultServer[Method];
};
