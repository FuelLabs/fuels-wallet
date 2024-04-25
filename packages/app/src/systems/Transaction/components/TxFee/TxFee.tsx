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
      <Flex gap="$3" align={'center'}>
        {/* {checked !== undefined && (
          <Checkbox
            id={`${title}FeeCheckbox`}
            aria-label={`${title} Checkbox`}
            checked={checked}
            css={{
              width: '$3',
              height: '$3',
              borderRadius: '100%',

              '.fuel_Icon': {
                display: 'none'
              },
            }}
          />
        )} */}
        <Text color="intentsBase11" css={styles.text}>
          {title || 'Fee (network)'}
        </Text>
      </Flex>
      <Text color="intentsBase12" css={styles.text} aria-label="Fee Value">
        {fee ? `${fee.format()} ETH` : '--'}
      </Text>
    </Card>
  );
};

TxFee.Loader = TxFeeLoader;
