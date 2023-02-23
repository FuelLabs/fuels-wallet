import { cssObj } from '@fuel-ui/css';
import { Text, Card } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';

import { AccountInfoLoader } from './AccountInfoLoader';

import { AccountItem } from '~/systems/Account';

export type AccountInfoProps = {
  headerText: string;
  account?: Account;
};

export function AccountInfo({ headerText, account }: AccountInfoProps) {
  if (!account) return <AccountInfo.Loader />;
  return (
    <Card css={styles.root} gap="$0">
      <Card.Header css={styles.header}>
        <Text fontSize="sm" css={styles.headerText}>
          {headerText}
        </Text>
      </Card.Header>
      <AccountItem account={account} />
    </Card>
  );
}

AccountInfo.Loader = AccountInfoLoader;

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
  }),
  header: cssObj({
    px: '$3',
    py: '$2',
    display: 'flex',
  }),
  headerText: cssObj({
    color: '$gray12',
    fontWeight: '$bold',
  }),
};
