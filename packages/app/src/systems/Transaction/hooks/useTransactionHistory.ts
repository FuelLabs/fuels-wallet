import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import { TX_PER_PAGE, transactionHistoryMachine } from '../machines';
import type { TxInputs } from '../services';

const selectors = {
  isFetching: (state: TransactionHistoryMachineState) => {
    return state.matches('fetching');
  },
  isFetchingNextPage: (state: TransactionHistoryMachineState) => {
    return state.matches('fetchingNextPage');
  },
  transactionHistory: (state: TransactionHistoryMachineState) => {
    return state.context.transactionHistory;
  },
  hasNextPage: (state: TransactionHistoryMachineState) => {
    return state.context.pageInfo?.hasNextPage ?? false;
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
  const isFetchingNextPage = useSelector(service, selectors.isFetchingNextPage);
  const transactionHistory = useSelector(service, selectors.transactionHistory);
  const hasNextPage = useSelector(service, selectors.hasNextPage);
  const hasPreviousPage = useSelector(service, selectors.hasPreviousPage);

  function getTransactionHistory(input: TxInputs['getTransactionHistory']) {
    send('GET_TRANSACTION_HISTORY', { input });
  }

  function fetchNextPage() {
    send('FETCH_NEXT_PAGE');
  }

  useEffect(() => {
    if (address) {
      getTransactionHistory({
        address: address.toString(),
        pagination: {
          first: TX_PER_PAGE,
        },
      });
    }
  }, [address]);

  return {
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    transactionHistory,
    hasNextPage,
    hasPreviousPage,
  };
}
