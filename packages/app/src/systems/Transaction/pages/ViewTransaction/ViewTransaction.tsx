import { Stack } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { useNavigate, useParams } from 'react-router-dom';

import { TxDetails, TxFromTo } from '../../components';
import { useTransaction } from '../../hooks';

import { AssetsAmount } from '~/systems/Asset';
import { Layout } from '~/systems/Core';

export function ViewTransaction() {
  const txId = useParams<{ txId: string }>().txId;
  const { tx, isLoading, fee, coinInputs, outputsToSend, outputAmount } =
    useTransaction(txId);
  const navigate = useNavigate();

  const transactionFrom = coinInputs?.[0]?.owner.toString()
    ? {
        type: AddressType.account,
        address: coinInputs[0].owner.toString(),
      }
    : undefined;

  return (
    <Layout title="Transaction" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        {tx && (
          <Stack gap="$4">
            <TxFromTo
              from={transactionFrom}
              to={{
                type: AddressType.account,
                address: outputsToSend[0]?.to.toString(),
              }}
            />
            <AssetsAmount amounts={outputsToSend} title="Assets Sent" />
            <TxDetails fee={fee} outputAmount={outputAmount} />
          </Stack>
        )}
      </Layout.Content>
    </Layout>
  );
}
