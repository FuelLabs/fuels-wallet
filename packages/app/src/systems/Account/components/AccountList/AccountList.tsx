import { cssObj } from '@fuel-ui/css';
import { Button, CardList, Stack } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { useState } from 'react';

import { AccountItem } from '../AccountItem';

export type AccountListProps = {
  accounts?: Account[];
  canHideAccounts?: boolean;
  hasHiddenAccounts?: boolean;
  isLoading?: boolean;
  onPress?: (account: Account) => void;
  onExport?: (address: string) => void;
  onToggleHidden?: (address: string, isHidden: boolean) => void;
  onUpdate?: (address: string) => void;
};

export function AccountList({
  accounts,
  canHideAccounts,
  hasHiddenAccounts,
  isLoading,
  onPress,
  onExport,
  onUpdate,
  onToggleHidden,
}: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);

  function toggle() {
    setShowHidden((s) => !s);
  }

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
              onToggleHidden={
                (!canHideAccounts && !account.isHidden) || account.isCurrent
                  ? undefined
                  : onToggleHidden
              }
            />
          ))}
        </CardList>
      )}
      {!isLoading && hasHiddenAccounts && (
        <Button
          size="xs"
          color="gray"
          variant="link"
          onPress={toggle}
          css={styles.hiddenBtn}
          aria-label={`Toggle hidden accounts`}
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
