import type { BigNumberish } from 'fuels';

export type Maybe<T> = T | null | undefined;

export enum Pages {
  'index' = '/',
  'wallet' = '/wallet',
  'faucet' = '/wallet/faucet',
  'signUp' = '/sign-up',
  'signUpWelcome' = 'welcome',
  'signUpCreateWallet' = 'create-wallet',
  'signUpRecoverWallet' = 'recover-wallet',
}

export enum PageLinks {
  'index' = '/',
  'wallet' = '/wallet',
  'faucet' = '/wallet/faucet',
  'signUp' = '/sign-up',
  'signUpWelcome' = '/sign-up/welcome',
  'signUpCreateWallet' = '/sign-up/create-wallet',
  'signUpRecoverWallet' = '/sign-up/recover-wallet',
}

export type AmountMap = Record<string, Maybe<BigNumberish>>;
