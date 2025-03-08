import { Box, Text, useFuelTheme } from '@fuel-ui/react';
import { BN } from 'fuels';
import { useMemo } from 'react';
import type { AssetFlow, SimplifiedOperation } from '../../types';
import { TxOperation } from '../TxOperation';
import { GroupedOperations } from './GroupedOperations';
import { operationsStyles as styles } from './TxOperationsStyles';
type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

// Helper to sum assets by assetId and create proper AssetFlow objects
function sumAssets(operations: SimplifiedOperation[]): AssetFlow[] {
  const incomingAssets: Record<string, BN> = {};
  const outgoingAssets: Record<string, BN> = {};

  let fromAddress = '';
  let toAddress = '';
  if (operations.length > 0) {
    const firstOp = operations[0];
    fromAddress = firstOp.from?.address || '';
    toAddress = firstOp.to?.address || '';
  }

  for (const op of operations) {
    if (!op.assets?.length) continue;

    for (const asset of op.assets) {
      const { assetId, amount } = asset;
      const direction = op.isFromCurrentAccount
        ? outgoingAssets
        : incomingAssets;

      if (!direction[assetId]) {
        direction[assetId] = new BN(0);
      }
      direction[assetId] = direction[assetId].add(amount);
    }
  }

  const assetFlows: AssetFlow[] = [];

  for (const [assetId, amount] of Object.entries(incomingAssets)) {
    assetFlows.push({
      assetId,
      amount,
      from: fromAddress,
      to: toAddress,
      type: 'in',
    });
  }

  for (const [assetId, amount] of Object.entries(outgoingAssets)) {
    assetFlows.push({
      assetId,
      amount,
      from: toAddress,
      to: fromAddress,
      type: 'out',
    });
  }

  return assetFlows;
}

let _isDark = false;

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  const { current: theme } = useFuelTheme();
  _isDark = theme === 'dark';
  const assetSummary = useMemo(() => sumAssets(operations), [operations]);
  // to be able to show a combined view, all root main operations should have the same initiator and recipient
  const operationsInitiator = operations[0]?.from;
  const operationsRecipient = operations[0]?.to;

  const isTwoWayTx = operations.every(
    (operation) =>
      (operation.from?.address === operationsInitiator?.address ||
        operation.to?.address === operationsInitiator?.address) &&
      (operation.to?.address === operationsRecipient?.address ||
        operation.from?.address === operationsRecipient?.address)
  );

  const renderOperations = () => {
    if (operations.length === 0) {
      return (
        <Box css={styles.header}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      );
    }

    if (operations.length > 1 && isTwoWayTx) {
      return (
        <GroupedOperations
          operations={operations}
          assetSummary={assetSummary}
          operationsInitiator={operationsInitiator}
          operationsRecipient={operationsRecipient}
        />
      );
    }
    return (
      <Box.VStack css={styles.container}>
        {operations.map((operation, index) => (
          <Box.Flex css={styles.cardStyle} key={JSON.stringify(operation)}>
            <TxOperation
              key={`${operation.type}-${operation?.from?.address || ''}-${operation?.to?.address || ''}-${index}`}
              operation={operation}
            />
          </Box.Flex>
        ))}
      </Box.VStack>
    );
  };

  return (
    <Box css={styles.drawer} data-expanded={false}>
      {renderOperations()}
    </Box>
  );
}
