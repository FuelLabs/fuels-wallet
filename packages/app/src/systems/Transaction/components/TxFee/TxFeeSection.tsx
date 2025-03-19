import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { TxFeeLoader } from './TxFeeLoader';

export type TxFeeSectionProps = {
  children?: ReactNode;
  isLoading?: boolean;
};

export function TxFeeSection({ children, isLoading }: TxFeeSectionProps) {
  return (
    <Box css={styles.feeWrapper}>
      <Box.HStack gap="$2" align="center">
        <Box css={styles.feeIconWrapper}>
          <Icon icon="CurrencyCent" css={styles.feeIcon} size={16} />
        </Box>
        <Text css={styles.title}>Fee (network)</Text>
      </Box.HStack>
      <Box css={styles.content}>{isLoading ? <TxFeeLoader /> : children}</Box>
    </Box>
  );
}

const styles = {
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '$gray12',
  }),
  feeWrapper: cssObj({
    borderRadius: '10px',
    width: '100%',
  }),
  content: cssObj({
    width: '100%',
    mt: '$2',
  }),
  feeIconWrapper: cssObj({
    borderRadius: '$full',
    border: '1px solid $intentsBase11',
    ml: '$4',
    mr: '10px',
    my: '$2',
  }),
  feeIcon: cssObj({
    color: '$intentsBase11',
    m: '2px',
    '& svg': {
      strokeWidth: '2px',
    },
  }),
};
