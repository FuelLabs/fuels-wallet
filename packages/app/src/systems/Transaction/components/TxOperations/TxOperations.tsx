import { Box, Card, ContentLoader } from '@fuel-ui/react';
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
    <Card css={{ height: 270, padding: '$2' }}>
      <ContentLoader width={'100%'} height={'100%'}>
        {/* Account 1 */}
        <circle cx="30" cy="30" r="20" />
        <rect x="60" y="20" rx="3" ry="3" width="120" height="20" />
        <rect x="190" y="20" rx="3" ry="3" width="80" height="20" />

        {/* Calls contract */}
        <circle cx="30" cy="80" r="10" />
        <rect x="60" y="72.5" rx="3" ry="3" width="100" height="15" />

        {/* Fuel Staking contract */}
        <circle cx="30" cy="130" r="20" />
        <rect x="60" y="122.5" rx="3" ry="3" width="120" height="20" />
        <rect x="190" y="122.5" rx="3" ry="3" width="90" height="20" />

        {/* Sends funds */}
        <circle cx="30" cy="180" r="10" />
        <rect x="60" y="172.5" rx="3" ry="3" width="100" height="15" />

        {/* Account 1 (again) */}
        <circle cx="30" cy="230" r="20" />
        <rect x="60" y="225" rx="3" ry="3" width="120" height="20" />
        <rect x="190" y="225" rx="3" ry="3" width="80" height="20" />
      </ContentLoader>
    </Card>
  );
};
