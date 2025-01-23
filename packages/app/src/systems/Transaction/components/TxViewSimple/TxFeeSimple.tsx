import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader, Text } from '@fuel-ui/react';
import type { SimplifiedFee } from '../../types';
import { TxAssetAmount } from './TxOperationsSimple/operations/TxAssetAmount';

type TxFeeSimpleProps = {
  fee: SimplifiedFee;
  isLoading?: boolean;
};

export function TxFeeSimple({ fee, isLoading }: TxFeeSimpleProps) {
  if (isLoading) return <TxFeeSimple.Loader />;

  return (
    <Box css={styles.content}>
      <Box.Stack gap="$2">
        <Text css={styles.title}>Network Fee</Text>
        <TxAssetAmount amount={fee.network.toString()} showAssetId={false} />
      </Box.Stack>
    </Box>
  );
}

TxFeeSimple.Loader = function TxFeeSimpleLoader() {
  return (
    <Box css={styles.content}>
      <ContentLoader width={300} height={80} viewBox="0 0 300 80">
        <rect x="20" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="20" y="44" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="44" rx="4" ry="4" width="100" height="16" />
      </ContentLoader>
    </Box>
  );
};

const styles = {
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    padding: '$3',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
  }),
};
