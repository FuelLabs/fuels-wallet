import { cssObj } from '@fuel-ui/css';
import { Alert, Button, Dialog } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { TxContent, TxHeader } from '~/systems/Transaction';

export const TxApprove = () => {
  const txRequest = useTransactionRequest();
  const navigate = useNavigate();
  const { assets } = useAssets();

  const isFailed = txRequest.status('failed');
  const isSuccess = txRequest.status('success');
  const isDone = isFailed || isSuccess;

  const goToWallet = () => {
    txRequest.handlers.closeDialog();
    navigate(Pages.index());
  };

  return (
    <>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : txRequest.handlers.closeDialog}
      >
        {txRequest.title}
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {txRequest.status('waitingApproval') && (
          <Alert status="warning">
            <Alert.Description>
              Confirm before approve if all details in your transaction are
              correct
            </Alert.Description>
          </Alert>
        )}
        {txRequest.isLoading ? (
          <TxContent.Loader />
        ) : (
          <TxContent.Info
            showDetails
            tx={txRequest.tx}
            txStatus={txRequest.approveStatus()}
            assets={assets}
            header={
              <>
                {isDone && (
                  <TxHeader
                    id={txRequest.tx?.id}
                    type={txRequest.tx?.type}
                    status={txRequest.tx?.status || txRequest.approveStatus()}
                    providerUrl={txRequest.providerUrl}
                  />
                )}
              </>
            }
          />
        )}
      </Dialog.Description>
      <Dialog.Footer>
        {txRequest.showActions && (
          <>
            <Button
              variant="ghost"
              isDisabled={txRequest.isLoading}
              onPress={txRequest.handlers.closeDialog}
            >
              Back
            </Button>
            <Button
              intent="primary"
              isLoading={txRequest.isLoading}
              onPress={txRequest.handlers.approve}
            >
              Approve
            </Button>
          </>
        )}
        {isSuccess && (
          <Button size="sm" intent="primary" onPress={goToWallet}>
            Back to wallet
          </Button>
        )}
        {isFailed && (
          <Button
            size="sm"
            variant="ghost"
            intent="error"
            onPress={txRequest.handlers.tryAgain}
          >
            Try again
          </Button>
        )}
      </Dialog.Footer>
    </>
  );
};

const styles = {
  description: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  }),
};
