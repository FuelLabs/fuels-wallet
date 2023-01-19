import type { TransactionResultReceipt, BN } from 'fuels';
import { ReceiptCoder, arrayify, ReceiptType, TransactionCoder } from 'fuels';

import { parseTx } from './tx';

import type {
  IReceiptFragment,
  IAddressTransactionsQuery,
} from '~/generated/graphql';

/** @TODO: Move this logic to the SDK */
export const processGqlReceipt = (
  gqlReceipt: IReceiptFragment
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
export const processTransactionToTx = (
  gqlTransactions: IAddressTransactionsQuery['transactionsByOwner'],
  gasPerByte: BN | undefined,
  gasPriceFactor: BN | undefined
) => {
  const edges = gqlTransactions.edges;
  if (edges.length === 0 || !gasPerByte || !gasPriceFactor) return undefined;
  const txs = edges.map(({ node: tx }) => {
    const transaction = new TransactionCoder().decode(
      arrayify(tx.rawPayload),
      0
    )?.[0];
    const receipts = tx.receipts?.map(processGqlReceipt) || [];
    const gqlStatus = tx.status?.type;
    const time = (tx.status as { time: string })?.time;
    const dataNeededForTx = {
      transaction,
      receipts,
      gqlStatus,
      id: tx.id,
      gasPerByte,
      gasPriceFactor,
      time,
    };
    return parseTx(dataNeededForTx);
  });

  return txs;
};
