import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';
import { getAssetFuelCurrentChain } from '../utils';

const useFuelAsset = (params: { asset?: AssetData; chainId?: number }) => {
  const [fuelAsset, setFuelAsset] = useState<AssetFuelData>();

  const { asset, chainId } = params;
  useEffect(() => {
    const fetchFuelAsset = async () => {
      if (!asset) return;

      try {
        const fuelAsset = await getAssetFuelCurrentChain({ asset, chainId });
        setFuelAsset(fuelAsset);
      } catch (_error) {
        // Handle error
      }
    };

    fetchFuelAsset();
  }, [asset, chainId]);

  return fuelAsset;
};

export default useFuelAsset;
