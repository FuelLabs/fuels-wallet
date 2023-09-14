import { useNavigate, useParams } from 'react-router-dom';
import { useAssets } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';

import { TxHeader, TxStatusAlert } from '../../components';
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
  const { assets } = useAssets();

  return (
    <Layout
      title="Transaction"
      isLoading={ctx.isFetching || ctx.isFetchingResult}
    >
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        {!txResult && <TxContent.Loader header={<TxHeader.Loader />} />}
        {ctx.shouldShowAlert && (
          <TxStatusAlert txStatus={txResult?.status} error={ctx.error} />
        )}
        {txResult && (
          <TxContent.Info
            tx={txResult}
            isLoading={ctx.isFetching}
            showDetails={ctx.shouldShowTxDetails}
            assets={assets}
            header={
              <TxHeader
                id={txResult.id}
                type={txResult.type}
                status={txResult.status}
                providerUrl={providerUrl}
              />
            }
          />
        )}
      </Layout.Content>
    </Layout>
  );
}
