import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Stack, Text } from '@fuel-ui/react';
import { Address, bn } from 'fuels';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { Tx } from '../../utils';
import {
  getTimeFromNow,
  OperationDirection,
  getOperationDirection,
  getTxStatusColor,
} from '../../utils';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

import { getAssetInfoById } from '~/systems/Asset';
import { shortAddress } from '~/systems/Core';

export type TxItemProps = {
  transaction: Tx;
  ownerAddress: string;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof ActivityItemLoader;
};

const formatDate = (date: Date | undefined) =>
  date ? getTimeFromNow(date) : '';

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
  const date = time ? new Date(time) : undefined;

  const toOrFromText = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    switch (opDirection) {
      case OperationDirection.to:
        return 'To: ';
      case OperationDirection.from:
        return 'From: ';
      default:
        return '';
    }
  }, [ownerAddress, mainOperation]);

  const toOrFromAddress = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    const address =
      opDirection === OperationDirection.to
        ? mainOperation.to?.address
        : mainOperation.from?.address;
    return address ? Address.fromString(address).bech32Address : '';
  }, [ownerAddress, mainOperation]);

  const assetInfo = useMemo(
    () => getAssetInfoById(amount?.assetId, amount),
    [amount]
  );

  return (
    <Card css={styles.root} data-testid="activity-item">
      <TxIcon operationName={mainOperation.name} status={txStatus} />
      <Stack css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm" css={styles.label}>
              {label}
            </Text>
          </Flex>

          <Flex css={styles.item}>
            <Text color={txColor} fontSize="sm" css={styles.amount}>
              {`${bn(amount?.amount).format()} ${assetInfo.symbol}`}
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.fromToTextWrapper}>
            <Text fontSize="xs" css={styles.fromToText}>
              {toOrFromText}
            </Text>
            <Text fontSize="xs">{shortAddress(toOrFromAddress)}</Text>
            <Copyable
              value={id}
              iconProps={{
                icon: Icon.is('CopySimple'),
                'aria-label': 'Copy Transaction ID',
              }}
              tooltipMessage="Copy Transaction ID"
            />
          </Flex>
          <Flex css={styles.item}>
            <Text fontSize="xs">{formatDate(date)}</Text>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    pt: '$3',
    pb: '$3',
    px: '$3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$3',
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
    gap: '$0',
  }),
  fromToTextWrapper: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
  fromToText: cssObj({
    fontWeight: '$bold',
    color: '$whiteA12',
  }),
  label: cssObj({
    fontWeight: '$bold',
    color: '$whiteA12',
  }),
  amount: cssObj({
    fontWeight: '$bold',
  }),
};

ActivityItem.Loader = ActivityItemLoader;
