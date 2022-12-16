import { Button, CardList, Stack } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';

import { AccountItem } from '../AccountItem';

export type AccountListProps = {
  onPress: (account: Account) => void;
  accounts: Account[];
};

export function AccountList({ accounts, onPress }: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);
  const [anyHiddenAccounts, setAnyHiddenAccounts] = useState(false);

  function toggle() {
    setShowHidden((s) => !s);
  }

  useEffect(() => {
    const hiddenAccounts = accounts.some((account) => {
      return account.isHidden;
    });
    setAnyHiddenAccounts(hiddenAccounts);
  }, [accounts]);

  return (
    <Stack gap="$3">
      <CardList isClickable>
        {accounts.map((account) => {
          return (
            <AccountItem
              onPress={() => onPress(account)}
              key={account.address}
              account={account}
              isHidden={!showHidden && account.isHidden}
              isSelected={account.isSelected}
            />
          );
        })}
      </CardList>
      {anyHiddenAccounts && (
        <Button size="xs" color="gray" variant="link" onPress={toggle}>
          {showHidden ? 'Hide' : 'Show'} hidden accounts
        </Button>
      )}
    </Stack>
  );
}
