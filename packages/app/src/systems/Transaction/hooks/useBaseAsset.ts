import type { AssetFuelData } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { useProvider } from '~/systems/Network/hooks/useProvider';

/**
 * A hook that fetches the base asset for the current network
 *
 * @returns The base asset data or undefined if not yet fetched
 */
export function useBaseAsset() {
  const provider = useProvider();
  const [baseAsset, setBaseAsset] = useState<AssetFuelData | undefined>();

  useEffect(() => {
    let abort = false;

    const getBaseAsset = async () => {
      const [baseAssetId, chainId] = await Promise.all([
        provider?.getBaseAssetId(),
        provider?.getChainId(),
      ]);

      if (abort || baseAssetId == null || chainId == null) return;

      const baseAsset = await AssetsCache.getInstance().getAsset({
        chainId: chainId,
        assetId: baseAssetId,
        dbAssets: [],
        save: false,
      });

      if (abort) return;
      setBaseAsset(baseAsset);
    };

    getBaseAsset();

    return () => {
      abort = true;
    };
  }, [provider]);

  return baseAsset;
}
