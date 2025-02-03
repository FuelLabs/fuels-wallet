import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';
import { TxStatusAlert } from '../../components';
import { TxDetails } from '../../components/TxDetails/TxDetails';
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
          <TxDetails
            summary={txResult}
            showDetails={ctx.shouldShowTxFee}
            isLoading={!txResult}
            variant="history"
          />
        )}
      </Layout.Content>
    </Layout>
  );
}
