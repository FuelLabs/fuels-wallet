import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { MUTATION_KEYS } from '../utils';

export const useAddNetwork = () => {
  const { fuel } = useFuel();

  const { mutate, mutateAsync, ...queryProps } = useMutation(
    [MUTATION_KEYS.addAssets],
    async (networkUrl: string) => {
      return fuel.addNetwork(networkUrl);
    }
  );

  return {
    addNetwork: (networkUrl: string) => mutate(networkUrl),
    addNetworkAsync: (networkUrl: string) => mutateAsync(networkUrl),
    ...queryProps,
  };
};
