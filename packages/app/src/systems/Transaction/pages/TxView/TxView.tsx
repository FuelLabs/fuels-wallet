import { cssObj } from '@fuel-ui/css';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, coreStyles } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxStatusAlert } from '../../components';
import { TxContent } from '../../components/TxContent/TxContent';
import { TransactionViewContext } from '../../context/TransactionViewContext';
import { useTxResult } from '../../hooks';

export function TxView() {
  const txIdQueryParam = useParams<{ txId: string }>().txId;
  const networks = useNetworks();
  const providerUrl = networks?.selectedNetwork?.url;
  const navigate = useNavigate();
  const {
    txResult,
    isLoading: isTxLoading,
    ...ctx
  } = useTxResult({
    providerUrl,
    txId: txIdQueryParam,
    waitProviderUrl: true,
  });
  const form = useForm<SendFormValues>();
  const { isLoading: isAccountsLoading } = useAccounts();

  return (
    <TransactionViewContext.Provider value={{ isHistoryView: true }}>
      <Layout
        title="Transaction"
        isLoading={ctx.isFetching || ctx.isFetchingResult}
      >
        <Layout.TopBar onBack={() => navigate(-1)} />
        <Layout.Content css={styles.content} noScroll>
          {ctx.shouldShowAlert && (
            <TxStatusAlert txStatus={txResult?.status} error={ctx.error} />
          )}
          {isAccountsLoading || isTxLoading ? (
            <TxContent.Loader showHeaderLoader />
          ) : (
            <FormProvider {...form}>
              {txResult && (
                <TxContent.Info
                  tx={txResult}
                  showDetails={ctx.shouldShowTxFee}
                />
              )}
            </FormProvider>
          )}
        </Layout.Content>
      </Layout>
    </TransactionViewContext.Provider>
  );
}

const styles = {
  content: cssObj({
    ...coreStyles.scrollable('$intentsBase3'),
    borderTop: '1px solid $gray6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    backgroundColor: '$intentsBase3',
    padding: '$2 0 $2 $2',
    overflowY: 'scroll !important',
    '&::-webkit-scrollbar': {
      width: '$3',
      backgroundColor: 'transparent',
    },

    'html[class="fuel_dark-theme"] &': {
      backgroundColor: '$bodyBg',
    },
  }),
};
