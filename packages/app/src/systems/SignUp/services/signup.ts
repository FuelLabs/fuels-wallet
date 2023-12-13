import { AccountService } from '~/systems/Account';
import { db } from '~/systems/Core/utils/database';
import { getPhraseFromValue } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network';
import { VaultService } from '~/systems/Vault';

export type SignUpServiceInputs = {
  create: {
    data: {
      password?: string;
      mnemonic?: string[];
    };
  };
};

export class SignUpService {
  static async create({ data }: SignUpServiceInputs['create']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    // Ensure database is open
    await db.open();
    // Clear databse on create
    await db.clear();

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
}
