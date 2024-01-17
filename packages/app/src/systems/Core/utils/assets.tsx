import type { AssetFuel, Fuel } from '@fuels/assets';
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
  const fuelAsset = getAssetFuel(
    asset,
    asset.networks.find((network) => network.type === 'fuel')?.chainId
  );
  if (fuelAsset) {
    arr.push(fuelAsset);
  }
  return arr;
}, [] as AssetFuel[]);
