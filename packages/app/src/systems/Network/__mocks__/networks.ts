import { uniqueId } from 'xstate/lib/utils';

export const MOCK_NETWORKS = [
  {
    id: uniqueId(),
    isSelected: true,
    name: 'Local',
    url: import.meta.env.VITE_FUEL_PROVIDER_URL,
  },
  {
    id: uniqueId(),
    name: 'Another',
    url: 'https://devnet.fuel.network/v1/graphql',
  },
];
