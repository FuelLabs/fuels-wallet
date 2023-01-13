/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayify, ReceiptCoder, ReceiptType, TransactionCoder } from 'fuels';
import type { TransactionResultReceipt, Address, BN } from 'fuels';
import { useMemo, useState, useEffect } from 'react';

import { TxService } from '../services';
import { parseTx } from '../utils';

import type {
  AddressTransactionsQuery,
  ReceiptFragment,
} from '~/generated/graphql';
import { useChainInfo } from '~/systems/Network';

/** @TODO: Move this logic to the SDK */
const processGqlReceipt = (
  gqlReceipt: ReceiptFragment
): TransactionResultReceipt => {
  const receipt = new ReceiptCoder().decode(
    arrayify(gqlReceipt.rawPayload),
    0
  )[0];

  if (
    receipt.type === ReceiptType.LogData ||
    receipt.type === ReceiptType.ReturnData
  ) {
    return {
      ...receipt,
      data: gqlReceipt.data!,
    };
  }
  return receipt;
};

/** @TODO: Move this logic to the SDK */
const processTransactionToTx = (
  gqlTransactions: any[],
  gasPerByte: BN | undefined,
  gasPriceFactor: BN | undefined
) => {
  if (gqlTransactions.length === 0 || !gasPerByte || !gasPriceFactor)
    return undefined;
  const txs = gqlTransactions.map((gqlTransaction) => {
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

  return txs;
};

/** @TODO: Move this logic to the SDK */
const getGQLTransactionsFromData = (
  data: AddressTransactionsQuery | undefined
) => {
  return data?.transactionsByOwner!.edges!.map((edge) => edge!.node) ?? [];
};

type UseTxsProps = {
  address?: string | Address;
  providerUrl?: string;
  waitProviderUrl?: boolean;
};

export function useTxs({ address, providerUrl }: UseTxsProps) {
  const { chainInfo, isLoading: isLoadingChainInfo } =
    useChainInfo(providerUrl);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AddressTransactionsQuery>();
  const [error, setError] = useState();

  useEffect(() => {
    if (data || !address) return;

    setLoading(true);
    TxService.getTransactionHistory({
      address: address?.toString() || '',
    })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [data, address]);

  const isLoadingTx = isLoadingChainInfo || loading;

  const txs = useMemo(() => {
    /** @TODO: Move this logic to the SDK */
    const gqlTransactions = getGQLTransactionsFromData(data);
    const gasPerByte = chainInfo?.consensusParameters.gasPerByte;
    const gasPriceFactor = chainInfo?.consensusParameters.gasPriceFactor;
    const transactions = processTransactionToTx(
      gqlTransactions,
      gasPerByte,
      gasPriceFactor
    );
    return transactions;
  }, [data]);

  return {
    isLoadingTx,
    txs,
    error,
  };
}
