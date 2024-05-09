import type { AssetData } from '@fuel-wallet/types';
import initialAssets from '@fuels/assets';
import { type NetworkFuel, Provider, isB256 } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { getUniqueString } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network/services/network';

export type AssetInputs = {
  upsertAsset: {
    data: AssetData;
  };
  updateAsset: {
    id: string;
    data: Partial<AssetData>;
  };
  addAsset: {
    data: AssetData;
  };
  addAssets: {
    data: AssetData[];
  };
  removeAsset: {
    assetId: string;
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
        await db.assets.delete(assets[0].assetId);
      }
      await db.assets.add(input.data);

      return db.assets.get({ assetId: input.data.assetId });
    });
  }

  static async setListedAssets() {
    // @TODO: Remove when SDK provide correct asset id for the network
    const legacyFuelBaseAssetId =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await Provider.create(currentNetwork?.url || '');
    const networkBaseAssetId = provider.getBaseAssetId();

    const assetsPromises = initialAssets.map((asset) => {
      const fuelNetworkAssets = asset.networks.filter(
        (n) => n.type === 'fuel'
      ) as Array<NetworkFuel>;

      const fuelNetworkAsset = asset.networks.find(
        (n) => n.type === 'fuel' && n.chainId === provider.getChainId()
      ) as NetworkFuel;

      const networks = fuelNetworkAssets.map((network) => {
        if (
          network.chainId === provider.getChainId() &&
          network.assetId === legacyFuelBaseAssetId
        ) {
          return {
            ...network,
            assetId: networkBaseAssetId,
          };
        }
        return network;
      });

      const newAsset = {
        ...asset,
        networks,
        assetId:
          fuelNetworkAsset.assetId === legacyFuelBaseAssetId
            ? networkBaseAssetId
            : fuelNetworkAsset.assetId,
        decimals: fuelNetworkAsset.decimals,
      };
      return AssetService.upsertAsset({
        data: {
          ...newAsset,
          isCustom: false,
          imageUrl: newAsset.icon,
        },
      });
    });

    await Promise.all(assetsPromises);
  }

  static updateAsset(input: AssetInputs['updateAsset']) {
    if (!input.data) {
      throw new Error('Asset.data undefined');
    }
    if (!input.id) {
      throw new Error('Asset.id undefined');
    }
    return db.transaction('rw', db.assets, async () => {
      await db.assets.update(input.id, input.data);
      return db.assets.get(input.id);
    });
  }

  static async addAsset(input: AssetInputs['addAsset']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(input.data);
      return db.assets.get({ assetId: input.data.assetId });
    });
  }

  static async addAssets(input: AssetInputs['addAssets']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.bulkAdd(input.data);

      return true;
    });
  }

  static async removeAsset({ assetId }: AssetInputs['removeAsset']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.delete(assetId);

      return true;
    });
  }

  static async getAsset(assetId?: string) {
    return db.transaction('r', db.assets, async () => {
      return db.assets.get({ assetId });
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
      assetId: a.assetId.trim(),
      name: a.name?.trim(),
      symbol: a.symbol?.trim(),
      imageUrl: a.imageUrl?.trim(),
    }));

    // validate that all of the names are defined and not empty and not just consisting of spaces
    const someNameUndefined = trimmedAssets.some((asset) => {
      return !asset.name;
    });
    if (someNameUndefined) {
      throw new Error('Asset.name is invalid');
    }

    // validate if any assetId is wrong (not isB256)
    const invalidAssetId = trimmedAssets.find((a) => !isB256(a.assetId));
    if (invalidAssetId) {
      throw new Error(
        'Asset with invalid assetId. Asset IDs can only be B256 addresses.'
      );
    }

    // validate input doesnt repeat assets, by id, name or symbol
    const uniqueAssetsById = trimmedAssets.filter(
      (a, index) =>
        index === trimmedAssets.findIndex((obj) => obj.assetId === a.assetId)
    );
    if (trimmedAssets.length !== uniqueAssetsById.length) {
      throw new Error('Asset with same assetId being added multiple times');
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
    // biome-ignore lint/complexity/noForEach: <explanation>
    trimmedAssets.forEach((obj) => {
      if (
        !Number.isInteger(obj.decimals) ||
        Number(obj.decimals) > 19 ||
        Number(obj.decimals) < 0
      ) {
        throw new Error(`Asset ${obj.assetId} decimals is not valid`);
      }
    });

    // validate if all assets from input are already added
    const uniqueAssetsIds = uniqueAssetsById.map((a) => a.assetId);
    const repeatedAssets = await AssetService.getAssetsByFilter(
      (a) => uniqueAssetsIds.indexOf(a.assetId) !== -1
    );
    if (repeatedAssets.length === uniqueAssetsById.length) {
      throw new Error('Assets already exist in wallet settings');
    }

    // get only not repeated assets
    const assetsToAdd = trimmedAssets.filter(
      (a) => repeatedAssets.findIndex((obj) => obj.assetId === a.assetId) === -1
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

        return [...assets, { ...asset, name, symbol, isCustom: true }];
      },
      Promise.resolve([] as AssetData[])
    );

    return assetsNotRepeated;
  }
}
