import type { AssetFuelData } from '@fuel-wallet/types';
import {
  type Asset,
  type AssetFuel,
  type NetworkFuel,
  getAssetFuel,
} from 'fuels';
import { NetworkService } from '~/systems/Network/services';

export const getAssetFuelCurrentChain = async (input: {
  asset: Asset;
  chainId?: number;
}): Promise<AssetFuel> => {
  const networkChainId =
    input.chainId || (await NetworkService.getSelectedNetwork())?.chainId;

  // specifically check for null because 0 is a valid chainId
  if (networkChainId == null) {
    throw new Error('No network selected');
  }

  const UNKNOWN_FUEL_NETWORK_ASSET: NetworkFuel = {
    type: 'fuel',
    chainId: networkChainId,
    decimals: 0,
    assetId: '',
  };
  const assetNetwork =
    getAssetFuel(input.asset, networkChainId) || UNKNOWN_FUEL_NETWORK_ASSET;

  const { networks: _, ...assetRest } = input.asset;

  return {
    ...assetRest,
    ...assetNetwork,
  };
};

const assetIdIndexes = new WeakMap<Asset[], Map<number, Map<string, Asset>>>();

const getAssetIdIndex = (assets: Asset[], chainId: number) => {
  let byChain = assetIdIndexes.get(assets);
  if (!byChain) {
    byChain = new Map();
    assetIdIndexes.set(assets, byChain);
  }
  let index = byChain.get(chainId);
  if (!index) {
    index = new Map();
    for (const asset of assets) {
      // Later matches win
      index.set(getAssetFuel(asset, chainId)?.assetId ?? '', asset);
    }
    byChain.set(chainId, index);
  }
  return index;
};

export const findFuelAssetByAssetId = (input: {
  assets?: Asset[];
  assetId: string;
  chainId: number;
}) => {
  if (!input.assets?.length) return undefined;
  return getAssetIdIndex(input.assets, input.chainId).get(input.assetId);
};

export const getFuelAssetByAssetId = async (input: {
  assets: Asset[];
  assetId: string;
  chainId?: number;
}) => {
  const chainId =
    input.chainId || (await NetworkService.getSelectedNetwork())?.chainId;
  const asset =
    chainId == null
      ? undefined
      : findFuelAssetByAssetId({
          assets: input.assets,
          assetId: input.assetId,
          chainId,
        });

  if (asset) return getAssetFuelCurrentChain({ asset, chainId });

  // return a fake assetId if the fuelAsset is not found
  const unknown = await getAssetFuelCurrentChain({
    asset: { name: '', symbol: '', icon: '', networks: [] },
    chainId,
  });

  return {
    ...unknown,
    assetId: input.assetId,
  };
};

export const isUnknownAsset = (asset: AssetFuelData) => {
  return !asset.name && !asset.verified && !asset.isCustom && !asset.isNft;
};
