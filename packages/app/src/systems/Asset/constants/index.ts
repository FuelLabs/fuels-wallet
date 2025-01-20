import type { AssetEndpoint } from '~/systems/Asset/types';

export const ASSET_ENDPOINTS: AssetEndpoint[] = [
  {
    chainId: 9889,
    url: 'https://explorer-indexer-mainnet.fuel.network',
  },
  {
    chainId: 0,
    url: 'https://explorer-indexer-testnet.fuel.network',
  },
];
