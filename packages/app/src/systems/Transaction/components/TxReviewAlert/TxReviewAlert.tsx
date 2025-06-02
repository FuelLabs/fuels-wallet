import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';

export type TxReviewAlertProps = {
  signOnly?: boolean;
};

export const TxReviewAlert = ({ signOnly = false }: TxReviewAlertProps) => {
  return (
    <Box
      css={{ borderBottom: '1px solid $gray6' }}
      aria-label="Confirm Transaction"
    >
      <Box.Flex css={styles.reviewTxBadge}>
        <Icon icon="InfoCircle" stroke={2} size={16} />
        {signOnly
          ? 'Double-check transaction details before signing'
          : 'Double-check transaction details before submission'}
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
    pl: '$3',
  }),
};
