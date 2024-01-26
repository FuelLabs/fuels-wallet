import type { BNInput } from 'fuels';
export type { Asset } from '@fuels/assets';
export type { Fuel as AssetFuel } from '@fuels/assets';
export type { Ethereum as AssetEthereum } from '@fuels/assets';

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
