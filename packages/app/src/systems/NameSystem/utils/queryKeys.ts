import type { QueryKey } from '@tanstack/react-query';

export const NS_QUERY_KEYS = {
  base: ['nameSystem'] as QueryKey,
  name: (name: string, provider?: string) => {
    const base = NS_QUERY_KEYS.base.concat(['name', name]);
    if (typeof provider !== 'undefined') base.push(provider);
    return base as QueryKey;
  },
  address: (address: string, provider?: string) => {
    const base = NS_QUERY_KEYS.base.concat(['address', address]);
    if (typeof provider !== 'undefined') base.push(provider);
    return base as QueryKey;
  },
};
