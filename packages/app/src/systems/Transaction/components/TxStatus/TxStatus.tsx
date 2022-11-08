import { cssObj } from '@fuel-ui/css';
import { Card, Copyable, Flex, Icon, IconButton, Text } from '@fuel-ui/react';
import { TransactionType } from 'fuels';
import type { FC } from 'react';

import type { Transaction } from '../../types';

import { TxStatusLoader } from './TxStatusLoader';

export type TxStatusProps = {
  transaction: Transaction;
};

type TxStatusComponent = FC<TxStatusProps> & {
  Loader: typeof TxStatusLoader;
};

export const TxStatus: TxStatusComponent = ({ transaction }) => {
  const handleCopyLink = () => {};

  return (
    <Card css={styles.root}>
      <Flex css={styles.row}>
        <Flex css={styles.item}>
          <Text fontSize="sm">Status: </Text>
          <Text fontSize="sm" css={{ color: '$gray12', mx: '$2' }}>
            Confirmed XX
          </Text>
          <Text color="brand" css={{ borderRadius: '100%', fontSize: 9 }}>
            ●
          </Text>
        </Flex>
        <Flex css={styles.item}>
          <IconButton
            color="gray"
            css={{ px: '$0 !important' }}
            tooltip="Copy Transaction Link"
            onPress={handleCopyLink}
            variant="link"
            icon={
              <Icon icon={Icon.is('LinkSimple')} size={16} css={styles.icon} />
            }
            aria-label="Copy Transaction Link"
          />
          <Copyable value={'ID'} css={{ mx: '$2' }}>
            {' '}
          </Copyable>
        </Flex>
      </Flex>
      <Flex css={styles.row}>
        <Flex css={styles.item}>
          <Text fontSize="sm">Type: </Text>
          <Text fontSize="sm" css={{ color: '$gray12', mx: '$2' }}>
            {transaction.type === TransactionType.Script ? 'Create' : 'Receive'}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    py: '$5',
    px: '$3',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
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

TxStatus.Loader = TxStatusLoader;
