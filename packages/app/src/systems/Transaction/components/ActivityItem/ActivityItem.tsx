import { cssObj } from '@fuel-ui/css';
import { Box, Card, Copyable, Icon, Text } from '@fuel-ui/react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTxMetadata } from '../../hooks/useTxMetadata';
import type { Tx } from '../../utils';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

import { Pages, shortAddress } from '~/systems/Core';

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
      onClick={() => navigate(Pages.tx({ txId: id }))}
    >
      <TxIcon operationName={label} status={status} />
      <Box.Stack css={styles.contentWrapper} gap="$0">
        <Box.Flex css={styles.item} gap={5}>
          <Text css={styles.label}>{label}</Text>
          <Copyable
            value={id}
            tooltipMessage="Copy Transaction ID"
            iconProps={{
              icon: Icon.is('Copy'),
              'aria-label': 'Copy Transaction ID',
            }}
          />
        </Box.Flex>
        <Box.Flex css={styles.row}>
          <Box.Flex css={styles.fromToTextWrapper}>
            <Text css={styles.label}>{toOrFromText}</Text>
            <Text>{shortAddress(toOrFromAddress)}</Text>
          </Box.Flex>
          {timeFormatted && (
            <Box.Flex css={styles.item}>
              <Text>{timeFormatted}</Text>
            </Box.Flex>
          )}
        </Box.Flex>
      </Box.Stack>
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    py: '$3',
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
    color: '$intentsBase12',
    flex: '0 0 40px',
  }),
  row: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '$sm',
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
  fromToTextWrapper: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
  label: cssObj({
    mt: '-2px',
    fontWeight: '$bold',
    color: '$whiteA12',
  }),
};

ActivityItem.Loader = ActivityItemLoader;
