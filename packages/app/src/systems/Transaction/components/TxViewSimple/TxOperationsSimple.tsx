import { cssObj } from '@fuel-ui/css';
import { Box, Card, ContentLoader } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../types';
import { TxOperationCard } from './TxOperationsSimple/TxOperationCard';

export type TxOperationsSimpleProps = {
  operations?: SimplifiedOperation[];
  isLoading?: boolean;
};

export function TxOperationsSimple({
  operations,
  isLoading,
}: TxOperationsSimpleProps) {
  if (isLoading) return <TxOperationsSimple.Loader />;

  return (
    <Box css={styles.content}>
      {operations?.map((operation, index) => (
        <TxOperationCard
          key={
            operation.groupId ||
            `${operation.type}-${operation.from}-${operation.to}-${index}`
          }
          operation={operation}
          index={index}
        />
      ))}
    </Box>
  );
}

TxOperationsSimple.Loader = function TxOperationsSimpleLoader() {
  return (
    <Card css={styles.operation}>
      <ContentLoader width={300} height={80} viewBox="0 0 300 80">
        <rect x="20" y="20" rx="4" ry="4" width="200" height="16" />
        <rect x="20" y="44" rx="4" ry="4" width="160" height="16" />
      </ContentLoader>
    </Card>
  );
};

const styles = {
  operation: cssObj({
    padding: '$1',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
};
