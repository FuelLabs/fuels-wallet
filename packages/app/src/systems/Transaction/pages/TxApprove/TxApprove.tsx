import { cssObj, Box, Button, Dialog } from '@fuel-wallet/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { TransactionStatus } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { TxRequestStatus, useTransactionRequest } from '~/systems/DApp';
import { TxContent } from '../../components/TxContent/TxContent';
import { TxReviewAlert } from '../../components/TxReviewAlert/TxReviewAlert';
import { TxSuccessWave } from '../../components/TxSuccessWave';

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
};

export const TxApprove = () => {
  const ctx = useTransactionRequest();
  const { isLoading: isLoadingAssets } = useAssets();
  const navigate = useNavigate();
  const isLoading =
    ctx.status('loading') || ctx.status('sending') || isLoadingAssets;
  const shouldShowReviewAlert =
    !ctx.status(TxRequestStatus.success) && !ctx.status(TxRequestStatus.failed);
  const { handlers } = useTransactionRequest();
  const isSignOnly = !!ctx.input.signOnly;
  const isSending = ctx.isSendingTx;
  const isSuccess = ctx.status(TxRequestStatus.success);

  /* Celebrate only the send that happened here, not a reopened result. */
  const wasSending = useRef(false);
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => {
    if (isSending) {
      wasSending.current = true;
      return;
    }
    if (!wasSending.current) return;
    wasSending.current = false;
    if (isSuccess) setCelebrate(true);
  }, [isSending, isSuccess]);

  const handleReject = () => {
    handlers.closeDialog();
    handlers.reset();
    handlers.reject();
    if (ctx.txSummaryExecuted) {
      navigate(Pages.wallet());
    }
  };

  return (
    <Box css={styles.wrapper} data-tx-phase={isSending ? 'sending' : undefined}>
      {celebrate && ctx.executedStatus() === TransactionStatus.success && (
        <TxSuccessWave />
      )}
      <Layout.TopBar hideMenu onBack={handleReject} />
      {shouldShowReviewAlert && <TxReviewAlert signOnly={isSignOnly} />}
      <Dialog.Description as="div" css={styles.description}>
        {isSignOnly && (
          <Box css={{ mb: '$4', fontWeight: '$normal' }}>
            You are signing this transaction without broadcasting it to the
            network.
          </Box>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {ctx.shouldShowTxSimulated && ctx.txSummarySimulated && (
            <motion.div key="simulated" {...swap} style={STACK}>
              <TxContent.Info
                showDetails
                tx={ctx.txSummarySimulated}
                errors={ctx.errors.simulateTxErrors}
                isSimulating={ctx.isSimulating}
                signOnly={isSignOnly}
                footer={
                  ctx.status('failed') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      intent="error"
                      onPress={ctx.handlers.tryAgain}
                    >
                      Try again
                    </Button>
                  )
                }
              />
            </motion.div>
          )}
          {ctx.shouldShowTxExecuted && ctx.txSummaryExecuted && (
            <motion.div key="executed" {...swap} style={STACK}>
              <TxContent.Info
                showDetails
                tx={ctx.txSummaryExecuted}
                txStatus={ctx.executedStatus()}
                celebrate={celebrate}
                footer={
                  ctx.status('failed') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      intent="error"
                      onPress={ctx.handlers.tryAgain}
                    >
                      Try again
                    </Button>
                  )
                }
                isPastTense={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog.Description>
      {ctx.shouldShowActions && (
        <Dialog.Footer css={styles.footer}>
          <Button
            variant="ghost"
            isDisabled={isLoading}
            onPress={handleReject}
            css={styles.footerButton}
          >
            Back
          </Button>
          <Button
            intent="primary"
            isLoading={isLoading}
            isDisabled={ctx.shouldDisableApproveBtn}
            onPress={ctx.handlers.approve}
            css={styles.footerButton}
          >
            {isSignOnly ? 'Sign' : 'Submit'}
          </Button>
        </Dialog.Footer>
      )}
    </Box>
  );
};

const STACK = { display: 'flex', flexDirection: 'column', gap: 8 } as const;

const styles = {
  wrapper: cssObj({
    position: 'relative',
    flex: 1,
    ...coreStyles.scrollable('$intentsBase3'),
    borderTop: '1px solid var(--fuel-line)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$intentsBase3',

    'html[class="fuel_dark-theme"] &': {
      backgroundColor: '$bodyBg',
    },
  }),
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'auto !important',
    padding: '0 $2 0 $3',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    mt: '$2',
  }),
  footer: cssObj({
    p: '$4 $5',
    borderTop: '1px solid var(--fuel-line)',
  }),
  footerButton: cssObj({
    mt: '$4',
  }),
};
