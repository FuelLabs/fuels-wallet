import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { bn } from 'fuels';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { Tx } from '../../utils';
import {
  OperationDirection,
  getOperationDirection,
  getTxStatusColor,
} from '../../utils';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

import { shortAddress } from '~/systems/Core';

export type TxItemProps = {
  transaction: Tx;
  ownerAddress: string;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof ActivityItemLoader;
};

export const ActivityItem: TxItemComponent = ({
  transaction,
  ownerAddress,
}) => {
  const {
    status: txStatus,
    id = '',
    totalAssetsSent,
    operations,
    time,
  } = transaction;
  const txColor = getTxStatusColor(txStatus);

  const mainOperation = operations[0];
  const label = mainOperation.name;
  const amount = totalAssetsSent[0];
  const date = time ? new Date(time) : null;

  const toOrFromText = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    if (opDirection === OperationDirection.to) return 'To: ';
    if (opDirection === OperationDirection.from) return 'From: ';
    return '';
  }, [ownerAddress, mainOperation]);

  const toOrFromAddress = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    if (opDirection === OperationDirection.to)
      return mainOperation.to?.address || '';
    if (opDirection === OperationDirection.from)
      return mainOperation.from?.address || '';
    return '';
  }, [ownerAddress, mainOperation]);

  const formatDate = (date: Date) =>
    `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;

  return (
    <Card css={styles.root} data-testid="activity-item">
      <TxIcon operationName={mainOperation.name} />
      <Flex direction="column" css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">{label}</Text>
          </Flex>

          <Flex css={styles.item}>
            <Text color={txColor} fontSize="sm">
              {/* @TODO: figure out a way to fetch the asset ID */}
              {`${bn(amount?.amount).format()}`}
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm">{toOrFromText}</Text>
            <Text fontSize="sm">{shortAddress(toOrFromAddress)}</Text>
            <Flex css={styles.item}>
              <Copyable
                value={id}
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
