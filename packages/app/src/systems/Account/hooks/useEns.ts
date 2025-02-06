import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { isValidEthAddress } from '~/systems/Core';

export type EnsData = {
  name: string | null;
  avatar: string | null;
  loading: boolean;
  error: Error | null;
};

export function useEns(address?: string) {
  const [ensData, setEnsData] = useState<EnsData>({
    name: null,
    avatar: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    async function resolveEns() {
      if (!address || !isValidEthAddress(address)) {
        setEnsData({
          name: null,
          avatar: null,
          loading: false,
          error: null,
        });
        return;
      }

      setEnsData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Using Ethereum mainnet for ENS resolution
        const provider = new ethers.providers.JsonRpcProvider(
          'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213'
        );

        // Get ENS name for the address (reverse lookup)
        const name = await provider.lookupAddress(address);

        // Get avatar if ENS name exists
        let avatar = null;
        if (name) {
          const resolver = await provider.getResolver(name);
          if (resolver) {
            avatar = await resolver.getText('avatar');
          }
        }

        setEnsData({
          name,
          avatar,
          loading: false,
          error: null,
        });
      } catch (error) {
        setEnsData({
          name: null,
          avatar: null,
          loading: false,
          error: error as Error,
        });
      }
    }

    resolveEns();
  }, [address]);

  return ensData;
}
