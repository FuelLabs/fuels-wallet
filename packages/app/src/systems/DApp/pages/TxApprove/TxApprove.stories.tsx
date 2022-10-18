import { WalletManager } from '@fuel-ts/wallet-manager';
import type { Meta, Story } from '@storybook/react';
import { Address, bn, ScriptTransactionRequest } from 'fuels';

import { TxApprove } from './TxApprove';

import { AccountService } from '~/systems/Account';
import { IndexedDBStorage } from '~/systems/Account/utils';
import { db } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxType } from '~/systems/Transaction';
import { TxService } from '~/systems/Transaction/services';

async function loader() {
  /**
   * Clear database and accounts
   * */
  await db.vaults.clear();
  await AccountService.clearAccounts();
  await NetworkService.clearNetworks();

  /**
   * Create a new wallet manager
   * */
  const storage = new IndexedDBStorage() as never;
  const manager = new WalletManager({ storage });
  await manager.unlock('123123123');

  /**
   * Add ETH coin owner
   * */
  await manager.addVault({
    type: 'privateKey',
    secret:
      '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  });
  const accounts = manager.getAccounts();
  const walletAccount =
    accounts.find((a) => a.address.toString().startsWith('0x94')) ||
    accounts[0];

  /**
   * Add first network and first account on database
   * */
  await NetworkService.addFirstNetwork();
  await AccountService.addAccount({
    data: {
      name: 'Account 2',
      address: walletAccount.address.toAddress(),
      publicKey: walletAccount.publicKey,
    },
  });

  /**
   * Create a sample transaction request
   * */
  const wallet = manager.getWallet(walletAccount.address);
  const coins = await wallet.getCoins();
  const amount = bn(1);
  const params = { gasLimit: bn(100000), gasPrice: bn(100000) };
  const txRequest = new ScriptTransactionRequest(params);
  txRequest.addCoinOutput(
    Address.fromString(
      '0x093829e4351649934f4d952de00d9f6696bc9099cf172994d3ee3bfc8e123a7e'
    ),
    amount,
    coins[0].assetId
  );
  const newCoins = await wallet.getCoinsToSpend([
    [amount, coins[0].assetId],
    txRequest.calculateFee(),
  ]);
  txRequest.addCoins(newCoins);

  /** Add transaction on database */
  await TxService.clear();
  const tx = await TxService.add({
    type: TxType.request,
    data: txRequest,
  });

  return {
    id: tx?.id,
    url: 'fuellabs.github.io/swayswap',
  };
}

export default {
  component: TxApprove,
  title: 'DApp/Pages/TxApprove',
} as Meta;

export const Usage: Story<unknown> = (_args, { loaded: { id, url } }) => {
  return <TxApprove id={id} url={url} />;
};

Usage.loaders = [loader];
Usage.parameters = {
  layout: 'fullscreen',
  viewport: {
    defaultViewport: 'chromeExtension',
  },
};
