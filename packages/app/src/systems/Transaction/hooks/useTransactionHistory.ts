import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import { transactionHistoryMachine } from '../machines';
import type { TxInputs } from '../services';

const selectors = {
  isFetching: (state: TransactionHistoryMachineState) => {
    return state.hasTag('loading');
  },
  isFetchingNextPage: (state: TransactionHistoryMachineState) => {
    return state.matches('fetchingNextPage');
  },
  transactionHistory: (state: TransactionHistoryMachineState) => {
    return state.context.transactionHistory;
  },
  hasNextPage: (state: TransactionHistoryMachineState) => {
    const hasCurrentCursor = Boolean(state.context.currentCursor);
    const hasLoadedTxs = Boolean(state.context.transactionHistory?.length);
    return hasCurrentCursor && hasLoadedTxs;
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

  function getTransactionHistory(input: TxInputs['getTransactionHistory']) {
    send('GET_TRANSACTION_HISTORY', { input });
  }

  function fetchNextPage() {
    send('FETCH_NEXT_PAGE');
  }

  useEffect(() => {
    if (address) {
      getTransactionHistory({ address: address.toString() });
    }
  }, [address]);

  return {
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    transactionHistory,
    hasNextPage,
  };
}
