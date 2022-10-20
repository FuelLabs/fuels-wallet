import { WalletManager } from '@fuel-ts/wallet-manager';
import type { Meta, StoryFn } from '@storybook/react';
import { bn, Provider, ScriptTransactionRequest, Wallet } from 'fuels';

import { TxApprove } from './TxApprove';

import { VITE_FUEL_PROVIDER_URL } from '~/config';
import { AccountService } from '~/systems/Account';
import { IndexedDBStorage } from '~/systems/Account/utils';
import { db } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxType } from '~/systems/Transaction';
import { TxService } from '~/systems/Transaction/services';

const OWNER =
  '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298';

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
  await manager.addVault({ type: 'privateKey', secret: OWNER });
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
  // TODO: fix this on fuels-ts it should be possible to
  // customize the ProviderURL on the manager level
  wallet.provider = new Provider(VITE_FUEL_PROVIDER_URL);
  const amount = bn(1);
  const params = { gasLimit: bn(100000), gasPrice: bn(100000) };
  const coins = await wallet.getCoins();
  const newAddr = Wallet.generate({
    provider: VITE_FUEL_PROVIDER_URL,
  }).address;
  const assetId = coins[0].assetId;
  const txRequest = new ScriptTransactionRequest(params);
  txRequest.addCoinOutput(newAddr, amount, assetId);
  txRequest.addCoins(
    await wallet.getCoinsToSpend([[amount, assetId], txRequest.calculateFee()])
  );

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
  loaders: [loader],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = (_args, { loaded: { id, url } }) => {
  return <TxApprove id={id} url={url} />;
};
