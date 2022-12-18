import { Stack } from '@fuel-ui/react';
import { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TxDetails,
  TxFromTo,
  TxHeader,
  TxOperations,
  TxStatusAlert,
} from '../../components';
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
    isFetchingDetails,
    isFetchingResult,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    tx,
    error,
    ethAmountSent,
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
            <TxStatusAlert txStatus={tx?.status} error={error} />
          )}
          {shouldShowTx && (
            <>
              <TxHeader
                id={tx?.id}
                type={tx?.type}
                status={tx?.status}
                providerUrl={providerUrl}
              />
              <TxOperations operations={tx?.operations} status={tx?.status} />
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
            <TxDetails fee={tx?.fee} amountSent={ethAmountSent} />
          )}
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
