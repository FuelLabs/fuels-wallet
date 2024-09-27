import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxStatusAlert } from '../../components';
import { TxContent } from '../../components/TxContent';
import { useTxResult } from '../../hooks';

export function TxView() {
  const txIdQueryParam = useParams<{ txId: string }>().txId;
  const networks = useNetworks();
  const providerUrl = networks?.selectedNetwork?.url;
  const navigate = useNavigate();
  const { txResult, ...ctx } = useTxResult({
    providerUrl,
    txId: txIdQueryParam,
    waitProviderUrl: true,
  });
  const form = useForm<SendFormValues>();

  return (
    <Layout
      title="Transaction"
      isLoading={ctx.isFetching || ctx.isFetchingResult}
    >
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        {!txResult && <TxContent.Loader />}
        {ctx.shouldShowAlert && (
          <TxStatusAlert txStatus={txResult?.status} error={ctx.error} />
        )}
        {txResult && (
          <FormProvider {...form}>
            <TxContent.Info
              tx={txResult}
              isLoading={ctx.isFetching}
              showDetails={ctx.shouldShowTxFee}
            />
          </FormProvider>
        )}
      </Layout.Content>
    </Layout>
  );
}
