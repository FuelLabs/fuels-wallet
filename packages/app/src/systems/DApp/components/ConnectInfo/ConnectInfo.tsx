import { cssObj } from '@fuel-ui/css';
import { Avatar, Button, Card, Icon, Tag, Text, Tooltip } from '@fuel-ui/react';
import type { Account } from '@fuels-wallet/types';

import { parseUrl, shortAddress } from '~/systems/Core';

export type ConnectInfoProps = {
  origin: string;
  account: Account;
};

export function ConnectInfo({ origin, account }: ConnectInfoProps) {
  return (
    <Card css={styles.root}>
      <Tag as="div" variant="outlined">
        <Tooltip content={origin} align="start" alignOffset={-10}>
          <Text as="span">{parseUrl(origin)}</Text>
        </Tooltip>
      </Tag>
      <Button variant="link" size="md" css={styles.accountBtn} color="gray">
        <Avatar.Generated
          role="img"
          size="sm"
          hash={account.address}
          aria-label={account.name}
          background="fuel"
        />
        <Text>{shortAddress(account.address)}</Text>
        <Icon icon={Icon.is('CaretDown')} size={14} />
      </Button>
    </Card>
  );
}

const styles = {
  root: cssObj({
    py: '$1',
    px: '$3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& .fuel_tag': {
      maxWidth: 130,
      boxSizing: 'border-box',
      px: '$3',
      borderColor: '$accent11',
      borderStyle: 'dashed',
      color: '$gray11',
    },

    '& .fuel_tag span': {
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      textSize: 'xs',
      color: '$accent11',
    },
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
