import type { TransactionResultReceipt } from 'fuels';
import {
  arrayify,
  TransactionCoder,
  processGqlReceipt,
  assembleTransactionSummary,
  bn,
} from 'fuels';

import type { IAddressTransactionsQuery } from '~/generated/graphql';

/** @TODO: Move this logic to the SDK */
export const processTransactionToTx = (
  gqlTransactions: IAddressTransactionsQuery['transactionsByOwner']
) => {
  const edges = gqlTransactions.edges;
  if (edges.length === 0) return undefined;
  const txs = edges.map(({ node: tx }) => {
    const transactionBytes = arrayify(tx.rawPayload);
    const transaction = new TransactionCoder().decode(transactionBytes, 0)?.[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const receipts = (tx.receipts?.map(processGqlReceipt as any) ||
      []) as TransactionResultReceipt[];
    const time = (tx.status as { time: string })?.time;
    const dataNeededForTx = {
      transaction,
      receipts,
      gqlStatus: tx.status,
      id: tx.id,
      time,
      transactionBytes,
      gasPrice: bn(transaction.gasPrice),
    };
    return assembleTransactionSummary(dataNeededForTx);
  });

  return txs;
};
