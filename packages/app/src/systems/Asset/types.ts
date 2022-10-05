import type { BNInput, CoinQuantity } from 'fuels';

export type Asset = Omit<CoinQuantity, 'amount'> & {
  amount?: BNInput;
};

export type AssetWithInfo = Asset & {
  imageUrl: string;
  name: string;
  symbol: string;
};
