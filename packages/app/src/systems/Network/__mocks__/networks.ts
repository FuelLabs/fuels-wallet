import { uniqueId } from 'xstate/lib/utils';

export const MOCK_NETWORKS = [
  {
    id: uniqueId(),
    isSelected: true,
    name: 'Local',
    url: process.env.VITE_FUEL_PROVIDER_URL,
  },
  {
    id: uniqueId(),
    name: 'Another',
    url: 'http://test.network.fuel.sh/graphql',
  },
];
