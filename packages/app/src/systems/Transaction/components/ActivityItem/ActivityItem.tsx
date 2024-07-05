import { cssObj } from '@fuel-ui/css';
import { Box, Card, Copyable, Icon, Text } from '@fuel-ui/react';
import { Address, type TransactionSummary } from 'fuels';
import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages, shortAddress } from '~/systems/Core';

import { useTxMetadata } from '../../hooks/useTxMetadata';
import { TxIcon } from '../TxIcon';

import { ActivityItemLoader } from './ActivityItemLoader';

export type TxItemProps = {
  transaction: TransactionSummary;
  ownerAddress: string;
};

type TxItemComponent = FC<TxItemProps> & {
  Loader: typeof ActivityItemLoader;
};

export const ActivityItem: TxItemComponent = ({
  transaction,
  ownerAddress,
}) => {
  const navigate = useNavigate();
  const {
    label,
    operation,
    toOrFromAddress,
    toOrFromText,
    timeFormatted,
    id,
    status,
  } = useTxMetadata({ ownerAddress, transaction });

  const address = useMemo(() => {
    if (!toOrFromAddress) return;

    return Address.fromDynamicInput(toOrFromAddress);
  }, [toOrFromAddress]);

  return (
    <Card
      css={styles.root}
      aria-label="activity-item"
      onClick={() => navigate(Pages.tx({ txId: id }))}
    >
      <TxIcon operation={operation} status={status} />
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
            <Text>{!!address && shortAddress(address.toB256())}</Text>
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
    fontWeight: '$normal',
    fontSize: '$sm',
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
    fontWeight: '$normal',
    color: '$inverseA12',
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
  }),
};

ActivityItem.Loader = ActivityItemLoader;
