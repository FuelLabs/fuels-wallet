// import { TransactionType } from 'fuels';

export const getTransactionTypeText = (type?: number) => {
  switch (type) {
    case 0: // TransactionType.Script:
      return 'Script';
    case 1: // TransactionType.Create:
      return 'Create';
    case 2: // TransactionType.Mint:
      return 'Mint';
    default:
      return '';
  }
};
