import type { BigNumberish } from 'fuels';

export type Maybe<T> = T | null | undefined;

export enum Pages {
  'index' = '/',
  'home' = '/wallet',
  'faucet' = '/wallet/faucet',
  'signUp' = '/sign-up',
  'signUpWelcome' = 'welcome',
  'signUpCreateWallet' = 'create-wallet',
  'signUpRecoverWallet' = 'recover-wallet',
  'networks' = 'networks',
  'updateNetwork' = 'update/:id',
  'addNetwork' = 'add',
}

export type AmountMap = Record<string, Maybe<BigNumberish>>;
