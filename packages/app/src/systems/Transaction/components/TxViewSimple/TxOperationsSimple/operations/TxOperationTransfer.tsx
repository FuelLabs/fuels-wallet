import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../../types';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';

type TxOperationTransferProps = {
  operation: SimplifiedOperation;
};

export function TxOperationTransfer({ operation }: TxOperationTransferProps) {
  const amount = (
    operation.metadata?.totalAmount ||
    operation.amount ||
    '0'
  ).toString();
  const operationCount = operation.metadata?.operationCount;

  return (
    <Box.Flex css={styles.root}>
      <Box.Stack gap="$1" css={styles.contentCol}>
        <TxAddressDisplay address={operation.from} />
        <TxAssetDisplay
          amount={amount}
          assetId={operation.assetId}
          operationCount={operationCount}
        />
        <TxAddressDisplay address={operation.to} />
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    padding: '$2',
    backgroundColor: '$cardBg',
    borderRadius: '$md',
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
  }),
};
