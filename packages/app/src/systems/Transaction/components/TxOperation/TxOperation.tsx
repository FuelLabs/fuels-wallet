import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';

import type { Operation, TxStatus } from '../../utils';
import { TxFromTo } from '../TxFromTo/TxFromTo';

import { AssetsAmount } from '~/systems/Asset';

export type TxOperationProps = {
  operation?: Operation;
  status?: TxStatus;
};

export function TxOperation({ operation, status }: TxOperationProps) {
  const { from, to, assetsSent } = operation ?? {};
  return (
    <Card css={styles.root}>
      <TxFromTo from={from} to={to} status={status} />
      {!!assetsSent?.length && <AssetsAmount amounts={assetsSent} />}
    </Card>
  );
}

TxOperation.Loader = () => (
  <Card css={styles.root}>
    <TxFromTo isLoading={true} />
    <AssetsAmount.Loader />
  </Card>
);

const styles = {
  root: cssObj({
    position: 'relative',
    '.fuel_card': {
      boxShadow: 'none',
    },
    '.asset_amount': {
      pt: '$2',
      borderTop: '1px dashed $gray3',
    },
  }),
};
