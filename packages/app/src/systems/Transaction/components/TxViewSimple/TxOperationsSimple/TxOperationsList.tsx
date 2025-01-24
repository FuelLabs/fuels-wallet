import { Box } from '@fuel-ui/react';
import { useMemo } from 'react';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { TxOperationsGroup } from './TxOperationsGroup';
import { TxOperation } from './operations/TxOperation';

type TxOperationsListProps = {
  operations: SimplifiedOperation[];
  currentAccount?: string;
};

export function TxOperationsList({
  operations,
  currentAccount,
}: TxOperationsListProps) {
  const { mainOperations, otherRootOperations, intermediateOperations } =
    useMemo(() => {
      const main: SimplifiedOperation[] = [];
      const otherRoot: SimplifiedOperation[] = [];
      const intermediate: SimplifiedOperation[] = [];

      for (const op of operations) {
        const depth = op.metadata?.depth || 0;
        const isTransfer = op.type === TxCategory.SEND;
        const isFromCurrentAccount =
          currentAccount && op.from === currentAccount;
        const isToCurrentAccount = currentAccount && op.to === currentAccount;

        // All transfers go to main list
        if (isTransfer) {
          main.push(op);
          continue;
        }

        // Contract calls at root level (depth 0)
        if (depth === 0) {
          // If related to current account, show in main list
          if (isFromCurrentAccount || isToCurrentAccount) {
            main.push(op);
          } else {
            otherRoot.push(op);
          }
          continue;
        }

        // All other operations (intermediate contract calls)
        intermediate.push(op);
      }

      return {
        mainOperations: main,
        otherRootOperations: otherRoot,
        intermediateOperations: intermediate,
      };
    }, [operations, currentAccount]);

  return (
    <Box>
      {/* Main operations (transfers and root contract calls related to current account) */}
      {mainOperations.map((operation, index) => (
        <TxOperation
          key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
          operation={operation}
          showNesting={false}
        />
      ))}

      {/* Other root operations not related to current account */}
      <TxOperationsGroup
        title="Other Contract Calls"
        operations={otherRootOperations}
        showNesting={false}
      />

      {/* Intermediate operations with nesting */}
      <TxOperationsGroup
        title="Intermediate Operations"
        operations={intermediateOperations}
        showNesting={true}
      />
    </Box>
  );
}

TxOperationsList.Loader = function TxOperationsListLoader() {
  return (
    <Box.Stack gap="$1">
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
