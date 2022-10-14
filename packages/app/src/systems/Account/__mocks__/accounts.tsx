import { Mnemonic } from '@fuel-ts/mnemonic';

import { AccountService } from '../services';

import { MNEMONIC_SIZE } from '~/config';
import { getWordsFromValue } from '~/systems/Core';

export const MOCK_ACCOUNTS = [
  {
    name: 'Account 1',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef',
    publicKey: '0x00',
  },
  {
    name: 'Account 2',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d20934734r',
    publicKey: '0x00',
  },
  {
    name: 'Account 3',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d209347123',
    isHidden: true,
    publicKey: '0x00',
  },
];

export async function createMockAccount(password: string) {
  const mnemonic = getWordsFromValue(Mnemonic.generate(MNEMONIC_SIZE));
  const manager = await AccountService.createManager({
    data: {
      mnemonic,
      password,
    },
  });
  const firstAccount = manager.getAccounts()[0];
  await AccountService.clearAccounts();
  return AccountService.addAccount({
    data: {
      ...MOCK_ACCOUNTS[0],
      address: firstAccount.address.toString(),
      publicKey: firstAccount.publicKey,
    },
  });
}
