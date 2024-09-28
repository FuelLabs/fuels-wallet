import { Alert, Box } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { Operation, TransactionStatus } from 'fuels';
import type { Maybe } from '~/systems/Core';

import { useNetworks } from '~/systems/Network';
import { TxOperation } from '../TxOperation/TxOperation';

export type TxOperationsProps = {
  operations?: Operation[];
  status?: Maybe<TransactionStatus>;
  isLoading?: boolean;
};

export function TxOperations({
  operations,
  status,
  isLoading,
}: TxOperationsProps) {
  if (operations?.length === 0) {
    return (
      <Alert status="info">
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
