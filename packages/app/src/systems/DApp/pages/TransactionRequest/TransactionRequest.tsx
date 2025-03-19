import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { Layout, coreStyles } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { TxContent, getGasLimitFromTxRequest } from '~/systems/Transaction';
import { formatTip } from '~/systems/Transaction/components/TxFeeOptions/TxFeeOptions.utils';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';
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
  } = txRequest;
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
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content} noScroll>
          {shouldShowTxSimulated && txSummarySimulated && (
            <TxContent.Info
              showDetails
              tx={txSummarySimulated}
              txRequest={proposedTxRequest}
              errors={errors.simulateTxErrors}
              fees={fees}
              isLoadingFees={isLoadingFees}
              isLoading={isLoading}
            />
          )}
          {shouldShowTxExecuted && txSummaryExecuted && (
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
              Submit
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
    borderTop: '1px solid $gray6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    backgroundColor: '$intentsBase3',
    padding: '$2 0 $2 $3',
    overflowY: 'scroll !important',
    '&::-webkit-scrollbar': {
      width: '$3',
      backgroundColor: 'transparent',
    },

    'html[class="fuel_dark-theme"] &': {
      backgroundColor: '#111',
    },
  }),
  approveUrlTag: cssObj({
    alignSelf: 'center',
    background: 'transparent',
    borderColor: '$border',
    borderStyle: 'solid',
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
