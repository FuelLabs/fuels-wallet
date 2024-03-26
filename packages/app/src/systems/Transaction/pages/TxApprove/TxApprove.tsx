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
  const ctx = useTransactionRequest();
  const navigate = useNavigate();
  const { assets } = useAssets();
  const isSuccess = ctx.status('success');

  const goToWallet = () => {
    ctx.handlers.closeDialog();
    navigate(Pages.index());
  };

  const Header = (
    <Alert status="warning" css={styles.alert}>
      <Alert.Description>
        Carefully check if all the details in your transaction are correct
      </Alert.Description>
    </Alert>
  );

  return (
    <>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : ctx.handlers.closeDialog}
      >
        {ctx.title}
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {ctx.shouldShowLoader && <TxContent.Loader header={Header} />}
        {ctx.shouldShowTx && (
          <TxContent.Info
            showDetails
            tx={ctx.txResult}
            isLoading={ctx.status('loading')}
            header={Header}
            assets={assets}
          />
        )}
        {(ctx.status('success') || ctx.status('failed')) && (
          <TxContent.Info
            showDetails
            tx={ctx.txResult}
            txStatus={ctx.approveStatus()}
            assets={assets}
            header={
              <TxHeader
                id={ctx.txResult?.id || ctx.approvedTx?.id}
                type={ctx.txResult?.type}
                status={ctx.approveStatus()}
                providerUrl={ctx.providerUrl}
              />
            }
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
        {ctx.showActions && (
          <>
            <Button
              variant="ghost"
              isDisabled={ctx.isLoading}
              onPress={ctx.handlers.closeDialog}
            >
              Back
            </Button>
            <Button
              intent="primary"
              isLoading={ctx.isLoading}
              onPress={ctx.handlers.approve}
            >
              Approve
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
    paddingLeft: '$4',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  }),
  alert: cssObj({
    '& .fuel_Alert-content': {
      gap: '$1',
    },
    ' & .fuel_Heading': {
      fontSize: '$sm',
    },
  }),
};
