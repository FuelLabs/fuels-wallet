import type { Account } from '@fuel-wallet/types';

import { IS_SIGNING_UP_KEY } from '~/config';
import { AccountService } from '~/systems/Account';
import { Storage } from '~/systems/Core';
import { db } from '~/systems/Core/utils/database';
import { getPhraseFromValue } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network';
import { VaultService } from '~/systems/Vault/services';

export type SignUpServiceInputs = {
  create: {
    data: {
      password?: string;
      mnemonic?: string[];
    };
  };
  complete: {
    data: {
      password?: string;
      mnemonic?: string[];
    };
    account: Account;
  };
  getWordsToConfirm: {
    data: {
      mnemonic?: string[];
    };
  };
  confirmMnemonic: {
    data: {
      mnemonic?: string[];
      positions?: number[];
    };
  };
};

export type SignUpServiceOutputs = {
  save: {
    mnemonic?: string[];
    account?: Account;
  };
  getWordsToConfirm: {
    words?: string[];
    positions?: number[];
  };
  getSaved: {
    mnemonic?: string[];
    account?: Account;
  };
};
export class SignUpService {
  static async create({ data }: SignUpServiceInputs['create']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    // Clear databse on create
    await db.clear();
    await Storage.clear();

    // Add networks
    await NetworkService.addDefaultNetworks();

    // Unlock Vault
    await VaultService.unlock({ password: data.password });

    // Create vault using mnemonic
    const account = await VaultService.createVault({
      type: 'mnemonic',
      secret: getPhraseFromValue(data.mnemonic),
    });

    // Register the first account retuned from the vault
    return AccountService.addAccount({
      data: {
        name: 'Account 1',
        address: account.address.toString(),
        publicKey: account.publicKey,
        isHidden: false,
        vaultId: account.vaultId,
      },
    });
  }

  static async complete({ data, account }: SignUpServiceInputs['complete']) {
    if (!account || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    await db.clear();
    await Storage.clear();

    // Register the first account retuned from the vault
    return AccountService.addAccount({
      data: {
        name: 'Account 1',
        address: account.address.toString(),
        publicKey: account.publicKey,
        isHidden: false,
        vaultId: account.vaultId,
      },
    });
  }

  static async save({ data }: SignUpServiceInputs['create']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    // Unlock Vault
    VaultService.unlock({ password: data.password });

    // Create vault using mnemonic
    await VaultService.createVault({
      type: 'mnemonic',
      secret: getPhraseFromValue(data.mnemonic),
    });
    Storage.setItem(IS_SIGNING_UP_KEY, true);
  }

  static async getSaved(): Promise<SignUpServiceOutputs['getSaved']> {
    const vaultIsLocked = await VaultService.isLocked();
    if (vaultIsLocked) {
      throw new Error('Vault is locked');
    }
    const secret = await VaultService.exportVault({
      password: undefined,
      vaultId: 0,
      // TODO change once we add multiple vault management
      // https://github.com/FuelLabs/fuels-wallet/issues/562
    });
    const mnemonic = secret.split(' ');
    const vaultAccounts = await VaultService.getAccounts();
    const vaultAccount = vaultAccounts[0];
    const account = {
      name: 'Account 1',
      address: vaultAccount.address.toString(),
      publicKey: vaultAccount.publicKey,
      isHidden: false,
      vaultId: vaultAccount.vaultId,
    } as Account;
    return {
      mnemonic,
      account,
    };
  }

  static hasSaved(): boolean {
    return !!Storage.getItem(IS_SIGNING_UP_KEY);
  }

  static async getWordsToConfirm({
    data,
  }: SignUpServiceInputs['getWordsToConfirm']): Promise<
    SignUpServiceOutputs['getWordsToConfirm']
  > {
    if (!data?.mnemonic) {
      throw new Error('Invalid password');
    }

    return VaultService.getWordsToConfirm({
      words: data.mnemonic,
    });
  }

  static async confirmMnemonic({
    data,
  }: SignUpServiceInputs['confirmMnemonic']): Promise<boolean> {
    if (!data?.mnemonic) {
      throw new Error('Invalid words');
    }
    if (!data?.positions) {
      throw new Error('Invalid positions');
    }

    return VaultService.confirmMnemonic({
      words: data.mnemonic,
      positions: data.positions,
    });
  }

  static async deleteSaved() {
    await db.clear();
    await Storage.clear();
  }
}
