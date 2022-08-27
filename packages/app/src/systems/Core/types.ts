export type Maybe<T> = T | null | undefined;

export enum Pages {
  'home' = '/',
  'signUp' = '/sign-up',
  'signUp.createWallet' = 'create-wallet',
  'signUp.recoverWallet' = 'recover-wallet',
}

export type AmountMap = Record<string, Maybe<bigint>>;
