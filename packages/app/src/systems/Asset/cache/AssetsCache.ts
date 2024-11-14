import type { AssetData } from '@fuel-wallet/types';
import type { Asset, Provider } from 'fuels';
import { db } from '~/systems/Core/utils/database';
import { fetchNftData } from '../utils/nft';

type Endpoint = {
  chainId: number;
  url: string;
};

export class AssetsCache {
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

    const assetFromIndexer = await this.fetchAssetFromIndexer(
      endpoint.url,
      assetId
    );

    console.log('asd assetFromIndexer', assetFromIndexer);
    if (!assetFromIndexer) return;

    const { isNFT, ...rest } = assetFromIndexer;
    const asset = {
      ...rest,
      isNft: !!isNFT,
    };

    if (assetFromIndexer.contractId) {
      const nftData = await fetchNftData({
        assetId,
        contractId: assetFromIndexer.contractId,
        provider,
      }).catch(() => undefined);
      if (nftData?.name) {
        Object.assign(asset, nftData);
      }
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
