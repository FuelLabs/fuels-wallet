import { useNavigate, useParams } from 'react-router-dom';

import { TxHeader, TxStatusAlert } from '../../components';
import { TxContent } from '../../components/TxContent';
import { useTx } from '../../hooks';

import { useAssets } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { NetworkScreen, useNetworks } from '~/systems/Network';

export function TxView() {
  const txIdQueryParam = useParams<{ txId: string }>().txId;
  const networks = useNetworks({ type: NetworkScreen.list });
  const providerUrl = networks?.selectedNetwork?.url;
  const navigate = useNavigate();
  const { tx, ...ctx } = useTx({
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
        {ctx.isLoadingTx && <TxContent.Loader header={<TxHeader.Loader />} />}
        {ctx.shouldShowAlert && (
          <TxStatusAlert txStatus={tx?.status} error={ctx.error} />
        )}
        {ctx.shouldShowTx && (
          <TxContent.Info
            tx={tx}
            amount={ctx.ethAmountSent}
            showDetails={ctx.shouldShowTxDetails}
            assets={assets}
            header={
              <TxHeader
                id={tx?.id}
                type={tx?.type}
                status={tx?.status}
                providerUrl={providerUrl}
              />
            }
          />
        )}
      </Layout.Content>
    </Layout>
  );
}
