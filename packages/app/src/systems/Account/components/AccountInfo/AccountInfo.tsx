import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import { AccountItem } from '~/systems/Account';

import { AccountInfoLoader } from './AccountInfoLoader';

export type AccountInfoProps = {
  headerText: string;
  account?: Account;
};

export function AccountInfo({ headerText, account }: AccountInfoProps) {
  if (!account) return <AccountInfo.Loader />;
  return (
    <Card css={styles.root}>
      <Card.Header space="compact">{headerText}</Card.Header>
      <Card.Body css={styles.cardBody}>
        <AccountItem account={account} compact />
      </Card.Body>
    </Card>
  );
}

AccountInfo.Loader = AccountInfoLoader;

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
    gap: '$1',
  }),
  cardBody: cssObj({
    padding: '$0',

    '& > .fuel_Card': {
      border: 'none',
    },
  }),
};
