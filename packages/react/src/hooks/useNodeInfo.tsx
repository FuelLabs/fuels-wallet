import { useQuery } from '@tanstack/react-query';
import { compare } from 'compare-versions';

import { QUERY_KEYS } from '../utils';

import { useProvider } from './useProvider';

type NodeInfoParams = {
  version?: string;
};

export const useNodeInfo = ({ version = '0.0.0' }: NodeInfoParams = {}) => {
  const { provider } = useProvider();
  const { data: nodeInfo, ...query } = useQuery(
    [QUERY_KEYS.nodeInfo, provider?.url],
    () => {
      return provider?.fetchNode();
    },
    {
      enabled: !!provider,
    }
  );
  const isCompatible = nodeInfo?.nodeVersion
    ? compare(nodeInfo.nodeVersion, version, '>=')
    : null;

  return {
    isCompatible,
    nodeInfo,
    ...query,
  };
};
