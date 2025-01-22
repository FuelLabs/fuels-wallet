import { Box } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { TxOperationContractAsset } from './operations/TxOperationContractAsset';
import { TxOperationExternalCalls } from './operations/TxOperationExternalCalls';
import { TxOperationGroupedCalls } from './operations/TxOperationGroupedCalls';
import { TxOperationTransfer } from './operations/TxOperationTransfer';

type TxOperationsListProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsList({ operations }: TxOperationsListProps) {
  console.log('TxOperationsList operations:', operations); // Debug log
  return (
    <Box.Stack gap="$2">
      {operations.map((operation) => {
        // If it's a transfer operation
        if (operation.type === TxCategory.SEND) {
          return (
            <TxOperationTransfer
              key={operation.groupId}
              operation={operation}
            />
          );
        }

        // If it's a contract call with asset transfer
        if (operation.type === TxCategory.CONTRACTCALL && operation.amount) {
          return (
            <TxOperationContractAsset
              key={operation.groupId}
              operation={operation}
            />
          );
        }

        // If it's a grouped contract call
        if (
          operation.type === TxCategory.CONTRACTCALL &&
          operation.metadata?.operationCount &&
          operation.metadata.operationCount > 1
        ) {
          return (
            <TxOperationGroupedCalls
              key={operation.groupId}
              operation={operation}
            />
          );
        }

        // If it's an external contract call
        if (operation.type === TxCategory.CONTRACTCALL) {
          return (
            <TxOperationExternalCalls
              key={operation.groupId}
              operation={operation}
            />
          );
        }

        return null;
      })}
    </Box.Stack>
  );
}

// Add loader component
TxOperationsList.Loader = function TxOperationsListLoader() {
  return (
    <Box.Stack gap="$2">
      {[1, 2].map((i) => (
        <Box
          key={i}
          css={{
            height: '80px',
            backgroundColor: '$gray2',
            borderRadius: '$md',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
    </Box.Stack>
  );
};
