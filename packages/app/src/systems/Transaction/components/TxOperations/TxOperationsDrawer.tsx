import { Box, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../types';
import { TxOperation } from '../TxOperation';
import { GroupedOperations } from './GroupedOperations';
import { operationsStyles as styles } from './TxOperationsStyles';

type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  // Check if this is a user -> contract -> user flow
  // Only group operations when a user sends to a contract and receives back
  const isUserContractUserFlow =
    operations.length > 1 &&
    operations.some((op) => op.isFromCurrentAccount && op.to?.type === 0) &&
    operations.some((op) => op.isToCurrentAccount && op.from?.type === 0);

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

    if (isUserContractUserFlow) {
      return <GroupedOperations operations={operations} />;
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
