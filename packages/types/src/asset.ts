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
  // override icon to don't be required
  icon?: string;
  isCustom?: boolean;
  indexed?: boolean;
  suspicious?: boolean;
  isNft?: boolean;
  verified?: boolean;
};

export type AssetFuelAmount = AssetFuelData & {
  amount?: BNInput;
};
