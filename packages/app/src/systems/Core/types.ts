import type { BN } from 'fuels';

import { route } from './utils/route';

export type Maybe<T> = T | null | undefined;

export enum CRXPages {
  signup = '/index.html',
  popup = '/popup.html',
}

export const Pages = {
  index: route('/'),
  wallet: route('/wallet'),
  receive: route('/wallet/receive'),
  signUp: route('/sign-up'),
  signUpWelcome: route('/sign-up/welcome'),
  signUpTerms: route('/sign-up/terms'),
  signUpCreateWallet: route('/sign-up/create'),
  signUpConfirmWallet: route('/sign-up/confirm'),
  signUpRecoverWallet: route('/sign-up/recover'),
  signUpEncryptWallet: route('/sign-up/encrypt'),
  signUpCreatedWallet: route('/sign-up/complete'),
  networks: route('/networks'),
  networkUpdate: route<'id'>('/networks/update/:id'),
  networkAdd: route('/networks/add'),
  request: route('/request'),
  requestConnection: route('/request/connection'),
  requestTransaction: route('/request/transaction'),
  requestMessage: route('/request/message'),
  requestAddAssets: route('/request/assets'),
  requestSelectNetwork: route('/request/network'),
  txs: route('/transactions'),
  tx: route<'txId'>('/transactions/view/:txId'),
  settings: route('/settings'),
  settingsChangePassword: route('/settings/change-password'),
  settingsConnectedApps: route('/settings/connected-apps'),
  settingsSetLockTimeout: route('/settings/set-lock'), // added
  send: route('/send'),
  sendConfirm: route('/send/confirm'),
  accounts: route('/accounts'),
  accountAdd: route('/accounts/add'),
  logout: route('/accounts/logout'),
  assets: route('/assets'),
  assetsEdit: route<'name'>('/assets/edit/:name'),
  assetsAdd: route<'assetId'>('/assets/add/:assetId?'),
  errors: route('/errors'),
};

export type AmountMap = Record<string, Maybe<BN>>;
