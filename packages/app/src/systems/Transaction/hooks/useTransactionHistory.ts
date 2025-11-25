import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useCallback, useRef } from 'react';

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
  const addressRef = useRef<string>();
  const fetchInitiatedRef = useRef(false);

  const service = useInterpret(() => transactionHistoryMachine);

  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingNextPage = useSelector(service, selectors.isFetchingNextPage);
  const transactionHistory = useSelector(service, selectors.transactionHistory);
  const hasNextPage = useSelector(service, selectors.hasNextPage);

  const getTransactionHistory = useCallback(
    (input: TxInputs['getTransactionHistory']) => {
      console.debug(
        '[useTransactionHistory] Sending GET_TRANSACTION_HISTORY event with address:',
        input.address
      );
      send('GET_TRANSACTION_HISTORY', { input });
    },
    [send]
  );

  const addressStr = address?.toString();
  if (addressStr && addressStr !== addressRef.current) {
    console.debug(
      '[useTransactionHistory] Address changed from',
      addressRef.current,
      'to',
      addressStr
    );
    addressRef.current = addressStr;
    fetchInitiatedRef.current = false;
  }

  if (addressStr && !fetchInitiatedRef.current) {
    console.debug(
      '[useTransactionHistory] Initiating fetch for address:',
      addressStr
    );
    fetchInitiatedRef.current = true;
    queueMicrotask(() => {
      getTransactionHistory({ address: addressStr });
    });
  }

  function fetchNextPage() {
    send('FETCH_NEXT_PAGE');
  }

  return {
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    transactionHistory,
    hasNextPage,
  };
}
