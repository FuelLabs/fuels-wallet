import { Box, Card, ContentLoader } from '@fuel-wallet/ui';
import { useAccounts } from '~/systems/Account';
import type { CategorizedOperations } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
  txAccount?: string;
  isPastTense?: boolean;
};

export function TxOperations({
  operations,
  txAccount,
  isPastTense = false,
}: TxOperationsListProps) {
  const { findAccount } = useAccounts();

  return (
    <Box.Stack gap="$2">
      <TxOperationsDrawer
        operations={operations.mainOperations}
        isPastTense={isPastTense}
      />

      <TxOperationsGroup
        title={`Operations not related to ${findAccount(txAccount)?.name}`}
        operations={operations.notRelatedToCurrentAccount}
        isPastTense={isPastTense}
      />
      {operations.intermediateContractCalls && (
        <TxOperationsGroup
          title="Intermediate contract calls"
          operations={operations.intermediateContractCalls}
        />
      )}
    </Box.Stack>
  );
}

TxOperations.Loader = function TxOperationsLoader() {
  return (
    <Card
      css={{
        height: 152,
        padding: '$4',
        border: '1px solid var(--fuel-line)',
      }}
    >
      {/* Mirrors the operation card: sender, the action between, recipient. */}
      <ContentLoader width={'100%'} height={'100%'}>
        <circle cx="18" cy="18" r="18" />
        <rect x="48" y="12" width="72" height="12" />
        <rect x="128" y="12" width="88" height="12" />

        <rect x="17" y="40" width="1" height="40" />
        <rect x="48" y="54" width="96" height="10" />

        <circle cx="18" cy="102" r="18" />
        <rect x="48" y="96" width="72" height="12" />
        <rect x="128" y="96" width="88" height="12" />
      </ContentLoader>
    </Card>
  );
};
