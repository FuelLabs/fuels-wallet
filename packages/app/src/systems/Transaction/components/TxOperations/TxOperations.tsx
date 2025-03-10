import { Box } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import type {
  CategorizedOperations,
  CategorizedV2Operations,
} from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedV2Operations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { account } = useAccounts();

  console.log('!operations', operations);
  return (
    <Box.Stack gap="$2">
      <TxOperationsDrawer operations={operations.mainOperations} />

      <TxOperationsGroup
        title={`Operations not related to ${account?.name}`}
        operations={operations.notRelatedToCurrentAccount}
        showNesting={false}
        numberLabel={`${operations.notRelatedToCurrentAccount.length}`}
      />
      {operations.intermediateContractCalls && (
        <TxOperationsGroup
          title="Intermediate contract calls"
          operations={operations.intermediateContractCalls}
          showNesting={true}
          numberLabel={`${operations.intermediateContractCalls.length}`}
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
