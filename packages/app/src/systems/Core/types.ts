import type { BigNumberish } from 'fuels';

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
  signMessage: route('/sign-message'),
  txs: route('/transactions'),
  txApprove: route('/transactions/approve'),
};

export type AmountMap = Record<string, Maybe<BigNumberish>>;
