import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import {
  TRANSACTION_HISTORY_ERRORS,
  transactionHistoryMachine,
} from '../machines';
import type { TxInputs } from '../services';

const selectors = {
  isFetching: (state: TransactionHistoryMachineState) =>
    state.matches('fetching'),
  context: (state: TransactionHistoryMachineState) => state.context,
  isInvalidAddress: (state: TransactionHistoryMachineState) =>
    state.context.error === TRANSACTION_HISTORY_ERRORS.INVALID_ADDRESS,
  isNotFound: (state: TransactionHistoryMachineState) =>
    state.context.error === TRANSACTION_HISTORY_ERRORS.NOT_FOUND,
};

type UseTransactionHistoryProps = {
  address?: string | Address;
  providerUrl?: string;
};

export function useTransactionHistory({
  address,
  providerUrl,
}: UseTransactionHistoryProps) {
  const service = useInterpret(() => transactionHistoryMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const context = useSelector(service, selectors.context);
  const isInvalidAddress = useSelector(service, selectors.isInvalidAddress);
  const isNotFound = useSelector(service, selectors.isNotFound);

  const { walletAddress, transactionHistory, error } = context;

  function getTransactionHistory(input: TxInputs['getTransactionHistory']) {
    send('GET_TRANSACTION_HISTORY', { input });
  }

  // TODO: remove the useEffect and add it to the Account Machine
  useEffect(() => {
    if (address && providerUrl) {
      getTransactionHistory({ address: address.toString() });
    }
  }, [address, providerUrl]);

  return {
    isLoading: isFetching,
    transactionHistory,
    error,
    walletAddress,
    isFetching,
    isInvalidAddress,
    isNotFound,
  };
}
