import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { FC } from 'react';

import type { Status, Type } from '../../utils';
import { getTxStatusColor } from '../../utils';

import { TxHeaderLoader } from './TxHeaderLoader';

export type TxHeaderProps = {
  status?: Status;
  id?: string;
  providerUrl?: string;
  type?: Type;
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
  const txColor = getTxStatusColor(status);

  return (
    <Card css={styles.root}>
      <Flex css={styles.row}>
        <Flex css={styles.item}>
          <Text fontSize="sm">Status: </Text>
          <Text fontSize="sm" css={{ color: '$gray12', mx: '$2' }}>
            {status}
          </Text>
          <Text
            color={txColor}
            aria-label={`Status Color: ${txColor}`}
            css={{ borderRadius: '100%', fontSize: 9, cursor: 'default' }}
          >
            ●
          </Text>
        </Flex>
        <Flex css={styles.item}>
          <Copyable
            value={getBlockExplorerLink({
              path: `transaction/${id || ''}`,
              providerUrl,
            })}
            tooltipMessage="Copy Transaction Link"
            iconProps={{
              icon: Icon.is('LinkSimple'),
              'aria-label': 'Copy Transaction Link',
            }}
          />
          <Copyable
            value={id || ''}
            css={{ mx: '$2' }}
            iconProps={{
              icon: Icon.is('CopySimple'),
              'aria-label': 'Copy Transaction ID',
            }}
            tooltipMessage="Copy Transaction ID"
          />
        </Flex>
      </Flex>
      <Flex css={styles.row}>
        <Flex css={styles.item}>
          <Text fontSize="sm">Type: </Text>
          <Text fontSize="sm" css={{ color: '$gray12', mx: '$2' }}>
            {type}
          </Text>
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
    flexDirection: 'column',
    gap: '$2',
    fontWeight: '$semibold',

    '.fuel_copyable-icon': {
      color: '$brand !important',
    },
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
};

TxHeader.Loader = TxHeaderLoader;
