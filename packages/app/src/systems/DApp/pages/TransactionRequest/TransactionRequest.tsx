import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import { useAssets } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import { TxContent } from '~/systems/Transaction';

import { FormProvider } from 'react-hook-form';
import { useTransactionRequest } from '../../hooks/useTransactionRequest';

export function TransactionRequest() {
  const txRequest = useTransactionRequest({ isOriginRequired: true });
  const {
    form,
    handlers,
    status,
    isSendingTx,
    txSummarySimulated,
    txSummaryExecuted,
    fees,
    ...ctx
  } = txRequest;
  const { assets, isLoading: isLoadingAssets } = useAssets();

  if (!ctx.account) return null;

  const isLoading = status('loading') || status('sending') || isLoadingAssets;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handlers.approve)}
        data-testid={txRequest.txStatus}
        autoComplete="off"
      >
        <Layout title={ctx.title} noBorder>
          <Layout.TopBar type={TopBarType.external} />
          <Layout.Content css={styles.content}>
            {ctx.shouldShowLoader && <TxContent.Loader />}
            {ctx.shouldShowTxSimulated && (
              <TxContent.Info
                showDetails
                tx={txSummarySimulated}
                isLoading={isLoading}
                errors={ctx.errors.simulateTxErrors}
                isConfirm
                assets={assets}
                fees={fees}
              />
            )}
            {ctx.shouldShowTxExecuted && (
              <TxContent.Info
                showDetails
                tx={txSummaryExecuted}
                txStatus={ctx.executedStatus()}
                assets={assets}
                providerUrl={ctx.providerUrl}
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
          {ctx.shouldShowActions && (
            <Layout.BottomBar>
              <Button
                onPress={handlers.reject}
                variant="ghost"
                isDisabled={ctx.isLoading || status('sending')}
              >
                Reject
              </Button>
              <Button
                type="submit"
                intent="primary"
                isLoading={ctx.isLoading || status('sending')}
                isDisabled={ctx.shouldDisableApproveBtn}
              >
                Approve
              </Button>
            </Layout.BottomBar>
          )}
        </Layout>
      </form>
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
