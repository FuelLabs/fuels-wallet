import type { NetworkData } from '@fuel-wallet/types';
import { uniqueId } from 'xstate/lib/utils';

export const MOCK_NETWORKS: NetworkData[] = [
  {
    id: uniqueId(),
    chainId: 0,
    isSelected: true,
    name: 'Local',
    url: import.meta.env.VITE_FUEL_PROVIDER_URL,
  },
  {
    id: uniqueId(),
    chainId: 2,
    isSelected: false,
    name: 'Another',
    url: 'https://testnet.fuel.network/v1/graphql',
  },
];
