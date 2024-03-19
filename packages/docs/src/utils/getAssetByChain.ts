import type { AssetData } from '@fuel-wallet/types';
import type { Asset, AssetFuel } from 'fuels';

export function getAssetByChain(
  asset: Asset,
  chainId: number,
  network = 'fuel'
): AssetData {
  const assetFuelNetwork = asset.networks.find(
    (item) => item.chainId === chainId && item.type === network
  ) as AssetFuel;

  if (!assetFuelNetwork) {
    throw new Error('Asset not found for the given chain and network.');
  }

  return {
    ...asset,
    assetId: assetFuelNetwork.assetId,
    decimals: assetFuelNetwork.decimals,
    chainId: assetFuelNetwork.chainId,
    network: assetFuelNetwork.type,
  };
}
