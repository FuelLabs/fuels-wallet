import { cssObj } from '@fuel-ui/css';
import { Avatar, Button, Card, Copyable } from '@fuel-ui/react';
import { useCallback } from 'react';

type Props = {
  account: string;
};

export function UserAddressCard({ account }: Props) {
  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText(account as string);
  }, []);

  return (
    <Card css={styles.wrapper}>
      <Avatar.Generated hash={account as string} size="2xl" background="fuel" />
      <Copyable
        css={styles.accountText}
        aria-label="account-preview"
        value={account as string}
      >
        {account.slice(0, 15)}...
        {account.slice(account.length - 15, account.length - 1)}
      </Copyable>
      <Button
        aria-label="copy-account"
        onClick={copyAccount}
        size="sm"
        css={{ w: '100%' }}
      >
        Copy User Address
      </Button>
    </Card>
  );
}

const styles = {
  wrapper: cssObj({
    p: '24px',
    gap: '$3',
    borderRadius: '$lg',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  accountText: cssObj({
    fontSize: '$xs',
    fontWeight: '$bold',
  }),
};
