import { WalletManager } from '@fuel-ts/wallet-manager';
import type { Meta, StoryFn } from '@storybook/react';
import {
  bn,
  NativeAssetId,
  Provider,
  ScriptTransactionRequest,
  Wallet,
} from 'fuels';

import { TxApprove } from './TxApprove';

import {
  IS_DEVELOPMENT,
  VITE_FUEL_PROVIDER_URL,
  VITE_ADDR_OWNER,
} from '~/config';
import { AccountService } from '~/systems/Account';
import { IndexedDBStorage } from '~/systems/Account/utils';
import { db } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { TxType } from '~/systems/Transaction';
import { TxService } from '~/systems/Transaction/services';

async function getOwner() {
  const OWNER = IS_DEVELOPMENT
    ? VITE_ADDR_OWNER
    : localStorage.getItem('storybook-privateKey') || '';

  if (!OWNER) {
    // eslint-disable-next-line no-alert
    const privateKey = prompt('Enter a test privateKey');
    if (!privateKey) {
      throw Error('Private key is required!');
    } else {
      localStorage.setItem('storybook-privateKey', privateKey);
    }
  }

  return OWNER;
}

async function loader() {
  const secretKey = await getOwner();

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
  await manager.addVault({ type: 'privateKey', secret: secretKey });
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
  const newAddr = Wallet.generate({
    provider: VITE_FUEL_PROVIDER_URL,
  }).address;
  const assetId = NativeAssetId;
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
