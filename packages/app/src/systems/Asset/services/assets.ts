import { createProvider } from '@fuel-wallet/connections';
import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import { type NetworkFuel, assets, getAssetFuel } from 'fuels';
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
    };

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

  static async validateAddAssets(assets: AssetData[]) {
    // first validate has basic input
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

    // validate that all of the names are defined and not empty and not just consisting of spaces
    const someNameUndefined = trimmedAssets.some((asset) => {
      return !asset.name;
    });
    if (someNameUndefined) {
      throw new Error('Asset.name is invalid');
    }

    const uniqueAssetsByName = trimmedAssets.filter(
      (a, index) =>
        index === trimmedAssets.findIndex((obj) => obj.name === a.name)
    );
    if (trimmedAssets.length !== uniqueAssetsByName.length) {
      throw new Error('Asset with same name being added multiple times');
    }
    const uniqueAssetsBySymbol = trimmedAssets.filter(
      (a, index) =>
        index === trimmedAssets.findIndex((obj) => obj.symbol === a.symbol)
    );
    if (trimmedAssets.length !== uniqueAssetsBySymbol.length) {
      throw new Error('Asset with same symbol being added multiple times');
    }

    // validate if all assets from input are already added
    const uniqueAssetsNames = uniqueAssetsByName.map((a) => a.name);
    const repeatedAssets = await AssetService.getAssetsByFilter(
      (a) => uniqueAssetsNames.indexOf(a.name) !== -1
    );
    if (repeatedAssets.length === uniqueAssetsByName.length) {
      throw new Error('Assets already exist in wallet settings');
    }

    // get only not repeated assets
    const assetsToAdd = trimmedAssets.filter(
      (a) => repeatedAssets.findIndex((obj) => obj.name === a.name) === -1
    );

    return { assetsToAdd };
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
