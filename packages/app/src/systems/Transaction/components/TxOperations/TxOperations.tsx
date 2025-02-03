import { Box } from '@fuel-ui/react';
import type { CategorizedOperations } from '../../types';
import { TxOperationsGroup } from '../TxDetails/TxOperationsSimple/TxOperationsGroup';
import { TxOperation } from '../TxDetails/TxOperationsSimple/operations/TxOperation';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { mainOperations, otherRootOperations, intermediateOperations } =
    operations;

  return (
    <>
      {/* Main operations (transfers and root contract calls related to current account) */}
      {mainOperations.map((operation, index) => (
        <Box.Flex
          key={`${operation.type}-${operation.from}-${operation.to}-${index}`}
          css={{
            borderRadius: '12px',
            flex: 1,
            boxSizing: 'border-box',
            marginBottom: '16px',
          }}
        >
          <TxOperation operation={operation} showNesting={false} />
        </Box.Flex>
      ))}

      {/* Other root operations not related to current account */}
      <TxOperationsGroup
        title="Other Contract Calls"
        operations={otherRootOperations}
        showNesting={false}
        numberLabel="1"
      />

      {/* Intermediate operations with nesting */}
      {/* Intermediate opreations exist in the current setup? Wont they all be under the nesting of a root level operation? */}
      <TxOperationsGroup
        title="Intermediate Operations"
        operations={intermediateOperations}
        showNesting={true}
        numberLabel={otherRootOperations.length ? '2' : '1'}
      />
    </>
  );
}

TxOperations.Loader = function TxOperationsLoader() {
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
