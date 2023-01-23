import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Stack, Text } from '@fuel-ui/react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTxMetadata } from '../../hooks/useTxMetadata';
import type { Tx } from '../../utils';
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
  const { label, toOrFromAddress, toOrFromText, timeFormatted, id, status } =
    useTxMetadata({ ownerAddress, transaction });

  const navigate = useNavigate();

  return (
    <Card
      css={styles.root}
      aria-label="activity-item"
      onClick={() => navigate(`/transactions/view/${id}`)}
    >
      <TxIcon operationName={label} status={status} />
      <Stack css={styles.contentWrapper}>
        <Flex css={styles.row}>
          <Flex css={styles.item}>
            <Text fontSize="sm" css={styles.label}>
              {label}
            </Text>
          </Flex>
        </Flex>
        <Flex css={styles.row}>
          <Flex css={styles.fromToTextWrapper}>
            <Text fontSize="xs" css={styles.label}>
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
          {timeFormatted && (
            <Flex css={styles.item}>
              <Text fontSize="xs">{timeFormatted}</Text>
            </Flex>
          )}
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
    cursor: 'pointer',
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
  label: cssObj({
    fontWeight: '$bold',
    color: '$whiteA12',
  }),
};

ActivityItem.Loader = ActivityItemLoader;
