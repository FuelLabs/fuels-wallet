import { cssObj } from '@fuel-ui/css';
import { Box, Card, ContentLoader, Icon, Text } from '@fuel-ui/react';
import type { TransactionStatus } from 'fuels';

type TxHeaderSimpleProps = {
  status?: TransactionStatus;
  origin?: {
    name: string;
    favicon?: string;
    url?: string;
  };
  isLoading?: boolean;
};

export function TxHeaderSimple({ isLoading }: TxHeaderSimpleProps) {
  if (isLoading) return <TxHeaderSimple.Loader />;

  return (
    <Box css={styles.header}>
      {/* Disabled while the new Wallet header is not implemented */}
      {/* <Text as="h2">Review Transaction</Text> */}
      <Box css={styles.warning}>
        <Icon icon="InfoCircle" />
        Double-check the details of your transaction before submitting.
      </Box>
    </Box>
  );
}

TxHeaderSimple.Loader = function TxHeaderSimpleLoader() {
  return (
    <Card css={styles.root}>
      <ContentLoader width={300} height={40} viewBox="0 0 300 40">
        <rect x="20" y="10" rx="4" ry="4" width="92" height="20" />
      </ContentLoader>
    </Card>
  );
};

const styles = {
  header: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    marginBottom: '$1',
    backgroundColor: '$white',
    borderBottom: '1px solid $border',
    padding: '12px 18px',
  }),
  warning: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    fontSize: '12px',
    color: '#646464',
    fontWeight: '500',
    marginBottom: '$2',
  }),
  root: cssObj({
    padding: '$3',
  }),
  content: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  origin: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
  }),
  favicon: cssObj({
    width: '20px',
    height: '20px',
    borderRadius: '$md',
  }),
  icon: cssObj({
    width: '20px',
    height: '20px',
    color: '#8d8d8d',
  }),
  status: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
  }),
};
