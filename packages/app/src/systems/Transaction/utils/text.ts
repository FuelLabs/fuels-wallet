import { TransactionType } from 'fuels';

export const getTransactionTypeText = (type?: number) => {
  switch (type) {
    case TransactionType.Script:
      return 'Script';
    case TransactionType.Create:
      return 'Create';
    case TransactionType.Mint:
      return 'Mint';
    default:
      return '';
  }
};
