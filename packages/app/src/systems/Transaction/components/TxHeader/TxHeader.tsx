import { cssObj } from '@fuel-ui/css';
import { Box, Card, Copyable, Icon, Text } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { FC } from 'react';

import type { TxType } from '../../utils';
import { TxStatus, getTxStatusColor } from '../../utils';

import { TxHeaderLoader } from './TxHeaderLoader';

export type TxHeaderProps = {
  status?: TxStatus;
  id?: string;
  providerUrl?: string;
  type?: TxType;
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
        <Box.Flex css={styles.item}>
          <Copyable
            value={getBlockExplorerLink({
              path: `transaction/${id || ''}`,
              providerUrl,
            })}
            tooltipMessage="Copy Transaction Link"
            iconProps={{
              icon: Icon.is('Link'),
              'aria-label': 'Copy Transaction Link',
            }}
          />
          <Copyable
            value={id || ''}
            css={{ mx: '$2' }}
            iconProps={{
              icon: Icon.is('Copy'),
              'aria-label': 'Copy Transaction ID',
            }}
            tooltipMessage="Copy Transaction ID"
          />
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

      [`&[data-status="${TxStatus.success}"]`]: {
        color: `$${getTxStatusColor(TxStatus.success)}`,
      },
      [`&[data-status="${TxStatus.failure}"]`]: {
        color: `$${getTxStatusColor(TxStatus.failure)}`,
      },
      [`&[data-status="${TxStatus.pending}"]`]: {
        color: `$${getTxStatusColor(TxStatus.pending)}`,
      },
    },
  }),
  icon: cssObj({
    color: '$brand',
  }),
  type: cssObj({
    justifyContent: 'flex-start',
    gap: '$2',
  }),
};

TxHeader.Loader = TxHeaderLoader;
