import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import type { SendFormValues } from '~/systems/Send/hooks';
import {
  TxStatusAlert,
  TxViewSimple,
  TxViewSimpleWrapper,
} from '../../components';
import { TxContent } from '../../components/TxContent';
import { useTxResult } from '../../hooks';
import { simplifyTransaction } from '../../utils/simplifyTransaction';

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

  return (
    <Layout
      title="Transaction"
      isLoading={ctx.isFetching || ctx.isFetchingResult}
    >
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        {ctx.shouldShowAlert && (
          <TxStatusAlert txStatus={txResult?.status} error={ctx.error} />
        )}
        {txResult && (
          <TxViewSimpleWrapper
            summary={txResult}
            showDetails={ctx.shouldShowTxFee}
            isLoading={!txResult}
          />
        )}
      </Layout.Content>
    </Layout>
  );
}
