import { cssObj } from '@fuel-ui/css';
import { Box, Button, CardList, Input, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { type ReactNode, useMemo, useState } from 'react';

import { AccountItem } from '../AccountItem';

// Check if search query matches the B256 address (full or prefix, ignoring 0x)
function matchesB256Address(address: string, query: string): boolean {
  if (!query || !address) return false;
  const normalizedAddress = address.toLowerCase().replace(/^0x/, '');
  const normalizedQuery = query.toLowerCase().replace(/^0x/, '');
  return normalizedAddress.startsWith(normalizedQuery);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query: string): ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        return isMatch ? (
          <Text
            as="span"
            // biome-ignore lint/suspicious/noArrayIndexKey: Static list based on search query, order won't change
            key={index}
            css={{
              backgroundColor: '$intentsWarning3',
              color: '$intentsWarning11',
              fontWeight: '$semibold',
            }}
          >
            {part}
          </Text>
        ) : (
          part
        );
      })}
    </>
  );
}

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
  accounts = [],
  canHideAccounts,
  hasHiddenAccounts,
  isLoading,
  onPress,
  onExport,
  onUpdate,
  onToggleHidden,
}: AccountListProps) {
  const [showHidden, setShowHidden] = useState(() => false);
  const [searchQuery, setSearchQuery] = useState('');

  function toggle() {
    setShowHidden((s) => !s);
  }

  const { currentAccount, otherAccounts, hasMatchingHiddenAccounts } =
    useMemo(() => {
      const filtered = accounts.filter((account) => {
        const matchesSearch =
          account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          matchesB256Address(account.address, searchQuery);
        const isVisible = showHidden || !account.isHidden;
        return matchesSearch && isVisible;
      });

      const matchingHiddenAccounts = accounts.filter((account) => {
        if (!account.isHidden) return false;
        return (
          account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          matchesB256Address(account.address, searchQuery)
        );
      });

      const current = filtered.find((account) => account.isCurrent);
      const others = filtered.filter((account) => !account.isCurrent);

      return {
        currentAccount: current,
        otherAccounts: others,
        hasMatchingHiddenAccounts: matchingHiddenAccounts.length > 0,
      };
    }, [accounts, searchQuery, showHidden]);

  const displayAccounts = currentAccount
    ? [currentAccount, ...otherAccounts]
    : otherAccounts;

  return (
    <Box.Stack gap="$4">
      {!isLoading && accounts.length > 3 && (
        <Input>
          <Input.Field
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search accounts"
          />
        </Input>
      )}
      {isLoading && (
        <CardList>
          {[...Array(3).keys()].map((i) => {
            return <AccountItem.Loader key={i} />;
          })}
        </CardList>
      )}
      {!isLoading &&
        displayAccounts.length === 0 &&
        searchQuery &&
        !hasMatchingHiddenAccounts && (
          <Box css={styles.noResults}>
            <Text css={styles.noResultsText}>No accounts found</Text>
            <Text css={styles.noResultsSubtext}>
              Try searching by account name or address
            </Text>
          </Box>
        )}
      {!isLoading && displayAccounts.length > 0 && (
        <CardList isClickable>
          {displayAccounts.map((account) => {
            const addressMatches =
              searchQuery && matchesB256Address(account.address, searchQuery);

            return (
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
                highlightedName={
                  searchQuery
                    ? highlightText(account.name, searchQuery)
                    : undefined
                }
                addressSearchQuery={addressMatches ? searchQuery : undefined}
              />
            );
          })}
        </CardList>
      )}
      {!isLoading && hasHiddenAccounts && hasMatchingHiddenAccounts && (
        <Button
          size="xs"
          variant="link"
          onPress={toggle}
          css={styles.hiddenBtn}
          aria-label={'Toggle hidden accounts'}
        >
          {showHidden ? 'Hide' : 'Show'} hidden accounts
        </Button>
      )}
    </Box.Stack>
  );
}

const styles = {
  hiddenBtn: cssObj({
    color: '$intentsBase8',
  }),
  noResults: cssObj({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '$8',
    gap: '$2',
  }),
  noResultsText: cssObj({
    fontSize: '$base',
    fontWeight: '$medium',
    color: '$intentsBase12',
  }),
  noResultsSubtext: cssObj({
    fontSize: '$sm',
    color: '$intentsBase10',
    textAlign: 'center',
  }),
};
