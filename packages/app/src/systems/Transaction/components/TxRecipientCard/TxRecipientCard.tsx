import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { isBech32 } from 'fuels';
import type { FC } from 'react';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import { shortAddress } from '~/systems/Core';

export type TxRecipientCardProps = {
  address: string;
  isReceiver?: boolean;
};

type TxRecipientCardComponent = FC<TxRecipientCardProps> & {
  Loader: typeof TxRecipientCardLoader;
};

export const TxRecipientCard: TxRecipientCardComponent = ({
  address,
  isReceiver,
}) => {
  const isAccount = isBech32(address);
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
          <Icon icon={Icon.is('Code')} size={18} />
        </Box>
      )}
      <Flex css={styles.info}>
        <Copyable value={address}>{shortAddress(address)}</Copyable>
      </Flex>
    </Card>
  );
};

const styles = {
  root: cssObj({
    minWidth: '130px',
    py: '$4',
    px: '$3',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '$3',

    '.fuel_copyable': {
      color: '$gray12',
      fontSize: '$sm',
      fontWeight: '$semibold',
    },
  }),
  from: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  iconWrapper: cssObj({
    padding: '$4',
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
