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
  const [_openDrawer, setOpenDrawer] = useState<string | null>(null);
  const metadata = operation.metadata;
  const isGroup =
    isContractCallMetadata(metadata) &&
    metadata.operationCount &&
    metadata.operationCount > 1 &&
    operation.groupId?.includes(operation.to);
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
