import type { BigNumberish } from 'fuels';

import { route } from './utils/route';

export type Maybe<T> = T | null | undefined;

export enum CRXPages {
  'signup' = '/index.html',
  'popup' = '/popup.html',
}

export const Pages = {
  wallet: route('/'),
  faucet: route('/faucet'),
  signUp: route('/sign-up'),
  signUpWelcome: route('/sign-up/welcome'),
  signUpCreateWallet: route('/sign-up/create-wallet'),
  signUpRecoverWallet: route('/sign-up/recover-wallet'),
  signUpWalletCreated: route('/sign-up/wallet-created'),
  networks: route('/networks'),
  networkUpdate: route<'id'>('/networks/update/:id'),
  networkAdd: route('/networks/add'),
  txs: route('/transactions'),
  txApprove: route('/transactions/approve'),
};

export type AmountMap = Record<string, Maybe<BigNumberish>>;
