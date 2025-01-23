import { Box } from '@fuel-ui/react';
import { useMemo } from 'react';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { TxOperationContract } from './operations/TxOperationContract';
import { TxOperationTransfer } from './operations/TxOperationTransfer';

type TxOperationsListProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsList({ operations }: TxOperationsListProps) {
  const renderedOperations = useMemo(() => {
    return operations.map((operation, index) => {
      console.log('Rendering operation:', operation);
      const key = `${operation.type}-${operation.from}-${operation.to}-${index}`;

      if (operation.type === TxCategory.SEND) {
        return <TxOperationTransfer key={key} operation={operation} />;
      }

      return <TxOperationContract key={key} operation={operation} />;
    });
  }, [operations]);

  return <Box.Stack gap="$1">{renderedOperations}</Box.Stack>;
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
