import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { OperationCoin } from 'fuels';
import { useEffect, useState } from 'react';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import type { AssetAmountWithRate } from '../types';

type UseAmountAmountParams = {
  operationsCoin?: OperationCoin[];
};

const isAssetFuelAmount = (
  value: AssetAmountWithRate | null
): value is AssetAmountWithRate => value !== null;

export const useAssetsAmount = (params: UseAmountAmountParams) => {
  const provider = useProvider();
  const [assetsAmount, setAssetsAmount] = useState<AssetAmountWithRate[]>([]);

  useEffect(() => {
    const fetchAssetsAmount = async () => {
      try {
        if (!params.operationsCoin || !provider) {
          setAssetsAmount([]);
          return;
        }

        const assetsCache = AssetsCache.getInstance();

        const assetsWithAmount: (AssetAmountWithRate | null)[] =
          await Promise.all(
            params.operationsCoin.map(async (operationCoin) => {
              const assetCached = await assetsCache.getAsset({
                chainId: await provider.getChainId(),
                assetId: operationCoin.assetId,
                dbAssets: [],
                save: false,
              });

              if (!assetCached) return null;

              return {
                ...assetCached,
                amount: operationCoin.amount,
                rate: (assetCached as { rate?: number }).rate ?? 0,
              } as AssetAmountWithRate;
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
