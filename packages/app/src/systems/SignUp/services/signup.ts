import type { Account } from '@fuel-wallet/types';

import { IS_LOGGED_KEY } from '~/config';
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
};

export type SignUpServiceOutputs = {
  save: {
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

  static async save({ data }: SignUpServiceInputs['create']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    // Unlock Vault
    await VaultService.unlock({ password: data.password });

    // Create vault using mnemonic
    const account = await VaultService.createVault({
      type: 'mnemonic',
      secret: getPhraseFromValue(data.mnemonic),
    });
    Storage.setItem(IS_LOGGED_KEY, true);
    console.log(Storage.getItem(IS_LOGGED_KEY));
    Storage.setItem('mnemonic', data.mnemonic);
    Storage.setItem('account', account);
    VaultService.lock();
  }

  static getSaved(): SignUpServiceOutputs['save'] {
    const mnemonic = Storage.getItem('mnemonic') as string[];
    const account = Storage.getItem('account') as Account;
    return {
      mnemonic,
      account,
    };
  }

  static hasSaved(): boolean {
    return !!Storage.getItem('mnemonic') && !!Storage.getItem('account');
  }
}
