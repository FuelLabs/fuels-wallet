import { Stack } from '@fuel-ui/react';
import type { TransactionResultReceipt } from 'fuels';
import {
  Address,
  arrayify,
  ReceiptCoder,
  ReceiptType,
  TransactionCoder,
} from 'fuels';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActivityList } from '../../components/ActivityList/ActivityList';
import { parseTx } from '../../utils';

import type { ReceiptFragment } from './__generated__/operations';
import { useActivityPageQuery } from './__generated__/operations';

import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { NetworkScreen, useChainInfo, useNetworks } from '~/systems/Network';

const processGqlReceipt = (
  gqlReceipt: ReceiptFragment
): TransactionResultReceipt => {
  const receipt = new ReceiptCoder().decode(
    arrayify(gqlReceipt.rawPayload),
    0
  )[0];

  switch (receipt.type) {
    case ReceiptType.ReturnData: {
      return {
        ...receipt,
        data: gqlReceipt.data!,
      };
    }
    case ReceiptType.LogData: {
      return {
        ...receipt,
        data: gqlReceipt.data!,
      };
    }
    default:
      return receipt;
  }
};

export function ViewActivity() {
  const navigate = useNavigate();
  const networks = useNetworks({ type: NetworkScreen.list });
  const providerUrl = networks?.selectedNetwork?.url;
  const { account, isLoading } = useAccounts();
  const address = account ? Address.fromString(account.address).toB256() : '';

  const { loading, data } = useActivityPageQuery({
    variables: { first: 10, owner: address },
  });

  const { chainInfo } = useChainInfo(providerUrl);

  const txs = useMemo(() => {
    /** @TODO: Move this logic to the SDK */
    const gqlTransactions =
      data?.transactionsByOwner!.edges!.map((edge) => edge!.node) ?? [];
    const gasPerByte = chainInfo?.consensusParameters.gasPerByte;
    const gasPriceFactor = chainInfo?.consensusParameters.gasPriceFactor;
    if (gqlTransactions.length === 0 || !gasPerByte || !gasPriceFactor)
      return undefined;
    const transactions = gqlTransactions.map((gqlTransaction) => {
      const transaction = new TransactionCoder().decode(
        arrayify(gqlTransaction.rawPayload),
        0
      )?.[0];
      const receipts = gqlTransaction.receipts?.map(processGqlReceipt) || [];
      const gqlStatus = gqlTransaction.status?.type;
      const dataNeededForTx = {
        transaction,
        receipts,
        gqlStatus,
        id: gqlTransaction.id,
        gasPerByte,
        gasPriceFactor,
      };
      const tx = parseTx(dataNeededForTx);
      return tx;
    });
    return transactions;
  }, [data]);

  return (
    <Layout title="Activity" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        <Stack gap="$4">
          <ActivityList
            transactions={txs ?? []}
            isLoading={loading || isLoading || !account}
          />
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
