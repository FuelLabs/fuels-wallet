import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';

export function TxHeaderSimple() {
  return (
    <Box css={styles.header}>
      {/* Disabled while the new Wallet header is not implemented */}
      {/* <Text as="h2">Review Transaction</Text> */}
      <Box css={styles.warning}>
        <Icon icon="InfoCircle" />
        Double-check your transaction before submitting.
      </Box>
    </Box>
  );
}

const styles = {
  header: cssObj({
    marginBottom: '$2',
    backgroundColor: '$white',
    borderBottom: '1px solid $gray3',
    padding: '12px 18px',
  }),
  warning: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: '12px',
    color: '$gray11',
    fontWeight: '500',
    marginBottom: '$2',
  }),
};
