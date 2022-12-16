import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { FC } from 'react';

import type { Transaction } from '../../types';
import { getTransactionTypeText, getTxStatusColor } from '../../utils';
import { TxIcon } from '../TxIcon';

import { TxItemLoader } from './TxActivityItemLoader';

export type TxItemProps = {
  transaction: Transaction;
  providerUrl?: string;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof TxItemLoader;
};

export const TxItem: TxItemComponent = ({ transaction, providerUrl = '' }) => {
  const txColor = getTxStatusColor(transaction.status);
  const txExplorerLink = getBlockExplorerLink({
    path: `transaction/${transaction.id || ''}`,
    providerUrl,
  });

  return (
    <Card css={styles.root}>
      <TxIcon transactionType={transaction.type} />
      <Flex direction="column" css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">
              {' '}
              {getTransactionTypeText(transaction.type)}{' '}
            </Text>
          </Flex>

          <Flex css={styles.item}>
            <Text color={txColor} fontSize="sm">
              {' '}
              0.245 ETH
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">To: </Text>
            <Text fontSize="sm">0x00...0000</Text>
            <Flex css={styles.item}>
              <Copyable
                value={txExplorerLink}
                css={{ mx: '$2' }}
                iconProps={{
                  icon: Icon.is('CopySimple'),
                  'aria-label': 'Copy Transaction ID',
                }}
                tooltipMessage="Copy Transaction ID"
              />
            </Flex>
          </Flex>
          <Flex css={styles.item}>
            <Text fontSize="sm">Jun 27</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    pt: '$2',
    pb: '$3',
    px: '$3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$2',
    fontWeight: '$semibold',
    flexDirection: 'row',
  }),
  txIconWrapper: cssObj({
    color: '$gray12',
    flex: '0 0 40px',
  }),
  row: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  item: cssObj({
    alignItems: 'center',
  }),
  icon: cssObj({
    color: '$brand',
  }),
  contentWrapper: cssObj({
    flex: 1,
  }),
};

TxItem.Loader = TxItemLoader;
