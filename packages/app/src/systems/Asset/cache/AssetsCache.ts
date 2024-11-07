import type { AssetData } from '@fuel-wallet/types';
import type { Asset, Provider } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { fetchNftData } from '../utils/nft';

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
        const jsonResponse = await response.json();
        return jsonResponse;
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
    this.cache[chainId] = this.cache[chainId] || {};
    const assetFromCache = this.cache[chainId][assetId];
    if (assetFromCache?.name) {
      return assetFromCache;
    }

    // get from indexed db if not in memory
    const assetFromDb = await this.storage.getItem(`${chainId}/${assetId}`);
    if (assetFromDb?.name) {
      this.cache[chainId][assetId] = assetFromDb;
      return assetFromDb;
    }

    const assetFromIndexer = await this.fetchAssetFromIndexer(
      endpoint.url,
      assetId
    );
    console.log('asd assetFromIndexer', assetFromIndexer);
    if (!assetFromIndexer) return;

    const asset = {
      ...assetFromIndexer,
      isNft: false,
    };

    if (assetFromIndexer.contractId) {
      const nftData = await fetchNftData({
        assetId,
        contractId: assetFromIndexer.contractId,
        provider,
      });
      Object.assign(asset, nftData);
    }

    this.cache[chainId][assetId] = asset;
    this.storage.setItem(`${chainId}/${assetId}`, asset);
    return asset;
  }
  asset = {
    name: '',
    symbol: '',
    metadata: {},
  };

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
