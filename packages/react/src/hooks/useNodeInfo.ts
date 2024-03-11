import { compare } from 'compare-versions';

import { useNamedQuery } from '../core';
import { QUERY_KEYS } from '../utils';

import { useProvider } from './useProvider';

type NodeInfoParams = {
  version?: string;
};

export const useNodeInfo = ({ version = '0.0.0' }: NodeInfoParams = {}) => {
  const { provider } = useProvider();

  const query = useNamedQuery('nodeInfo', {
    queryKey: [QUERY_KEYS.nodeInfo, provider?.url],
    queryFn: () => {
      return provider?.fetchNode();
    },
    enabled: !!provider,
  });

  return new Proxy(query, {
    get(target, prop) {
      if (prop === 'isCompatible') {
        if (target.nodeInfo?.nodeVersion) {
          return compare(target.nodeInfo?.nodeVersion, version, '>=');
        }

        return null;
      }

      return Reflect.get(target, prop);
    },
  }) as typeof query & {
    isCompatible: boolean;
  };
};
