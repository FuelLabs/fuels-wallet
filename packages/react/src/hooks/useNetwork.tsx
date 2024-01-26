import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useNetwork = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.currentNetwork],
    async () => {
      return fuel.currentNetwork();
    }
  );

  return {
    network: data,
    ...queryProps,
  };
};
