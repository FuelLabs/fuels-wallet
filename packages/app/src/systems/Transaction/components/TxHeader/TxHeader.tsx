import { cssObj } from '@fuel-ui/css';
import { Box, Card, Copyable, Icon, Text, Tooltip } from '@fuel-ui/react';
import { TransactionStatus } from 'fuels';
import type { TransactionTypeName } from 'fuels';
import type { FC } from 'react';

import { useExplorerLink } from '../../hooks/useExplorerLink';
import { getTxStatusColor } from '../../utils';

import { TxHeaderLoader } from './TxHeaderLoader';

export type TxHeaderProps = {
  status?: TransactionStatus;
  id?: string;
  providerUrl?: string;
  type?: TransactionTypeName;
};

type TxHeaderComponent = FC<TxHeaderProps> & {
  Loader: typeof TxHeaderLoader;
};

export const TxHeader: TxHeaderComponent = ({
  status,
  id,
  type,
  providerUrl = '',
}) => {
  const { href: _href, openExplorer: _openExplorer } = useExplorerLink(
    providerUrl,
    id
  );

  return (
    <Card css={styles.root}>
      <Box.Flex css={styles.row}>
        <Box.Flex css={styles.item}>
          <Text fontSize="sm">Status: </Text>
          <Text fontSize="sm" className="status">
            {status}
          </Text>
          <Text
            aria-label="Status Circle"
            className="circle"
            data-status={status}
          >
            ●
          </Text>
        </Box.Flex>
        <Box.Flex css={styles.actions}>
          <Copyable
            value={id || ''}
            iconProps={{
              icon: Icon.is('Copy'),
              'aria-label': 'Copy Transaction ID',
            }}
            tooltipMessage="Copy Transaction ID"
          />
          {/* <Copyable
            value={href}
            tooltipMessage="Copy Transaction Link"
            iconProps={{
              icon: Icon.is('Link'),
              'aria-label': 'Copy Transaction Link',
            }}
          />
          <Tooltip content="Open explorer">
            <Icon
              css={styles.icon}
              icon={Icon.is('ExternalLink')}
              onClick={openExplorer}
              aria-label="Open explorer"
            />
          </Tooltip> */}
        </Box.Flex>
      </Box.Flex>
      <Box.Flex css={{ ...styles.row, ...styles.type }}>
        <Text fontSize="sm">Type: </Text>
        <Text fontSize="sm" className="type">
          {type}
        </Text>
      </Box.Flex>
    </Card>
  );
};

const styles = {
  root: cssObj({
    px: '$4',
    py: '$3',
    fontWeight: '$normal',

    '.fuel_copyable-icon': {
      color: '$brand !important',
    },
  }),
  row: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '$6',
  }),
  actions: cssObj({
    gap: '$2',
  }),
  item: cssObj({
    alignItems: 'center',

    '.status, .type': {
      color: '$intentsBase12',
      mx: '$2',
    },

    '.circle': {
      borderRadius: '100%',
      fontSize: 9,
      cursor: 'default',

      [`&[data-status="${TransactionStatus.success}"]`]: {
        color: `$${getTxStatusColor(TransactionStatus.success)}`,
      },
      [`&[data-status="${TransactionStatus.failure}"]`]: {
        color: `$${getTxStatusColor(TransactionStatus.failure)}`,
      },
      [`&[data-status="${TransactionStatus.submitted}"]`]: {
        color: `$${getTxStatusColor(TransactionStatus.submitted)}`,
      },
    },
  }),
  icon: cssObj({
    cursor: 'pointer',
  }),
  type: cssObj({
    justifyContent: 'flex-start',
    gap: '$2',
  }),
};

TxHeader.Loader = TxHeaderLoader;
