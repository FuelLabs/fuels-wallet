import { cssObj } from '@fuel-ui/css';
import { Box, Drawer, IconButton, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../types';

type TxOperationDrawerProps = {
  operation: SimplifiedOperation;
  isOpen: boolean;
  onClose: () => void;
};

export function TxOperationDrawer({
  operation,
  isOpen,
  onClose,
}: TxOperationDrawerProps) {
  return (
    <Drawer
      isDismissable
      size={300}
      side="right"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Drawer.Content>
        <Drawer.Body css={styles.drawer}>
          <Box.Flex css={styles.drawerHeader}>
            <Text as="span">Contract Calls</Text>
            <IconButton
              size="sm"
              icon="X"
              variant="link"
              aria-label="drawer_closeButton"
              onPress={onClose}
            />
          </Box.Flex>
          <Box css={styles.drawerContent}>
            {operation.metadata?.functionName && (
              <Text fontSize="sm">
                Function: {operation.metadata.functionName}
              </Text>
            )}
            <Text fontSize="sm">{operation.to.address}</Text>
            {operation.metadata?.operationCount && (
              <Text fontSize="sm">
                Total Calls: {operation.metadata.operationCount}
              </Text>
            )}
          </Box>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
}

const styles = {
  drawer: cssObj({
    display: 'grid',
    height: '100%',
    gridTemplateRows: '50px 1fr',
  }),
  drawerHeader: cssObj({
    px: '$4',
    py: '$3',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid $border',
    fontWeight: '$normal',
  }),
  drawerContent: cssObj({
    padding: '$4',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
};
