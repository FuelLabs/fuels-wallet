import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import type { Operation, TransactionStatus } from 'fuels';

import { FunctionCalls } from '../FunctionCalls';
import { TxFromTo } from '../TxFromTo/TxFromTo';

import { AssetsAmount } from '~/systems/Asset';
import type { Maybe } from '~/systems/Core';

export type TxOperationProps = {
  operation?: Operation;
  status?: Maybe<TransactionStatus>;
  assets?: Maybe<Asset[]>;
  isLoading?: boolean;
};

export function TxOperation({
  operation,
  status,
  assets,
  isLoading,
}: TxOperationProps) {
  const { from, to, assetsSent, calls } = operation ?? {};
  const amounts = assetsSent?.map((assetSent) => {
    const asset = assets?.find((a) => a.assetId === assetSent.assetId);
    return {
      ...assetSent,
      ...asset,
    };
  });
  return (
    <Card css={styles.root} className="TxOperation">
      <TxFromTo
        from={from}
        to={to}
        status={status}
        isLoading={isLoading}
        operationName={operation?.name}
      />
      {!!amounts?.length && <AssetsAmount amounts={amounts} />}
      {!!calls?.length && <FunctionCalls calls={calls} />}
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
    border: 'none',
    position: 'relative',
    display: 'flex',
    gap: '$2',
    flexDirection: 'column',
  }),
};
