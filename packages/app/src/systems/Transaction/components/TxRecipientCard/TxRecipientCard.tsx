import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import type { FC } from 'react';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import type { Account } from '~/systems/Account';
import { shortAddress } from '~/systems/Core';

export type TxRecipientCardProps = {
  account?: Account;
  contract?: { address: string };
};

type TxRecipientCardComponent = FC<TxRecipientCardProps> & {
  Loader: typeof TxRecipientCardLoader;
};

export const TxRecipientCard: TxRecipientCardComponent = ({ account, contract }) => {
  const address = account ? account.address : contract?.address;
  return (
    <Card css={styles.root}>
      <Text css={styles.from}>From {contract && '(Contract)'}</Text>
      {account && (
        <Avatar.Generated
          role="img"
          size="lg"
          hash={account.address}
          aria-label={account.name}
          background="fuel"
        />
      )}
      {contract && (
        <Box css={styles.iconWrapper}>
          <Icon icon={Icon.is('Code')} size={18} />
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
