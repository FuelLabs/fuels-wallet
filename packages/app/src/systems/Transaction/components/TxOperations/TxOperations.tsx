import { Alert, Box } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { Operation, TransactionStatus } from 'fuels';
import type { Maybe } from '~/systems/Core';

import { TxOperation } from '../TxOperation/TxOperation';

export type TxOperationsProps = {
  operations?: Operation[];
  status?: Maybe<TransactionStatus>;
  assets?: Maybe<AssetData[]>;
  isLoading?: boolean;
};

export function TxOperations({
  operations,
  status,
  assets,
  isLoading,
}: TxOperationsProps) {
  if (operations?.length === 0) {
    return (
      <Alert status="error">
        <Alert.Description>
          No operations found in this transaction
        </Alert.Description>
      </Alert>
    );
  }

  return (
    <Box.Stack gap="$4">
      {operations?.map((operation, index) => (
        <TxOperation
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          operation={operation}
          status={status}
          assets={assets}
          isLoading={isLoading}
        />
      ))}
    </Box.Stack>
  );
}

TxOperations.Loader = () => (
  <Box.Stack gap="$4">
    <TxOperation.Loader />
  </Box.Stack>
);
