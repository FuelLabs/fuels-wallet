import { cssObj } from '@fuel-ui/css';
import { Button, CardList, Stack } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';

import { AccountItem } from '../AccountItem';

export type AccountListProps = {
  accounts: Account[];
  isLoading?: boolean;
  onPress: (account: Account) => void;
};

export function AccountList({
  accounts,
  isLoading,
  onPress,
}: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);
  const [anyHiddenAccounts, setAnyHiddenAccounts] = useState(false);

  function toggle() {
    setShowHidden((s) => !s);
  }

  useEffect(() => {
    const hiddenAccounts = accounts.some((acc) => acc.isHidden);
    setAnyHiddenAccounts(hiddenAccounts);
  }, [accounts]);

  return (
    <Stack gap="$3">
      <CardList isClickable>
        {isLoading
          ? [...Array(3)].map((_, i) => {
              return <AccountItem.Loader key={i} />;
            })
          : accounts.map((account) => {
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
      {!isLoading && anyHiddenAccounts && (
        <Button
          size="xs"
          color="gray"
          variant="link"
          onPress={toggle}
          css={styles.hiddenBtn}
        >
          {showHidden ? 'Hide' : 'Show'} hidden accounts
        </Button>
      )}
    </Stack>
  );
}

const styles = {
  hiddenBtn: cssObj({
    color: '$gray8',
  }),
};
