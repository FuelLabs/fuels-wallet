import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';

import type { Operation, TxStatus } from '../../utils';
import { TxFromTo } from '../TxFromTo/TxFromTo';

import { AssetsAmount } from '~/systems/Asset';
import type { Maybe } from '~/systems/Core';

export type TxOperationProps = {
  operation?: Operation;
  status?: Maybe<TxStatus>;
  assets?: Maybe<Asset[]>;
};

export function TxOperation({ operation, status, assets }: TxOperationProps) {
  const { from, to, assetsSent } = operation ?? {};
  const amounts = assetsSent?.map((assetSent) => {
    const asset = assets?.find((a) => a.assetId === assetSent.assetId);
    return {
      ...assetSent,
      ...asset,
    };
  });
  return (
    <Card css={styles.root}>
      <TxFromTo from={from} to={to} status={status} />
      {!!amounts?.length && <AssetsAmount amounts={amounts} />}
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
