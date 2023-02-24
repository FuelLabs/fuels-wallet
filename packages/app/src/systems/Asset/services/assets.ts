import type { Asset } from '@fuel-wallet/types';

import { db } from '~/systems/Core/utils/database';

export type AssetInputs = {
  upsertAsset: {
    data: Asset;
  };
  addAsset: {
    data: Asset;
  };
  bulkAddAsset: {
    data: Asset[];
  };
  removeAsset: {
    assetId: string;
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

  static async addAsset(input: AssetInputs['addAsset']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(input.data);
      return db.assets.get({ assetId: input.data.assetId });
    });
  }

  static async bulkAddAsset(input: AssetInputs['bulkAddAsset']) {
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
}
