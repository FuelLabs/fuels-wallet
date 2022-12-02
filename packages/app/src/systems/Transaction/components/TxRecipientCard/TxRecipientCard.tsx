import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import type { FC } from 'react';

import type { TxRecipientAddress } from '../../types';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import { shortAddress } from '~/systems/Core';

export type TxRecipientCardProps = {
  recipient: TxRecipientAddress;
  isReceiver?: boolean;
};

type TxRecipientCardComponent = FC<TxRecipientCardProps> & {
  Loader: typeof TxRecipientCardLoader;
};

export const TxRecipientCard: TxRecipientCardComponent = ({
  recipient,
  isReceiver,
}) => {
  const { address } = recipient;
  const isAccount = recipient.type === AddressType.account;
  return (
    <Card css={styles.root}>
      <Text css={styles.from}>
        {isReceiver ? 'To' : 'From'} {!isAccount && '(Contract)'}
      </Text>
      {isAccount && (
        <Avatar.Generated
          role="img"
          size="lg"
          hash={address}
          aria-label="Generated Address"
          background="fuel"
        />
      )}
      {!isAccount && (
        <Box css={styles.iconWrapper}>
          <Icon icon={Icon.is('Code')} size={16} />
        </Box>
      )}
      {address && (
        <Flex css={styles.info}>
          <Copyable value={address}>{shortAddress(address)}</Copyable>
        </Flex>
      )}
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    p: '$3',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '$3',

    '.fuel_copyable': {
      color: '$gray12',
      fontSize: '$sm',
      fontWeight: '$semibold',
    },
    '.fuel_avatar-generated': {
      width: 56,
      height: 56,
      '& svg': {
        width: 56,
        height: 56,
      },
    },
  }),
  from: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  iconWrapper: cssObj({
    padding: '$5',
    background: '$gray3',
    borderRadius: '$full',
  }),
  info: cssObj({
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$1',

    '.fuel_copyable': {
      fontSize: '$xs',
    },
  }),
};

TxRecipientCard.Loader = TxRecipientCardLoader;
