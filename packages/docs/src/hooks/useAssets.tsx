import type { Asset } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { useFuel } from './useFuel';
import { useIsConnected } from './useIsConnected';

export function useAssets() {
  const [fuel] = useFuel();
  const [isConnected] = useIsConnected();
  const [assets, setAsset] = useState<Array<Asset>>([]);

  useEffect(() => {
    if (!isConnected) return;

    const queryAssets = async () => {
      const assets = await fuel.assets();
      setAsset(assets);
    };

    // Query assets
    queryAssets();

    fuel.on('assets', queryAssets);
    return () => {
      fuel.off('assets', queryAssets);
    };
  }, [fuel, isConnected]);

  return assets;
}
