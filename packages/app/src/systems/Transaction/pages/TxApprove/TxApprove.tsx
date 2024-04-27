import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Button,
  CardList,
  ContentLoader,
  Dialog,
} from '@fuel-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useTransactionRequest } from '~/systems/DApp';
import { OverlayDialogTopbar } from '~/systems/Overlay';
import { type GroupedErrors, TxContent, TxHeader } from '~/systems/Transaction';

const ErrorHeader = ({ errors }: { errors?: GroupedErrors }) => {
  const errorMessages = useMemo(() => {
    const messages = [];
    if (errors) {
      if (errors.InsufficientInputAmount) messages.push('Not enough funds');

      // biome-ignore lint: will not be a large array
      Object.keys(errors).forEach((key: string) => {
        if (key === 'InsufficientInputAmount') return;
        messages.push(errors[key]);
      });
    }

    return messages;
  }, [errors]);

  return (
    <Alert status="error" css={styles.alert}>
      <Alert.Description>
        {errorMessages.map((message) => (
          <Box>{message}</Box>
        ))}
      </Alert.Description>
    </Alert>
  );
};

export const TxApprove = () => {
  const ctx = useTransactionRequest();
  const navigate = useNavigate();
  const { assets, isLoading: isLoadingAssets } = useAssets();
  const isSuccess = ctx.status('success');
  const isLoading =
    ctx.status('loading') || ctx.status('sending') || isLoadingAssets;

  const goToWallet = () => {
    ctx.handlers.closeDialog();
    navigate(Pages.index());
  };

  const AlertHeader = (
    <Alert status="warning" css={styles.alert}>
      <Alert.Description>
        Carefully check if all the details in your transaction are correct
      </Alert.Description>
    </Alert>
  );

  const LoaderHeader = (
    <CardList.Item css={{ padding: '$2 !important' }}>
      <ContentLoader width={300} height={40} viewBox="0 0 300 40">
        <rect x="20" y="10" rx="4" ry="4" width="92" height="20" />
      </ContentLoader>
    </CardList.Item>
  );

  return (
    <>
      <OverlayDialogTopbar
        onClose={isSuccess ? goToWallet : ctx.handlers.closeDialog}
      >
        {ctx.title}
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        {ctx.shouldShowLoader && <TxContent.Loader header={LoaderHeader} />}
        {ctx.shouldShowTxSimulated && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummarySimulated}
            isLoading={isLoading}
            header={
              ctx.errors.hasSimulateTxErrors ? (
                <ErrorHeader errors={ctx.errors.simulateTxErrors} />
              ) : (
                AlertHeader
              )
            }
            assets={assets}
          />
        )}
        {ctx.shouldShowTxExecuted && (
          <TxContent.Info
            showDetails
            tx={ctx.txSummaryExecuted}
            txStatus={ctx.executedStatus()}
            assets={assets}
            header={
              <TxHeader
                id={ctx.txSummaryExecuted?.id}
                type={ctx.txSummaryExecuted?.type}
                status={ctx.executedStatus()}
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
    '& .fuel_Icon': {
      mt: '-2px',
    },
  }),
};
