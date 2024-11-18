import type { AssetData } from '@fuel-wallet/types';
import type { AssetFuel } from 'fuels';
import { AssetService } from '~/systems/Asset/services';
import { getFuelAssetByAssetId } from '~/systems/Asset/utils';
import { type FuelCachedAsset, db } from '~/systems/Core/utils/database';

type Endpoint = {
  chainId: number;
  url: string;
};

const FIVE_MINUTES = 5 * 60 * 1000;
export const assetDbKeyFactory = (chainId: number, assetId: string) =>
  `${chainId}/asset/${assetId}`;

export class AssetsCache {
  private cache: {
    [chainId: number]: {
      [assetId: string]: FuelCachedAsset;
    };
  };
  private dbAssetsCache: {
    [chainId: number]: Array<AssetData>;
  };
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
    this.dbAssetsCache = {};
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
            asset && assetData.set(assetId, asset);
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

  assetIsValid(asset: FuelCachedAsset) {
    const isNftAsset = asset.isNft && !asset.decimals;
    // Non-NFT assets (not account addresses)
    const isNonNftAsset = !asset.isNft && !!asset.decimals;
    const isZeroDecimalAsset = !asset.isNft && !asset.decimals && asset.symbol;
    return (
      asset.name != null &&
      'fetchedAt' in asset &&
      asset.fetchedAt != null &&
      (isNftAsset || isNonNftAsset || isZeroDecimalAsset)
    );
  }

  async getAsset({
    chainId,
    assetId,
    dbAssets,
    save = true,
  }: {
    chainId: number;
    assetId: string;
    dbAssets: AssetData[];
    save?: boolean;
  }): Promise<FuelCachedAsset | undefined> {
    if (chainId == null || !assetId) {
      return;
    }
    const endpoint = this.getIndexerEndpoint(chainId);
    if (!endpoint) return;
    // try to get from memory cache first
    this.cache[chainId] = this.cache[chainId] || {};
    const cachedEntry = this.cache[chainId][assetId];
    const now = Date.now();

    if (dbAssets?.length) {
      this.dbAssetsCache[chainId] = dbAssets;
    }

    if (
      cachedEntry?.name !== undefined &&
      cachedEntry.fetchedAt &&
      now - cachedEntry.fetchedAt < FIVE_MINUTES
    ) {
      return cachedEntry;
    }

    // get from indexed db if not in memory
    const assetFromDb = await this.storage.getItem(
      assetDbKeyFactory(chainId, assetId)
    );
    if (
      assetFromDb?.name &&
      assetFromDb.fetchedAt &&
      now - assetFromDb.fetchedAt < FIVE_MINUTES
    ) {
      this.cache[chainId][assetId] = assetFromDb;
      return assetFromDb as FuelCachedAsset;
    }

    const dbAsset = await getFuelAssetByAssetId({
      assets: dbAssets.length ? dbAssets : this.dbAssetsCache[chainId],
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

    const {
      isNFT,
      metadata,
      name: indexerAssetName,
      symbol: indexerAssetSymbol,
      ...rest
    } = assetFromIndexer ?? {};
    const asset: FuelCachedAsset = {
      ...dbAsset,
      isNft: !!isNFT,
      ...rest,
      metadata,
      fetchedAt: now,
      name: indexerAssetName || dbAsset?.name,
      symbol: indexerAssetSymbol || dbAsset?.symbol,
    };

    if (asset.name != null) {
      asset.indexed = true;
    } else {
      // @TODO: Remove once we have a proper caching pattern/mechanism
      asset.name = '';
    }

    if (save) {
      this.cache[chainId][assetId] = asset;
      this.storage.setItem(assetDbKeyFactory(chainId, assetId), asset);
    }
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

  async setItem(key: string, data: FuelCachedAsset) {
    await db.transaction('rw', db.indexedAssets, async () => {
      await db.indexedAssets.put({ ...data, key });
    });
  }
}
