import { cssObj } from '@fuel-ui/css';
import { Button, CardList, Stack } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';

import { AccountItem } from '../AccountItem';

export type AccountListProps = {
  accounts?: Account[];
  isLoading?: boolean;
  onPress?: (account: Account) => void;
  onExport?: (address: string) => void;
  onUpdate?: (address: string) => void;
};

export function AccountList({
  accounts,
  isLoading,
  onPress,
  onExport,
  onUpdate,
}: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);
  const [anyHiddenAccounts, setAnyHiddenAccounts] = useState(false);

  function toggle() {
    setShowHidden((s) => !s);
  }

  useEffect(() => {
    const hiddenAccounts = (accounts ?? []).some((acc) => acc.isHidden);
    setAnyHiddenAccounts(hiddenAccounts);
  }, [accounts]);

  return (
    <Stack gap="$3">
      {isLoading && (
        <CardList>
          {[...Array(3)].map((_, i) => {
            return <AccountItem.Loader key={i} />;
          })}
        </CardList>
      )}
      {!isLoading && (
        <CardList isClickable>
          {(accounts ?? []).map((account) => (
            <AccountItem
              onPress={() => onPress?.(account)}
              onUpdate={onUpdate}
              key={account.address}
              account={account}
              isHidden={!showHidden && account.isHidden}
              isCurrent={account.isCurrent}
              onExport={onExport}
            />
          ))}
        </CardList>
      )}
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
