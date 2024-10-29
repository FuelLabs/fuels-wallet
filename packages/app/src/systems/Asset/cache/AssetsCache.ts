import type { AssetData } from '@fuel-wallet/types';
import type { Asset, Provider } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { isNft } from '../utils/isNft';

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

  private getIndexerEndpoint(chainId: number) {
    return this.endpoints.find(
      (endpoint: Endpoint) => endpoint.chainId === chainId
    );
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
        return response.json();
      }
    } catch (_e: unknown) {}
  }

  async getAsset({
    chainId,
    assetId,
    provider,
  }: { chainId: number; assetId: string; provider: Provider }) {
    if (chainId == null || !assetId) {
      return;
    }
    const endpoint = this.getIndexerEndpoint(chainId);
    if (!endpoint) return;
    // try to get from memory cache first
    this.cache[endpoint.chainId] = this.cache[endpoint.chainId] || {};
    if (this.cache[endpoint.chainId][assetId]) {
      return this.cache[endpoint.chainId][assetId];
    }
    // get from indexed db if not in memory
    const savedAsset = await this.storage.getItem(
      `${endpoint.chainId}/${assetId}`
    );
    if (savedAsset) {
      this.cache[endpoint.chainId][assetId] = savedAsset;
      return savedAsset;
    }
    const assetFromIndexer = await this.fetchAssetFromIndexer(
      endpoint.url,
      assetId
    );
    if (!assetFromIndexer) return;

    const isNftAsset = await isNft({
      assetId,
      contractId: assetFromIndexer.contractId,
      provider,
    });

    const asset = {
      ...assetFromIndexer,
      isNft: isNftAsset,
    };

    this.cache[endpoint.chainId][assetId] = asset;
    this.storage.setItem(`${endpoint.chainId}/${assetId}`, asset);
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
