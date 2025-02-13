import { Box } from '@fuel-ui/react';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import type { CategorizedOperations, SimplifiedOperation } from '../../types';
import type { TxCategory } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { account } = useAccounts();

  const _groupedMainOperations = useMemo(() => {
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
      <TxOperationsDrawer operations={operations.mainOperations} />

      {/* Other root operations */}
      <TxOperationsGroup
        title={`Operations not related to ${account?.name}`}
        operations={operations.otherRootOperations}
        showNesting={false}
        numberLabel="1"
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
