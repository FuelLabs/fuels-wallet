import { getWordsFromValue } from '../../utils';
import { MNEMONIC, PASSWORD } from '../config';

import { AccountService } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';

export async function mockVault() {
  const mnemonic = MNEMONIC;
  const password = PASSWORD;
  const account = await AccountService.createVault({
    data: {
      mnemonic: getWordsFromValue(mnemonic),
      password,
    },
  });
  const network = await NetworkService.addFirstNetwork();

  return {
    account,
    mnemonic,
    password,
    network,
  };
}

export type MockVaultData = Awaited<ReturnType<typeof mockVault>>;
