import { cssObj, Box, Icon } from '@fuel-wallet/ui';

export type TxReviewAlertProps = {
  signOnly?: boolean;
};

export const TxReviewAlert = ({ signOnly = false }: TxReviewAlertProps) => {
  return (
    <Box
      css={{ borderBottom: '1px solid var(--fuel-line)' }}
      className="fuel-appear"
      aria-label="Confirm Transaction"
    >
      <Box.Flex css={styles.reviewTxBadge}>
        <Icon icon="InfoCircle" size={14} />
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
    gap: '$2',
    fontFamily: '$mono',
    fontSize: '11px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
    lineHeight: '16px',
    backgroundColor: '$muted',
    width: '100%',
    minHeight: '36px',
    px: '$4',
  }),
};
