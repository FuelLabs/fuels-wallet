import type { AssetData } from '@fuel-wallet/types';
import type { Asset, AssetFuel, Provider } from 'fuels';
import { AssetService } from '~/systems/Asset/services';
import { getFuelAssetByAssetId } from '~/systems/Asset/utils';
import { db } from '~/systems/Core/utils/database';

type Endpoint = {
  chainId: number;
  url: string;
};

export class AssetsCache {
  private cache: { [chainId: number]: { [assetId: string]: Asset } };
  private static instance: AssetsCache;
  private endpoints: Endpoint[] = [
    {
      chainId: 9889,
      url: 'https://explorer-indexer-mainnet.fuel.network',
    },
    {
      chainId: 0,
      url: 'https://explorer-indexer-testnet.fuel.network',
    },
  ];
  private storage: IndexedAssetsDB;

  private constructor() {
    this.cache = {};
    this.storage = new IndexedAssetsDB();
  }

  asset = {
    name: '',
    symbol: '',
    metadata: {},
  };

  private getIndexerEndpoint(chainId: number) {
    return this.endpoints.find(
      (endpoint: Endpoint) => endpoint.chainId === chainId
    );
  }

  static async fetchAllAssets(chainId: number, assetsIds: string[]) {
    const instance = AssetsCache.getInstance();
    const assetData = new Map<string, AssetFuel>();
    const dbAssets = await AssetService.getAssets();
    const promises = [];
    for (const assetId of assetsIds) {
      promises.push(
        instance
          .getAsset({ chainId, assetId, dbAssets })
          .then((asset) => {
            assetData.set(assetId, asset);
          })
          .catch((e) => {
            console.error('Error fetching asset from indexer', e);
            assetData.set(assetId, { name: '' } as AssetFuel);
          })
      );
    }
    await Promise.all(promises);
    return assetData;
  }

  private async fetchAssetFromIndexer(url: string, assetId: string) {
    try {
      const timeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );
      // limit on 2000ms request time
      const response = await Promise.race([
        fetch(`${url}/assets/${assetId}`),
        timeout,
      ]);
      if (response instanceof Response) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
    } catch (_e: unknown) {}
  }

  async getAsset({
    chainId,
    assetId,
    dbAssets,
  }: { chainId: number; assetId: string; dbAssets: AssetData[] }) {
    if (chainId == null || !assetId) {
      return;
    }
    const endpoint = this.getIndexerEndpoint(chainId);
    if (!endpoint) return;
    // try to get from memory cache first
    this.cache[chainId] = this.cache[chainId] || {};
    const assetFromCache = this.cache?.[chainId]?.[assetId];
    if (assetFromCache?.name !== undefined) {
      return assetFromCache;
    }

    // get from indexed db if not in memory
    const assetFromDb = await this.storage.getItem(`${chainId}/${assetId}`);
    if (assetFromDb?.name) {
      this.cache[chainId][assetId] = assetFromDb;
      return assetFromDb;
    }

    const dbAsset = await getFuelAssetByAssetId({
      assets: dbAssets,
      assetId: assetId,
      chainId,
    }).catch((e) => {
      console.error('Error fetching asset from db', e);
      return undefined;
    });
    const assetFromIndexer = await this.fetchAssetFromIndexer(
      endpoint.url,
      assetId
    ).catch((e) => {
      console.error('Error fetching asset from indexer', e);
      return undefined;
    });

    console.log('asd assetFromIndexer', assetFromIndexer);

    const { isNFT, metadata, name, ...rest } = assetFromIndexer ?? {};
    const asset = {
      ...dbAsset,
      isNft: !!isNFT,
      ...rest,
      ...metadata,
    };
    if (asset.name != null) {
      asset.indexed = true;
    } else {
      // @TODO: Remove once we have a proper caching pattern/mechanism

      asset.name = '';
    }

    this.cache[chainId][assetId] = asset;
    this.storage.setItem(`${chainId}/${assetId}`, asset);
    return asset;
  }

  static getInstance() {
    if (!AssetsCache.instance) {
      AssetsCache.instance = new AssetsCache();
    }
    return AssetsCache.instance;
  }
}

class IndexedAssetsDB {
  async getItem(key: string) {
    return db.transaction('r', db.indexedAssets, async () => {
      const asset = await db.indexedAssets.get({ key });
      return asset;
    });
  }

  async setItem(key: string, data: AssetData) {
    await db.transaction('rw', db.indexedAssets, async () => {
      await db.indexedAssets.put({ key, ...data });
    });
  }
}
