import { CHAIN_IDS } from 'fuels';
import type { AssetEndpoint } from '~/systems/Asset/types';

export const ASSET_ENDPOINTS: Record<string, AssetEndpoint> = {
  [CHAIN_IDS.fuel.mainnet]: {
    chainId: CHAIN_IDS.fuel.mainnet,
    url: 'https://explorer-indexer-mainnet.fuel.network',
  },
  [CHAIN_IDS.fuel.testnet]: {
    chainId: CHAIN_IDS.fuel.testnet,
    url: 'https://explorer-indexer-testnet.fuel.network',
  },
};

export const DEFAULT_ASSET_ENDPOINT = ASSET_ENDPOINTS[CHAIN_IDS.fuel.mainnet];
