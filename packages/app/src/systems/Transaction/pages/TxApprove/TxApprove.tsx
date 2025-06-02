import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Layout, Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { TxRequestStatus, useTransactionRequest } from '~/systems/DApp';
import { TxContent } from '../../components/TxContent/TxContent';
import { TxReviewAlert } from '../../components/TxReviewAlert/TxReviewAlert';

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

  const handleReject = () => {
    handlers.closeDialog();
    handlers.reset();
    handlers.reject();
    if (ctx.txSummaryExecuted) {
      navigate(Pages.wallet());
    }
  };

  return (
    <Box css={styles.wrapper}>
      <Layout.TopBar hideMenu onBack={handleReject} />
      {shouldShowReviewAlert && <TxReviewAlert signOnly={isSignOnly} />}
      <Dialog.Description as="div" css={styles.description}>
        {isSignOnly && (
          <Box css={{ mb: '$4', fontWeight: '$normal' }}>
            You are signing this transaction without broadcasting it to the
            network.
          </Box>
        )}
        {ctx.shouldShowTxSimulated && ctx.txSummarySimulated && (
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
        )}
        {ctx.shouldShowTxExecuted && ctx.txSummaryExecuted && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummaryExecuted}
            txStatus={ctx.executedStatus()}
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
        )}
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

const styles = {
  wrapper: cssObj({
    flex: 1,
    ...coreStyles.scrollable('$intentsBase3'),
    borderTop: '1px solid $gray6',
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
    borderTop: '1px solid $gray7',
  }),
  footerButton: cssObj({
    mt: '$4',
  }),
};
