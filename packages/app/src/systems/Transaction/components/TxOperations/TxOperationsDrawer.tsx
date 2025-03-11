import { Box, Text } from '@fuel-ui/react';
import { MotionBox } from '~/systems/Core';
import type { SimplifiedOperation } from '../../types';
import { TxOperation } from '../TxOperation';
import { operationsStyles as styles } from './TxOperationsStyles';

type TxOperationsDrawerProps = {
  operations: SimplifiedOperation[];
  isLoading: boolean;
};

export function TxOperationsDrawer({
  operations,
  isLoading,
}: TxOperationsDrawerProps) {
  const renderOperations = () => {
    if (!operations?.length) {
      return (
        <Box css={styles.header}>
          <Text fontSize="sm" css={styles.title}>
            No root operations related to this account.
          </Text>
        </Box>
      );
    }

    return (
      <Box.VStack>
        {operations.map((operation, index) => (
          <MotionBox
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            key={JSON.stringify(operation)}
          >
            <TxOperation
              key={`${operation.type}-${operation?.from?.address || ''}-${operation?.to?.address || ''}-${index}`}
              operation={operation}
            />
          </MotionBox>
        ))}
      </Box.VStack>
    );
  };

  return (
    <Box css={styles.drawer} data-expanded={false}>
      {!isLoading && renderOperations()}
    </Box>
  );
}
