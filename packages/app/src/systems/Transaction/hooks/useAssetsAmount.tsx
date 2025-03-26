import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { OperationCoin } from 'fuels';
import { bn } from 'fuels';
import { useEffect, useState } from 'react';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { formatAmount } from '~/systems/Core/utils';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
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

              const formattedAmount = formatAmount({
                amount: operationCoin.amount,
                options: {
                  units: assetCached.decimals || 0,
                  precision: Math.min(assetCached.decimals || 0, 4),
                },
              });

              const fullFormattedAmount = formatAmount({
                amount: operationCoin.amount,
                options: {
                  units: assetCached.decimals || 0,
                  precision: assetCached.decimals || 0,
                },
              });

              const rate = (assetCached as { rate?: number }).rate ?? 0;

              let formattedUsd: string | undefined;
              if (rate > 0) {
                const usdValue = convertToUsd(
                  bn(operationCoin.amount),
                  assetCached.decimals || 0,
                  rate
                );
                formattedUsd = usdValue.formatted;
              }

              return {
                ...assetCached,
                amount: operationCoin.amount,
                rate,
                formattedAmount,
                fullFormattedAmount,
                formattedUsd,
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
