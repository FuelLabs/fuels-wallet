import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { OperationCoin } from 'fuels';
import { useEffect, useState } from 'react';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { useProvider } from '~/systems/Network/hooks/useProvider';

type UseAmountAmountParams = {
  operationsCoin?: OperationCoin[];
};

const isAssetFuelAmount = (
  value: AssetFuelAmount | null
): value is AssetFuelAmount => value !== null;

export const useAssetsAmount = (params: UseAmountAmountParams) => {
  const provider = useProvider();
  const [assetsAmount, setAssetsAmount] = useState<AssetFuelAmount[]>([]);

  useEffect(() => {
    const fetchAssetsAmount = async () => {
      try {
        if (!params.operationsCoin || !provider) {
          setAssetsAmount([]);
          return;
        }

        const assetsCache = AssetsCache.getInstance();

        const assetsWithAmount: (AssetFuelAmount | null)[] = await Promise.all(
          params.operationsCoin.map(async (operationCoin) => {
            const assetCached = await assetsCache.getAsset({
              chainId: provider.getChainId(),
              assetId: operationCoin.assetId,
              dbAssets: [],
              save: false,
            });

            if (!assetCached) return null;

            return {
              ...assetCached,
              amount: operationCoin.amount,
            };
          })
        );

        setAssetsAmount(assetsWithAmount.filter(isAssetFuelAmount));
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssetsAmount([]);
      }
    };

    fetchAssetsAmount();
  }, [provider, params.operationsCoin]);

  return assetsAmount;
};
