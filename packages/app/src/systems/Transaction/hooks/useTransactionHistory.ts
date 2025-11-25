import { useInterpret, useSelector } from '@xstate/react';
import type { Address } from 'fuels';
import { useCallback, useEffect } from 'react';

import type { TransactionHistoryMachineState } from '../machines';
import {
  onTransactionDomainEnriched,
  transactionHistoryMachine,
} from '../machines';
import type { TxInputs } from '../services';
import type { TransactionResultWithDomain } from '../types';

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

  const getTransactionHistory = useCallback(
    (input: TxInputs['getTransactionHistory']) => {
      send('GET_TRANSACTION_HISTORY', { input });
    },
    [send]
  );

  function fetchNextPage() {
    send('FETCH_NEXT_PAGE');
  }

  useEffect(() => {
    if (address) {
      getTransactionHistory({ address: address.toString() });
    }
  }, [address, getTransactionHistory]);

  useEffect(() => {
    const unsubscribe = onTransactionDomainEnriched(
      (enrichedTx: TransactionResultWithDomain) => {
        service.send({
          type: 'UPDATE_TRANSACTION_WITH_DOMAIN',
          enrichedTx,
        });
      }
    );

    return unsubscribe;
  }, [service]);

  return {
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    transactionHistory,
    hasNextPage,
  };
}
