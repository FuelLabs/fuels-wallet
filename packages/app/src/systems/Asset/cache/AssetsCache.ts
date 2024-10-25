import type { Asset } from 'fuels';
import { IndexedDBStorage } from '~/systems/Account';

export default class AssetsCache {
  private cache: { [network: string]: { [assetId: string]: Asset } };
  private static instance: AssetsCache;
  private endpoints: Endpoint[] = [
    {
      chainId: 9889,
      networkId: '0',
      networkName: 'mainnet',
      url: 'https://explorer-indexer-mainnet.fuel.network',
    },
    {
      chainId: 0,
      networkId: '1',
      networkName: 'testnet',
      url: 'https://explorer-indexer-testnet.fuel.network',
    },
    {
      chainId: 0,
      networkId: '2',
      networkName: 'devnet',
      url: 'https://explorer-indexer-devnet.fuel.network',
    },
  ];
  private storage: IndexedDBStorage;

  private constructor() {
    this.cache = {};
    this.storage = new IndexedDBStorage();
  }

  private getEndpoint(chainId: number, networkId: string) {
    return this.endpoints.find((endpoint: Endpoint) =>
      chainId === 0
        ? endpoint.networkId === networkId
        : endpoint.chainId === chainId
    );
  }

  private async fetchAssetFromIndexer(url: string, assetId: string) {
    try {
      const timeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 500)
      );
      // limit on 500ms request time
      const response = await Promise.race([
        fetch(`${url}/assets/${assetId}`),
        timeout,
      ]);
      if (response instanceof Response) {
        return response.json();
      }
    } catch (_e: unknown) {}
  }

  async getAsset(chainId: number, networkId: string, assetId: string) {
    if (chainId === null || chainId === undefined || !networkId || !assetId) {
      return;
    }
    const endpoint = this.getEndpoint(chainId, networkId);
    if (!endpoint) return;
    // try to get from memory cache first
    this.cache[endpoint.networkName] = this.cache[endpoint.networkName] || {};
    if (this.cache[endpoint.networkName][assetId]) {
      return this.cache[endpoint.networkName][assetId];
    }
    // get from indexed db if not in memory
    const savedAsset = await this.storage.getItem(
      `${endpoint.networkName}/${assetId}`
    );
    if (savedAsset) return savedAsset;
    const asset = await this.fetchAssetFromIndexer(endpoint.url, assetId);
    if (!asset) return;
    this.cache[endpoint.networkName][assetId] = asset;
    this.storage.setItem(`${endpoint.networkName}/${assetId}`, asset);
    return asset;
  }

  static getInstance() {
    if (!AssetsCache.instance) {
      AssetsCache.instance = new AssetsCache();
    }
    return AssetsCache.instance;
  }
}

type Endpoint = {
  chainId: number;
  networkId: string;
  networkName: string;
  url: string;
};
