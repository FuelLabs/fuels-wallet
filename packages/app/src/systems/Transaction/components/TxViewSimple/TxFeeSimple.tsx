import { cssObj } from '@fuel-ui/css';
import { Box, Card, ContentLoader, Text } from '@fuel-ui/react';
import { AssetsAmount } from '~/systems/Asset';
import type { SimplifiedFee } from '../../types';

type TxFeeSimpleProps = {
  fee: SimplifiedFee;
  isLoading?: boolean;
};

export function TxFeeSimple({ fee, isLoading }: TxFeeSimpleProps) {
  if (isLoading) return <TxFeeSimple.Loader />;

  const { total, network, tip } = fee;

  return (
    <Card css={styles.root}>
      <Box css={styles.content}>
        <Box css={styles.row}>
          <Text>Network Fee</Text>
          <AssetsAmount
            amounts={[{ amount: network }]}
            showSymbol
            showIcon={false}
          />
        </Box>
        {tip && !tip.isZero() && (
          <Box css={styles.row}>
            <Text>Priority Fee</Text>
            <AssetsAmount
              amounts={[{ amount: tip }]}
              showSymbol
              showIcon={false}
            />
          </Box>
        )}
        <Box css={styles.total}>
          <Text>Total Fee</Text>
          <AssetsAmount
            amounts={[{ amount: total }]}
            showSymbol
            showIcon={false}
          />
        </Box>
      </Box>
    </Card>
  );
}

TxFeeSimple.Loader = function TxFeeSimpleLoader() {
  return (
    <Card css={styles.root}>
      <ContentLoader width={300} height={80} viewBox="0 0 300 80">
        <rect x="20" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="20" rx="4" ry="4" width="100" height="16" />
        <rect x="20" y="44" rx="4" ry="4" width="100" height="16" />
        <rect x="180" y="44" rx="4" ry="4" width="100" height="16" />
      </ContentLoader>
    </Card>
  );
};

const styles = {
  root: cssObj({
    padding: '$3',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
  row: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  total: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid $gray4',
    paddingTop: '$3',
    marginTop: '$2',
  }),
};
