import { Box } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';

import type { Operation, TxStatus } from '../../utils';
import { TxOperation } from '../TxOperation/TxOperation';

import type { Maybe } from '~/systems/Core';

export type TxOperationsProps = {
  operations?: Operation[];
  status?: Maybe<TxStatus>;
  assets?: Maybe<Asset[]>;
  isLoading?: boolean;
};

export function TxOperations({
  operations,
  status,
  assets,
  isLoading,
}: TxOperationsProps) {
  return (
    <Box.Stack gap="$4">
      {operations?.map((operation, index) => (
        <TxOperation
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
