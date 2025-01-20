import { Box } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { TxOperationSend } from './TxOperationSend';
import { TxOperationSwap } from './TxOperationSwap';

type TxOperationContentProps = {
  operation: SimplifiedOperation;
};

export function TxOperationContent({ operation }: TxOperationContentProps) {
  // Don't render content for contract calls - this is handled by the card
  if (operation.type === TxCategory.CONTRACTCALL) return null;

  return (
    <Box.Stack gap="$4">
      <TxOperationSend operation={operation} />
      <TxOperationSwap operation={operation} />
    </Box.Stack>
  );
}
