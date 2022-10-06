import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Button, Card, Copyable } from '@fuel-ui/react';

import { useAccount } from '~/systems/Account';

export function UserAddressCard() {
  const { account } = useAccount();

  return (
    <Card
      css={{
        p: '$4',
        gap: '$3',
        borderRadius: '$lg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box css={styles.avatarWrapper}>
        <Avatar.Generated hash={account?.publicKey as string} size="lg" />
      </Box>
      <Copyable value={account?.address as string}>
        {account?.address.slice(0, 6)}...
        {account?.address.slice(
          account.address.length - 7,
          account.address.length - 1
        )}
      </Copyable>
      <Button size="sm" css={{ w: '100%' }}>
        Share
      </Button>
    </Card>
  );
}

const styles = {
  avatarWrapper: cssObj({
    background: '$accent11',
    w: '60px',
    h: '60px',
    borderRadius: '$full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
