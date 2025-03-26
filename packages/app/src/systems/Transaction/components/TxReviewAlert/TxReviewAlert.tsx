import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';

export const TxReviewAlert = () => {
  return (
    <Box
      css={{ borderBottom: '1px solid $gray6' }}
      aria-label="Confirm Transaction"
    >
      <Box.Flex css={styles.reviewTxBadge}>
        <Icon icon="InfoCircle" stroke={2} size={16} />
        Please double-check all transaction details before submitting.
      </Box.Flex>
    </Box>
  );
};

const styles = {
  reviewTxBadge: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: 'calc($sm - 1px)',
    color: '$gray12',
    fontWeight: '$medium',
    lineHeight: '$tight',
    backgroundColor: '$intentsInfo4',
    width: '100%',
    minHeight: '40px',
    pl: '$4',
  }),
};
