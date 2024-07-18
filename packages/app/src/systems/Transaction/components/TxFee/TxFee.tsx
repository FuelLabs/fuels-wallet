import { Card, Text } from '@fuel-ui/react';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import type { FC } from 'react';

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
  return (
    <Card
      css={styles.detailItem(!!checked, !!onChecked)}
      onClick={() => onChecked?.(true)}
    >
      <Text
        color="intentsBase11"
        css={styles.title}
        aria-label={`fee title:${title || 'Network'}`}
      >
        {title || 'Fee (network)'}
      </Text>
      <Text
        color="intentsBase12"
        css={styles.amount}
        aria-label={`fee value:${title || 'Network'}`}
      >
        {fee
          ? `${fee.format({
              minPrecision: DEFAULT_PRECISION,
              precision: DEFAULT_PRECISION,
            })} ETH`
          : '--'}
      </Text>
    </Card>
  );
};

TxFee.Loader = TxFeeLoader;
