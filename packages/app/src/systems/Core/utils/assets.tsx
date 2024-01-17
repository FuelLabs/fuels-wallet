import type { AssetFuel } from '@fuels/assets';
import assets, { getAssetFuel } from '@fuels/assets';

// export const fuelAssets = assets.map((asset) => {
//   const fuelNetworkAsset = asset.networks.find(
//     (n) => n.type === 'fuel'
//   ) as Fuel;
//   return {
//     ...asset,
//     assetId: fuelNetworkAsset.assetId,
//     decimals: fuelNetworkAsset.decimals,
//   };
// });

export const fuelAssets = assets.reduce((arr, asset) => {
  const fuelAsset = getAssetFuel(asset);
  if (fuelAsset) {
    arr.push(fuelAsset);
  }
  return arr;
}, [] as AssetFuel[]);
