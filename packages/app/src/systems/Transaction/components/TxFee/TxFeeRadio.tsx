import { Box, RadioGroupItem, Text } from '@fuel-ui/react';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import { type FC, useMemo } from 'react';

import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useBaseAsset } from '../../hooks/useBaseAsset';
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
  const baseAsset = useBaseAsset();

  const feeInUsd = useMemo(() => {
    if (baseAsset?.rate == null || fee == null) return '$0';

    return convertToUsd(fee, baseAsset.decimals, baseAsset.rate).formatted;
  }, [baseAsset, fee]);

  const ready = !!fee && !!feeInUsd;

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
