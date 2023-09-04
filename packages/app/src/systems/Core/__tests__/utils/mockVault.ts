import { NetworkService } from '~/systems/Network';
import { SignUpService } from '~/systems/SignUp/services';

import { getWordsFromValue } from '../../utils';
import { MNEMONIC, PASSWORD, PKEY } from '../config';

type MockVaultConfig = {
  password?: string;
};

export async function mockVault(config?: MockVaultConfig) {
  const mnemonic = MNEMONIC;
  const password = config?.password || PASSWORD;
  const account = await SignUpService.create({
    data: {
      mnemonic: getWordsFromValue(mnemonic),
      password,
    },
  });
  const network = await NetworkService.getSelectedNetwork();

  return {
    account: account!,
    network: network!,
    mnemonic,
    password,
    pkey: PKEY,
  };
}

export type MockVaultData = Awaited<ReturnType<typeof mockVault>>;
