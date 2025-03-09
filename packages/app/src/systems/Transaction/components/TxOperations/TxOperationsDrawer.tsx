import { Box, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../types';
import { TxOperation } from '../TxOperation';
import { GroupedOperations } from './GroupedOperations';
import { operationsStyles as styles } from './TxOperationsStyles';
type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
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

    // here we should have both single or twoWayTx
    if (operations.length > 1 && isTwoWayTx) {
      return (
        <GroupedOperations
          operations={operations}
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
