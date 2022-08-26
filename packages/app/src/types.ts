export type Maybe<T> = T | null | undefined;

export enum Pages {
  'home' = '/',
}

export type Asset = {
  name: string;
  symbol: string;
  assetId: string;
  imageUrl: string;
};

export type AmountMap = Record<string, Maybe<bigint>>;
