import type { Asset } from '@fuel-wallet/types';
import { isB256 } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { getUniqueString } from '~/systems/Core/utils/string';

export type AssetInputs = {
  upsertAsset: {
    data: Asset;
  };
  updateAsset: {
    id: string;
    data: Partial<Asset>;
  };
  addAsset: {
    data: Asset;
  };
  addAssets: {
    data: Asset[];
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

export class AssetService {
  static async upsertAsset(input: AssetInputs['upsertAsset']) {
    return db.transaction('rw!', db.assets, async () => {
      const { assetId, ...updateData } = input.data;
      const asset = await db.assets.get({ assetId });
      if (asset) {
        await db.assets.update(assetId, updateData);
      } else {
        await db.assets.add(input.data);
      }

      return db.assets.get({ assetId });
    });
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

  static async getAssetsByFilter(filterFn: (asset: Asset) => boolean) {
    return db.transaction('r', db.assets, async () => {
      const assets = db.assets.filter(filterFn).toArray();
      return assets;
    });
  }

  static async validateAddAssets(assets: Asset[]) {
    // first validate has basic input
    if (!assets.length) {
      throw new Error('No assets to add');
    }

    // validate that all of the names are defined
    const someNameUndefined = assets.some((asset) => {
      asset.name === undefined;
    });
    if (someNameUndefined) {
      throw new Error('Asset.name is undefined');
    }

    // trim asset props as will need to validate comparing strings
    const trimmedAssets = assets.map((a) => ({
      ...a,
      assetId: a.assetId.trim(),
      name: a.name?.trim(),
      symbol: a.symbol?.trim(),
      imageUrl: a.imageUrl?.trim(),
    }));

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

  static async avoidRepeatedFields(assets: Asset[]) {
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
      Promise.resolve([] as Asset[])
    );

    return assetsNotRepeated;
  }
}
