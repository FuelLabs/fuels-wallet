import { Box, RadioGroupItem, Text } from '@fuel-ui/react';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import { type FC, useEffect, useMemo, useState } from 'react';

import type { AssetFuelData } from '@fuel-wallet/types';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { TxFee } from './TxFee';
import { TxFeeLoader } from './TxFeeLoader';
import { styles } from './styles';

export type TxFeeRadioProps = {
  fee?: BN;
  checked?: boolean;
  title: string;
};

type TxFeeRadioComponent = FC<TxFeeRadioProps>;

export const TxFeeRadio: TxFeeRadioComponent = ({
  fee,
  checked,
  title,
}: TxFeeRadioProps) => {
  const [_flag, setFlag] = useState(false);
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

  const ready = !!fee && !!feeInUsd;

  // Horrible workaround to force re-render of this section.
  useEffect(() => {
    setTimeout(() => {
      setFlag((prev) => !prev);
    }, 500);
  }, [ready]);

  if (!ready) return <TxFee.Loader />;

  return (
    <Box.Flex key={title} css={styles.option}>
      <RadioGroupItem
        value={title}
        checked={checked}
        label={title}
        labelCSS={styles.optionLabel}
      />

      <Text css={styles.optionContent}>
        {fee
          ? `${fee.format({
              minPrecision: DEFAULT_PRECISION,
              precision: DEFAULT_PRECISION,
            })} ETH`
          : '--'}
      </Text>
    </Box.Flex>
  );
};

TxFee.Loader = TxFeeLoader;
