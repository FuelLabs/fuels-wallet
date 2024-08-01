import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { useMemo } from 'react';
import { useAssets } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { TxContent } from '~/systems/Transaction';
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
    providerUrl,
    executedStatus,
  } = txRequest;
  const { assets, isLoading: isLoadingAssets } = useAssets();

  const defaultValues = useMemo<TransactionRequestFormData | undefined>(() => {
    if (!txSummarySimulated) return undefined;

    const tip = txSummarySimulated.tip;
    const gasLimit = txSummarySimulated.gasUsed;

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
  }, [txSummarySimulated]);

  const isLoadingInfo = useMemo<boolean>(() => {
    return status('loading') || status('sending') || isLoadingAssets;
  }, [status, isLoadingAssets]);

  if (!defaultValues) {
    return (
      <Layout title={title} noBorder>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          <TxContent.Loader />
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <FormProvider
      onSubmit={handlers.approve}
      defaultValues={defaultValues}
      testId={txRequest.txStatus}
      context={{
        baseFee: fees.baseFee,
        minGasLimit: fees.minGasLimit,
        maxGasLimit: fees.maxGasLimit,
      }}
    >
      <AutoSubmit />

      <Layout title={title} noBorder>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content css={styles.content}>
          {shouldShowTxSimulated && (
            <TxContent.Info
              showDetails
              tx={txSummarySimulated}
              isLoading={isLoadingInfo}
              errors={errors.simulateTxErrors}
              isConfirm
              assets={assets}
              fees={fees}
            />
          )}
          {shouldShowTxExecuted && (
            <TxContent.Info
              showDetails
              tx={txSummaryExecuted}
              txStatus={executedStatus()}
              assets={assets}
              providerUrl={providerUrl}
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
              isDisabled={isLoading || status('sending')}
            >
              Reject
            </Button>
            <Button
              type="submit"
              intent="primary"
              isLoading={isLoading || status('sending')}
              isDisabled={shouldDisableApproveBtn}
            >
              Approve
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
    '& h2': {
      m: '$0',
      fontSize: '$sm',
      color: '$intentsBase12',
    },
    '& h4': {
      m: '$0',
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
