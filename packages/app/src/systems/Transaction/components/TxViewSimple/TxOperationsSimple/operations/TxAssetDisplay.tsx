import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { TxAssetAmount } from './TxAssetAmount';

type TxAssetDisplayProps = {
  amount: string;
  assetId?: string;
  label?: string;
  operationCount?: number;
  showLabel?: boolean;
};

export function TxAssetDisplay({
  amount,
  assetId,
  label,
  operationCount,
  showLabel,
}: TxAssetDisplayProps) {
  return (
    <Box.Stack gap="$0" css={styles.root}>
      <TxAssetAmount
        amount={amount}
        assetId={assetId}
        label={label}
        showLabel={showLabel}
      />
      {operationCount && operationCount > 1 && (
        <Box css={styles.count}>x{operationCount}</Box>
      )}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
  }),
  count: cssObj({
    color: '$gray8',
    fontSize: '$xs',
    marginLeft: '$1',
  }),
};
