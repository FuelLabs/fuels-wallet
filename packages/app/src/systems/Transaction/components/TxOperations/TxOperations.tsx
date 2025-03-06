import { Box, Switch, Text, Tooltip } from '@fuel-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import type { CategorizedOperations } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { account } = useAccounts();
  const [showAllDepths, setShowAllDepths] = useState(false);

  const mainOperationsToShow = useMemo(() => {
    return operations.mainOperations.filter(
      (operation) => showAllDepths || operation.metadata.depth === 0
    );
  }, [operations.mainOperations, showAllDepths]);

  const otherOperationsToShow = useMemo(() => {
    return operations.otherRootOperations.filter(
      (operation) => showAllDepths || operation.metadata.depth === 0
    );
  }, [operations.otherRootOperations, showAllDepths]);

  // New memoized variable for intermediate operations (depth !== 0)
  const intermediateOperations = useMemo(() => {
    return [
      ...operations.mainOperations.filter(
        (operation) => operation.metadata.depth !== 0
      ),
      ...operations.otherRootOperations.filter(
        (operation) => operation.metadata.depth !== 0
      ),
    ];
  }, [operations.mainOperations, operations.otherRootOperations]);

  useEffect(() => {
    // This was a button toggle, now it is automatic when there are no main operations (rare case)
    if (mainOperationsToShow.length === 0) {
      setShowAllDepths(true);
    }
  }, [mainOperationsToShow]);

  return (
    <Box.Stack gap="$2">
      <TxOperationsDrawer operations={mainOperationsToShow} />

      <TxOperationsGroup
        title={`Operations not related to ${account?.name}`}
        operations={otherOperationsToShow}
        showNesting={false}
        numberLabel={`${operations.otherRootOperations.length}`}
      />

      {intermediateOperations.length > 0 && (
        <TxOperationsGroup
          title="Intermediate contract calls"
          operations={intermediateOperations}
          showNesting={true}
          numberLabel={`${intermediateOperations.length}`}
        />
      )}
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
