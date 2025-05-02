import { useCallback, useState } from 'react';
import { useNetworks } from '~/systems/Network';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import NameSystemService from '../services/nameSystem';

export const useResolver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { network } = useNetworks();

  const resolver = useCallback(
    async (name: string) => {
      setIsLoading(true);

      const resolver = await NameSystemService.resolverDomain({
        domain: name,
        chainId: network?.chainId!,
      });

      setIsLoading(false);

      return resolver;
    },
    [network?.chainId]
  );

  return { resolver, isLoading };
};
