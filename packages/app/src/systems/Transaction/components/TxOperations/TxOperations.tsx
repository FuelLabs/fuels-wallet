import { Box, ContentLoader } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import type { CategorizedOperations } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { account } = useAccounts();

  return (
    <Box.Stack gap="$2">
      <TxOperationsDrawer operations={operations.mainOperations} />

      <TxOperationsGroup
        title={`Operations not related to ${account?.name}`}
        operations={operations.notRelatedToCurrentAccount}
        showNesting={false}
      />
      {operations.intermediateContractCalls && (
        <TxOperationsGroup
          title="Intermediate contract calls"
          operations={operations.intermediateContractCalls}
          showNesting={true}
        />
      )}
    </Box.Stack>
  );
}

TxOperations.Loader = function TxOperationsLoader() {
  return (
    <ContentLoader width={350} height={286}>
      <rect x="0" y="10" rx="3" ry="3" width="322" height="137" />
      <rect x="0" y="160" rx="3" ry="3" width="322" height="66" />
    </ContentLoader>
  );
};
