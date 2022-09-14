export type Maybe<T> = T | null | undefined;

export enum Pages {
  'index' = '/',
  'home' = '/wallet',
  'signUp' = '/sign-up',
  'signUpWelcome' = 'welcome',
  'signUpCreateWallet' = 'create-wallet',
  'signUpRecoverWallet' = 'recover-wallet',
}

export type AmountMap = Record<string, Maybe<bigint>>;
