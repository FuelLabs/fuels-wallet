import type { Asset, AssetFuel } from 'fuels';

export function getAssetByChain(
  asset: Asset,
  chainId: number,
  network = 'fuel'
): AssetFuel | undefined {
  const assetFuelNetwork = asset.networks.find(
    (item) => item.chainId === chainId && item.type === network
  ) as AssetFuel;

  if (!assetFuelNetwork) return undefined;

  return {
    ...asset,
    assetId: assetFuelNetwork.assetId,
    decimals: assetFuelNetwork.decimals,
    chainId: assetFuelNetwork.chainId,
    type: assetFuelNetwork.type,
  };
}
