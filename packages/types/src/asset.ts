import type { BNInput } from 'fuels';

export type AssetData = {
  name?: string;
  assetId: string;
  imageUrl?: string;
  symbol?: string;
  decimals?: number;
  isCustom?: boolean;
  chainId?: number;
  network?: string;
};

export type AssetAmount = AssetData & {
  amount?: BNInput;
};
