import { cssObj } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import { type Operation, type TransactionStatus, getAssetFuel } from 'fuels';
import { AssetsAmount } from '~/systems/Asset';
import type { Maybe } from '~/systems/Core';

import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import { FunctionCalls } from '../FunctionCalls';
import { TxFromTo } from '../TxFromTo/TxFromTo';

export type TxOperationProps = {
  operation?: Operation;
  status?: Maybe<TransactionStatus>;
  assets?: Maybe<AssetData[]>;
  isLoading?: boolean;
};

export function TxOperation({
  operation,
  status,
  isLoading,
}: TxOperationProps) {
  const { from, to, assetsSent, calls } = operation ?? {};
  const amounts = useAssetsAmount({
    operationsCoin: assetsSent,
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
    borderRadius: '$md',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  }),
};
