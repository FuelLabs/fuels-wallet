export type Maybe<T> = T | null | undefined;

export enum Pages {
  'home' = '/',
  'faucet' = '/faucet',
  'signUp' = '/sign-up',
  'signUpWelcome' = 'welcome',
  'signUpCreateWallet' = 'create-wallet',
  'signUpRecoverWallet' = 'recover-wallet',
}

export type AmountMap = Record<string, Maybe<bigint>>;
