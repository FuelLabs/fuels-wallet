import { arrayify, ReceiptCoder, ReceiptType, TransactionCoder } from 'fuels';
import type { TransactionResultReceipt, Address } from 'fuels';
import { useMemo } from 'react';

import { parseTx } from '../utils';

import type { ReceiptFragment } from './__generated__/operations';
import { useAddressTransactionsQuery } from './__generated__/operations';

import { useChainInfo } from '~/systems/Network';

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

type UseTxsProps = {
  address?: string | Address;
  providerUrl?: string;
  waitProviderUrl?: boolean;
};

export function useTxs({ address, providerUrl }: UseTxsProps) {
  const { chainInfo, isLoading: isLoadingChainInfo } =
    useChainInfo(providerUrl);

  const { loading, data } = useAddressTransactionsQuery({
    variables: { first: 10, owner: address?.toString() || '' },
  });

  const isLoadingTx = isLoadingChainInfo || loading;

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

  return {
    isLoadingTx,
    txs,
  };
}
