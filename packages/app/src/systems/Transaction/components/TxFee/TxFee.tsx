import { Card, HStack, Text } from '@fuel-ui/react';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import { type FC, useEffect, useMemo, useState } from 'react';

import type { AssetFuelData } from '@fuel-wallet/types';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { TxFeeLoader } from './TxFeeLoader';
import { styles } from './styles';

export type TxFeeProps = {
  fee?: BN;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
  title?: string;
};

type TxFeeComponent = FC<TxFeeProps> & {
  Loader: typeof TxFeeLoader;
};

export const TxFee: TxFeeComponent = ({
  fee,
  checked,
  onChecked,
  title,
}: TxFeeProps) => {
  const [flag, setFlag] = useState(false);
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

  const feeInUsd = useMemo(() => {
    if (baseAsset?.rate == null || fee == null) return '$0';

    return convertToUsd(fee, baseAsset.decimals, baseAsset.rate).formatted;
  }, [baseAsset, fee]);

  // Horrible workaround to force re-render of this section.
  useEffect(() => {
    setTimeout(() => {
      setFlag((prev) => !prev);
    }, 500);
  }, []);

  if (!fee || !feeInUsd) return <TxFee.Loader />;

  return (
    <Card
      css={styles.detailItem(!!checked, !!onChecked, !!title)}
      onClick={() => onChecked?.(true)}
    >
      <Text
        color="intentsBase12"
        css={styles.title}
        aria-label={`fee title:${title || 'Network'}`}
      >
        {title || 'Fee (network)'}
      </Text>
      <HStack gap="$1" css={styles.fee(flag)}>
        {!!feeInUsd && (
          <Text
            color="intentsBase12"
            css={styles.usd}
            aria-label={`tip in usd:${title || 'Network'}`}
          >
            {feeInUsd}
          </Text>
        )}
        <Text
          color="textSubtext"
          css={styles.amount}
          aria-label={`fee value:${title || 'Network'}`}
        >
          (
          {fee
            ? `${fee.format({
                minPrecision: DEFAULT_PRECISION,
                precision: DEFAULT_PRECISION,
              })} ETH`
            : '--'}
          )
        </Text>
      </HStack>
    </Card>
  );
};

TxFee.Loader = TxFeeLoader;
