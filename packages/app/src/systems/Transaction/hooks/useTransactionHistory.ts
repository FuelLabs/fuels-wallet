import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import { transactionHistoryMachine } from '../machines';
import type { TxInputs } from '../services';

const selectors = {
  isFetching: (state: TransactionHistoryMachineState) => {
    return state.matches('fetching');
  },
  isFetchingPreviousPage: (state: TransactionHistoryMachineState) => {
    return state.matches('fetchingPreviousPage');
  },
  transactionHistory: (state: TransactionHistoryMachineState) => {
    return state.context.transactionHistory;
  },
  hasPreviousPage: (state: TransactionHistoryMachineState) => {
    return state.context.pageInfo?.hasPreviousPage ?? false;
  },
};

type UseTransactionHistoryProps = {
  address?: string | Address;
};

export function useTransactionHistory({ address }: UseTransactionHistoryProps) {
  const service = useInterpret(() => transactionHistoryMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingPreviousPage = useSelector(
    service,
    selectors.isFetchingPreviousPage
  );
  const transactionHistory = useSelector(service, selectors.transactionHistory);
  const hasPreviousPage = useSelector(service, selectors.hasPreviousPage);

  function getTransactionHistory(input: TxInputs['getTransactionHistory']) {
    send('GET_TRANSACTION_HISTORY', { input });
  }

  function fetchPreviousPage() {
    send('FETCH_PREVIOUS_PAGE');
  }

  useEffect(() => {
    if (address) {
      getTransactionHistory({
        address: address.toString(),
        pagination: {
          before: null,
        },
      });
    }
  }, [address]);

  return {
    fetchPreviousPage,
    isFetching,
    isFetchingPreviousPage,
    transactionHistory,
    hasPreviousPage,
  };
}
