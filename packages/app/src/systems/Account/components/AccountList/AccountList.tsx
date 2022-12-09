import { Button, CardList, Stack } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useState } from 'react';

import { AccountItem } from '../AccountItem';
import type { AccountItemProps } from '../AccountItem';

export type AccountListProps = Omit<AccountItemProps, 'account'> & {
  accounts: Account[];
};

export function AccountList({ accounts, ...props }: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);

  function toggle() {
    setShowHidden((s) => !s);
  }

  return (
    <Stack gap="$3">
      <CardList isClickable>
        {accounts.map((account) => {
          return (
            <AccountItem
              {...props}
              key={account.address}
              account={account}
              isHidden={!showHidden && account.isHidden}
            />
          );
        })}
      </CardList>
      <Button size="xs" color="gray" variant="link" onPress={toggle}>
        {showHidden ? 'Hide' : 'Show'} hidden accounts
      </Button>
    </Stack>
  );
}
