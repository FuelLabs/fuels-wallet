import { Card, Checkbox, Flex, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { bn } from 'fuels';
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
  fee: initialFee,
  checked,
  onChecked,
  title,
}: TxFeeProps) => {
  const fee = bn(initialFee);

  return (
    <Card css={styles.detailItem(!!checked)}>
      <Flex gap="$3" align={'center'}>
        {checked !== undefined && (
          <Checkbox
            id={`${title}FeeCheckbox`}
            aria-label={`${title} Checkbox`}
            checked={checked}
            onCheckedChange={(e) => {
              onChecked?.(e as boolean);
            }}
            css={{
              width: '$4',
              height: '$4',
              borderRadius: '100%',

              '.fuel_Icon': {
                width: '$3',
              },
            }}
          />
        )}
        <Text color="intentsBase11" css={styles.text}>
          {title || 'Fee (network)'}
        </Text>
      </Flex>
      <Text color="intentsBase12" css={styles.text} aria-label="Fee Value">
        {fee?.format()} ETH
      </Text>
    </Card>
  );
};

TxFee.Loader = TxFeeLoader;
