import { cssObj } from '@fuel-ui/css';
import { Card, Flex, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { bn } from 'fuels';
import type { FC } from 'react';

import { TxDetailsLoader } from './TxDetailsLoader';

export type TxDetailsProps = {
  fee?: BN;
};

type TxDetailsComponent = FC<TxDetailsProps> & {
  Loader: typeof TxDetailsLoader;
};

export const TxDetails: TxDetailsComponent = ({
  fee: initialFee,
}: TxDetailsProps) => {
  const fee = bn(initialFee || 0);

  return (
    <Card>
      <Flex css={styles.detailItems}>
        <Flex css={styles.detailItem}>
          <Text color="gray10" css={styles.text}>
            Fee (network)
          </Text>
          <Text color="gray12" css={styles.text} aria-label="Fee Value">
            {fee?.format()} ETH
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const styles = {
  detailItems: cssObj({
    flexDirection: 'column',
    gap: '$4',
    px: '$3',
    py: '$2',
    flex: 1,
  }),
  detailItem: cssObj({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  text: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
};

TxDetails.Loader = TxDetailsLoader;
