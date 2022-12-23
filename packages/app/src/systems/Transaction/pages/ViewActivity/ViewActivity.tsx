import { Stack } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { Address, bn, TransactionType } from 'fuels';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActivityList } from '../../components/ActivityList/ActivityList';
import type { Transaction } from '../../types';
import { TxCategory } from '../../types';
import { TxStatus } from '../../utils';

import type { ActivityPageTransaction } from './__generated__/operations';
import { useActivityPageQuery } from './__generated__/operations';

import { useAccounts } from '~/systems/Account';
import { Layout } from '~/systems/Core';

// @TODO: replace this with the transaction transform function from the SDK
const getTransactionAmount = (tx: ActivityPageTransaction) => {
  if (
    tx.outputs[0].__typename === 'ChangeOutput' ||
    tx.outputs[0].__typename === 'CoinOutput' ||
    tx.outputs[0].__typename === 'VariableOutput'
  ) {
    return tx.outputs[0].amount;
  }
  return '0';
};

export function ViewActivity() {
  const navigate = useNavigate();
  const { account, isLoading } = useAccounts();
  const address = account ? Address.fromString(account.address).toB256() : '';

  const { loading, data } = useActivityPageQuery({
    variables: { first: 10, owner: address },
  });

  const transactionsData = useMemo<ActivityPageTransaction[]>(
    () => data?.transactionsByOwner!.edges!.map((edge) => edge!.node) ?? [],
    [data]
  );

  // @TODO: replace this with the transaction transform function from the SDK
  const transactions = useMemo<Transaction[]>(
    () =>
      transactionsData.map((transaction) => ({
        id: transaction.id,
        type: TransactionType.Script,
        from: {
          address: '0x0000000000000000000000000000000000000000',
          type: AddressType.contract,
        },
        to: {
          address: '0x0000000000000000000000000000000000000000',
          type: AddressType.contract,
        },
        amount: {
          assetId: transaction.inputAssetIds
            ? transaction.inputAssetIds[0]
            : '',
          imageUrl: '',
          name: 'ETH',
          symbol: 'ETH',
          amount: transaction.outputs
            ? bn(getTransactionAmount(transaction))
            : '',
        },
        category: TxCategory.SCRIPT,
        status: TxStatus.success,
      })),
    [transactionsData]
  );

  return (
    <Layout title="Activity" isLoading={isLoading}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        <Stack gap="$4">
          <ActivityList
            transactions={transactions}
            isLoading={loading || isLoading || !account}
          />
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
