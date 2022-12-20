import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import type { Address } from 'fuels';
import type { FC } from 'react';

import { TxType } from '../../types';
import type { Transaction, TxStatus } from '../../types';
import { getTransactionTypeText, getTxStatusColor } from '../../utils';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

import { shortAddress } from '~/systems/Core';

export type TxItemProps = {
  transaction: Transaction;
  providerUrl?: string;
  amount?: AssetAmount;
  date?: string;
  to?: Address;
  from?: Address;
  txType?: TxType;
  txStatus?: TxStatus;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof ActivityItemLoader;
};

export const ActivityItem: TxItemComponent = ({
  transaction,
  txStatus,
  amount,
  date,
  to,
  from,
  txType,
}) => {
  const txColor = getTxStatusColor(txStatus);

  const toOrFromText = txType === TxType.SEND ? 'From' : 'To';

  const toOrFromAddress = txType === TxType.SEND ? from : to;

  return (
    <Card css={styles.root}>
      <TxIcon transactionType={txType} />
      <Flex direction="column" css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">
              {getTransactionTypeText(transaction.type)}
            </Text>
          </Flex>

          <Flex css={styles.item}>
            <Text color={txColor} fontSize="sm">
              {`${amount?.amount} ${amount?.symbol}`}
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">{toOrFromText}: </Text>
            <Text fontSize="sm">
              {shortAddress(toOrFromAddress?.toString() || '')}
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
            <Text fontSize="sm">{date}</Text>
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
