import type { BN } from 'fuels';

import { route } from './utils/route';

export type Maybe<T> = T | null | undefined;

export enum CRXPages {
  'signup' = '/index.html',
  'popup' = '/popup.html',
}

export const Pages = {
  index: route('/'),
  wallet: route('/wallet'),
  faucet: route('/wallet/faucet'),
  receive: route('/wallet/receive'),
  signUp: route('/sign-up'),
  signUpWelcome: route('/sign-up/welcome'),
  signUpCreateWallet: route('/sign-up/create-wallet'),
  signUpRecoverWallet: route('/sign-up/recover-wallet'),
  signUpWalletCreated: route('/sign-up/wallet-created'),
  networks: route('/networks'),
  networkUpdate: route<'id'>('/networks/update/:id'),
  networkAdd: route('/networks/add'),
  request: route('/request'),
  requestConnection: route('/request/connection'),
  requestTransaction: route('/request/transaction'),
  requestMessage: route('/request/message'),
  txs: route('/transactions'),
  tx: route<'txId'>('/transactions/view/:txId'),
  settings: route('/settings'),
  settingsRevealPassphrase: route('/settings/reveal-passphrase'),
  settingsChangePassword: route('/settings/change-password'),
  send: route('/send'),
  sendConfirm: route('/send/confirm'),
};

export type AmountMap = Record<string, Maybe<BN>>;
