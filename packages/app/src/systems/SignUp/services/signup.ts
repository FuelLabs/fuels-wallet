import type { Account } from '@fuel-wallet/types';

import { IS_SIGNING_UP_KEY } from '~/config';
import { AccountService } from '~/systems/Account';
import { CoreService, Storage } from '~/systems/Core';
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
    };
  };
};

export type SignUpServiceOutputs = {
  save: {
    mnemonic?: string[];
    account?: Account;
  };
  getPositionsToConfirm: {
    positions: number[];
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

    try {
      // Clear databse on create
      await CoreService.clear();

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
      const newAccount = await AccountService.addAccount({
        data: {
          name: 'Account 1',
          address: account.address.toString(),
          publicKey: account.publicKey,
          isHidden: false,
          vaultId: account.vaultId,
        },
      });
      return newAccount;
    } catch (e) {
      throw new Error(`Error creating account : ${e}`);
    }
  }

  static async complete({ data, account }: SignUpServiceInputs['complete']) {
    if (!account || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    await AccountService.clearAccounts();
    await CoreService.clear();

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
      account,
    };
  }

  static hasSaved(): boolean {
    return !!Storage.getItem(IS_SIGNING_UP_KEY);
  }

  static async getPositionsToConfirm({
    data,
  }: SignUpServiceInputs['getWordsToConfirm']): Promise<
    SignUpServiceOutputs['getPositionsToConfirm']
  > {
    if (!data?.mnemonic) {
      throw new Error('Invalid password');
    }

    return VaultService.getPositionsToConfirm({
      words: data.mnemonic,
    });
  }

  static async confirmMnemonic({
    data,
  }: SignUpServiceInputs['confirmMnemonic']): Promise<boolean> {
    if (!data?.mnemonic) {
      throw new Error('Invalid words');
    }

    return VaultService.confirmMnemonic({
      words: data.mnemonic,
    });
  }

  static async deleteSaved() {
    await CoreService.clear();
  }
}
