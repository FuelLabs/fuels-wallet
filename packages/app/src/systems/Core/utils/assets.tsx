import type { AssetFuel } from '@fuels/assets';
import assets, { getAssetFuel } from '@fuels/assets';

export const fuelAssets = assets.reduce((arr, asset) => {
  const fuelAsset = getAssetFuel(asset);
  if (fuelAsset) {
    arr.push(fuelAsset);
  }
  return arr;
}, [] as AssetFuel[]);
