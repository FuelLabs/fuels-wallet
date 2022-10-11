import { WalletManager } from '@fuel-ts/wallet-manager';
import type { Meta, Story } from '@storybook/react';
import { ScriptTransactionRequest } from 'fuels';

import { TxApprove } from './TxApprove';

import { AccountService } from '~/systems/Account';
import { IndexedDBStorage } from '~/systems/Account/utils';
import { db } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

async function loader() {
  await db.vaults.clear();
  await AccountService.clearAccounts();
  await NetworkService.clearNetworks();
  const storage = new IndexedDBStorage() as never;
  const manager = new WalletManager({ storage });
  await manager.unlock('123123123');
  await manager.addVault({
    type: 'privateKey',
    secret:
      '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  });

  const accounts = manager.getAccounts();
  const walletAccount =
    accounts.find((a) => a.address.toString().startsWith('0x94')) ||
    accounts[0];

  await NetworkService.addFirstNetwork();
  const account = await AccountService.addAccount({
    data: {
      name: 'Account 2',
      address: walletAccount.address.toAddress(),
      publicKey: walletAccount.publicKey,
    },
  });

  const wallet = manager.getWallet(walletAccount.address);
  const coins = await wallet.getCoins();
  const txRequest = new ScriptTransactionRequest({
    script: '0x00',
    scriptData: '0x00',
  });
  txRequest.addCoin(coins[1]);

  return {
    txRequest,
    account,
  };
}

export default {
  component: TxApprove,
  title: 'DApp/Pages/TxApprove',
} as Meta;

export const Usage: Story<unknown> = (_args, { loaded: { txRequest } }) => {
  return <TxApprove tx={txRequest} url="fuellabs.github.io/swayswap" />;
};
Usage.loaders = [loader];
