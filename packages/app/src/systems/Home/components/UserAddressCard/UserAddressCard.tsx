import { cssObj } from '@fuel-ui/css';
import { Avatar, Button, Card, Copyable } from '@fuel-ui/react';
import { useCallback } from 'react';

type Props = {
  address: string;
};

export function UserAddressCard({ address }: Props) {
  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText(address);
  }, []);

  return (
    <Card css={styles.wrapper}>
      <Avatar.Generated hash={address} size="2xl" background="fuel" />
      <Copyable
        css={styles.accountText}
        aria-label="account-preview"
        value={address}
      >
        {address.slice(0, 15)}...
        {address.slice(address.length - 15, address.length)}
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
