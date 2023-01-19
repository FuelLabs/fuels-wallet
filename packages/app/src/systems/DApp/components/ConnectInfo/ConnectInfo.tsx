import { cssObj } from '@fuel-ui/css';
import { Avatar, Button, Card, Icon, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';

import { ConnectInfoLoader } from './ConnectInfoLoader';

import { OriginTag, shortAddress } from '~/systems/Core';

export type ConnectInfoProps = {
  origin: string;
  account: Account;
  isReadOnly?: boolean;
};

export function ConnectInfo({ origin, account, isReadOnly }: ConnectInfoProps) {
  return (
    <Card css={styles.root}>
      <OriginTag origin={origin} />
      <Button
        variant="link"
        size="md"
        css={styles.accountBtn}
        color="gray"
        isDisabled={isReadOnly}
      >
        <Avatar.Generated
          role="img"
          size="sm"
          hash={account.address}
          aria-label={account.name}
          background="fuel"
        />
        <Text>{shortAddress(account.address)}</Text>
        {!isReadOnly && <Icon icon={Icon.is('CaretDown')} size={14} />}
      </Button>
    </Card>
  );
}

ConnectInfo.Loader = ConnectInfoLoader;

const styles = {
  root: cssObj({
    py: '$1',
    px: '$3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  accountBtn: cssObj({
    alignItems: 'center',
    px: '$0 !important',

    '&:hover': {
      textDecoration: 'none !important',
    },

    '&, & .fuel_text': {
      fontSize: '$xs',
      fontWeight: '$semibold',
      color: '$gray9 !important',
    },

    '&:hover, &:hover .fuel_text': {
      color: '$gray11 !important',
    },

    '& .fuel_text': {
      ml: '$1',
    },
  }),
};
