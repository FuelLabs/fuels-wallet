import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Button, Card, Copyable } from '@fuel-ui/react';
import { useCallback } from 'react';

type Props = {
  account: string;
};

export function UserAddressCard({ account }: Props) {
  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText(account as string);
  }, []);

  return (
    <Card
      css={{
        p: '24px',
        gap: '$3',
        borderRadius: '$lg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box css={styles.avatarWrapper}>
        <Avatar.Generated
          css={{ width: 90, height: 90 }}
          hash={account as string}
          size="lg"
        />
      </Box>
      <Copyable value={account as string}>
        {account.slice(0, 6)}...
        {account.slice(account.length - 7, account.length - 1)}
      </Copyable>
      <Button onClick={copyAccount} size="sm" css={{ w: '100%' }}>
        Copy User Address
      </Button>
    </Card>
  );
}

const styles = {
  avatarWrapper: cssObj({
    background: '$accent11',
    w: '100px',
    h: '100px',
    borderRadius: '$full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
