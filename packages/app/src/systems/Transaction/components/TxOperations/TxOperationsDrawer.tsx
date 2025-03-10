import { Box, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../types';
import { TxOperation } from '../TxOperation';
// import { GroupedOperations } from './GroupedOperations';
import { operationsStyles as styles } from './TxOperationsStyles';

type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
};

export function TxOperationsDrawer({ operations }: TxOperationsDrawerProps) {
  // Check if this is a user -> contract -> user flow
  // Only group operations when a user sends to a contract and receives back

  const renderOperations = () => {
    if (!operations?.length) {
      // TODO add a loading state
      return (
        <Box css={styles.header}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      );
    }

    // return <GroupedOperations operations={operations[0]} />;

    return (
      <Box.VStack>
        {operations.map((operation, index) => (
          <Box.Flex key={JSON.stringify(operation)}>
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
