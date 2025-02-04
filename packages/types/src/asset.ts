import type { Asset, AssetFuel, BNInput } from 'fuels';

export type AssetData = Asset & {
  // override icon to don't be required
  icon?: string;
  isCustom?: boolean;
  indexed?: boolean;
  suspicious?: boolean;
  isNft?: boolean;
  verified?: boolean;
};

export type AssetAmount = AssetData & {
  amount?: BNInput;
};

export type AssetFuelData = AssetFuel & {
  icon?: string;
  isCustom?: boolean;
  indexed?: boolean;
  suspicious?: boolean;
  collection?: string;
  rate?: number;
  isNft?: boolean;
  verified?: boolean;
  metadata?: {
    name?: string;
    image?: string;
  };
};

export type AssetFuelAmount = AssetFuelData & {
  amount?: BNInput;
};
