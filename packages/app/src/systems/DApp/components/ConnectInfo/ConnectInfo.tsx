import { cssObj } from '@fuel-ui/css';
import { Avatar, Card, Flex, Tag, Text } from '@fuel-ui/react';

import type { Account } from '~/systems/Account';
import { parseUrl, shortAddress } from '~/systems/Core';

export type ConnectInfoProps = {
  url: string;
  account: Account;
};

export function ConnectInfo({ url, account }: ConnectInfoProps) {
  return (
    <Card css={styles.root}>
      <Tag as="div" variant="outlined">
        <Text as="span">{parseUrl(url)}</Text>
      </Tag>
      <Flex css={styles.account}>
        <Avatar.Generated
          role="img"
          size="sm"
          hash={account.address}
          aria-label={account.name}
          background="fuel"
        />
        <Text>{shortAddress(account.address)}</Text>
      </Flex>
    </Card>
  );
}

const styles = {
  root: cssObj({
    padding: '$3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& .fuel_tag': {
      width: 130,
      boxSizing: 'border-box',
      px: '$3',
      borderColor: '$gray3',
      borderStyle: 'dashed',
      color: '$gray11',
    },

    '& .fuel_tag span': {
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      textSize: 'xs',
    },
  }),
  account: cssObj({
    gap: '$3',
    alignItems: 'center',

    '& .fuel_text': {
      fontSize: '$xs',
      fontWeight: '$semibold',
    },
  }),
};
