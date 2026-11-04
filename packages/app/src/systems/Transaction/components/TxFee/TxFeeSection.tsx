import { cssObj, Box, Text } from '@fuel-wallet/ui';
import type { ReactNode } from 'react';
import { TxFeeLoader } from './TxFeeLoader';

export type TxFeeSectionProps = {
  children?: ReactNode;
  isLoading?: boolean;
};

export function TxFeeSection({ children, isLoading }: TxFeeSectionProps) {
  return (
    <Box css={styles.feeWrapper}>
      <Text css={styles.title}>Fee (network)</Text>
      <Box css={styles.content}>{isLoading ? <TxFeeLoader /> : children}</Box>
    </Box>
  );
}

const styles = {
  title: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
  }),
  feeWrapper: cssObj({
    width: '100%',
    mt: '$3',
  }),
  content: cssObj({
    width: '100%',
    mt: '$2',
  }),
};
