import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';

import type { Operation, Status } from '../../utils';
import { TxFromTo } from '../TxFromTo/TxFromTo';

import { AssetsAmount } from '~/systems/Asset';

export type TxOperationProps = {
  operation?: Operation;
  status?: Status;
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
