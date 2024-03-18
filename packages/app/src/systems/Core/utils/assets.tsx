import { type AssetFuel, assets } from 'fuels';

export const fuelAssets = assets.map((asset) => {
  const fuelNetworkAsset = asset.networks.find(
    (n) => n.type === 'fuel'
  ) as AssetFuel;
  return {
    ...asset,
    assetId: fuelNetworkAsset.assetId,
    decimals: fuelNetworkAsset.decimals,
  };
});
