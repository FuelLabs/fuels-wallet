import type { Fuel } from '@fuels/assets';
import { assets } from '@fuels/assets';

export const fuelAssets = assets.map((asset) => {
  const fuelNetworkAsset = asset.networks.find(
    (n) => n.type === 'fuel'
  ) as Fuel;
  return {
    ...asset,
    assetId: fuelNetworkAsset.assetId,
    decimals: fuelNetworkAsset.decimals,
  };
});
