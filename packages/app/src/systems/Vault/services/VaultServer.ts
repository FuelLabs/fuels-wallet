import { WalletManager } from '@fuel-ts/wallet-manager';
import EventEmitter from 'events';
import { transactionRequestify, Address } from 'fuels';
import { JSONRPCServer } from 'json-rpc-2.0';

import { IndexedDBStorage } from '~/systems/Account/utils/storage';
import { CoreService } from '~/systems/Core/services';

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
  };
};

export class Vault extends EventEmitter {
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
    'lock',
    'destroy',
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
    Vault.methods.forEach((methodName) => {
      if (!this[methodName]) {
        throw new Error('Method not exists!');
      }
      this.server.addMethod(methodName, this[methodName].bind(this));
    });
  }

  async destroy(): Promise<void> {
    return CoreService.clear();
  }

  async createVault({
    type,
    secret,
  }: VaultInputs['createVault']): Promise<VaultAccount> {
    await this.destroy();
    await this.manager.addVault({
      type,
      secret,
    });
    const account = await this.manager.getAccounts()[0];
    return {
      address: account.address.toString(),
      publicKey: account.publicKey,
      vaultId: account.vaultId || 0,
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
  }: VaultInputs['signTransaction']): Promise<string> {
    const wallet = await this.manager.getWallet(Address.fromString(address));
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    const signature = wallet.signTransaction(transactionRequest);
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

  async exportVault({ vaultId }: VaultInputs['exportVault']): Promise<string> {
    const vault = await this.manager.exportVault(vaultId);
    return vault.secret || '';
  }
}

export type VaultMethods = {
  [Method in keyof Vault]: Vault[Method];
};
