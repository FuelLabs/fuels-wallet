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

export const getFuelAssetByAssetId = async (input: {
  assets: Asset[];
  assetId: string;
  chainId?: number;
}) => {
  // create a reduce that will iterate the assets using promise and return the asset that matches the assetId froming from getAssetFuelCurrentChain
  const assetToReturn = await input.assets.reduce(
    async (acc, asset) => {
      const assetFuel = await getAssetFuelCurrentChain({
        asset,
        chainId: input.chainId,
      });
      if (assetFuel.assetId === input.assetId) {
        return assetFuel;
      }
      return acc;
    },
    Promise.resolve() as Promise<AssetFuel | undefined>
  );

  if (assetToReturn) return assetToReturn;

  // return a fake assetId if the fuelAsset is not found
  const unknown = await getAssetFuelCurrentChain({
    asset: { name: '', symbol: '', icon: '', networks: [] },
    chainId: input.chainId,
  });

  return {
    ...unknown,
    assetId: input.assetId,
  };
};

export const isUnknownAsset = (asset: AssetFuelData) => {
  return !asset.name && !asset.verified && !asset.isCustom && !asset.isNft;
};
