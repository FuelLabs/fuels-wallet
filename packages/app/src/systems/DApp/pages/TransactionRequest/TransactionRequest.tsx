import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { Layout, coreStyles } from '~/systems/Core';
import { TxContent, getGasLimitFromTxRequest } from '~/systems/Transaction';
import { formatTip } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions.utils';
import { TxReviewAlert } from '~/systems/Transaction/components/TxReviewAlert/TxReviewAlert';
import { useInsufficientFeeError } from '~/systems/Transaction/hooks/useInsufficientFeeError';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';
import { TxRequestStatus } from '../../machines/transactionRequestMachine';
import { AutoSubmit } from './TransactionRequest.AutoSubmit';
import {
  FormProvider,
  type TransactionRequestFormData,
} from './TransactionRequest.FormProvider';

export function TransactionRequest() {
  const txRequest = useTransactionRequest({ isOriginRequired: true });
  const {
    handlers,
    status,
    txSummarySimulated,
    txSummaryExecuted,
    fees,
    isLoading,
    title,
    shouldShowTxSimulated,
    shouldShowTxExecuted,
    shouldShowActions,
    shouldDisableApproveBtn,
    errors,
    executedStatus,
    proposedTxRequest,
    isLoadingFees,
    isSimulating,
    input,
  } = txRequest;
  const isSignOnly = !!input.signOnly;

  const { insufficientFeeError, isInsufficientFeeError, suggestedMinFee } =
    useInsufficientFeeError(errors);

  // Determine which errors to display - show insufficient fee error, simulation errors, or send errors
  const displayErrors = useMemo(() => {
    if (insufficientFeeError) return insufficientFeeError;
    if (errors.simulateTxErrors) return errors.simulateTxErrors;
    if (errors.txApproveError) {
      const err = errors.txApproveError;
      if (typeof err === 'string') return err;
      const msgs = err?.response?.errors
        ?.map((e: { message: string }) => e.message)
        .join('; ');
      return msgs || JSON.stringify(err);
    }
    return undefined;
  }, [insufficientFeeError, errors.simulateTxErrors, errors.txApproveError]);

  const defaultValues = useMemo<TransactionRequestFormData | undefined>(() => {
    if (!txSummarySimulated || !proposedTxRequest) return undefined;

    const tip = bn(proposedTxRequest.tip);
    const gasLimit = getGasLimitFromTxRequest(proposedTxRequest);

    return {
      fees: {
        tip: {
          amount: tip,
          text: formatTip(tip),
        },
        gasLimit: {
          amount: gasLimit,
          text: gasLimit.toString(),
        },
      },
    };
  }, [txSummarySimulated, proposedTxRequest]);

  const shouldShowReviewAlert =
    !status(TxRequestStatus.success) && !status(TxRequestStatus.failed);

  // Show fee options in failed state if it's a recoverable insufficient fee error
  const shouldShowFeeOptionsInFailed =
    status(TxRequestStatus.failed) &&
    isInsufficientFeeError &&
    txSummarySimulated &&
    proposedTxRequest;

  return (
    <FormProvider
      onSubmit={handlers.approve}
      defaultValues={defaultValues}
      testId={txRequest.txStatus}
      context={{
        baseFee: fees.baseFee,
        maxGasLimit: fees.maxGasLimit,
      }}
    >
      <AutoSubmit />

      <Layout title={title} isLoading={isLoading}>
        <Layout.TopBar hideMenu hideBackArrow />
        {shouldShowReviewAlert && <TxReviewAlert signOnly={isSignOnly} />}
        <Layout.Content css={styles.content} noScroll>
          {(shouldShowTxSimulated || shouldShowFeeOptionsInFailed) && (
            <TxContent.Info
              showDetails
              tx={txSummarySimulated}
              txRequest={proposedTxRequest}
              errors={displayErrors}
              fees={fees}
              isLoadingFees={isLoadingFees}
              isLoading={isLoading}
              txAccount={input?.address}
              isSimulating={isSimulating}
              signOnly={isSignOnly}
              suggestedMinFee={suggestedMinFee}
              autoAdvanced={isInsufficientFeeError}
              footer={false}
            />
          )}
          {shouldShowTxExecuted &&
            txSummaryExecuted &&
            !shouldShowFeeOptionsInFailed && (
              <TxContent.Info
                showDetails
                tx={txSummaryExecuted}
                txStatus={executedStatus()}
                footer={
                  status('failed') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      intent="error"
                      onPress={txRequest.handlers.tryAgain}
                    >
                      Try again
                    </Button>
                  )
                }
                txAccount={input?.address}
              />
            )}
        </Layout.Content>
        {shouldShowActions && (
          <Layout.BottomBar>
            <Button
              onPress={handlers.reject}
              variant="ghost"
              isDisabled={status('sending')}
            >
              Reject
            </Button>
            <Button
              type="submit"
              intent="primary"
              isLoading={isLoading || status('sending') || isSimulating}
              isDisabled={shouldDisableApproveBtn}
            >
              {isSignOnly ? 'Sign' : 'Submit'}
            </Button>
          </Layout.BottomBar>
        )}
      </Layout>
    </FormProvider>
  );
}

const styles = {
  actionBtn: cssObj({
    mt: '$4',
  }),
  content: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    backgroundColor: '$intentsBase3',
    padding: '$2 0 $2 $3',
    overflowY: 'auto',
    scrollbarGutter: 'stable',

    '&::-webkit-scrollbar': {
      width: '$3',
      backgroundColor: 'transparent',
    },

    'html[class="fuel_dark-theme"] &': {
      backgroundColor: '$bodyBg',
    },
  }),
  approveUrlTag: cssObj({
    alignSelf: 'center',
    background: 'transparent',
    borderColor: '$border',
    borderStyle: 'solid',
  }),
};
