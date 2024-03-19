import type { Connection } from '@fuel-wallet/types';
import { Signer } from 'fuels';
import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { ConnectionService } from '~/systems/DApp/services';
import { NetworkService } from '~/systems/Network';

function createAccount(name: string, isHidden = false) {
  const signer = new Signer(Signer.generatePrivateKey());
  return AccountService.addAccount({
    data: {
      name,
      address: signer.address.toString(),
      publicKey: signer.publicKey,
      isHidden,
    },
  });
}

export async function mockConnections() {
  await AccountService.clearAccounts();
  const account1 = await createAccount('Account 1');
  const account2 = await createAccount('Account 2');
  const account3 = await createAccount('Account 3', true);
  await ConnectionService.clearConnections();
  const connection1 = await ConnectionService.addConnection({
    data: {
      origin: 'uniswap.org',
      accounts: [account1?.address!],
      favIconUrl: 'https://wallet.fuel.network/favicon.ico',
      title: 'Uniswap',
    },
  });
  const connection2 = await ConnectionService.addConnection({
    data: {
      origin: 'fuellabs.github.io/swayswap',
      accounts: [account1?.address!, account2?.address!],
      favIconUrl: 'https://wallet.fuel.network/favicon.ico',
      title: 'SwaySwap',
    },
  });
  return {
    account1,
    account2,
    account3,
    connection1,
    connection2,
  };
}

export async function connectionsLoader() {
  await NetworkService.clearNetworks();
  await NetworkService.addDefaultNetworks();
  await AccountService.clearAccounts();
  return mockConnections();
}

export const MOCK_CONNECTION = {
  origin: 'example.com',
  accounts: [MOCK_ACCOUNTS[0].address],
} as Connection;
