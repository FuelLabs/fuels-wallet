import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Card,
  Drawer,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import { useState } from 'react';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { TxOperationContent } from './TxOperationContent';
import { TxOperationHeader } from './TxOperationHeader';
import { isContractCallMetadata } from './utils';

export type TxOperationCardProps = {
  operation: SimplifiedOperation;
  index: number;
};

export function TxOperationCard({ operation, index }: TxOperationCardProps) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const metadata = operation.metadata;
  console.log('TxOperationCard:', {
    operation,
    metadata,
    type: operation.type,
    isContractCallMetadata: metadata ? isContractCallMetadata(metadata) : false,
    operationCount:
      metadata && isContractCallMetadata(metadata)
        ? metadata.operationCount
        : 0,
  });

  const isGroup =
    isContractCallMetadata(metadata) &&
    metadata.operationCount &&
    metadata.operationCount > 1;

  console.log('isGroup:', isGroup);
  const key =
    operation.groupId ||
    `${operation.type}-${operation.from}-${operation.to}-${index}`;

  const isContractCall = operation.type === TxCategory.CONTRACTCALL;
  const isClickable = isContractCall && isGroup;

  return (
    <Box>
      <Card css={styles.info} onClick={() => isClickable && setOpenDrawer(key)}>
        {isGroup && (
          <Alert status="info" css={styles.alert} hideIcon>
            <Alert.Description>
              This contract call occurs {metadata.operationCount} times
            </Alert.Description>
          </Alert>
        )}
        <Box.Stack gap="$4">
          <TxOperationHeader operation={operation} />
          {!isGroup && <TxOperationContent operation={operation} />}
        </Box.Stack>
      </Card>

      {isGroup && (
        <Drawer
          isDismissable
          size={300}
          side="right"
          isOpen={openDrawer === key}
          onClose={() => setOpenDrawer(null)}
        >
          <Drawer.Content>
            <Drawer.Body css={styles.drawer}>
              <Box.Flex css={styles.drawerHeader}>
                <Text as="span">Contract Calls</Text>
                <IconButton
                  size="sm"
                  icon={Icon.is('X')}
                  variant="link"
                  aria-label="drawer_closeButton"
                  onPress={() => setOpenDrawer(null)}
                />
              </Box.Flex>
              <Box css={styles.drawerContent}>
                {isContractCallMetadata(metadata) && metadata.functionName && (
                  <Text fontSize="sm">Function: {metadata.functionName}</Text>
                )}
                <Text fontSize="sm">Contract: {operation.to}</Text>
                {isContractCallMetadata(metadata) &&
                  metadata.operationCount && (
                    <Text fontSize="sm">
                      Total Calls: {metadata.operationCount}
                    </Text>
                  )}
              </Box>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      )}
    </Box>
  );
}

const styles = {
  info: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    cursor: ({ isClickable }: { isClickable: boolean }) =>
      isClickable ? 'pointer' : 'default',
    '&:hover': {
      backgroundColor: ({ isClickable }: { isClickable: boolean }) =>
        isClickable ? '$gray2' : 'transparent',
    },
    padding: '$3',
  }),
  alert: cssObj({
    padding: '0',
    textAlign: 'center',
    backgroundColor: '#E6F4FE',
    color: '#0D74CE',
    border: 'none',
    borderRadius: '6px',
  }),
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
