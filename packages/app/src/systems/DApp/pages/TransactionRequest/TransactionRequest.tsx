import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { Layout, coreStyles } from '~/systems/Core';
import {
  TxContent,
  detectInsufficientMaxFee,
  getGasLimitFromTxRequest,
} from '~/systems/Transaction';
import { formatTip } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions.utils';
import { TxReviewAlert } from '~/systems/Transaction/components/TxReviewAlert/TxReviewAlert';
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

  // Detect insufficient fee errors from simulation OR send (txApproveError)
  const sendError = useMemo(
    () => detectInsufficientMaxFee(errors.txApproveError),
    [errors.txApproveError]
  );
  const simulateError = useMemo(() => {
    if (
      typeof errors.simulateTxErrors === 'object' &&
      errors.simulateTxErrors?.isInsufficientMaxFee
    ) {
      return errors.simulateTxErrors;
    }
    return null;
  }, [errors.simulateTxErrors]);

  const insufficientFeeError = sendError || simulateError;
  const isInsufficientFeeError = Boolean(insufficientFeeError);

  // Extract suggested minimum fee from error details (with 10% buffer)
  const suggestedMinFee = useMemo(() => {
    const details = insufficientFeeError?.details;
    if (details?.maxFeeFromGasPrice) {
      // Add 10% buffer to suggested fee
      return bn(details.maxFeeFromGasPrice).mul(110).div(100);
    }
    return undefined;
  }, [insufficientFeeError]);

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
              errors={insufficientFeeError || errors.simulateTxErrors}
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
