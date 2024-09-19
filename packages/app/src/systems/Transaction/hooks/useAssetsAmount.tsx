import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { OperationCoin } from 'fuels';
import { useEffect, useState } from 'react';
import { getFuelAssetByAssetId, useAssets } from '~/systems/Asset';

export const useAssetsAmount = (params: {
  operationsCoin?: OperationCoin[];
}) => {
  const { assets } = useAssets();
  const [assetsAmount, setAssetsAmount] = useState<AssetFuelAmount[]>([]);

  useEffect(() => {
    const fetchAssetsAmount = async () => {
      const assetsAmountAsync = await params.operationsCoin?.reduce(
        async (acc, operationCoin) => {
          const prev = await acc;
          const assetAmount = await getFuelAssetByAssetId({
            assets,
            assetId: operationCoin.assetId,
          });

          if (!assetAmount) return prev;

          return [...prev, { ...assetAmount, amount: operationCoin.amount }];
        },
        Promise.resolve([] as AssetFuelAmount[])
      );

      setAssetsAmount(assetsAmountAsync || []);
    };

    fetchAssetsAmount();
  }, [params.operationsCoin, assets]);

  return assetsAmount;
};
