import { Stack } from '@fuel-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { TxDetails, TxFromTo, TxHeader, TxStatusAlert } from '../../components';
import { useTransaction } from '../../hooks';

import { AssetsAmount } from '~/systems/Asset';
import { Layout } from '~/systems/Core';
import { NetworkScreen, useNetworks } from '~/systems/Network';

export function ViewTransaction() {
  const txIdQueryParam = useParams<{ txId: string }>().txId;
  const networks = useNetworks({ type: NetworkScreen.list });
  const providerUrl = networks?.selectedNetwork?.url;

  const {
    isFetching,
    isFetchingResult,
    txFee,
    txStatus,
    txId,
    tx,
    error,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    txFrom,
    txTo,
    isFetchingDetails,
    toAssetAmounts,
    amountSent,
  } = useTransaction({
    txId: txIdQueryParam,
    providerUrl,
    waitProviderUrl: true,
  });

  const navigate = useNavigate();

  return (
    <Layout title="Transaction" isLoading={isFetching || isFetchingResult}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        <Stack gap="$4">
          {shouldShowAlert && (
            <TxStatusAlert txStatus={txStatus} error={error} />
          )}
          {shouldShowTx && (
            <>
              <TxHeader
                transaction={{
                  id: txId,
                  type: tx?.type,
                  status: txStatus,
                }}
                providerUrl={providerUrl}
              />
              <TxFromTo from={txFrom} to={txTo} status={txStatus} />
              {Boolean(toAssetAmounts?.length) && (
                <AssetsAmount amounts={toAssetAmounts} title="Assets Sent" />
              )}
            </>
          )}
          {isFetching && (
            <>
              <TxHeader.Loader />
              <TxFromTo isLoading={true} />
              <AssetsAmount.Loader />
            </>
          )}
          {isFetchingDetails && <TxDetails.Loader />}
          {shouldShowTxDetails && (
            <TxDetails fee={txFee} amountSent={amountSent} />
          )}
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
