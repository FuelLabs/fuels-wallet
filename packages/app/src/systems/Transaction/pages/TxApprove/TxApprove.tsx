import { cssObj } from '@fuel-ui/css';
import { Button, Dialog } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { TxDetails } from '../../components/TxDetails/TxDetails';

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
    <>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : ctx.handlers.closeDialog}
      >
        {ctx.title}
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {ctx.shouldShowTxSimulated && (
          <TxDetails
            tx={ctx.txSummarySimulated}
            showDetails
            isLoading={!ctx.txSummarySimulated}
            variant="default"
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
        {ctx.shouldShowTxExecuted && (
          <TxDetails
            tx={ctx.txSummaryExecuted}
            showDetails
            isLoading={false}
            variant="default"
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
    </>
  );
};

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    overflowY: 'scroll !important',
    paddingLeft: '0',
    paddingRight: '0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  }),
};
