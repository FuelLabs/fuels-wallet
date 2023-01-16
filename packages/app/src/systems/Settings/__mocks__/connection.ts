/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { Connection } from '@fuel-wallet/types';
import { Wallet } from 'fuels';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { ConnectionService } from '~/systems/DApp/services';
import { NetworkService } from '~/systems/Network';

function createAccount(name: string) {
  const wallet = Wallet.generate();
  return AccountService.addAccount({
    data: {
      name,
      address: wallet.address.toString(),
      publicKey: wallet.publicKey,
    },
  });
}

export async function mockConnections() {
  await AccountService.clearAccounts();
  const account1 = await createAccount('Account 1');
  const account2 = await createAccount('Account 2');
  await ConnectionService.clearConnections();
  const connection1 = await ConnectionService.addConnection({
    data: {
      origin: 'uniswap.org',
      accounts: [account1?.address!],
    },
  });
  const connection2 = await ConnectionService.addConnection({
    data: {
      origin: 'fuellabs.github.io/swayswap',
      accounts: [account1?.address!, account2?.address!],
    },
  });
  return {
    account1,
    account2,
    connection1,
    connection2,
  };
}

export async function connectionsLoader() {
  await NetworkService.clearNetworks();
  await NetworkService.addFirstNetwork();
  await AccountService.clearAccounts();
  return mockConnections();
}

export const MOCK_CONNECTION = {
  origin: 'https://example.com',
  accounts: [MOCK_ACCOUNTS[0].address],
} as Connection;
