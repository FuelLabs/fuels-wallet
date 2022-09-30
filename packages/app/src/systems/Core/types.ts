import type { BigNumberish } from 'fuels';

import { route } from './utils/route';

export type Maybe<T> = T | null | undefined;

export const Pages = {
  index: route('/'),
  home: route('/wallet'),
  faucet: route('/wallet/faucet'),
  signUp: route('/sign-up'),
  signUpWelcome: route('/sign-up/welcome'),
  signUpCreateWallet: route('/sign-up/create-wallet'),
  signUpRecoverWallet: route('/sign-up/recover-wallet'),
  networks: route('/networks'),
  networkUpdate: route<'id'>('/networks/update/:id'),
  networkAdd: route('/networks/add'),
};

export type AmountMap = Record<string, Maybe<BigNumberish>>;
