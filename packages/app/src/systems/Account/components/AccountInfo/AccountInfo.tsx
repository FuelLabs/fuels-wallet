import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
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
      <Card.Header space="compact">{headerText}</Card.Header>
      <Card.Body css={styles.cardBody}>
        <AccountItem account={account} />
      </Card.Body>
    </Card>
  );
}

AccountInfo.Loader = AccountInfoLoader;

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
  }),
  cardBody: cssObj({
    padding: '$0',
  }),
};
