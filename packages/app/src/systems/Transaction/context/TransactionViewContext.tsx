import { createContext, useContext } from 'react';

type TransactionViewContextType = {
  isHistoryView: boolean;
};

export const TransactionViewContext = createContext<TransactionViewContextType>(
  {
    isHistoryView: false,
  }
);

export function useTransactionView() {
  return useContext(TransactionViewContext);
}
