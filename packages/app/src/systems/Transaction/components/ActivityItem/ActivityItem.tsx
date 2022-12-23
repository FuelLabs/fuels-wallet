import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { bn } from 'fuels';
import type { FC } from 'react';

import { TxCategory } from '../../types';
import type { Transaction } from '../../types';
import { getTransactionTypeText, getTxStatusColor } from '../../utils';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

import { shortAddress } from '~/systems/Core';

export type TxItemProps = {
  transaction: Transaction;
  providerUrl?: string;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof ActivityItemLoader;
};

export const ActivityItem: TxItemComponent = ({ transaction }) => {
  const {
    amount,
    date,
    from,
    to,
    category: txCategory,
    status: txStatus,
  } = transaction;
  const txColor = getTxStatusColor(txStatus);

  const toOrFromText = txCategory === TxCategory.SEND ? 'From' : 'To';

  const toOrFromAddress = txCategory === TxCategory.SEND ? from : to;

  const formatDate = (date: Date) =>
    `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;

  return (
    <Card css={styles.root}>
      <TxIcon transactionType={txCategory} />
      <Flex direction="column" css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">
              {getTransactionTypeText(transaction.type)}
            </Text>
          </Flex>

          <Flex css={styles.item}>
            <Text color={txColor} fontSize="sm">
              {`${bn(amount?.amount).format()} ${amount?.symbol}`}
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">{toOrFromText}: </Text>
            <Text fontSize="sm">
              {shortAddress(toOrFromAddress?.address || '')}
            </Text>
            <Flex css={styles.item}>
              <Copyable
                value={transaction.id || ''}
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
            <Text fontSize="sm">{formatDate(date || new Date())}</Text>
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

ActivityItem.Loader = ActivityItemLoader;
