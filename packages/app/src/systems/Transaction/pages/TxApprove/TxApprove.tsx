import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { TxContent } from '../../components/TxContent/TxContent';

export const TxApprove = () => {
  const ctx = useTransactionRequest();
  const navigate = useNavigate();
  const { isLoading: isLoadingAssets } = useAssets();
  const isSuccess = ctx.status('success');
  const isLoading =
    ctx.status('loading') || ctx.status('sending') || isLoadingAssets;

  const goToWallet = () => {
    ctx.handlers.closeDialog();
    navigate(Pages.index());
  };

  return (
    <Box css={styles.wrapper}>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : ctx.handlers.closeDialog}
      >
        {ctx.title}
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {ctx.shouldShowTxSimulated && ctx.txSummarySimulated && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummarySimulated}
            isLoading={isLoading}
            errors={ctx.errors.simulateTxErrors}
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
            isConfirm
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
          />
        )}
      </Dialog.Description>
      <Dialog.Footer>
        {ctx.shouldShowActions && (
          <>
            <Button
              variant="ghost"
              isDisabled={isLoading}
              onPress={ctx.handlers.closeDialog}
            >
              Back
            </Button>
            <Button
              intent="primary"
              isLoading={isLoading}
              isDisabled={ctx.shouldDisableApproveBtn}
              onPress={ctx.handlers.approve}
            >
              Submit
            </Button>
          </>
        )}
      </Dialog.Footer>
    </Box>
  );
};

const styles = {
  wrapper: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$0',
  }),
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'auto !important',
    padding: '0',
    flex: 1,
    display: 'flex',
    // height: '462px',
    flexDirection: 'column',
    gap: '$0',
  }),
};
