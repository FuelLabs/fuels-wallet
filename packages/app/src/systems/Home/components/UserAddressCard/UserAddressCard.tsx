import { cssObj } from '@fuel-ui/css';
import { Avatar, Button, Card, Copyable } from '@fuel-ui/react';
import { useCallback } from 'react';

type Props = {
  address: string;
};

export function UserAddressCard({ address }: Props) {
  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText(address);
  }, [address]);

  return (
    <Card>
      <Card.Body css={styles.wrapper}>
        <Avatar.Generated
          hash={address}
          size="2xl"
          css={{ boxShadow: '$sm' }}
        />
        <Copyable
          css={styles.accountText}
          aria-label="account-preview"
          value={address}
        >
          {address.slice(0, 15)}...
          {address.slice(address.length - 15, address.length)}
        </Copyable>
        <Button
          variant="ghost"
          aria-label="copy-account"
          onPress={copyAccount}
          size="sm"
        >
          Copy User Address
        </Button>
      </Card.Body>
    </Card>
  );
}

const styles = {
  wrapper: cssObj({
    gap: '$3',
    borderRadius: '$lg',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }),
  accountText: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
};
