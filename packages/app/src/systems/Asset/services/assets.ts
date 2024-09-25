import { createProvider } from '@fuel-wallet/connections';
import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import {
  type NetworkEthereum,
  type NetworkFuel,
  assets,
  getAssetFuel,
} from 'fuels';
import { type Provider, isB256 } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { getUniqueString } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network/services/network';
import type { AssetFormValues } from '../hooks/useAssetForm';
import { getFuelAssetByAssetId } from '../utils';

export type AssetInputs = {
  upsertAsset: {
    data: AssetData;
  };
  updateAsset: {
    name: string;
    data: Partial<AssetFuelData>;
  };
  addAsset: {
    data: AssetFormValues;
  };
  addAssets: {
    data: AssetData[];
  };
  removeAsset: {
    name: string;
  };
  getFieldNotRepeated: {
    value: string;
    field: 'name' | 'symbol';
    tries?: number;
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AssetService {
  static async upsertAsset(input: AssetInputs['upsertAsset']) {
    return db.transaction('rw!', db.assets, async () => {
      const assets = await AssetService.getAssetsByFilter((a) => {
        return a.name === input.data.name;
      });
      if (assets?.[0]) {
        await db.assets.delete(assets[0].name);
      }
      await db.assets.add(input.data);

      return db.assets.get({ name: input.data.name });
    });
  }

  static async setListedAssets() {
    const assetsPromises = assets.map((asset) => {
      return AssetService.upsertAsset({
        data: {
          ...asset,
          isCustom: false,
        },
      });
    });

    await Promise.all(assetsPromises);
  }

  static async updateAsset(input: AssetInputs['updateAsset']) {
    if (!input.data) {
      throw new Error('Asset.data undefined');
    }
    if (!input.name) {
      throw new Error('Asset.name undefined');
    }

    // just for security, should not happen
    const currentAsset = await AssetService.getAsset(input.data.name);
    if (!currentAsset) {
      throw new Error('Asset not found');
    }
    if (!currentAsset.isCustom) {
      throw new Error(`It's not allowed to change Listed Assets`);
    }

    const { decimals, assetId, ...inputRest } = input.data;
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const newNetworks = currentAsset.networks.map((network) => {
      if (
        network.type === 'fuel' &&
        network.chainId === currentNetwork?.chainId
      ) {
        return {
          ...network,
          assetId,
          decimals,
        };
      }
      return network;
    });

    const assetToUpdate = {
      ...currentAsset,
      ...inputRest,
      networks: newNetworks,
    };

    return db.transaction('rw', db.assets, async () => {
      await db.assets.update(input.name, assetToUpdate);
      return db.assets.get(input.name);
    });
  }

  static async addAsset(input: AssetInputs['addAsset']) {
    // validate if id it is already in some asset
    const assets = await AssetService.getAssets();
    const currentNetwork = await NetworkService.getSelectedNetwork();

    if (currentNetwork?.chainId == null) {
      throw new Error('Network not selected');
    }

    const currentFuelAsset = await getFuelAssetByAssetId({
      assets,
      assetId: input.data.assetId,
      chainId: currentNetwork?.chainId,
    });
    if (currentFuelAsset.name === 'Unknown') {
      throw new Error('Asset ID already exists');
    }

    // try to find if already exists by symbol or name
    const assetFromName = await AssetService.getAsset(input.data.name);
    const assetFromSymbol = await AssetService.getAssetBySymbol(
      input.data.symbol
    );

    // if already exists, check if it is a fuel asset
    const asset = assetFromName || assetFromSymbol;
    if (asset && !asset.isCustom) {
      throw new Error(`Default assets can't be changed`);
    }

    const existingFuelAsset = asset
      ? getAssetFuel(asset, currentNetwork?.chainId)
      : undefined;
    if (existingFuelAsset) {
      throw new Error('Asset name/symbol already exists');
    }

    const { decimals, assetId, ...inputRest } = input.data;

    const assetToCreate = {
      ...inputRest,
      ...asset,
      networks: [
        ...(asset?.networks || []),
        {
          type: 'fuel',
          assetId,
          decimals,
          chainId: currentNetwork.chainId,
        } as NetworkFuel,
      ],
      isCustom: true,
    } as AssetData;

    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(assetToCreate);
      return db.assets.get({ name: input.data.name });
    });
  }

  static async addAssets(input: AssetInputs['addAssets']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.bulkAdd(input.data);

      return true;
    });
  }

  static async removeAsset({ name }: AssetInputs['removeAsset']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.delete(name);

      return true;
    });
  }

  static async getAsset(name?: string) {
    return db.transaction('r', db.assets, async () => {
      return db.assets.get({ name });
    });
  }

  static async getAssetBySymbol(symbol?: string) {
    return db.transaction('r', db.assets, async () => {
      return db.assets.get({ symbol });
    });
  }

  static async clearAssets() {
    return db.transaction('rw', db.assets, async () => {
      return db.assets.clear();
    });
  }

  static async getAssets() {
    return db.transaction('r', db.assets, async () => {
      return db.assets.toArray();
    });
  }

  static async getAssetsByFilter(filterFn: (asset: AssetData) => boolean) {
    return db.transaction('r', db.assets, async () => {
      const assets: Array<AssetData> = [];
      await db.assets.filter(filterFn).each((data) => {
        assets.push({ ...data });
      });
      return assets;
    });
  }

  private static async mapAssetsByAddressAndAssetId(assets?: AssetData[]) {
    // Fetch existing assets once
    const existingAssets = assets || (await AssetService.getAssets());
    const existingAssetNameMap = new Map<string, AssetData>();
    const existingAssetSymbolMap = new Map<string, AssetData>();
    // Fuel only
    const assetIdChainMap = new Map<string, number>();
    // Ethereum only
    const networkAddressChainMap = new Map<string, number>();
    for (const asset of existingAssets) {
      // @TODO: Remove this when we have a better way to handle this
      // biome-ignore lint/suspicious/noExplicitAny: Sometimes a assetId comes at the root of the asset
      const looseAssetId = (asset as any)?.assetId as string | undefined;
      looseAssetId && assetIdChainMap.set(looseAssetId, 0);

      existingAssetNameMap.set(asset.name, asset);
      existingAssetSymbolMap.set(asset.symbol, asset);
      for (const network of asset.networks) {
        if (network.type === 'fuel') {
          if (assetIdChainMap.get(network.assetId))
            throw new Error('Asset ID already exists');
          assetIdChainMap.set(network.assetId, network.chainId);
        } else if (network.address) {
          networkAddressChainMap.set(network.address, network.chainId);
        }
      }
    }

    return {
      existingAssetNameMap,
      existingAssetSymbolMap,
      assetIdChainMap,
      networkAddressChainMap,
    };
  }

  static async validateAddAssets(assets: AssetData[]) {
    if (!assets.length) {
      throw new Error('No assets to add');
    }

    // trim asset props as will need to validate comparing strings
    const trimmedAssets = assets.map((a) => ({
      ...a,
      name: a.name?.trim(),
      symbol: a.symbol?.trim(),
      icon: a.icon?.trim(),
    }));

    // Check for invalid names
    if (trimmedAssets.some((asset) => !asset.name)) {
      throw new Error('Asset.name is invalid');
    }

    // Check for duplicate names and symbols within the input
    const nameSet = new Set<string>();
    const symbolSet = new Set<string>();
    for (const asset of trimmedAssets) {
      if (nameSet.has(asset.name)) {
        throw new Error('Asset with same name being added multiple times');
      }
      nameSet.add(asset.name);

      if (symbolSet.has(asset.symbol)) {
        throw new Error('Asset with same symbol being added multiple times');
      }
      symbolSet.add(asset.symbol);
    }

    const {
      existingAssetNameMap,
      existingAssetSymbolMap,
      assetIdChainMap,
      networkAddressChainMap,
    } = await AssetService.mapAssetsByAddressAndAssetId();

    const newAssetsToAdd: AssetData[] = [];
    // Assets that exist but in different chains
    const customAssetsToAdd: AssetData[] = [];

    for (const asset of trimmedAssets) {
      const existingAsset =
        existingAssetNameMap.get(asset.name) ||
        existingAssetSymbolMap.get(asset.symbol);
      if (existingAsset && !existingAsset.isCustom) {
        const nonDuplicateNetworks: Array<NetworkEthereum | NetworkFuel> = [];

        for (const newNetwork of asset.networks) {
          const isDuplicate = existingAsset.networks.some((existingNetwork) => {
            if (newNetwork.type !== existingNetwork.type) return false;
            if (newNetwork.type === 'fuel' && existingNetwork.type === 'fuel') {
              const isAssetIdDuplicate =
                assetIdChainMap.get(newNetwork.assetId) === newNetwork.chainId;
              if (newNetwork.chainId !== existingNetwork.chainId) {
                return isAssetIdDuplicate;
              }
              return (
                isAssetIdDuplicate ||
                (newNetwork.assetId === existingNetwork.assetId &&
                  newNetwork.contractId === existingNetwork.contractId)
              );
            }
            if (
              newNetwork.type === 'ethereum' &&
              existingNetwork.type === 'ethereum'
            ) {
              const isAddressDuplicate =
                newNetwork.address &&
                networkAddressChainMap.get(newNetwork.address) ===
                  newNetwork.chainId;

              if (newNetwork.chainId !== existingNetwork.chainId) {
                return isAddressDuplicate;
              }
              return (
                isAddressDuplicate ||
                (newNetwork.address === existingNetwork.address &&
                  newNetwork.chainId === existingNetwork.chainId)
              );
            }
            return false;
          });

          if (!isDuplicate) {
            nonDuplicateNetworks.push(newNetwork);
          }
        }

        if (nonDuplicateNetworks.length === 0) {
          throw new Error(
            `Asset "${asset.name}" already exists in wallet settings`
          );
        }

        customAssetsToAdd.push({
          ...asset,
          networks: nonDuplicateNetworks,
          isCustom: true,
        });
      } else {
        newAssetsToAdd.push(asset);
      }
    }

    return newAssetsToAdd.concat(customAssetsToAdd);
  }

  static async avoidRepeatedFields(assets: AssetData[]) {
    const allAssets = await AssetService.getAssets();
    const allNameValues = allAssets.map((a) => a.name);
    const allSymbolValues = allAssets.map((a) => a.symbol);
    const assetsNotRepeated = assets.reduce(
      async (prev, asset) => {
        const assets = await prev;
        const allNewAssetNames = assets.map((a) => a.name);
        const allNewAssetSymbols = assets.map((a) => a.symbol);
        const name = getUniqueString({
          desired: asset.name,
          allValues: [...allNameValues, ...allNewAssetNames],
        });
        const symbol = getUniqueString({
          desired: asset.symbol,
          allValues: [...allSymbolValues, ...allNewAssetSymbols],
        });

        return [
          ...assets,
          { ...asset, name: name || '', symbol: symbol || '', isCustom: true },
        ];
      },
      Promise.resolve([] as AssetData[])
    );

    return assetsNotRepeated;
  }
}
