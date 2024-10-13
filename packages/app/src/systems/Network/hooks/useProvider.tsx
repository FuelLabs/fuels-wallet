import { createProvider } from '@fuel-wallet/connections';
import type { Provider } from 'fuels';
import { useEffect, useState } from 'react';
import { useNetworks } from './useNetworks';

export function useProvider() {
  const { network } = useNetworks();
  const [provider, setProvider] = useState<Provider | undefined>(undefined);

  useEffect(() => {
    if (network?.url) {
      createProvider(network.url).then(setProvider);
    }
  }, [network?.url]);

  return provider;
}
