import { Box } from '@fuel-ui/react';
import { useMemo } from 'react';
import type { CategorizedOperations, SimplifiedOperation } from '../../types';
import type { TxCategory } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const groupedMainOperations = useMemo(() => {
    const groups = new Map<TxCategory, SimplifiedOperation[]>();

    for (const op of operations.mainOperations) {
      const existing = groups.get(op.type) || [];
      groups.set(op.type, [...existing, op]);
    }

    return Array.from(groups.entries()).map(([type, ops]) => ({
      type,
      operations: ops,
    }));
  }, [operations.mainOperations]);

  return (
    <Box.Stack gap="$2">
      {/* Main operations grouped by type */}
      {groupedMainOperations.map((group) => (
        <TxOperationsDrawer
          key={group.type}
          operations={group}
          defaultExpanded={true}
        />
      ))}

      {/* Other root operations */}
      <TxOperationsGroup
        title="Other Contract Calls"
        operations={operations.otherRootOperations}
        showNesting={false}
        numberLabel="1"
      />

      {/* Intermediate operations */}
      <TxOperationsGroup
        title="Intermediate Operations"
        operations={operations.intermediateOperations}
        showNesting={true}
        numberLabel={operations.otherRootOperations.length ? '2' : '1'}
      />
    </Box.Stack>
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
