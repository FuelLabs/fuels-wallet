import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Card,
  Copyable,
  HStack,
  Icon,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import { TransactionStatus } from 'fuels';
import type { TransactionTypeName } from 'fuels';
import type { FC } from 'react';

import { useExplorerLink } from '../../hooks/useExplorerLink';
import { getTxStatusColor } from '../../utils';

import { shortAddress } from '~/systems/Core';
import { TxHeaderLoader } from './TxHeaderLoader';

export type TxHeaderProps = {
  status?: TransactionStatus;
  id?: string;
  type?: TransactionTypeName;
};

type TxHeaderComponent = FC<TxHeaderProps> & {
  Loader: typeof TxHeaderLoader;
};

export const TxHeader: TxHeaderComponent = ({ status, id, type }) => {
  const { href, openExplorer } = useExplorerLink(id);

  return (
    <Card css={styles.root}>
      <HStack align="center" justify="between" gap="$2">
        <Box.Flex grow="1" gap="$2">
          <Text fontSize="sm">ID: </Text>
          <Text fontSize="sm" color="intentsBase12">
            {shortAddress(id)}
          </Text>
        </Box.Flex>
        <HStack align="center">
          <Copyable
            value={id || ''}
            iconProps={{
              icon: Icon.is('Copy'),
              'aria-label': 'Copy Transaction ID',
            }}
            tooltipMessage="Copy Transaction ID"
          />
          {href && (
            <>
              <Copyable
                value={href}
                tooltipMessage="Copy Transaction Link"
                iconProps={{
                  icon: Icon.is('Link'),
                  'aria-label': 'Copy Transaction Link',
                }}
              />
              <Tooltip content="View on Explorer">
                <Icon
                  css={styles.icon}
                  icon={Icon.is('ExternalLink')}
                  onClick={openExplorer}
                  aria-label="View on Explorer"
                />
              </Tooltip>
            </>
          )}
        </HStack>
      </HStack>
      <HStack align="center" gap="$2">
        <Text fontSize="sm">Status: </Text>
        <Text fontSize="sm" color="intentsBase12">
          {status}
        </Text>
        <Text
          as="span"
          aria-label="Status Circle"
          css={styles.circle}
          data-status={status}
        />
      </HStack>
      <HStack align="center" gap="$2">
        <Text fontSize="sm">Type: </Text>
        <Text fontSize="sm" color="intentsBase12">
          {type}
        </Text>
      </HStack>
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
  circle: cssObj({
    borderRadius: '100%',
    width: 6,
    height: 6,
    cursor: 'default',

    [`&[data-status="${TransactionStatus.success}"]`]: {
      backgroundColor: `$${getTxStatusColor(TransactionStatus.success)}`,
    },
    [`&[data-status="${TransactionStatus.failure}"]`]: {
      backgroundColor: `$${getTxStatusColor(TransactionStatus.failure)}`,
    },
    [`&[data-status="${TransactionStatus.submitted}"]`]: {
      backgroundColor: `$${getTxStatusColor(TransactionStatus.submitted)}`,
    },
  }),
  icon: cssObj({
    cursor: 'pointer',
  }),
};

TxHeader.Loader = TxHeaderLoader;
