/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInterpret, useSelector } from '@xstate/react';
import { arrayify, ReceiptCoder, ReceiptType, TransactionCoder } from 'fuels';
import type { TransactionResultReceipt, Address, BN } from 'fuels';
import { useMemo, useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import {
  transactionHistoryMachine,
  TRANSACTION_HISTORY_ERRORS,
} from '../machines';
import type { TxInputs } from '../services';
import { parseTx } from '../utils';

import type {
  IAddressTransactionsQuery,
  IReceiptFragment,
} from '~/generated/graphql';
import { useChainInfo } from '~/systems/Network';

/** @TODO: Move this logic to the SDK */
const processGqlReceipt = (
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
    const time = gqlTransaction.status?.time;
    const dataNeededForTx = {
      transaction,
      receipts,
      gqlStatus,
      id: gqlTransaction.id,
      gasPerByte,
      gasPriceFactor,
      time,
    };
    const tx = parseTx(dataNeededForTx);
    return tx;
  });

  return txs;
};

/** @TODO: Move this logic to the SDK */
const getGQLTransactionsFromData = (
  data: IAddressTransactionsQuery | undefined
) => {
  return data?.transactionsByOwner!.edges!.map((edge) => edge!.node) ?? [];
};

const selectors = {
  isFetching: (state: TransactionHistoryMachineState) =>
    state.matches('fetching'),
  context: (state: TransactionHistoryMachineState) => state.context,
  isInvalidAddress: (state: TransactionHistoryMachineState) =>
    state.context.error === TRANSACTION_HISTORY_ERRORS.INVALID_ADDRESS,
  isNotFound: (state: TransactionHistoryMachineState) =>
    state.context.error === TRANSACTION_HISTORY_ERRORS.NOT_FOUND,
};

type UseTxsProps = {
  address?: string | Address;
  providerUrl?: string;
};

export function useTxs({ address, providerUrl }: UseTxsProps) {
  const { chainInfo, isLoading: isLoadingChainInfo } =
    useChainInfo(providerUrl);

  const service = useInterpret(() => transactionHistoryMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const context = useSelector(service, selectors.context);
  const isInvalidAddress = useSelector(service, selectors.isInvalidAddress);
  const isNotFound = useSelector(service, selectors.isNotFound);

  const { walletAddress, addressTransactionsQuery, error } = context;

  const isLoadingTx = isLoadingChainInfo || isFetching;

  const txs = useMemo(() => {
    /** @TODO: Move this logic to the SDK */
    const gqlTransactions = getGQLTransactionsFromData(
      addressTransactionsQuery
    );
    const gasPerByte = chainInfo?.consensusParameters.gasPerByte;
    const gasPriceFactor = chainInfo?.consensusParameters.gasPriceFactor;
    const transactions = processTransactionToTx(
      gqlTransactions,
      gasPerByte,
      gasPriceFactor
    );
    return transactions;
  }, [addressTransactionsQuery]);

  function getTransactionHistory(input: TxInputs['getTransactionHistory']) {
    send('GET_TRANSACTION_HISTORY', { input });
  }

  useEffect(() => {
    if (address && providerUrl) {
      getTransactionHistory({ address: address.toString() });
    }
  }, [address, providerUrl]);

  return {
    isLoadingTx,
    txs,
    error,
    walletAddress,
    isFetching,
    isInvalidAddress,
    isNotFound,
  };
}
